const pacienteModel = require('../models/pacienteModel');

module.exports = {
  listado: async (req, res) => {
    try {
      const results = await pacienteModel.listado();
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener pacientes'
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const paciente = await pacienteModel.obtenerPorId(id);
      
      if (!paciente) {
        return res.status(404).json({
          success: 0,
          message: 'Paciente no encontrado'
        });
      }

      return res.status(200).json({
        success: 1,
        data: paciente
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener el paciente'
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, apellido_paterno, ci, fecha_nacimiento, fecha_registro } = req.body;

      if (!nombre || !apellido_paterno || !ci || !fecha_nacimiento || !fecha_registro) {
        return res.status(400).json({
          success: 0,
          message: 'Campos requeridos: nombre, apellido_paterno, ci, fecha_nacimiento, fecha_registro'
        });
      }

      const ciExiste = await pacienteModel.buscarPorCI(ci);
      if (ciExiste) {
        return res.status(400).json({
          success: 0,
          message: 'Ya existe un paciente con ese CI'
        });
      }

      const pacienteId = await pacienteModel.crear(req.body);
      const pacienteCreado = await pacienteModel.obtenerPorId(pacienteId);

      return res.status(201).json({
        success: 1,
        data: pacienteCreado
      });
    } catch (err) {
      console.error('Error en crear:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al crear el paciente'
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: 0,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      const pacienteExiste = await pacienteModel.obtenerPorId(id);
      if (!pacienteExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Paciente no encontrado'
        });
      }

      if (req.body.ci && req.body.ci !== pacienteExiste.ci) {
        const ciExiste = await pacienteModel.buscarPorCI(req.body.ci);
        if (ciExiste) {
          return res.status(400).json({
            success: 0,
            message: 'Ya existe un paciente con ese CI'
          });
        }
      }

      await pacienteModel.actualizar(id, req.body);
      const pacienteActualizado = await pacienteModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: pacienteActualizado
      });
    } catch (err) {
      console.error('Error en actualizar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al actualizar el paciente'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const pacienteExiste = await pacienteModel.obtenerPorId(id);
      if (!pacienteExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Paciente no encontrado'
        });
      }

      await pacienteModel.eliminar(id);

      return res.status(200).json({
        success: 1,
        message: 'Paciente eliminado correctamente'
      });
    } catch (err) {
      console.error('Error en eliminar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al eliminar el paciente'
      });
    }
  },

  buscarPorCI: async (req, res) => {
    try {
      const { ci } = req.params;
      const paciente = await pacienteModel.buscarPorCI(ci);
      
      if (!paciente) {
        return res.status(404).json({
          success: 0,
          message: 'Paciente no encontrado'
        });
      }

      return res.status(200).json({
        success: 1,
        data: paciente
      });
    } catch (err) {
      console.error('Error en buscarPorCI:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al buscar paciente'
      });
    }
  },

  buscarPorEmail: async (req, res) => {
    try {
      const { gmail } = req.params;
      const pacientes = await pacienteModel.buscarPorEmail(gmail);
      
      return res.status(200).json({
        success: 1,
        data: pacientes
      });
    } catch (err) {
      console.error('Error en buscarPorEmail:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al buscar pacientes'
      });
    }
  }
};