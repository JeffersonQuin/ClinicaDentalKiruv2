import { defineStore } from 'pinia'
import { recetaService } from 'src/services/recetaService'

export const useRecetaStore = defineStore('receta', {
  state: () => ({
    recetas: [],
    selectedReceta: null,
    loading: false
  }),

  actions: {
    async cargarRecetas() {
      this.loading = true
      try {
        const { data } = await recetaService.getAll()
        this.recetas = data.data || []
      } catch (error) {
        console.error('Error cargando recetas:', error)
        this.recetas = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async obtenerRecetaPorId(id) {
      this.loading = true
      try {
        const { data } = await recetaService.getById(id)
        return data.data
      } catch (error) {
        console.error('Error obteniendo receta:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async obtenerRecetasPorPaciente(paciente_id) {
      this.loading = true
      try {
        const { data } = await recetaService.getByPaciente(paciente_id)
        return data.data
      } catch (error) {
        console.error('Error obteniendo recetas del paciente:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async crearReceta(recetaData) {
      this.loading = true
      try {
        const { data } = await recetaService.create(recetaData)
        this.recetas.unshift(data.data)
        return data.data
      } catch (error) {
        console.error('Error creando receta:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async actualizarReceta(id, recetaData) {
      this.loading = true
      try {
        const { data } = await recetaService.update(id, recetaData)
        const index = this.recetas.findIndex(r => r.id === id)
        if (index > -1) {
          this.recetas[index] = data.data
        }
        return data.data
      } catch (error) {
        console.error('Error actualizando receta:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async eliminarReceta(id) {
      this.loading = true
      try {
        await recetaService.delete(id)
        this.recetas = this.recetas.filter(r => r.id !== id)
      } catch (error) {
        console.error('Error eliminando receta:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    seleccionarReceta(receta) {
      this.selectedReceta = receta
    },

    limpiarRecetaSeleccionada() {
      this.selectedReceta = null
    }
  }
})