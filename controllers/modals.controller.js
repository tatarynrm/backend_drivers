const OracleDB = require("oracledb");
const UrService = require("../service/ur-service");
const pool = require("../db/pool");
const noris = require("../db/db_pg_noris");

class ModalsController {
  createModalCheckIfNotExist = async (req, res) => {
    console.log(req.body);
    
    const { user_id, ur,count,comment,is_check,pipfull } = req.body;
    try {


     const    checkIsTrue = await noris.query(`select * from modals where user_id = ${user_id}`)
        


if (checkIsTrue.rows.length <= 0 ) {
            const modalCreate = await noris.query(
        `insert into modals (user_id,ur,count,comment,is_check,pipfull) values ($1,$2,$3,$4,$5,$6) RETURNING*;`,
        [user_id, ur,count,comment,is_check,pipfull]
      );
      console.log('DASDSA',modalCreate);
      
      res.json(modalCreate)
}
else if(count !== null || comment) {
    const modalUpdate = await noris.query(
        `UPDATE modals
         SET  count = $1, comment = $2, is_check = $3,pipfull=$4
         WHERE user_id = $5
         RETURNING *;`,
        [count, comment, is_check,pipfull, user_id]
      );
      res.json(modalUpdate)
}else {

    res.json(checkIsTrue)


}
        
    //     const newOffer = await noris.query(
    //     `insert into offers (text,email) values ($1,$2) RETURNING*;`,
    //     [text, email]
    //   );

    //   res.status(200).json(newOffer.rows);

  
    } catch (error) {
      console.log(error);
    }
  };

  getAllModals = async (req, res) => {
    try {
      const result = await noris.query('SELECT * FROM modals');
     

  
      res.json(result.rows);
    } catch (error) {
      console.error('Помилка при отриманні даних: ', error);
      res.status(500).send('Виникла помилка на сервері');
    }
  }
  


  // Користувачі до реєстрації


}

module.exports = new ModalsController();
