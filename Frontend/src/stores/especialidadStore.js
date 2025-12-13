import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { especialidadService } from 'src/services/especialidadService'

export const useEspecialidadStore = defineStore('especialidad', () => {
  const especialidades = ref([])
  const search = ref('')
  const searchResults = ref([])
  const fuse = ref(null)
  const paginaActual = ref(0)
  const itemsPorPagina = 4

  const fuseOptions = {
    keys: ['nombre', 'descripcion'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 1
  }

  // -----------------------------
  // Computed
  // -----------------------------
  const especialidadesActivas = computed(() => especialidades.value.filter(e => e.estado === 'activo'))
  const especialidadesInactivas = computed(() => especialidades.value.filter(e => e.estado === 'inactivo'))
  
  const totalPaginas = computed(() => Math.ceil(searchResults.value.length / itemsPorPagina))
  const especialidadesPaginaActual = computed(() => {
    const inicio = paginaActual.value * itemsPorPagina
    return searchResults.value.slice(inicio, inicio + itemsPorPagina)
  })

  const paginasVisibles = computed(() => {
    const total = totalPaginas.value
    const actual = paginaActual.value
    const paginas = []

    if (total <= 7) {
      for (let i = 0; i < total; i++) paginas.push(i)
    } else {
      if (actual <= 3) {
        for (let i = 0; i < 5; i++) paginas.push(i)
        paginas.push('...')
        paginas.push(total - 1)
      } else if (actual >= total - 4) {
        paginas.push(0)
        paginas.push('...')
        for (let i = total - 5; i < total; i++) paginas.push(i)
      } else {
        paginas.push(0)
        paginas.push('...')
        for (let i = actual - 1; i <= actual + 1; i++) paginas.push(i)
        paginas.push('...')
        paginas.push(total - 1)
      }
    }

    return paginas
  })

  // -----------------------------
  // CRUD
  // -----------------------------
  const cargarEspecialidades = async () => {
    try {
      const { data } = await especialidadService.getAll()
      especialidades.value = data || []
      rebuildFuse()
    } catch (error) {
      console.error('Error cargando especialidades:', error)
    }
  }

  const crearEspecialidad = async (nuevaEspecialidad) => {
    try {
      const { data } = await especialidadService.create(nuevaEspecialidad)
      // Asegurarse de que el estado esté presente (por defecto 'activo')
      const especialidadCreada = {
        ...data,
        estado: data.estado || 'activo'
      }
      especialidades.value.push(especialidadCreada)
      rebuildFuse()
      return especialidadCreada
    } catch (error) {
      console.error('Error creando especialidad:', error)
      throw error
    }
  }

  const actualizarEspecialidad = async (especialidadActualizada) => {
    try {
      const { data } = await especialidadService.update(especialidadActualizada.id, especialidadActualizada)
      const index = especialidades.value.findIndex(e => e.id === especialidadActualizada.id)
      if (index > -1) {
        // Usar los datos completos devueltos por el backend (que incluyen el estado)
        especialidades.value[index] = { ...data }
      } else {
        // Si no existe en el array, agregarlo
        especialidades.value.push({ ...data })
      }
      rebuildFuse()
      return data
    } catch (error) {
      console.error('Error actualizando especialidad:', error)
      throw error
    }
  }

  const toggleEstado = async (id, nuevoEstado) => {
    try {
      const res = await especialidadService.toggleEstado(id, nuevoEstado)
      const index = especialidades.value.findIndex(e => e.id === id)
      if (index > -1) {
        especialidades.value[index] = res.data
      }
      rebuildFuse()
      return res.data
    } catch (error) {
      console.error('Error cambiando estado de especialidad:', error)
      throw error
    }
  }

  // -----------------------------
  // Fuse.js
  // -----------------------------
  const rebuildFuse = () => {
    // Incluir todas las especialidades para búsqueda
    fuse.value = new Fuse(especialidades.value, fuseOptions)
    applySearch()
  }

  const applySearch = () => {
    // Incluir todas las especialidades en la búsqueda
    if (!search.value || search.value.trim() === '') {
      searchResults.value = especialidades.value
    } else if (fuse.value) {
      searchResults.value = fuse.value.search(search.value.trim()).map(r => r.item)
    } else {
      searchResults.value = especialidades.value
    }
    paginaActual.value = 0
  }

  // -----------------------------
  // Paginación
  // -----------------------------
  const siguientePagina = () => { if (paginaActual.value < totalPaginas.value - 1) paginaActual.value++ }
  const paginaAnterior = () => { if (paginaActual.value > 0) paginaActual.value-- }
  const irAPagina = (pagina) => { if (pagina !== '...' && pagina >= 0 && pagina < totalPaginas.value) paginaActual.value = pagina }

  return {
    especialidades,
    search,
    searchResults,
    fuse,
    paginaActual,
    totalPaginas,
    especialidadesPaginaActual,
    paginasVisibles,
    especialidadesActivas,
    especialidadesInactivas,
    cargarEspecialidades,
    crearEspecialidad,
    actualizarEspecialidad,
    toggleEstado,
    rebuildFuse,
    applySearch,
    siguientePagina,
    paginaAnterior,
    irAPagina
  }
})
