import { defineStore } from 'pinia';
import { dentistaService } from '../services/dentistaService';

export const useDentistaStore = defineStore('dentistas', {
  state: () => ({
    dentistas: [],
    dentistaSeleccionado: null,
    cargando: false,
    error: null,
  }),

  actions: {
    async obtenerDentistas() {
      this.cargando = true;
      this.error = null;

      try {
        const res = await dentistaService.getAll();
        this.dentistas = res.data;
      } catch (err) {
        console.error('Error obtenerDentistas:', err);
        this.error =
          err?.response?.data?.error?.message ||
          'Error al cargar dentistas';
      } finally {
        this.cargando = false;
      }
    },

    async obtenerDentista(id) {
      this.cargando = true;
      this.error = null;

      try {
        const res = await dentistaService.getById(id);
        this.dentistaSeleccionado = res.data;
      } catch (err) {
        console.error('Error obtenerDentista:', err);
        this.error =
          err?.response?.data?.error?.message ||
          'Error al cargar el dentista';
      } finally {
        this.cargando = false;
      }
    },

    async crearDentista(data, imagenFile = null) {
      this.cargando = true;
      this.error = null;

      try {
        // Preparar datos para el servicio
        const datosParaEnviar = { ...data };
        if (imagenFile) {
          datosParaEnviar.imagen = imagenFile;
        }

        const res = await dentistaService.create(datosParaEnviar);
        const dentistaCreado = res.data;
        
        // Verificar que no exista ya antes de agregar (evitar duplicados)
        const existe = this.dentistas.find(d => d.id === dentistaCreado.id);
        if (!existe) {
          this.dentistas.push(dentistaCreado);
        }
        
        return dentistaCreado;
      } catch (err) {
        console.error('Error crearDentista:', err);
        this.error =
          err?.response?.data?.error?.message ||
          'Error al crear el dentista';
        throw err;
      } finally {
        this.cargando = false;
      }
    },

    async actualizarDentista(id, data, imagenFile = null) {
      this.cargando = true;
      this.error = null;

      try {
        // Preparar datos para el servicio
        const datosParaEnviar = { ...data };
        if (imagenFile) {
          datosParaEnviar.imagen = imagenFile;
        }

        const res = await dentistaService.update(id, datosParaEnviar);
        const dentistaActualizado = res.data;

        const index = this.dentistas.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.dentistas[index] = dentistaActualizado;
        }

        return dentistaActualizado;
      } catch (err) {
        console.error('Error actualizarDentista:', err);
        this.error =
          err?.response?.data?.error?.message ||
          'Error al actualizar el dentista';
        throw err;
      } finally {
        this.cargando = false;
      }
    },

    async toggleEstado(id, nuevoEstado) {
      this.cargando = true;
      this.error = null;

      try {
        const res = await dentistaService.toggleEstado(id, nuevoEstado);
        const dentistaActualizado = res.data;

        const index = this.dentistas.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.dentistas[index] = dentistaActualizado;
        }

        return dentistaActualizado;
      } catch (err) {
        console.error('Error toggleEstado:', err);
        this.error =
          err?.response?.data?.error?.message ||
          'Error al cambiar el estado del dentista';
        throw err;
      } finally {
        this.cargando = false;
      }
    }
  }
});
