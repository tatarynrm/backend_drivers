require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
const { share_number, user_keyboard } = require("./bot_buttons");
const bot = new Telegraf(process.env.BOT_TELEGRAM_TOKEN);
const oracledb = require("oracledb");
const pool = require("../db/pool");
const { log } = require("handlebars/runtime");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
bot.start(async (ctx) => {
  const connection = await oracledb.getConnection(pool);
  connection.currentSchema = "ICTDAT";
  try {
    const existUser = await connection.execute(
      `select * from perus where TG_ID = ${ctx.message.from.id}`
    );
    if (existUser.rows <= 0) {
      await ctx.reply(
        "Вітаю.Для повноцінного користування ботом,- вам необхідно поділитись своїм контактом.",
        {
          reply_markup: share_number,
        }
      );
    }
    if (existUser.rows[0].TG_ID ) {
      ctx.reply(`Вітаю ${existUser.rows[0].EMAIL}`, {
        reply_markup: user_keyboard,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

console.log(user_keyboard.keyboard);
for (let i = 0; i < user_keyboard.keyboard.length; i++) {
  const el = user_keyboard.keyboard[i];
  const text = el[0].text;
  bot.hears(text, async (ctx) => {
    await ctx.reply("В процесі розробки");
  });
}
// for (let i = 0; i < but.length; i++) {
//   const element = but[i];
//   bot.hears('')
// }

// Handle the shared phone number
bot.on("contact", async (ctx) => {
  try {
    const { phone_number } = ctx.message.contact;
    console.log(phone_number);
    const user_id = await ctx.message.from.id;
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";
    const existUser = await connection.execute(
      `select * from perus where PHONE_NUMBER = '${phone_number}'`
    );

    if (existUser.rows.length > 0) {
      const updateSql = `update perus set TG_ID = :user_id where PHONE_NUMBER = :phone_number`;
      const bindParams = {
        user_id: user_id,
        phone_number: phone_number,
      };
      const options = {
        autoCommit: true,
      };
      const result = await connection.execute(updateSql, bindParams, options);

      console.log("Data updated successfully.");
      await connection.close();
      await ctx.reply(`Вітаю!`, { reply_markup: user_keyboard });
    }
    if (existUser.rows.length <= 0) {
      await ctx.reply(
        `Ви не можете використовувати бота.Зверніться в підтримку.`,
        { reply_markup: { remove_keyboard: true } }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

bot.hears("ok", async (ctx) => {
  ctx.reply("sds");
});
bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
