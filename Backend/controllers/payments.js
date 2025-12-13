const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentModel = require('../models/payments');
const reservaModel = require('../models/reservas');
const pool = require('../database');
module.exports = {
  // Crear Payment Intent (paso 1: antes de pagar)
  crearPaymentIntent: async (req, res) => {
    try {
      const { monto } = req.body; // En bolivianos
      const user_id = req.decoded.id; // Del token JWT

      // Convertir Bs a centavos (Stripe trabaja en centavos)
      // 10 Bs = 1000 centavos
      const amount = Math.round(monto * 100);

      // Crear Payment Intent en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'bob', // Bolivianos
        metadata: {
          user_id: user_id,
          tipo: 'reserva'
        }
      });

      // Registrar pago pendiente en BD
      const paymentId = await paymentModel.crear({
        user_id: user_id,
        reserva_id: null, // Todavía no se crea la reserva
        monto: monto,
        stripe_payment_intent_id: paymentIntent.id,
        estado: 'pendiente'
      });

      return res.status(200).json({
        success: 1,
        data: {
          payment_id: paymentId,
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id
        }
      });
    } catch (error) {
      console.error('Error creando Payment Intent:', error);
      return res.status(500).json({
        success: 0,
        message: 'Error al iniciar el pago'
      });
    }
  },

  // Confirmar pago y crear reserva (paso 2: después de pagar)
  confirmarPago: async (req, res) => {
    try {
      const { payment_intent_id, datosReserva } = req.body;
      const user_id = req.decoded.id;

      // Verificar el pago en Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: 0,
          message: 'El pago no se completó correctamente'
        });
      }

      // Obtener registro de pago
      const payment = await paymentModel.obtenerPorPaymentIntent(payment_intent_id);
      
      if (!payment) {
        return res.status(404).json({
          success: 0,
          message: 'Pago no encontrado'
        });
      }

      // Verificar que el usuario sea el mismo
      if (payment.user_id !== user_id) {
        return res.status(403).json({
          success: 0,
          message: 'No autorizado'
        });
      }

      // Si ya se creó la reserva, no duplicar
      if (payment.reserva_id) {
        const reserva = await reservaModel.obtenerPorId(payment.reserva_id);
        return res.status(200).json({
          success: 1,
          data: reserva,
          message: 'Reserva ya existente'
        });
      }

      // Crear la reserva
      const reservaId = await reservaModel.crear({
        user_id: user_id,
        dependiente_id: datosReserva.dependiente_id,
        servicio_id: datosReserva.servicio_id,
        sucursal_id: datosReserva.sucursal_id,
        fecha_reserva: datosReserva.fecha_reserva,
        hora_reserva: datosReserva.hora_reserva,
        notas: datosReserva.notas
      });

      // Actualizar payment con la reserva_id
      await pool.query(
        'UPDATE payments SET reserva_id = ?, estado = ? WHERE id = ?',
        [reservaId, 'completado', payment.id]
      );

      const reservaCreada = await reservaModel.obtenerPorId(reservaId);

      return res.status(201).json({
        success: 1,
        data: reservaCreada,
        message: 'Pago confirmado y reserva creada'
      });
    } catch (error) {
      console.error('Error confirmando pago:', error);
      return res.status(500).json({
        success: 0,
        message: 'Error al confirmar el pago'
      });
    }
  },


  // Obtener historial de pagos
  historial: async (req, res) => {
    try {
      const user_id = req.decoded.id;
      const pagos = await paymentModel.listarPorUsuario(user_id);

      return res.status(200).json({
        success: 1,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener historial de pagos'
      });
    }
  }
};