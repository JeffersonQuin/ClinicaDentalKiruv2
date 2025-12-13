const pool = require("../database");

module.exports = {
  // Listar todos los dependientes activos
  listado: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM dependientes WHERE state = ?',
      ['active']
    );
    return rows;
  },

  // Listar dependientes de un usuario específico (solo activos)
  listarPorUsuario: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM dependientes WHERE user_id = ? AND state = ?',
      [userId, 'active']
    );
    return rows;
  },

  // Obtener un dependiente por ID (solo si está activo)
  obtenerPorId: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM dependientes WHERE id = ? AND state = ?',
      [id, 'active']
    );
    return rows[0];
  },

  // Crear nuevo dependiente
  crear: async (dependiente) => {
    const { user_id, nombre_completo, genero, parentesco, telefono, fecha_nacimiento } = dependiente;
    
    const [result] = await pool.query(
      `INSERT INTO dependientes 
       (user_id, nombre_completo, genero, parentesco, telefono, fecha_nacimiento, state) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, nombre_completo, genero, parentesco, telefono, fecha_nacimiento, 'active']
    );
    
    return result.insertId;
  },

  // Actualizar dependiente
  actualizar: async (id, dependiente) => {
    const campos = [];
    const valores = [];

    if (dependiente.nombre_completo !== undefined) {
      campos.push('nombre_completo = ?');
      valores.push(dependiente.nombre_completo);
    }
    if (dependiente.genero !== undefined) {
      campos.push('genero = ?');
      valores.push(dependiente.genero);
    }
    if (dependiente.parentesco !== undefined) {
      campos.push('parentesco = ?');
      valores.push(dependiente.parentesco);
    }
    if (dependiente.telefono !== undefined) {
      campos.push('telefono = ?');
      valores.push(dependiente.telefono);
    }
    if (dependiente.fecha_nacimiento !== undefined) {
      campos.push('fecha_nacimiento = ?');
      valores.push(dependiente.fecha_nacimiento);
    }

    if (campos.length === 0) {
      return 0;
    }

    valores.push(id);
    const [result] = await pool.query(
      `UPDATE dependientes SET ${campos.join(', ')} WHERE id = ? AND state = ?`,
      [...valores, 'active']
    );
    
    return result.affectedRows;
  },

  // Soft delete - marcar como inactivo
  eliminar: async (id) => {
    const [result] = await pool.query(
      'UPDATE dependientes SET state = ? WHERE id = ?',
      ['inactive', id]
    );
    return result.affectedRows;
  },

  // Restaurar dependiente eliminado
  restaurar: async (id) => {
    const [result] = await pool.query(
      'UPDATE dependientes SET state = ? WHERE id = ?',
      ['active', id]
    );
    return result.affectedRows;
  },

  // Verificar si un dependiente pertenece a un usuario
  perteneceAUsuario: async (dependienteId, userId) => {
    const [rows] = await pool.query(
      'SELECT id FROM dependientes WHERE id = ? AND user_id = ? AND state = ?',
      [dependienteId, userId, 'active']
    );
    return rows.length > 0;
  },

  // Contar dependientes activos de un usuario
  contarPorUsuario: async (userId) => {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total FROM dependientes WHERE user_id = ? AND state = ?',
      [userId, 'active']
    );
    return rows[0].total;
  }
};
