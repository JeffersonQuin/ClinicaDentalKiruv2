// src/services/anuncioService.js
// src/services/anuncioService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/anuncios';

export const anuncioService = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),

  create: (data) => {
    const formData = new FormData();
    for (let key in data) {
      if (key === 'imagen' && data.imagen) {
        formData.append('imagen', data.imagen); // archivo
      } else {
        formData.append(key, data[key]); // campos de texto
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
        formData.append(key, data[key]); // campos de texto
      }
    }
    return axios.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  delete: (id) => axios.delete(`${API_URL}/${id}`)
};
