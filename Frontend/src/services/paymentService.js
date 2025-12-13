import axios from 'axios';

const API_URL = 'http://localhost:5050/payments';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  createPaymentIntent: (monto) => 
    axios.post(`${API_URL}/create-payment-intent`, { monto }, { headers: getAuthHeader() }),
  
  confirmarPago: (payment_intent_id, datosReserva) =>
    axios.post(`${API_URL}/confirm`, { payment_intent_id, datosReserva }, { headers: getAuthHeader() }),
  
  getHistorial: () =>
    axios.get(`${API_URL}/historial`, { headers: getAuthHeader() })
};