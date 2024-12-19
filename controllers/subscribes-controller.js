const OracleDB = require("oracledb");
const UrService = require("../service/ur-service");
const pool = require("../db/pool");
const { log } = require("handlebars/runtime");




class SubscribeController {
    emailSubscribe = async (req, res) => {
        const { value,user_id } = req.body;
        try {
            const connection = await OracleDB.getConnection(pool);
            const sql = `update ictdat.perus set EMAILNOT = :value where KOD = :user_id `;
            const binds = { value: value, user_id: user_id };
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
      };
    tgSubscribe = async (req, res) => {
        const { value,user_id } = req.body;
     
        try {
          const connection = await OracleDB.getConnection(pool);
     
          const sql = `update ictdat.perus set TG_NOT = :value where KOD = :user_id `;
          const binds = { value: value, user_id: user_id };
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
      };
}

module.exports = new SubscribeController();