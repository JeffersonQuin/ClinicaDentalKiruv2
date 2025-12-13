import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { servicioService } from '../services/servicioService'

const FUSE_OPTIONS = {
  keys: ['titulo', 'descripcion', 'categoria'],
  threshold: 0.3
}

export const useServicioStore = defineStore('servicios', () => {
  // Estados
  const servicios = ref([])
  const filteredServicios = ref([])
  const search = ref('')
  const selectedServicio = ref(null)
  const loading = ref(false)
  const fuse = ref(null)

  // Diálogos
  const showDetailDialog = ref(false)
  const showEditDialog = ref(false)
  const showNewDialog = ref(false)

  // ================= CRUD =================
  const listar = async () => {
    loading.value = true
    try {
      const res = await servicioService.getAll()
      servicios.value = res.data
      filteredServicios.value = [...servicios.value]
      rebuildFuse()
    } catch (err) {
      console.error('Error al listar servicios:', err)
    } finally {
      loading.value = false
    }
  }

  const obtenerPorId = async (id) => {
    try {
      const res = await servicioService.getById(id)
      return res.data
    } catch (err) {
      console.error('Error al obtener servicio:', err)
    }
  }

  const crear = async (data, file) => {
    loading.value = true
    try {
      const formData = { ...data, imagen: file || null }
      const res = await servicioService.create(formData)
      servicios.value.push(res.data)
      filteredServicios.value.push(res.data)
      rebuildFuse()
      return res.data
    } catch (err) {
      console.error('Error al crear servicio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const actualizar = async (id, data, file) => {
    loading.value = true
    try {
      const formData = { ...data, imagen: file || null }
      const res = await servicioService.update(id, formData)

      const index = servicios.value.findIndex(s => s.id === id)
      if (index !== -1) servicios.value[index] = res.data

      const filteredIndex = filteredServicios.value.findIndex(s => s.id === id)
      if (filteredIndex !== -1) filteredServicios.value[filteredIndex] = res.data

      rebuildFuse()
      filterServicios()
      return res.data
    } catch (err) {
      console.error('Error al actualizar servicio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleEstado = async (id, nuevoEstado) => {
    try {
      const res = await servicioService.toggleEstado(id, nuevoEstado)
      const index = servicios.value.findIndex(s => s.id === id)
      if (index !== -1) {
        servicios.value[index] = res.data
      }
      const filteredIndex = filteredServicios.value.findIndex(s => s.id === id)
      if (filteredIndex !== -1) {
        filteredServicios.value[filteredIndex] = res.data
      }
      rebuildFuse()
      filterServicios()
      return res.data
    } catch (err) {
      console.error('Error al cambiar estado de servicio:', err)
      throw err
    }
  }

  // ================ Filtro Fuse =================
  const rebuildFuse = () => {
    fuse.value = new Fuse(servicios.value, FUSE_OPTIONS)
  }

  const filterServicios = () => {
    if (!search.value.trim()) {
      filteredServicios.value = [...servicios.value]
      return
    }
    const results = fuse.value.search(search.value.trim())
    filteredServicios.value = results.map(r => r.item)
  }

  const setSearch = (value) => {
    search.value = value
    filterServicios()
  }

  // ================ Diálogos =================
  const setSelectedServicio = (servicio) => selectedServicio.value = servicio ? { ...servicio } : null

  const openDetailDialog = (servicio) => { setSelectedServicio(servicio); showDetailDialog.value = true }
  const closeDetailDialog = () => { showDetailDialog.value = false; setSelectedServicio(null) }

  const openEditDialog = (servicio) => { setSelectedServicio(servicio); showEditDialog.value = true }
  const closeEditDialog = () => { showEditDialog.value = false; setSelectedServicio(null) }

  const openNewDialog = () => showNewDialog.value = true
  const closeNewDialog = () => showNewDialog.value = false

  const closeAllDialogs = () => {
    showDetailDialog.value = false
    showEditDialog.value = false
    showNewDialog.value = false
    setSelectedServicio(null)
  }

  // ================ Utilidades =================
  const getImagePath = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return `http://localhost:5050${imagePath}`
    return `http://localhost:5050/${imagePath}`
  }

  const handleImageError = (event) => { event.target.style.display = 'none' }

  // ================= Computed =================
  const totalServicios = computed(() => servicios.value.length)
  const serviciosActivos = computed(() => servicios.value.filter(s => s.estado === 'activo'))
  const serviciosInactivos = computed(() => servicios.value.filter(s => s.estado === 'inactivo'))
  const categoriasUnicas = computed(() => [...new Set(servicios.value.map(s => s.categoria))])
  const isAnyDialogOpen = computed(() => showDetailDialog.value || showEditDialog.value || showNewDialog.value)

  // ================= Aliases =================
  const agregarServicio = crear
  const actualizarServicio = actualizar

  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatState = (state) => state === 'activo' ? 'Activo' : 'Inactivo'
  const getStateClass = (state) => state === 'activo' ? 'active' : 'inactive'

  return {
    servicios,
    filteredServicios,
    search,
    selectedServicio,
    loading,
    fuse,
    showDetailDialog,
    showEditDialog,
    showNewDialog,
    totalServicios,
    serviciosActivos,
    serviciosInactivos,
    categoriasUnicas,
    isAnyDialogOpen,

    listar,
    obtenerPorId,
    crear,
    actualizar,
    toggleEstado,

    // Aliases
    agregarServicio,
    actualizarServicio,

    filterServicios,
    setSearch,
    setSelectedServicio,
    openDetailDialog,
    closeDetailDialog,
    openEditDialog,
    closeEditDialog,
    openNewDialog,
    closeNewDialog,
    closeAllDialogs,
    getImagePath,
    handleImageError,

    // Helpers
    formatDate,
    formatState,
    getStateClass
  }
})
