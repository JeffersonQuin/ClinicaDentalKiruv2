const dependienteModel = require('../models/dependientes');

module.exports = {
  // Listar todos los dependientes del usuario autenticado
  listado: async (req, res) => {
    try {
      const userId = req.decoded.id; // Del token JWT
      const results = await dependienteModel.listarPorUsuario(userId);
      
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener dependientes'
      });
    }
  },

  // Obtener un dependiente específico
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      
      // Verificar que el dependiente pertenece al usuario
      const pertenece = await dependienteModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para acceder a este dependiente'
        });
      }
      
      const dependiente = await dependienteModel.obtenerPorId(id);
      
      if (!dependiente) {
        return res.status(404).json({
          success: 0,
          message: 'Dependiente no encontrado'
        });
      }

      return res.status(200).json({
        success: 1,
        data: dependiente
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener el dependiente'
      });
    }
  },

  // Crear nuevo dependiente
  crear: async (req, res) => {
    try {
      const userId = req.decoded.id; // Del token JWT
      const { nombre_completo, genero, parentesco, telefono, fecha_nacimiento } = req.body;

      // Validaciones
      if (!nombre_completo || !genero || !parentesco) {
        return res.status(400).json({
          success: 0,
          message: 'Nombre completo, género y parentesco son requeridos'
        });
      }

      // Validar género
      const generosValidos = ['Masculino', 'Femenino', 'Otro'];
      if (!generosValidos.includes(genero)) {
        return res.status(400).json({
          success: 0,
          message: 'Género inválido'
        });
      }

      const dependienteData = {
        user_id: userId,
        nombre_completo,
        genero,
        parentesco,
        telefono,
        fecha_nacimiento
      };

      const dependienteId = await dependienteModel.crear(dependienteData);
      const dependienteCreado = await dependienteModel.obtenerPorId(dependienteId);

      return res.status(201).json({
        success: 1,
        data: dependienteCreado
      });
    } catch (err) {
      console.error('Error en crear:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al crear el dependiente'
      });
    }
  },

  // Actualizar dependiente
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const { nombre_completo, genero, parentesco, telefono, fecha_nacimiento } = req.body;

      // Verificar que al menos un campo esté presente
      if (!nombre_completo && !genero && !parentesco && !telefono && !fecha_nacimiento) {
        return res.status(400).json({
          success: 0,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      // Verificar que el dependiente pertenece al usuario
      const pertenece = await dependienteModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para modificar este dependiente'
        });
      }

      // Validar género si está presente
      if (genero) {
        const generosValidos = ['Masculino', 'Femenino', 'Otro'];
        if (!generosValidos.includes(genero)) {
          return res.status(400).json({
            success: 0,
            message: 'Género inválido'
          });
        }
      }

      await dependienteModel.actualizar(id, req.body);
      const dependienteActualizado = await dependienteModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: dependienteActualizado
      });
    } catch (err) {
      console.error('Error en actualizar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al actualizar el dependiente'
      });
    }
  },

  // Soft delete - desactivar dependiente
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;

      // Verificar que el dependiente pertenece al usuario
      const pertenece = await dependienteModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para eliminar este dependiente'
        });
      }

      await dependienteModel.eliminar(id);

      return res.status(200).json({
        success: 1,
        message: 'Dependiente desactivado correctamente'
      });
    } catch (err) {
      console.error('Error en eliminar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al desactivar el dependiente'
      });
    }
  },

  // Restaurar dependiente eliminado
  restaurar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;

      // Verificar que el dependiente pertenece al usuario
      // (necesitamos ajustar el modelo para que también busque inactivos en este caso)
      await dependienteModel.restaurar(id);

      const dependienteRestaurado = await dependienteModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: dependienteRestaurado,
        message: 'Dependiente restaurado correctamente'
      });
    } catch (err) {
      console.error('Error en restaurar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al restaurar el dependiente'
      });
    }
  }
};
