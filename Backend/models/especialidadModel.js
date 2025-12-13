const pool = require('../database');

class EspecialidadModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM especialidad');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM especialidad WHERE id = ?', [id]);
    return rows[0];
  }

  static async crear(especialidad) {
    const sql = `
      INSERT INTO especialidad (nombre, descripcion, estado)
      VALUES (?, ?, ?)
    `;

    const params = [
      especialidad.nombre,
      especialidad.descripcion,
      especialidad.estado || 'activo'
    ];

    const [result] = await pool.query(sql, params);
    // Devolver el objeto completo desde la base de datos
    const [rows] = await pool.query('SELECT * FROM especialidad WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async actualizar(id, especialidad) {
    const sql = `
      UPDATE especialidad
      SET nombre = ?, descripcion = ?, estado = ?
      WHERE id = ?
    `;

    const params = [
      especialidad.nombre,
      especialidad.descripcion,
      especialidad.estado || 'activo',
      id
    ];

    await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM especialidad WHERE id = ?', [id]);
    return rows[0];
  }

}

module.exports = EspecialidadModel;
