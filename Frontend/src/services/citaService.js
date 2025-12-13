import axios from 'axios';

const API_URL = 'http://localhost:5050/citas';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const citaService = {
  // CRUD básico
  getAll: () => 
    axios.get(API_URL, { headers: getAuthHeader() }),
  
  getById: (id) => 
    axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }),
  
  create: (data) => 
    axios.post(API_URL, data, { headers: getAuthHeader() }),
  
  update: (id, data) => 
    axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() }),
  
  delete: (id) => 
    axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() }),

  // Métodos específicos
  getByPaciente: (pacienteId) => 
    axios.get(`${API_URL}/paciente/${pacienteId}`, { headers: getAuthHeader() }),
  
  getByDentista: (dentistaId) => 
    axios.get(`${API_URL}/dentista/${dentistaId}`, { headers: getAuthHeader() }),
  
  getProximas: (dentistaId, limite = 5) => 
    axios.get(`${API_URL}/dentista/${dentistaId}/proximas`, { 
      params: { limite },
      headers: getAuthHeader() 
    }),
  
  getEstadisticas: (dentistaId) => 
    axios.get(`${API_URL}/dentista/${dentistaId}/estadisticas`, { 
      headers: getAuthHeader() 
    }),

  // Cambios de estado
  cambiarEstado: (id, estado) => 
    axios.patch(`${API_URL}/${id}/estado`, { estado }, { 
      headers: getAuthHeader() 
    }),
  
  completar: (id) => 
    axios.patch(`${API_URL}/${id}/completar`, {}, { 
      headers: getAuthHeader() 
    }),
  
  cancelar: (id) => 
    axios.patch(`${API_URL}/${id}/cancelar`, {}, { 
      headers: getAuthHeader() 
    }),

  // Horarios disponibles (verifica RESERVAS y CITAS)
  getHorariosDisponibles: (sucursalId, fecha, dentistaId = null) => {
    const params = { sucursal_id: sucursalId, fecha };
    if (dentistaId) params.dentista_id = dentistaId;
    
    return axios.get(`${API_URL}/horarios-disponibles`, { 
      params,
      headers: getAuthHeader() 
    });
  }
};