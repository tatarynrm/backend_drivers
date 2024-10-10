const { Pool, Client } = require("pg");

// Create a new Pool instance (recommended for most use cases)
const noris = new Pool({
  user: process.env.NORIS_DB_USER,
  host: process.env.NORIS_DB_HOST,
  database: process.env.NORIS_DB_NAME,
  password: process.env.NORIS_DB_PASSWORD,
  port: process.env.NORIS_DB_PORT,
});

module.exports = noris;
