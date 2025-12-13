// test-db.js
const { testConnection } = require('../Backend/database');

(async () => {
  console.log('Probando conexión a PostgreSQL...');
  await testConnection();
  process.exit(0); // cierra el proceso después de la prueba
})();
