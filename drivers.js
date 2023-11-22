require("dotenv").config();
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const moment = require("moment");
require("moment/locale/uk");
const { Telegraf, Markup } = require('telegraf');
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
const errrorMiddleware = require("./middlewares/error-middleware");
const authRouter = require("./router/user-routes");
const urRouter = require('./router/ur-routes')
const transportationRouter = require("./router/transportation-routes");
const externalLardiRouter = require("./external-api/lardi/routes/cargo");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./middlewares/sessionMiddleware");
const {
  authorizeUser,
  initializeUser,
} = require("./middlewares/socketController");
const pool = require("./db/pool");
const { sendBuhTransport } = require("./nodemailer/nodemailer");
const sendRegisterMail = require("./nodemailer/register/register-mail");
const bot = require("./telegram_bot/bot_init");

const io = new Server(server, {
  cors: corsConfig,
});
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://carriers.ict.lviv.ua", "http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://carriers.ict.lviv.ua",
    "http://localhost:3000",
    "https://ictwork.site",
  ];
  // const allowedOrigins = [
  //   process.env.ALLOW_ORIGIN_1,
  //   process.env.ALLOW_ORIGIN_2,
  //   process.env.ALLOW_ORIGIN_3,
  // ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Controll-Allow-Origin", origin);
  }
  res.header("Access-Controll-Allow-Methods", "GET,OPTIONS");
  res.header("Access-Controll-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Controll-Allow-Credentials", true);
  return next();
});

app.use("/", authRouter);
app.use("/", transportationRouter);
app.use("/ur", urRouter);

// EXTERNAL API
app.use("/lardi", externalLardiRouter);
// EXTERNAL API

// Error Має бути в кінці
app.use(errrorMiddleware);
app.use(sessionMiddleware);

app.get("/test", async (req, res) => {
  try {
    res.json({
      data: `TEST : ${moment(new Date()).format("LLLL")}`,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/me", async (req, res) => {
  try {
    res.json({
      data: "ME!!!!!!!!!",
    });
  } catch (error) {
    console.log(error);
  }
});
io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
});

// setTimeout(()=>{
//   // sendBuhTransport()
//   sendRegisterMail()
// },2000)

server.listen(process.env.PORT || 8801, async () => {
  // await initDb();
  console.log(`Server on PORT : ${process.env.PORT}`);
});
