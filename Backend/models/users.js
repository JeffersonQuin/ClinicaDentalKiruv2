const crypto = require('crypto');

function sha256(string) {
    return crypto.createHash('sha256').update(string).digest('hex');
}

const pool = require("../database");

module.exports = {
  listado: async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  crear: async (user) => {
    const { username, password, email } = user;
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, sha256(password), email]
    );
    return result.insertId;
  },

  actualizar: async (id, user) => {
    const campos = [];
    const valores = [];

    if (user.username !== undefined) {
      campos.push('username = ?');
      valores.push(user.username);
    }
    if (user.password !== undefined) {
      campos.push('password = ?');
      valores.push(sha256(user.password));
    }
    if (user.email !== undefined) {
      campos.push('email = ?');
      valores.push(user.email);
    }
    if (user.tipo !== undefined) {
      campos.push('tipo = ?');
      valores.push(user.tipo);
    }
    if (user.state !== undefined) {
      campos.push('state = ?');
      valores.push(user.state);
    }

    if (campos.length === 0) {
      return 0;
    }

    valores.push(id);
    const [result] = await pool.query(
      `UPDATE users SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
    return result.affectedRows;
  },

  eliminar: async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  },

  verifica: async (datos) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [datos.username, sha256(datos.password)]
    );
    return rows[0];
  },

  buscarPorProveedorId: async (provider, provider_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      [provider, provider_id]
    );
    return rows[0];
  },

  promocionarUsuario: async (id, user) => {
    const { tipo, password } = user;
    const [result] = await pool.query(
      'UPDATE users SET tipo = ?, password = ? WHERE id = ?',
      [tipo, sha256(password), id]
    );
    return result.affectedRows;
  },

  buscarPorEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  crearDesdeOAuth: async (profileData) => {
    const { email, provider, provider_id, username, avatar, email_verified } = profileData;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, email_verified, provider, provider_id, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, email_verified ? 1 : 0, provider, provider_id, avatar]
    );
    return result.insertId;
  }
};