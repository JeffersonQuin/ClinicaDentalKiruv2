// models/pacientes.js
const { query } = require('../database');

// CRUD Básico usando async/await
module.exports = {
  
  // Obtener todos los pacientes
  async listar() {
    const sql = 'SELECT * FROM pacientes ORDER BY id ASC';
    const result = await query(sql);
    return result.rows;
  },

  // Obtener un paciente por ID
  async obtenerPorId(id) {
    const sql = 'SELECT * FROM pacientes WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Crear paciente
  async crear(paciente) {
    const sql = `
      INSERT INTO pacientes (nombre, apellido, edad, telefono)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      paciente.nombre,
      paciente.apellido,
      paciente.edad,
      paciente.telefono
    ];

    const result = await query(sql, values);
    return result.rows[0];
  },

  // Actualizar paciente
  async actualizar(id, paciente) {
    const sql = `
      UPDATE pacientes
      SET nombre = $1, apellido = $2, edad = $3, telefono = $4
      WHERE id = $5
      RETURNING *;
    `;
    
    const values = [
      paciente.nombre,
      paciente.apellido,
      paciente.edad,
      paciente.telefono,
      id
    ];

    const result = await query(sql, values);
    return result.rows[0];
  },

  // Eliminar paciente
  async eliminar(id) {
    const sql = 'DELETE FROM pacientes WHERE id = $1 RETURNING *;';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
};
