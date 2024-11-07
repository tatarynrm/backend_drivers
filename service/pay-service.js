const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
const pool = require("../db/pool");
const { Result } = require("express-validator");
const { log } = require("handlebars/runtime");
const moment = require('moment')


class PayService {

  async getPayDays(KOD) {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";

try {
  const result = await connection.execute(
    `select * from v_borgpday where kod_ur = ${KOD}`
  );

const rows = result.rows
const data = rows.reduce((acc, current) => {
  const date = moment(current.DAT).format('L');
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(current);
  return acc;
}, {});


const dataArray = Object.entries(data).map(([date, objects]) => ({
  date,
  objects
}));


console.log(result.rows);


    return {
      dataArray,
    };
} catch (error) {
  console.log(error);
}
  
  }

}

module.exports = new PayService();
