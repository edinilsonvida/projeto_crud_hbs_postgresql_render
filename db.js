require('dotenv').config();
const { Pool } = require('pg');

// 1. Configuração do Pool de conexões do PostgreSQL
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  // Mantém a compatibilidade de SSL para rodar tanto no Render quanto localmente
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// 2. Tratamento de erro para conexões ociosas (Evita o crash por ECONNRESET no Render)
connection.on('error', (err, client) => {
  console.error('Aviso: O banco de dados encerrou uma conexão ociosa (ECONNRESET).', err.message);
});

// 3. Teste inicial de conexão
connection.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar no PostgreSQL:', err.stack);
  } else {
    console.log('Conectado ao PostgreSQL com sucesso!');
    // Libera o cliente de volta para o Pool após o teste
    if (client) release();
  }
});

// 4. Exporta a conexão para ser usada no restante do projeto
module.exports = connection;