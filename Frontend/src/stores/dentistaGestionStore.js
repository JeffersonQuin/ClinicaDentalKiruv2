// src/stores/dentistaGestionStore.js
import { defineStore } from 'pinia'
import { useDentistaStore } from './dentistaStore'
import { useEspecialidadStore } from './especialidadStore'
import { useDentistaEspecialidadStore } from './dentistaEspecialidadStore'

export const useDentistaGestionStore = defineStore('dentistaGestion', {
  state: () => ({
    dentistasCompletos: [],
    cargando: false,
    error: null
  }),

  getters: {
    getDentistaCompleto: (state) => (id) => {
      return state.dentistasCompletos.find(d => d.id === id)
    },

    totalActivos: (state) => {
      return state.dentistasCompletos.filter(d => d.estado === 'activo').length
    },

    totalInactivos: (state) => {
      return state.dentistasCompletos.filter(d => d.estado === 'inactivo').length
    }
  },

  actions: {
    async cargarDentistasCompletos() {
      this.cargando = true
      this.error = null

      try {
        const dentistaStore = useDentistaStore()
        const especialidadStore = useEspecialidadStore()
        const dentistaEspecialidadStore = useDentistaEspecialidadStore()

        await Promise.all([
          dentistaStore.obtenerDentistas(),
          especialidadStore.cargarEspecialidades(),
          dentistaEspecialidadStore.obtenerRelaciones()
        ])

        this.dentistasCompletos = dentistaStore.dentistas.map(dentista => {
          const relaciones = dentistaEspecialidadStore.relaciones.filter(
            r => r.dentista_id === dentista.id
          )

          const especialidades = relaciones
            .map(rel => {
              const especialidad = especialidadStore.especialidades.find(
                e => e.id === rel.especialidad_id
              )
              return especialidad ? { ...especialidad } : null
            })
            .filter(Boolean)

          return {
            ...dentista,
            especialidades: especialidades
          }
        })

        return this.dentistasCompletos
      } catch (error) {
        console.error('Error cargando dentistas completos:', error)
        this.error = error.response?.data?.error?.message || 'Error al cargar dentistas'
        throw error
      } finally {
        this.cargando = false
      }
    },

    async crearDentistaCompleto(datosDentista, especialidadesIds = [], imagenFile = null) {
      this.cargando = true
      this.error = null

      try {
        const dentistaStore = useDentistaStore()
        const especialidadStore = useEspecialidadStore()
        const dentistaEspecialidadStore = useDentistaEspecialidadStore()

        const datosParaCrear = {
          nombre: datosDentista.nombre,
          segundo_nombre: datosDentista.segundo_nombre || '',
          apellido_paterno: datosDentista.apellido_paterno,
          apellido_materno: datosDentista.apellido_materno || '',
          estado: datosDentista.estado || 'activo',
          imagen: imagenFile
        }

        // Crear el dentista
        const dentistaCreado = await dentistaStore.crearDentista(datosParaCrear, imagenFile)

        if (!dentistaCreado || !dentistaCreado.id) {
          throw new Error('No se pudo crear el dentista o no se recibió el ID')
        }

        // Asignar especialidades si hay alguna
        if (especialidadesIds && especialidadesIds.length > 0) {
          try {
            await dentistaEspecialidadStore.reemplazar(
              dentistaCreado.id,
              especialidadesIds
            )
          } catch (espError) {
            console.warn('Error asignando especialidades:', espError)
          }
        }

        // Construir el objeto completo del dentista recién creado
        // Primero asegurarnos de tener las especialidades cargadas
        if (especialidadStore.especialidades.length === 0) {
          await especialidadStore.cargarEspecialidades()
        }

        // Construir el objeto completo del dentista recién creado
        const especialidades = especialidadesIds
          .map(espId => {
            const especialidad = especialidadStore.especialidades.find(e => e.id === espId)
            return especialidad ? { ...especialidad } : null
          })
          .filter(Boolean)

        const dentistaCompleto = {
          ...dentistaCreado,
          especialidades: especialidades
        }

        // Agregarlo a la lista local SIN recargar todo desde el servidor
        // Verificar que no exista ya (evitar duplicados)
        const existe = this.dentistasCompletos.find(d => d.id === dentistaCreado.id)
        if (!existe) {
          this.dentistasCompletos.push(dentistaCompleto)
        }

        return dentistaCompleto
      } catch (error) {
        console.error('Error creando dentista completo:', error)
        this.error = error.response?.data?.error?.message || error.message || 'Error al crear dentista'
        throw error
      } finally {
        this.cargando = false
      }
    },

    async actualizarDentistaCompleto(id, datosDentista, especialidadesIds = [], imagenFile = null) {
      this.cargando = true
      this.error = null

      try {
        const dentistaStore = useDentistaStore()
        const especialidadStore = useEspecialidadStore()
        const dentistaEspecialidadStore = useDentistaEspecialidadStore()

        const datosParaActualizar = {
          nombre: datosDentista.nombre,
          segundo_nombre: datosDentista.segundo_nombre || '',
          apellido_paterno: datosDentista.apellido_paterno,
          apellido_materno: datosDentista.apellido_materno || '',
          estado: datosDentista.estado || 'activo'
        }

        if (imagenFile) {
          datosParaActualizar.imagen = imagenFile
        }

        const dentistaActualizado = await dentistaStore.actualizarDentista(id, datosParaActualizar, imagenFile)

        if (!dentistaActualizado) {
          throw new Error('No se pudo actualizar el dentista')
        }

        if (Array.isArray(especialidadesIds)) {
          try {
            await dentistaEspecialidadStore.reemplazar(id, especialidadesIds)
          } catch (espError) {
            console.warn('Error actualizando especialidades:', espError)
          }
        }

        // SOLUCIÓN: Actualizar solo el dentista específico en lugar de recargar todo
        if (especialidadStore.especialidades.length === 0) {
          await especialidadStore.cargarEspecialidades()
        }

        const especialidades = especialidadesIds
          .map(espId => {
            const especialidad = especialidadStore.especialidades.find(e => e.id === espId)
            return especialidad ? { ...especialidad } : null
          })
          .filter(Boolean)

        const dentistaCompleto = {
          ...dentistaActualizado,
          especialidades: especialidades
        }

        // Actualizar en la lista local
        const index = this.dentistasCompletos.findIndex(d => d.id === id)
        if (index !== -1) {
          this.dentistasCompletos[index] = dentistaCompleto
        } else {
          this.dentistasCompletos.push(dentistaCompleto)
        }

        return dentistaCompleto
      } catch (error) {
        console.error('Error actualizando dentista completo:', error)
        this.error = error.response?.data?.error?.message || error.message || 'Error al actualizar dentista'
        throw error
      } finally {
        this.cargando = false
      }
    },

    async toggleEstadoDentista(id, nuevoEstado) {
      this.cargando = true
      this.error = null

      try {
        const dentistaStore = useDentistaStore()

        // Actualizar el estado del dentista
        const dentistaActualizado = await dentistaStore.toggleEstado(id, nuevoEstado)

        if (!dentistaActualizado) {
          throw new Error('No se pudo cambiar el estado del dentista')
        }

        // Actualizar en la lista local
        const index = this.dentistasCompletos.findIndex(d => d.id === id)
        if (index !== -1) {
          this.dentistasCompletos[index] = {
            ...this.dentistasCompletos[index],
            estado: nuevoEstado
          }
        }

        return dentistaActualizado
      } catch (error) {
        console.error('Error cambiando estado de dentista:', error)
        this.error = error.response?.data?.error?.message || error.message || 'Error al cambiar estado del dentista'
        throw error
      } finally {
        this.cargando = false
      }
    },

    obtenerDentistaCompletoPorId(id) {
      return this.getDentistaCompleto(id)
    },

    async recargarDentistaCompleto(id) {
      try {
        const dentistaStore = useDentistaStore()
        const especialidadStore = useEspecialidadStore()
        const dentistaEspecialidadStore = useDentistaEspecialidadStore()

        await Promise.all([
          dentistaStore.obtenerDentista(id),
          especialidadStore.cargarEspecialidades(),
          dentistaEspecialidadStore.obtenerPorDentista(id)
        ])

        const dentista = dentistaStore.dentistaSeleccionado
        if (!dentista) {
          return null
        }

        const especialidadesIds = dentistaEspecialidadStore.especialidadesDentista
        const especialidades = especialidadesIds
          .map(espId => {
            const especialidad = especialidadStore.especialidades.find(e => e.id === espId)
            return especialidad ? { ...especialidad } : null
          })
          .filter(Boolean)

        const dentistaCompleto = {
          ...dentista,
          especialidades: especialidades
        }

        const index = this.dentistasCompletos.findIndex(d => d.id === id)
        if (index !== -1) {
          this.dentistasCompletos[index] = dentistaCompleto
        } else {
          this.dentistasCompletos.push(dentistaCompleto)
        }

        return dentistaCompleto
      } catch (error) {
        console.error('Error recargando dentista completo:', error)
        throw error
      }
    }
  }
})