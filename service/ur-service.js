const pool = require("../db/pool");
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
class UrService {
    getContrAgents = async (req, res) => {
        const { search } = req.body;
        try {
          const connection = await oracledb.getConnection(pool);
          const result = await connection.execute(
            `select * from ictdat.ur 
            WHERE NDOV LIKE '${search}%'
            OR NDOV LIKE '$${search}'
            OR NDOV LIKE '${search}'
            OR ZKPO LIKE '${search}'
            OR ZKPO LIKE '${search}$'
            OR ZKPO LIKE '$${search}'
            OR UPPER( NDOV ) LIKE '${search}%'
            OR UPPER( NDOV ) LIKE '%${search}_%'
            OR UPPER( NDOV ) LIKE '% ${search}'
            OR UPPER( NDOV ) LIKE '%${search} %'
            OR LOWER( NDOV ) LIKE '${search}%'
            OR LOWER( NDOV ) LIKE '%${search} %'
            OR LOWER( NDOV ) LIKE '%_${search}'
            OR LOWER( NDOV ) LIKE '%${search} %'
            OR NDOV LIKE '%_${search}_%'
            OR NDOV LIKE '${search}_%'
            OR NDOV LIKE '%_${search}'
            OR NDOV LIKE '_${search}'
            OR NDOV LIKE '_${search}_'
            OR NDOV LIKE '${search}_'
            OR NDOV LIKE '${search}_%'
            `
          );
          res.status(200).json(result.rows);
          if (!result) {
            res.status(401).json({ message: "error" });
          }
        } catch (error) {
          console.log(error);
        }
      };


}

module.exports = new UrService();
