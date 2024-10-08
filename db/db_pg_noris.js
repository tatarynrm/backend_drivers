const { Pool, Client } = require('pg');

// Create a new Pool instance (recommended for most use cases)
const noris = new Pool({

  user: 'postgres',

  host: '185.233.39.139',
  database: 'ict_drivers',
  password: 'Aa527465182',
  port: 5432, // PostgreSQL default port
});

module.exports = noris;