// src/services/especialidadService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/especialidad'; // Ajusta el puerto y ruta

export const especialidadService = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  create: (data) => axios.post(API_URL, data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  toggleEstado: (id, estado) => axios.patch(`${API_URL}/${id}/toggle-estado`, { estado })
};
