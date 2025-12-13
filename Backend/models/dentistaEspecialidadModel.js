const pool = require('../database');

class DentistaEspecialidadModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM dentista_especialidad');
    return rows;
  }

  static async obtenerPorDentista(dentista_id) {
    const [rows] = await pool.query(
      'SELECT especialidad_id FROM dentista_especialidad WHERE dentista_id = ?',
      [dentista_id]
    );
    return rows;
  }

  static async asignar(dentista_id, especialidad_id) {
    const sql = `INSERT INTO dentista_especialidad (dentista_id, especialidad_id) VALUES (?, ?)`;
    await pool.query(sql, [dentista_id, especialidad_id]);
    return { dentista_id, especialidad_id };
  }

  static async eliminar(dentista_id, especialidad_id) {
    await pool.query(
      'DELETE FROM dentista_especialidad WHERE dentista_id = ? AND especialidad_id = ?',
      [dentista_id, especialidad_id]
    );
    return true;
  }

  static async eliminarTodas(dentista_id) {
    await pool.query('DELETE FROM dentista_especialidad WHERE dentista_id = ?', [dentista_id]);
    return true;
  }

}

module.exports = DentistaEspecialidadModel;
