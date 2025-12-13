// models/sucursales.js
const pool = require("../database");

module.exports = {
  // Listar todas las sucursales activas
  listado: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM sucursales WHERE activo = ? ORDER BY nombre',
      [1]
    );
    return rows;
  },

  // Obtener sucursal por ID
  obtenerPorId: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM sucursales WHERE id = ? AND activo = ?',
      [id, 1]
    );
    return rows[0];
  }
};