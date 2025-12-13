const pool = require('../database');

class DentistaModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM dentista');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM dentista WHERE id = ?', [id]);
    return rows[0];
  }

  static async crear(dentista) {
    const sql = `
      INSERT INTO dentista
        (nombre, segundo_nombre, apellido_paterno, apellido_materno, imagen, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      dentista.nombre,
      dentista.segundo_nombre || null,
      dentista.apellido_paterno,
      dentista.apellido_materno || null,
      dentista.imagen || null,
      dentista.estado || 'activo'
    ];

    const [result] = await pool.query(sql, params);
    return { id: result.insertId, ...dentista };
  }

  static async actualizar(id, dentista) {
    const sql = `
      UPDATE dentista
      SET nombre = ?, segundo_nombre = ?, apellido_paterno = ?, apellido_materno = ?, imagen = ?, estado = ?
      WHERE id = ?
    `;

    const params = [
      dentista.nombre,
      dentista.segundo_nombre || null,
      dentista.apellido_paterno,
      dentista.apellido_materno || null,
      dentista.imagen || null,
      dentista.estado || 'activo',
      id
    ];

    await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM dentista WHERE id = ?', [id]);
    return rows[0];
  }

}

module.exports = DentistaModel;
