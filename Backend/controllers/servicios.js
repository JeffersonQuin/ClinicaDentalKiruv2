const servicioModel = require('../models/servicios');

module.exports = {
  listado: async (req, res) => {
    try {
      const results = await servicioModel.listado();
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener servicios'
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await servicioModel.obtenerPorId(id);
      
      if (!servicio) {
        return res.status(404).json({
          success: 0,
          message: 'Servicio no encontrado'
        });
      }

      return res.status(200).json({
        success: 1,
        data: servicio
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener el servicio'
      });
    }
  }
};