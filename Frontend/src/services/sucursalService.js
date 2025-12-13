// src/services/sucursalService.js
import axios from 'axios';

// URL correcta según tu backend
const API_URL = 'http://localhost:5050/sucursales';

export const sucursalService = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),

  create: (data, file) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (file) {
      formData.append('imagen', file);
    }

    return axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  update: (id, data, file) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (file) {
      formData.append('imagen', file);
    }

    return axios.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  toggleActivo: (id, activo) => {
    return axios.patch(`${API_URL}/${id}/toggle-activo`, { activo });
  }
};
