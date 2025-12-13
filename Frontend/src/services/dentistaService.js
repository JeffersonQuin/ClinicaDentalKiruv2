// src/services/dentistaService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/dentista';

export const dentistaService = {
  getAll: () => axios.get(API_URL),

  getById: (id) => axios.get(`${API_URL}/${id}`),

  create: (data) => {
    const formData = new FormData();

    for (let key in data) {
      if (key === 'imagen' && data.imagen) {
        formData.append('imagen', data.imagen); // archivo
      } else {
        formData.append(key, data[key]); // textos
      }
    }

    return axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  update: (id, data) => {
    const formData = new FormData();

    for (let key in data) {
      if (key === 'imagen' && data.imagen) {
        formData.append('imagen', data.imagen); // archivo
      } else {
        formData.append(key, data[key]);
      }
    }

    return axios.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  toggleEstado: (id, estado) => {
    return axios.patch(`${API_URL}/${id}/toggle-estado`, { estado });
  }
};
