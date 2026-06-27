require('dotenv').config();
const { Pool } = require('pg');

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

connection.on('error', (err, client) => {
  console.error('Aviso: O banco de dados encerrou uma conexão ociosa (ECONNRESET).', err.message);
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
    console.error('Erro ao conectar no PostgreSQL:', err.stack);
  } else {
    console.log('Conectado ao PostgreSQL com sucesso!');
    if (client) release();
  }
});

module.exports = connection;