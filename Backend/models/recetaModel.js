const pool = require("../database");

module.exports = {
  // Listar todas las recetas con información del paciente y dentista
  listado: async () => {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        p.nombre as paciente_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.ci,
        d.nombre as dentista_nombre,
        d.segundo_nombre as dentista_segundo_nombre,
        d.apellido_paterno as dentista_apellido_paterno,
        d.apellido_materno as dentista_apellido_materno
      FROM recetas r
      INNER JOIN pacientes p ON r.paciente_id = p.id
      INNER JOIN dentista d ON r.dentista_id = d.id
      WHERE p.state = 1
      ORDER BY r.fecha DESC
    `);
    return rows;
  },

  // Obtener receta por ID con medicamentos, paciente y dentista
  obtenerPorId: async (id) => {
    const [recetas] = await pool.query(`
      SELECT 
        r.*,
        p.nombre as paciente_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.ci,
        p.fecha_nacimiento,
        p.ciudad,
        p.alertas_clinicas,
        d.nombre as dentista_nombre,
        d.segundo_nombre as dentista_segundo_nombre,
        d.apellido_paterno as dentista_apellido_paterno,
        d.apellido_materno as dentista_apellido_materno
      FROM recetas r
      INNER JOIN pacientes p ON r.paciente_id = p.id
      INNER JOIN dentista d ON r.dentista_id = d.id
      WHERE r.id = ?
    `, [id]);
    
    if (!recetas[0]) return null;
    
    const [medicamentos] = await pool.query(
      'SELECT * FROM medicamentos WHERE receta_id = ? ORDER BY id',
      [id]
    );
    
    return {
      ...recetas[0],
      medicamentos
    };
  },

  // Obtener recetas por paciente
  obtenerPorPaciente: async (paciente_id) => {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        d.nombre as dentista_nombre,
        d.segundo_nombre as dentista_segundo_nombre,
        d.apellido_paterno as dentista_apellido_paterno,
        d.apellido_materno as dentista_apellido_materno
      FROM recetas r
      INNER JOIN dentistas d ON r.dentista_id = d.id
      WHERE r.paciente_id = ?
      ORDER BY r.fecha DESC
    `, [paciente_id]);
    return rows;
  },

  // Crear receta con medicamentos
  crear: async (receta, medicamentos) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        paciente_id,
        dentista_id,
        fecha,
        valida_hasta,
        diagnostico,
        indicaciones_generales,
        observaciones
      } = receta;

      // Insertar receta
      const [resultReceta] = await connection.query(
        `INSERT INTO recetas (
          paciente_id, dentista_id, fecha, valida_hasta, diagnostico,
          indicaciones_generales, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          paciente_id, dentista_id, fecha, valida_hasta, diagnostico,
          indicaciones_generales, observaciones
        ]
      );

      const receta_id = resultReceta.insertId;

      // Insertar medicamentos
      if (medicamentos && medicamentos.length > 0) {
        const medicamentosValues = medicamentos.map(m => [
          receta_id,
          m.nombre,
          m.dosis,
          m.duracion,
          m.indicaciones || null
        ]);

        await connection.query(
          `INSERT INTO medicamentos (receta_id, nombre, dosis, duracion, indicaciones)
           VALUES ?`,
          [medicamentosValues]
        );
      }

      await connection.commit();
      return receta_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Actualizar receta y medicamentos
  actualizar: async (id, receta, medicamentos) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const campos = [];
      const valores = [];

      if (receta.dentista_id !== undefined) {
        campos.push('dentista_id = ?');
        valores.push(receta.dentista_id);
      }
      if (receta.fecha !== undefined) {
        campos.push('fecha = ?');
        valores.push(receta.fecha);
      }
      if (receta.valida_hasta !== undefined) {
        campos.push('valida_hasta = ?');
        valores.push(receta.valida_hasta);
      }
      if (receta.diagnostico !== undefined) {
        campos.push('diagnostico = ?');
        valores.push(receta.diagnostico);
      }
      if (receta.indicaciones_generales !== undefined) {
        campos.push('indicaciones_generales = ?');
        valores.push(receta.indicaciones_generales);
      }
      if (receta.observaciones !== undefined) {
        campos.push('observaciones = ?');
        valores.push(receta.observaciones);
      }

      if (campos.length > 0) {
        valores.push(id);
        await connection.query(
          `UPDATE recetas SET ${campos.join(', ')} WHERE id = ?`,
          valores
        );
      }

      // Eliminar medicamentos antiguos y crear nuevos
      if (medicamentos !== undefined) {
        await connection.query('DELETE FROM medicamentos WHERE receta_id = ?', [id]);
        
        if (medicamentos.length > 0) {
          const medicamentosValues = medicamentos.map(m => [
            id,
            m.nombre,
            m.dosis,
            m.duracion,
            m.indicaciones || null
          ]);

          await connection.query(
            `INSERT INTO medicamentos (receta_id, nombre, dosis, duracion, indicaciones)
             VALUES ?`,
            [medicamentosValues]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Eliminar receta (elimina medicamentos en cascada)
  eliminar: async (id) => {
    const [result] = await pool.query('DELETE FROM recetas WHERE id = ?', [id]);
    return result.affectedRows;
  }
};