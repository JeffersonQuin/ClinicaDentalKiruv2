// src/stores/dentistaEspecialidadStore.js
import { defineStore } from 'pinia';
import { dentistaEspecialidadService } from '../services/dentistaEspecialidadService';

export const useDentistaEspecialidadStore = defineStore('dentistaEspecialidad', {
    state: () => ({
        relaciones: [],
        especialidadesDentista: [],
        cargando: false,
        error: null,
    }),

    actions: {

        // Todas las relaciones
        async obtenerRelaciones() {
            this.cargando = true;
            this.error = null;

            try {
                const res = await dentistaEspecialidadService.getAll();
                this.relaciones = res.data;
            } catch (err) {
                console.error(err);
                this.error = 'Error al cargar relaciones dentista-especialidad';
            } finally {
                this.cargando = false;
            }
        },

        // Especialidades de un dentista
        async obtenerPorDentista(dentista_id) {
            this.cargando = true;
            this.error = null;

            try {
                const res = await dentistaEspecialidadService.getByDentista(dentista_id);
                this.especialidadesDentista = res.data.map(r => r.especialidad_id);
            } catch (err) {
                console.error(err);
                this.error = 'Error al cargar especialidades del dentista';
            } finally {
                this.cargando = false;
            }
        },

        // Asignar una especialidad
        async asignar(dentista_id, especialidad_id) {
            this.cargando = true;

            try {
                await dentistaEspecialidadService.assign(dentista_id, especialidad_id);
                this.especialidadesDentista.push(especialidad_id);
                return true;
            } catch (err) {
                console.error(err);
                this.error = 'Error al asignar especialidad';
                return false;
            } finally {
                this.cargando = false;
            }
        },

        // Eliminar una especialidad del dentista
        async eliminar(dentista_id, especialidad_id) {
            this.cargando = true;

            try {
                await dentistaEspecialidadService.remove(dentista_id, especialidad_id);
                this.especialidadesDentista = this.especialidadesDentista.filter(id => id !== especialidad_id);
                return true;
            } catch (err) {
                console.error(err);
                this.error = 'Error al eliminar especialidad';
                return false;
            } finally {
                this.cargando = false;
            }
        },

        // Reemplazar todas las especialidades
        async reemplazar(dentista_id, especialidades) {
            this.cargando = true;

            try {
                await dentistaEspecialidadService.replaceAll(dentista_id, especialidades);
                this.especialidadesDentista = especialidades;
                return true;
            } catch (err) {
                console.error(err);
                this.error = 'Error al actualizar especialidades';
                return false;
            } finally {
                this.cargando = false;
            }
        }
    }
});
