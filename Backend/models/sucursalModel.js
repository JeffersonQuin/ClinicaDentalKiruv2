const pool = require('../database');

class SucursalModel {

  static async listar() {
    const [rows] = await pool.query('SELECT * FROM sucursales');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM sucursales WHERE id = ?', [id]);
    return rows[0];
  }

  static async crear(sucursal) {
    const sql = `
      INSERT INTO sucursales 
        (nombre, ubicacion, direccion, descripcion, imagen, latitud, longitud, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      sucursal.nombre,
      sucursal.ubicacion,
      sucursal.direccion,
      sucursal.descripcion,
      sucursal.imagen,
      sucursal.latitud,
      sucursal.longitud,
      sucursal.activo
    ];

    const [result] = await pool.query(sql, params);
    return { id: result.insertId, ...sucursal };
  }

  static async actualizar(id, sucursal) {
    const sql = `
      UPDATE sucursales
      SET nombre = ?, ubicacion = ?, direccion = ?, descripcion = ?, imagen = ?, latitud = ?, longitud = ?, activo = ?
      WHERE id = ?
    `;

    const params = [
      sucursal.nombre,
      sucursal.ubicacion,
      sucursal.direccion,
      sucursal.descripcion,
      sucursal.imagen || null,
      sucursal.latitud || null,
      sucursal.longitud || null,
      sucursal.activo !== undefined ? sucursal.activo : true,
      id
    ];

    await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM sucursales WHERE id = ?', [id]);
    return rows[0];
  }

}

module.exports = SucursalModel;
