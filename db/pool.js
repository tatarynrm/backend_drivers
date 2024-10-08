// const pool = {
//   user: process.env.DB_LOGIN_NAME,
//   password: process.env.DB_LOGIN_PASSWORD,
//   connectString: process.env.DB_LOGIN_CONNECT_STRING,
//   poolMax: Number(process.env.DB_POOL_MAX || 20),
//   poolMin: Number(process.env.DB_POOL_MIN || 10),
//   poolIncrement: Number(process.env.DB_POOL_INCREMENT || 1),
//   poolTimeOut: Number(process.env.DB_POOL_TIMEOUT || 60),
// };

const pool = {
  user: process.env.DB_LOGIN_NAME,
  password: process.env.DB_LOGIN_PASSWORD,
  connectString: process.env.DB_LOGIN_CONNECT_STRING,
  // poolMax: Number(process.env.DB_POOL_MAX || 20),
  // poolMin: Number(process.env.DB_POOL_MIN || 10),
  // poolIncrement: Number(process.env.DB_POOL_INCREMENT || 1),
  // poolTimeOut: Number(process.env.DB_POOL_TIMEOUT || 60),
};

module.exports = pool;

