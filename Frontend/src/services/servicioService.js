// src/services/servicioService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/servicios';

export const servicioService = {
  
  // Obtener todos los servicios
  getAll: () => axios.get(API_URL),

  // Obtener un servicio por ID
  getById: (id) => axios.get(`${API_URL}/${id}`),

  // Crear servicio con foto
  create: (data) => {
    const formData = new FormData();

    for (let key in data) {
      if (key === 'imagen' && data.imagen) {
        formData.append('imagen', data.imagen); // archivo
      } else {
        formData.append(key, data[key]); // texto
      }
    }

    return axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Actualizar servicio con o sin imagen
  update: (id, data) => {
    const formData = new FormData();

    for (let key in data) {
      if (key === 'imagen' && data.imagen) {
        formData.append('imagen', data.imagen); // archivo nuevo
      } else {
        formData.append(key, data[key]); // texto
      }
    }

    return axios.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Activar/Desactivar servicio
  toggleEstado: (id, estado) => {
    return axios.patch(`${API_URL}/${id}/toggle-estado`, { estado });
  }
};
