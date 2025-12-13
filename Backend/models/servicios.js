// models/servicios.js
const pool = require("../database");

module.exports = {
  // Listar todos los servicios activos
  listado: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM servicios WHERE state = ? ORDER BY nombre',
      ['active']
    );
    return rows;
  },

  // Obtener servicio por ID
  obtenerPorId: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM servicios WHERE id = ? AND state = ?',
      [id, 'active']
    );
    return rows[0];
  }
};