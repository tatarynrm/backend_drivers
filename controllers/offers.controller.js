const OracleDB = require("oracledb");
const UrService = require("../service/ur-service");
const pool = require("../db/pool");
const noris = require("../db/db_pg_noris");

class OffersController {
  createOffer = async (req, res) => {
    const { text, email } = req.body;
    try {
      const newOffer = await noris.query(
        `insert into offers (text,email) values ($1,$2) RETURNING*;`,
        [text, email]
      );

      res.status(200).json(newOffer.rows);
    } catch (error) {
      console.log(error);
    }
  };
  getAllOffers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Отримуємо параметри з запиту

    // Обчислюємо зсув (offset)
    const offset = (page - 1) * limit;

    try {
      // Виконуємо SQL-запит з пагінацією
      const result = await noris.query(
        `SELECT * FROM offers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      // Виконуємо запит для отримання загальної кількості пропозицій
      const totalCountResult = await noris.query(`SELECT COUNT(*) FROM offers`);
      const totalCount = totalCountResult.rows[0].count; // Отримуємо загальну кількість пропозицій

      // Перевіряємо, чи є рядки у відповіді
      if (result.rows.length > 0) {
        return res.status(200).json({
          totalCount: totalCount, // Загальна кількість пропозицій
          currentPage: page, // Поточна сторінка
          offers: result.rows, // Рядки з пропозиціями
        });
      } else {
        return res.status(404).json({ msg: "No offers found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  preRegisterAccountCreate = async (req, res) => {
    const {
      email,
      is_admin,
      per_admin,
      phone_number,
      pwd,
      surname,
      name,
      last_name,
      company
    } = req.body;

    try {
      const newAccount = await noris.query(
        `insert into users_to_register (email,
      is_admin,
      per_admin,
      phone_number,
      pwd,
      surname,
      name,
      last_name,company) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING*;`,
        [
          email,
          is_admin,
          per_admin,
          phone_number,
          pwd,
          surname,
          name,
          last_name,
          company
        ]
      );

   if (newAccount.rows) {
    res.status(200).json(newAccount.rows)
   }
    } catch (error) {
      console.log(error);
    }
  };

  // Користувачі до реєстрації

  getAllPreRegisterUsers = async (req, res) => {

    try {
const users = await noris.query(`select * from users_to_register`);

console.log(users);

res.json(users)
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new OffersController();
