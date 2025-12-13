const pool = require("../database");

module.exports = {
  listado: async () => {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE state = 1');
    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ? AND state = 1', [id]);
    return rows[0];
  },

  crear: async (paciente) => {
    const {
      fecha_registro,
      gmail,
      nombre,
      apellido_paterno,
      apellido_materno,
      ci,
      fecha_nacimiento,
      ciudad,
      profesion,
      estado_civil,
      domicilio,
      telefono,
      motivo_consulta,
      ultima_visita_odontologo,
      descripcion,
      antecedentes_salud,
      alertas_clinicas
    } = paciente;

    const [result] = await pool.query(
      `INSERT INTO pacientes (
        fecha_registro, gmail, nombre, apellido_paterno, apellido_materno,
        ci, fecha_nacimiento, ciudad, profesion, estado_civil, domicilio,
        telefono, motivo_consulta, ultima_visita_odontologo, descripcion,
        antecedentes_salud, alertas_clinicas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fecha_registro, gmail, nombre, apellido_paterno, apellido_materno,
        ci, fecha_nacimiento, ciudad, profesion, estado_civil, domicilio,
        telefono, motivo_consulta, ultima_visita_odontologo, descripcion,
        antecedentes_salud, alertas_clinicas
      ]
    );
    return result.insertId;
  },

  actualizar: async (id, paciente) => {
    const campos = [];
    const valores = [];

    if (paciente.fecha_registro !== undefined) {
      campos.push('fecha_registro = ?');
      valores.push(paciente.fecha_registro);
    }
    if (paciente.gmail !== undefined) {
      campos.push('gmail = ?');
      valores.push(paciente.gmail);
    }
    if (paciente.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(paciente.nombre);
    }
    if (paciente.apellido_paterno !== undefined) {
      campos.push('apellido_paterno = ?');
      valores.push(paciente.apellido_paterno);
    }
    if (paciente.apellido_materno !== undefined) {
      campos.push('apellido_materno = ?');
      valores.push(paciente.apellido_materno);
    }
    if (paciente.ci !== undefined) {
      campos.push('ci = ?');
      valores.push(paciente.ci);
    }
    if (paciente.fecha_nacimiento !== undefined) {
      campos.push('fecha_nacimiento = ?');
      valores.push(paciente.fecha_nacimiento);
    }
    if (paciente.ciudad !== undefined) {
      campos.push('ciudad = ?');
      valores.push(paciente.ciudad);
    }
    if (paciente.profesion !== undefined) {
      campos.push('profesion = ?');
      valores.push(paciente.profesion);
    }
    if (paciente.estado_civil !== undefined) {
      campos.push('estado_civil = ?');
      valores.push(paciente.estado_civil);
    }
    if (paciente.domicilio !== undefined) {
      campos.push('domicilio = ?');
      valores.push(paciente.domicilio);
    }
    if (paciente.telefono !== undefined) {
      campos.push('telefono = ?');
      valores.push(paciente.telefono);
    }
    if (paciente.motivo_consulta !== undefined) {
      campos.push('motivo_consulta = ?');
      valores.push(paciente.motivo_consulta);
    }
    if (paciente.ultima_visita_odontologo !== undefined) {
      campos.push('ultima_visita_odontologo = ?');
      valores.push(paciente.ultima_visita_odontologo);
    }
    if (paciente.descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(paciente.descripcion);
    }
    if (paciente.antecedentes_salud !== undefined) {
      campos.push('antecedentes_salud = ?');
      valores.push(paciente.antecedentes_salud);
    }
    if (paciente.alertas_clinicas !== undefined) {
      campos.push('alertas_clinicas = ?');
      valores.push(paciente.alertas_clinicas);
    }
    if (paciente.state !== undefined) {
      campos.push('state = ?');
      valores.push(paciente.state);
    }

    if (campos.length === 0) {
      return 0;
    }

    valores.push(id);
    const [result] = await pool.query(
      `UPDATE pacientes SET ${campos.join(', ')} WHERE id = ? AND state = 1`,
      valores
    );
    return result.affectedRows;
  },

  eliminar: async (id) => {
    const [result] = await pool.query('UPDATE pacientes SET state = 0 WHERE id = ?', [id]);
    return result.affectedRows;
  },

  buscarPorCI: async (ci) => {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes WHERE ci = ? AND state = 1',
      [ci]
    );
    return rows[0];
  },

  buscarPorEmail: async (gmail) => {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes WHERE gmail = ? AND state = 1',
      [gmail]
    );
    return rows;
  }
};