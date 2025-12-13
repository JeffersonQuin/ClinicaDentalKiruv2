import axios from 'axios';

const API_URL = 'http://localhost:5050/pacientes';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pacienteService = {
  getAll: () => axios.get(API_URL, { headers: getAuthHeader() }),
  getById: (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(API_URL, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  getByCi: (ci) => axios.get(`${API_URL}/ci/${ci}`, { headers: getAuthHeader() }),
  getByEmail: (gmail) => axios.get(`${API_URL}/email/${gmail}`, { headers: getAuthHeader() })
};