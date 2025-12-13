const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conectado a MySQL');
    connection.release();
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('✗ Conexión perdida con MySQL');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('✗ Demasiadas conexiones a MySQL');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('✗ Conexión rechazada por MySQL');
    } else {
      console.error('✗ Error MySQL:', err.message);
    }
  }
})();

module.exports = pool;