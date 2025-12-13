const recetaModel = require('../models/recetaModel');

module.exports = {
  listado: async (req, res) => {
    try {
      const results = await recetaModel.listado();
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener recetas'
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const receta = await recetaModel.obtenerPorId(id);
      
      if (!receta) {
        return res.status(404).json({
          success: 0,
          message: 'Receta no encontrada'
        });
      }

      return res.status(200).json({
        success: 1,
        data: receta
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener la receta'
      });
    }
  },

  obtenerPorPaciente: async (req, res) => {
    try {
      const { paciente_id } = req.params;
      const recetas = await recetaModel.obtenerPorPaciente(paciente_id);
      
      return res.status(200).json({
        success: 1,
        data: recetas
      });
    } catch (err) {
      console.error('Error en obtenerPorPaciente:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener recetas del paciente'
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { 
        paciente_id,
        dentista_id,
        fecha, 
        valida_hasta, 
        diagnostico,
        medicamentos 
      } = req.body;

      // Validaciones
      if (!paciente_id || !dentista_id || !fecha || !valida_hasta || !diagnostico) {
        return res.status(400).json({
          success: 0,
          message: 'Campos requeridos: paciente_id, dentista_id, fecha, valida_hasta, diagnostico'
        });
      }

      if (!medicamentos || !Array.isArray(medicamentos) || medicamentos.length === 0) {
        return res.status(400).json({
          success: 0,
          message: 'Debe incluir al menos un medicamento'
        });
      }

      // Validar que cada medicamento tenga los campos requeridos
      for (const med of medicamentos) {
        if (!med.nombre || !med.dosis || !med.duracion) {
          return res.status(400).json({
            success: 0,
            message: 'Cada medicamento debe tener nombre, dosis y duración'
          });
        }
      }

      const recetaData = {
        paciente_id,
        dentista_id,
        fecha,
        valida_hasta,
        diagnostico,
        indicaciones_generales: req.body.indicaciones_generales || null,
        observaciones: req.body.observaciones || null
      };

      const recetaId = await recetaModel.crear(recetaData, medicamentos);
      const recetaCreada = await recetaModel.obtenerPorId(recetaId);

      return res.status(201).json({
        success: 1,
        data: recetaCreada
      });
    } catch (err) {
      console.error('Error en crear:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al crear la receta'
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { medicamentos, ...recetaData } = req.body;

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: 0,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      const recetaExiste = await recetaModel.obtenerPorId(id);
      if (!recetaExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Receta no encontrada'
        });
      }

      // Validar medicamentos si se proporcionan
      if (medicamentos !== undefined) {
        if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
          return res.status(400).json({
            success: 0,
            message: 'Debe incluir al menos un medicamento'
          });
        }

        for (const med of medicamentos) {
          if (!med.nombre || !med.dosis || !med.duracion) {
            return res.status(400).json({
              success: 0,
              message: 'Cada medicamento debe tener nombre, dosis y duración'
            });
          }
        }
      }

      await recetaModel.actualizar(id, recetaData, medicamentos);
      const recetaActualizada = await recetaModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: recetaActualizada
      });
    } catch (err) {
      console.error('Error en actualizar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al actualizar la receta'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const recetaExiste = await recetaModel.obtenerPorId(id);
      if (!recetaExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Receta no encontrada'
        });
      }

      await recetaModel.eliminar(id);

      return res.status(200).json({
        success: 1,
        message: 'Receta eliminada correctamente'
      });
    } catch (err) {
      console.error('Error en eliminar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al eliminar la receta'
      });
    }
  }
};