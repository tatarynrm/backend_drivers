const pool = require("../db/pool");
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
const { sendRegistrationSuccess } = require("../mail-service/registrration.sendEmail");

const {sendEmailSuccessRegister} = require('../nodemailer/register/register-mail')

class UserService {
  // Реєстрація
  async registration(email, pwd,kod_ur,surname,name,last_name,phone_number,per_admin,is_admin) {
 
 
    
    const connection = await oracledb.getConnection(pool);
    const candidate = await connection.execute(
      `select * from ictdat.perus where email = '${email}'`
    );
    if (candidate.rows > 0) {
      return {
        message:'USER EXIST'
      }
    }
    const hashPassword = await bcrypt.hash(pwd, 10);
    const sql = `INSERT INTO ictdat.perus (email,pwdhash,kod_ur,datreestr,pwd,prizv,name,pobat,phone_number,peradmin,isadmin) VALUES (:val1, :val2,:val3,:val4,:val5,:val6,:val7,:val8,:val9,:val10,:val11) returning kod into :outbind`;
    const binds = {
      val1: email,
      val2: hashPassword,
      val3: kod_ur,
      val4: new Date(),
      val5: pwd,
      val6: surname,
      val7: name,
      val8: last_name,
      val9: phone_number,
      val10: per_admin,
      val11: is_admin,
      outbind: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };
    const options = {
      autoCommit: true,
    };
    const result = await connection.execute(sql, binds, options);
    // sendRegisterMail(email,password)

if (result) {
  const thisUser = await connection.execute(
    `select * from ictdat.perus where email = '${email}'`
  );
  const userData = thisUser.rows[0];
  const userDto = new UserDto(userData);

  const tokens = tokenService.generateTokens({ ...userDto });

  await tokenService.saveToken(userDto.KOD, tokens.refreshToken);


  
  // await sendRegistrationSuccess(email,'Успішна реєстрація в особистому кабінеті перевізнка 🚚',`Вітаємо з успішною реєстрацію в особистому кабінеті перевізника\n\nhttps://carriers.ict.lviv.ua\n\nВаші авторизаційні дані:\n\nLogin:\n${email}\n----------\nPassword:\n${pwd}`)
 await sendEmailSuccessRegister(email,pwd)
  
  
  return {
    ...tokens,
    user: userDto,
  };
  
}else {
return {
  msg:'USER ALREADY EXIST'
}
  
}
    

  }
  async login(email, password) {
  
    const conn = await oracledb.getConnection(pool);
    const candidate = await conn.execute(
      `select a.*,b.NUR from ictdat.perus a
      left join ictdat.ur b on a.KOD_UR = b.KOD
      where a.email = '${email}' `
    );
    console.log('CANDIDATE',candidate);
    

    if (candidate.rows <= 0) {
      throw ApiError.BadRequest(`Такого користувача не знайдено`);
    }
    const isEqualPassword = await bcrypt.compare(
      password,
      candidate.rows[0].PWDHASH
    );
    if (!isEqualPassword) {
      throw ApiError.BadRequest("Incorect password");
    }
    const userDto = new UserDto(candidate.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto});
    await tokenService.saveToken(userDto.KOD, tokens.refreshToken);

    return {
      ...tokens,
      user: {...userDto,NUR: candidate.rows[0].NUR},
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.checkToken(refreshToken);
   
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const conn = await oracledb.getConnection(pool);
    const user = await conn.execute(
      `select * from ictdat.perus where kod = ${userData.KOD}`
    );

const urName = await conn.execute(`select * from ictdat.ur where kod = ${user.rows[0].KOD_UR}`)

// const urInfo = urName
    const userDto = new UserDto({...user.rows[0]});
    const tokens = tokenService.generateTokens({ ...userDto});
    await tokenService.saveToken(userDto.KOD, tokens.refreshToken);
    return {
      ...tokens,
      user: {...userDto,NUR:urName.rows[0].NUR},
      
    };
  }

  async getInfo(KOD_UR) {
    const conn = await oracledb.getConnection(pool);
    const users = await conn.execute(`
    select count(*) as kp_all,
       sum(case when trunc(a.perevdat, 'YYYY') = add_months(trunc(sysdate, 'YYYY'), -12) then 1 else 0 end) as kp_year_prev,
       sum(case when trunc(a.perevdat, 'YYYY') = trunc(sysdate, 'YYYY') then 1 else 0 end) as kp_year_curr,
       sum(case when trunc(a.perevdat, 'MM') = add_months(trunc(sysdate, 'MM'), -1) then 1 else 0 end) as kp_month_prev,
       sum(case when trunc(a.perevdat, 'MM') = trunc(sysdate, 'MM') then 1 else 0 end) as kp_month_curr,
       min(a.datzav) as datzav_first,
       max(a.datzav) as datzav_last
from ictdat.zaylst a
where a.kod_per = ${KOD_UR} and
      a.appdat is not null
    `);
    return users.rows;
  }

  async getTwoYearsData(KOD_UR) {
  
    const conn = await oracledb.getConnection(pool);
    const resultPrev = await conn.execute(`
    select to_char(a.dat, 'YYYY.MM') as mis,
       count(*) as kil
from ictdat.zay a
where a.kod_per = ${KOD_UR} and
      trunc(a.dat, 'YYYY') = trunc(add_months(trunc(sysdate, 'MM'), -12), 'YYYY')
group by to_char(a.dat, 'YYYY.MM')
order by mis
    `)
    const resultThis = await conn.execute(`
    select to_char(a.dat, 'YYYY.MM') as mis,
       count(*) as kil
from ictdat.zay a
where a.kod_per = ${KOD_UR} and
      trunc(a.dat, 'YYYY') = trunc(sysdate, 'YYYY')
group by to_char(a.dat, 'YYYY.MM')
order by mis
    `);
    const result2YearsAgo = await conn.execute(`
    select to_char(a.dat, 'YYYY.MM') as mis,
       count(*) as kil
from ictdat.zay a
where a.kod_per = ${KOD_UR} and
      trunc(a.dat, 'YYYY') = trunc(add_months(trunc(sysdate, 'MM'), -24), 'YYYY')
group by to_char(a.dat, 'YYYY.MM')
order by mis
    `)

    return {
      resultPrev,
      resultThis,
      result2YearsAgo
    }
  }

}

module.exports = new UserService();
