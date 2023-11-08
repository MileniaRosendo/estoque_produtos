const { Pool } = require('pg');

const pool = new Pool({
  user:'mhydjkbp',
  host: 'isabelle.db.elephantsql.com',
  database: 'mhydjkbp',
  password: 'Cz0s2F89tLl5ZSLhoh-WYdkVbdB3-Rry',
  port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;
