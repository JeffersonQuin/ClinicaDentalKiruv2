const pool = require("../database");

module.exports = {
  // Crear registro de pago
  crear: async (payment) => {
    const { user_id, reserva_id, monto, stripe_payment_intent_id, estado } = payment;
    const [result] = await pool.query(
      'INSERT INTO payments (user_id, reserva_id, monto, stripe_payment_intent_id, estado) VALUES (?, ?, ?, ?, ?)',
      [user_id, reserva_id, monto, stripe_payment_intent_id, estado]
    );
    return result.insertId;
  },

  // Obtener pago por ID
  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    return rows[0];
  },

  // Obtener por payment_intent_id de Stripe
  obtenerPorPaymentIntent: async (payment_intent_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE stripe_payment_intent_id = ?',
      [payment_intent_id]
    );
    return rows[0];
  },

  // Actualizar estado del pago
  actualizarEstado: async (id, estado) => {
    const [result] = await pool.query(
      'UPDATE payments SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [estado, id]
    );
    return result.affectedRows;
  },

  // Listar pagos de un usuario
  listarPorUsuario: async (user_id) => {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }
};