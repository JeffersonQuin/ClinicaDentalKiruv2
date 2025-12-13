// src/services/dentistaEspecialidadService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/dentistaEspecialidad';

export const dentistaEspecialidadService = {

    // Lista todas las relaciones dentista-especialidad
    getAll: () => axios.get(API_URL),

    // Obtiene solo las especialidades de un dentista
    getByDentista: (dentista_id) => axios.get(`${API_URL}/${dentista_id}`),

    // Asignar una especialidad
    assign: (dentista_id, especialidad_id) => {
        return axios.post(API_URL, {
            dentista_id,
            especialidad_id
        });
    },

    // Eliminar una relación específica
    remove: (dentista_id, especialidad_id) => {
        return axios.delete(API_URL, {
            data: { dentista_id, especialidad_id } // importante para DELETE
        });
    },

    // Reemplazar todas las especialidades de un dentista
    replaceAll: (dentista_id, especialidades) => {
        return axios.put(`${API_URL}/reemplazar`, {
            dentista_id,
            especialidades
        });
    }
};
