const reservaModel = require('../models/reservas');
const dependienteModel = require('../models/dependientes');

module.exports = {
  // Listar todas las reservas del usuario autenticado
  listado: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const results = await reservaModel.listarPorUsuario(userId);
      
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener reservas'
      });
    }
  },

  // Obtener próximas reservas
  proximasReservas: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const limite = parseInt(req.query.limite) || 5;
      
      const results = await reservaModel.obtenerProximasReservas(userId, limite);
      
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en proximasReservas:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener próximas reservas'
      });
    }
  },

  // Obtener una reserva específica
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      
      // Verificar que la reserva pertenece al usuario
      const pertenece = await reservaModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para acceder a esta reserva'
        });
      }
      
      const reserva = await reservaModel.obtenerPorId(id);
      
      if (!reserva) {
        return res.status(404).json({
          success: 0,
          message: 'Reserva no encontrada'
        });
      }

      return res.status(200).json({
        success: 1,
        data: reserva
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener la reserva'
      });
    }
  },

  // Crear nueva reserva
  crear: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const { 
        dependiente_id, 
        servicio_id, 
        sucursal_id, 
        fecha_reserva, 
        hora_reserva,
        notas 
      } = req.body;

      // Validaciones básicas
      if (!servicio_id || !sucursal_id || !fecha_reserva || !hora_reserva) {
        return res.status(400).json({
          success: 0,
          message: 'Servicio, sucursal, fecha y hora son requeridos'
        });
      }

      // Si hay dependiente_id, verificar que pertenece al usuario
      if (dependiente_id) {
        const pertenece = await dependienteModel.perteneceAUsuario(dependiente_id, userId);
        if (!pertenece) {
          return res.status(403).json({
            success: 0,
            message: 'El dependiente especificado no pertenece a tu cuenta'
          });
        }
      }

      // Verificar disponibilidad de horario
      const disponible = await reservaModel.verificarDisponibilidad(
        sucursal_id, 
        fecha_reserva, 
        hora_reserva
      );

      if (!disponible) {
        return res.status(409).json({
          success: 0,
          message: 'El horario seleccionado ya no está disponible'
        });
      }

      // Validar que la fecha no sea en el pasado
      const fechaHoraReserva = new Date(`${fecha_reserva} ${hora_reserva}`);
      if (fechaHoraReserva < new Date()) {
        return res.status(400).json({
          success: 0,
          message: 'No se pueden crear reservas en fechas pasadas'
        });
      }

      const reservaData = {
        user_id: userId,
        dependiente_id: dependiente_id || null,
        servicio_id,
        sucursal_id,
        fecha_reserva,
        hora_reserva,
        notas: notas || null
      };

      const reservaId = await reservaModel.crear(reservaData);
      const reservaCreada = await reservaModel.obtenerPorId(reservaId);

      return res.status(201).json({
        success: 1,
        data: reservaCreada
      });
    } catch (err) {
      console.error('Error en crear:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al crear la reserva'
      });
    }
  },

  // Actualizar reserva
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const { 
        dependiente_id, 
        servicio_id, 
        sucursal_id, 
        fecha_reserva, 
        hora_reserva,
        notas 
      } = req.body;

      // Verificar que al menos un campo esté presente
      if (!dependiente_id && !servicio_id && !sucursal_id && 
          !fecha_reserva && !hora_reserva && !notas) {
        return res.status(400).json({
          success: 0,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      // Verificar que la reserva pertenece al usuario
      const pertenece = await reservaModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para modificar esta reserva'
        });
      }

      // Si cambia fecha/hora/sucursal, verificar disponibilidad
      if (fecha_reserva || hora_reserva || sucursal_id) {
        const reservaActual = await reservaModel.obtenerPorId(id);
        const nuevaSucursal = sucursal_id || reservaActual.sucursal_id;
        const nuevaFecha = fecha_reserva || reservaActual.fecha_reserva;
        const nuevaHora = hora_reserva || reservaActual.hora_reserva;

        const disponible = await reservaModel.verificarDisponibilidad(
          nuevaSucursal, 
          nuevaFecha, 
          nuevaHora,
          id // Excluir esta reserva de la verificación
        );

        if (!disponible) {
          return res.status(409).json({
            success: 0,
            message: 'El nuevo horario ya no está disponible'
          });
        }
      }

      // Si hay dependiente_id, verificar que pertenece al usuario
      if (dependiente_id) {
        const pertenece = await dependienteModel.perteneceAUsuario(dependiente_id, userId);
        if (!pertenece) {
          return res.status(403).json({
            success: 0,
            message: 'El dependiente especificado no pertenece a tu cuenta'
          });
        }
      }

      await reservaModel.actualizar(id, req.body);
      const reservaActualizada = await reservaModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: reservaActualizada
      });
    } catch (err) {
      console.error('Error en actualizar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al actualizar la reserva'
      });
    }
  },

  // Cambiar estado de la reserva
  cambiarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const { estado } = req.body;

      // Validar estado
      const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: 0,
          message: 'Estado inválido'
        });
      }

      // Verificar que la reserva pertenece al usuario
      const pertenece = await reservaModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para modificar esta reserva'
        });
      }

      await reservaModel.cambiarEstado(id, estado);
      const reservaActualizada = await reservaModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: reservaActualizada
      });
    } catch (err) {
      console.error('Error en cambiarEstado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al cambiar estado de la reserva'
      });
    }
  },

  // Cancelar reserva (cambiar estado a 'cancelada')
  cancelar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;

      // Verificar que la reserva pertenece al usuario
      const pertenece = await reservaModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para cancelar esta reserva'
        });
      }

      await reservaModel.cambiarEstado(id, 'cancelada');
      const reservaActualizada = await reservaModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: reservaActualizada,
        message: 'Reserva cancelada correctamente'
      });
    } catch (err) {
      console.error('Error en cancelar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al cancelar la reserva'
      });
    }
  },

  // Soft delete - desactivar reserva
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;

      // Verificar que la reserva pertenece al usuario
      const pertenece = await reservaModel.perteneceAUsuario(id, userId);
      if (!pertenece) {
        return res.status(403).json({
          success: 0,
          message: 'No tienes permiso para eliminar esta reserva'
        });
      }

      await reservaModel.eliminar(id);

      return res.status(200).json({
        success: 1,
        message: 'Reserva eliminada correctamente'
      });
    } catch (err) {
      console.error('Error en eliminar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al eliminar la reserva'
      });
    }
  },

  // Obtener horarios disponibles
  horariosDisponibles: async (req, res) => {
    try {
      const { sucursal_id, fecha_reserva } = req.query;

      if (!sucursal_id || !fecha_reserva) {
        return res.status(400).json({
          success: 0,
          message: 'Sucursal y fecha son requeridas'
        });
      }

      const horariosOcupados = await reservaModel.obtenerHorariosOcupados(
        sucursal_id, 
        fecha_reserva
      );

      // Generar todos los horarios posibles (8:00 a 20:00)
      const todosLosHorarios = [];
      for (let hora = 8; hora <= 20; hora++) {
        todosLosHorarios.push(`${hora.toString().padStart(2, '0')}:00`);
      }

      // Filtrar horarios disponibles
      const horariosDisponibles = todosLosHorarios.filter(
        horario => !horariosOcupados.includes(horario)
      );

      return res.status(200).json({
        success: 1,
        data: {
          fecha: fecha_reserva,
          sucursal_id: parseInt(sucursal_id),
          horarios_disponibles: horariosDisponibles,
          horarios_ocupados: horariosOcupados
        }
      });
    } catch (err) {
      console.error('Error en horariosDisponibles:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener horarios disponibles'
      });
    }
  },

  // Obtener estadísticas de reservas
  estadisticas: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const stats = await reservaModel.obtenerEstadisticas(userId);
      
      return res.status(200).json({
        success: 1,
        data: stats
      });
    } catch (err) {
      console.error('Error en estadisticas:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener estadísticas'
      });
    }
  }
};
