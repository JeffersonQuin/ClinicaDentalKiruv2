// src/services/dependienteService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/dependientes';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const dependienteService = {
  // Obtener todos los dependientes del usuario autenticado
  getAll: () => axios.get(API_URL, { headers: getAuthHeader() }),
  
  // Obtener un dependiente específico
  getById: (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  
  // Crear nuevo dependiente
  create: (data) => axios.post(API_URL, data, { headers: getAuthHeader() }),
  
  // Actualizar dependiente
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() }),
  
  // Eliminar (soft delete) dependiente
  delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  
  // Restaurar dependiente eliminado
  restore: (id) => axios.patch(`${API_URL}/${id}/restaurar`, {}, { headers: getAuthHeader() })
};
