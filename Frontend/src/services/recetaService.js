import axios from 'axios';

const API_URL = 'http://localhost:5050/recetas';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const recetaService = {
  getAll: () => axios.get(API_URL, { headers: getAuthHeader() }),
  getById: (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  getByPaciente: (paciente_id) => axios.get(`${API_URL}/paciente/${paciente_id}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(API_URL, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() })
};