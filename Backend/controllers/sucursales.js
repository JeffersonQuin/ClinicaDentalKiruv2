// controllers/sucursales.js
const sucursalModel = require('../models/sucursales');

module.exports = {
  listado: async (req, res) => {
    try {
      const results = await sucursalModel.listado();
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener sucursales'
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const sucursal = await sucursalModel.obtenerPorId(id);
      
      if (!sucursal) {
        return res.status(404).json({
          success: 0,
          message: 'Sucursal no encontrada'
        });
      }

      return res.status(200).json({
        success: 1,
        data: sucursal
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener la sucursal'
      });
    }
  }
};