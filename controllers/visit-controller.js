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
      console.log(data.rows); // Виводимо результати запиту до консоль

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
}

module.exports = new VisitController();
