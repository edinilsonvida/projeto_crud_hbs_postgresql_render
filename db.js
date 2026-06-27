require('dotenv').config();
const { Pool } = require('pg');

const connection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

const originalQuery = connection.query.bind(connection);
connection.query = function (sql, values) {
  if (typeof sql === 'string' && sql.includes('?')) {
    let i = 1;
    sql = sql.replace(/\?/g, () => `$${i++}`);
  }
  return originalQuery(sql, values);
};

connection.connect((err, client, release) => {
  if (err) {
    console.log('Erro ao conectar:', err);
  } else {
    console.log('Conectado ao PostgreSQL!');
    if (client) release();
  }
});

module.exports = connection;