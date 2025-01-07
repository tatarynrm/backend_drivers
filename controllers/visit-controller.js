const noris = require("../db/db_pg_noris");

class VisitController {
  visitRecord = async (req, res) => {
    const { page, company } = req.body; // Отримуємо дані зі запиту

    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Місяці від 0 до 11
    const day = String(todayDate.getDate()).padStart(2, "0"); // Дні від 1 до 31
    const today = `${year}-${month}-${day}`; // Форматуємо сьогоднішню дату

    try {
      // Виконуємо запит до бази даних
      const data = await noris.query("SELECT * FROM users_to_register");

      // Лог для перевірки результату


      // Починаємо транзакцію
      await noris.query("BEGIN");

      // Перевіряємо, чи існує запис для сьогоднішньої дати, компанії та сторінки
      const checkRes = await noris.query(
        "SELECT counter FROM visitors WHERE date = $1 AND page = $2 AND company = $3",
        [today, page, company]
      );

      if (checkRes.rows.length > 0) {
        // Якщо запис існує, збільшуємо значення counter
        const updateRes = await noris.query(
          `UPDATE visitors SET counter = counter + 1 
           WHERE date = $1 AND page = $2 AND company = $3 
           RETURNING counter`,
          [today, page, company]
        );
      } else {
        // Якщо запису немає, створюємо новий запис
        const insertRes = await noris.query(
          "INSERT INTO visitors (date, counter, page, company) VALUES ($1, 1, $2, $3) RETURNING counter",
          [today, page, company]
        );
      }

      // Завершуємо транзакцію
      await noris.query("COMMIT");

      // Відправляємо успішну відповідь
      res.status(200).send({ success: true });
    } catch (e) {
      // Якщо сталася помилка, відкатуємо транзакцію
      await noris.query("ROLLBACK");

      // Лог помилки
      console.error("Error recording visit:", e);

      // Відправляємо помилку
      res.status(500).send({ success: false, error: e.message });
    }
  };
visitAllData = async (req,res)=>{
  try {
    const query = `
      SELECT 
        "company", 
        COUNT(*) AS visit_count 
      FROM 
       visitors
      WHERE 
        DATE_TRUNC('month', "date") = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY 
        "company"
      ORDER BY 
        visit_count DESC;
    `;
    const { rows } = await noris.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Помилка:', err);
    res.status(500).send('Internal Server Error');
  }
}
  getCompanyVisit = async (req, res) => {
    const {company} = req.body


    
    try {
      const data = await noris.query(`
        SELECT * 
        FROM visitors 
        WHERE company LIKE '%' || $1 || '%'
          AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE);
      `, [company]);


   res.status(200).json(data);
    } catch (error) {
      console.log(error);
      
    }
  };
}

module.exports = new VisitController();
