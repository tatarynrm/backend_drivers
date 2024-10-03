const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");
const oracledb = require("oracledb");
const pool = require("../db/pool");
const { log } = require("handlebars/runtime");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

class UserController {
  async registration(req, res, next) {
    try {

      const { email, pwd,kod_ur,surname,name,last_name,phone_number,per_admin,is_admin} = req.body;
   console.log('REQ BODY REGISTER',req.body);
   
      
      const userData = await userService.registration(email, pwd,kod_ur,surname,name,last_name,phone_number,per_admin,is_admin);


      
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // });

   if (userData) {
    res.json(userData)
   }else {
    res.json({
      msg:"Error"
    })
   }

   
    } catch (e) {
   console.log(e);
      res.json(e)
      
    }
  }
  async login(req, res, next) {

    try {
   
      const connection = await oracledb.getConnection(pool);
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      const result = await connection.execute(
        `
      BEGIN
          ICTDAT.P_PERUS.LOG(:pKodPerUs,:pOper);
      END;
      `,
        {
          pKodPerUs: userData?.user.KOD,
          pOper: "LOGIN",
        }
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async checkActivity(req, res, next) {
    try {
      const connection = await oracledb.getConnection(pool);
      const { KOD_PERUS,PAGE_NAME } = req.body;
    


      const result = await connection.execute(
        `
      BEGIN
          ICTDAT.P_PERUS.AddCounter(:pKodPerUs,:pPageName);
      END;
      `,
        {
          pKodPerUs: KOD_PERUS,
          pPageName:PAGE_NAME
        }
      );

console.log(result);
      // res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
    

      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
  async getInfo(req, res, next) {
    const { KOD_UR } = req.body;
    try {
      const users = await userService.getInfo(KOD_UR);

      res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async getTwoYearInfo(req, res, next) {
    const { KOD_UR } = req.body;
    try {
      const users = await userService.getTwoYearsData(KOD_UR);
      res.json({
        lastYear:users.resultPrev.rows,
        thisYear:users.resultThis.rows,
        twoYearsAgo:users.result2YearsAgo.rows
      });
    } catch (e) {
      next(e);
     
    }
  }


  async getUsersAccounts (req,res,next) {
try {
  const conn = await oracledb.getConnection(pool)
  const result = await conn.execute(`select a.*,b.NDOV,b.ZKPO
  from ictdat.perus a 
  left join ictdat.ur b on a.KOD_UR = b.KOD

  
  `)

  res.json(result)
} catch (error) {
  console.log(error);
}
  }
  async getUserAccountsAdmin (req,res,next) {

    const {kod_ur} = req.body
try {
  const conn = await oracledb.getConnection(pool)
  const result = await conn.execute(`
    select * from ictdat.perus where kod_ur = ${kod_ur} and ISADMIN = 0 AND email NOT LIKE '%@ict.lviv.ua%'
  
  `)

  res.json(result.rows)
} catch (error) {
  console.log(error);
}
  }



 async  updateUserPhoneNumber (req,res,next) {
  const {phone_number,email} = req.body;
  console.log(req.body);
  try {
    const connection = await oracledb.getConnection(pool)
    const sql = `update ictdat.perus set PHONE_NUMBER = :phone_number,TG_ID = null where email = :email `;
    const binds = { phone_number: phone_number, email: email };
    const options = {
      autoCommit: true,
    };
    const result = await connection.execute(sql,binds, options);
    if (result.rowsAffected === 1) {
      res.json({
        message:"Success"
      })
    }else {
      res.json({
        message:"Error"
      })
    }
  } catch (error) {
    console.log(error);
  }
 }

 async updateAdminCompany (req,res,next) {
  const {kod_ur,kod} = req.body;

  try {
    const connection = await oracledb.getConnection(pool)
    const sql = `update ictdat.perus set KOD_UR = :kod_ur  where KOD = :kod `;
    const binds = { kod_ur, kod};
    const options = {
      autoCommit: true,
    };
    const result = await connection.execute(sql,binds, options);
    if (result.rowsAffected === 1) {
      res.json({
        message:"Success",
        status:200
      })
    }else {
      res.json({
        message:"Error"
      })
    }
  } catch (error) {
    console.log(error);
  }
 }
}

module.exports = new UserController();
