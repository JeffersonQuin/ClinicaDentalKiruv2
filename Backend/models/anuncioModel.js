const pool = require('../database');

class AnuncioModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM anuncios');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM anuncios WHERE id = ?', [id]);
    return rows[0];
  }

  // Crear anuncio
  static async crear(anuncio) {
    const sql = `
      INSERT INTO anuncios 
        (titulo, descripcion, categoria, fecha_publicacion, fecha_expiracion, userId, imagen, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      anuncio.titulo,
      anuncio.descripcion,
      anuncio.categoria,
      anuncio.fecha_publicacion,
      anuncio.fecha_expiracion,
      anuncio.userId,
      anuncio.imagen,
      anuncio.estado
    ];

    const [result] = await pool.query(sql, params);
    return { id: result.insertId, ...anuncio };
  }

  // Actualizar anuncio
  static async actualizar(id, anuncio) {
    const sql = `
      UPDATE anuncios
      SET titulo = ?, descripcion = ?, categoria = ?, fecha_publicacion = ?, fecha_expiracion = ?, userId = ?, imagen = ?, estado = ?
      WHERE id = ?
    `;
    const params = [
      anuncio.titulo,
      anuncio.descripcion,
      anuncio.categoria,
      anuncio.fecha_publicacion,
      anuncio.fecha_expiracion,
      anuncio.userId,
      anuncio.imagen,
      anuncio.estado,
      id
    ];

    await pool.query(sql, params);
    return { id, ...anuncio };
  }

  // Eliminar anuncio
  static async eliminar(id) {
    await pool.query('DELETE FROM anuncios WHERE id = ?', [id]);
    return true;
  }

}

module.exports = AnuncioModel;

