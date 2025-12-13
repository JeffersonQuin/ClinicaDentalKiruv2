const pool = require('../database');

class UsuarioModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  // 🔹 Nueva función para verificar existencia por username o email
  static async existe(username, email) {
    const [rows] = await pool.query(
      'SELECT id FROM usuarios WHERE username = ? OR email = ?',
      [username, email]
    );
    return rows.length > 0; // true si existe, false si no existe
  }

  static async crear(usuario) {
    const existe = await this.existe(usuario.username, usuario.email);
    if (existe) {
      throw new Error('El username o email ya existe');
    }

    const sql = `
      INSERT INTO usuarios (username, password, email, type, state, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      usuario.username,
      usuario.password,
      usuario.email,
      usuario.type,
      usuario.state,
      usuario.avatar
    ];

    const [result] = await pool.query(sql, params);
    return { id: result.insertId, ...usuario };
  }

  static async actualizar(id, usuario) {
    const sql = `
      UPDATE usuarios
      SET username = ?, password = ?, email = ?, type = ?, state = ?, avatar = ?
      WHERE id = ?
    `;
    const params = [
      usuario.username,
      usuario.password,
      usuario.email,
      usuario.type,
      usuario.state,
      usuario.avatar,
      id
    ];

    await pool.query(sql, params);
    return { id, ...usuario };
  }

  static async eliminar(id) {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return true;
  }

}

module.exports = UsuarioModel;
