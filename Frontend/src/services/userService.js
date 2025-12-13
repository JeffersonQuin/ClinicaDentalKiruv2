// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/users';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  console.log('Auth Token:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userService = {
  getAll: () => axios.get(API_URL, { headers: getAuthHeader() }),
  getById: (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(API_URL, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  promocionar: (id, data) => axios.patch(`${API_URL}/${id}/promocionar`, data, { headers: getAuthHeader() })
};