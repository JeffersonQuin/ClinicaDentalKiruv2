// src/stores/anuncioStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { anuncioService } from '../services/anuncioService'

const FUSE_OPTIONS = {
  keys: ['titulo', 'descripcion', 'categoria'],
  threshold: 0.3
}

export const useAnuncioStore = defineStore('anuncios', () => {
  // Estados
  const anuncios = ref([])
  const filteredAnuncios = ref([])
  const search = ref('')
  const selectedAnuncio = ref(null)
  const loading = ref(false)
  const fuse = ref(null)

  // Diálogos
  const showDetailDialog = ref(false)
  const showEditDialog = ref(false)
  const showNewDialog = ref(false)
  const showDeleteDialog = ref(false)

  // ================= CRUD =================
  const listar = async () => {
    loading.value = true
    try {
      const res = await anuncioService.getAll()
      anuncios.value = res.data
      filteredAnuncios.value = [...anuncios.value]
      rebuildFuse()
    } catch (err) {
      console.error('Error al listar anuncios:', err)
    } finally {
      loading.value = false
    }
  }

  const obtenerPorId = async (id) => {
    try {
      const res = await anuncioService.getById(id)
      return res.data
    } catch (err) {
      console.error('Error al obtener anuncio:', err)
    }
  }

  // src/stores/anuncioStore.js (actualizar solo la función crear)
  const crear = async (data, file) => {
    loading.value = true
    try {
      // Crear un nuevo objeto con todos los datos
      const formData = {
        ...data,
        imagen: file || null  // Asegurar que imagen esté en el objeto
      }

      // Enviar al service (el service manejará el FormData)
      const res = await anuncioService.create(formData)
      anuncios.value.push(res.data)
      filteredAnuncios.value.push(res.data)
      rebuildFuse()
      return res.data
    } catch (err) {
      console.error('Error al crear anuncio:', err)
      throw err // Importante: lanzar el error para que el componente lo capture
    } finally {
      loading.value = false
    }
  }

  // src/stores/anuncioStore.js (actualizar solo la función actualizar)
  const actualizar = async (id, data, file) => {
    loading.value = true
    try {
      // Crear un nuevo objeto con todos los datos
      const formData = {
        ...data,
        imagen: file || null  // Asegurar que imagen esté en el objeto
      }

      // Enviar al service (el service manejará el FormData)
      const res = await anuncioService.update(id, formData)

      const index = anuncios.value.findIndex(a => a.id === id)
      if (index !== -1) anuncios.value[index] = res.data

      // Actualizar también en filteredAnuncios
      const filteredIndex = filteredAnuncios.value.findIndex(a => a.id === id)
      if (filteredIndex !== -1) filteredAnuncios.value[filteredIndex] = res.data

      rebuildFuse()
      filterAnuncios()
      return res.data
    } catch (err) {
      console.error('Error al actualizar anuncio:', err)
      throw err // Importante: lanzar el error
    } finally {
      loading.value = false
    }
  }

  const eliminar = async (id) => {
    try {
      await anuncioService.delete(id)
      anuncios.value = anuncios.value.filter(a => a.id !== id)
      filteredAnuncios.value = filteredAnuncios.value.filter(a => a.id !== id)
    } catch (err) {
      console.error('Error al eliminar anuncio:', err)
    }
  }

  // ================ Filtro Fuse =================
  const rebuildFuse = () => {
    fuse.value = new Fuse(anuncios.value, FUSE_OPTIONS)
  }

  const filterAnuncios = () => {
    if (!search.value.trim()) {
      filteredAnuncios.value = [...anuncios.value]
      return
    }
    const results = fuse.value.search(search.value.trim())
    filteredAnuncios.value = results.map(r => r.item)
  }

  const setSearch = (value) => {
    search.value = value
    filterAnuncios()
  }

  // ================ Diálogos =================
  const setSelectedAnuncio = (anuncio) => selectedAnuncio.value = anuncio ? { ...anuncio } : null

  const openDetailDialog = (anuncio) => { setSelectedAnuncio(anuncio); showDetailDialog.value = true }
  const closeDetailDialog = () => { showDetailDialog.value = false; setSelectedAnuncio(null) }

  const openEditDialog = (anuncio) => { setSelectedAnuncio(anuncio); showEditDialog.value = true }
  const closeEditDialog = () => { showEditDialog.value = false; setSelectedAnuncio(null) }

  const openNewDialog = () => showNewDialog.value = true
  const closeNewDialog = () => showNewDialog.value = false

  const confirmDeleteAnuncio = (anuncio) => { setSelectedAnuncio(anuncio); showDeleteDialog.value = true }
  const closeDeleteDialog = () => { showDeleteDialog.value = false; setSelectedAnuncio(null) }

  const closeAllDialogs = () => {
    showDetailDialog.value = false
    showEditDialog.value = false
    showNewDialog.value = false
    showDeleteDialog.value = false
    setSelectedAnuncio(null)
  }

  // ================ Utilidades =================
  const getImagePath = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return `http://localhost:5050${imagePath}`
    return `http://localhost:5050/${imagePath}`
  }

  const handleImageError = (event) => { event.target.style.display = 'none' }

  // ================= Computed =================
  const totalAnuncios = computed(() => anuncios.value.length)
  const anunciosActivos = computed(() => anuncios.value.filter(a => a.estado === 'activo'))
  const anunciosInactivos = computed(() => anuncios.value.filter(a => a.estado === 'inactivo'))
  const categoriasUnicas = computed(() => [...new Set(anuncios.value.map(a => a.categoria))])
  const isAnyDialogOpen = computed(() => showDetailDialog.value || showEditDialog.value || showNewDialog.value || showDeleteDialog.value)

  // ================= Aliases & Legacy Helpers =================
  // Mantener compatibilidad con componentes que usan los nombres antiguos
  const agregarAnuncio = crear
  const actualizarAnuncio = actualizar
  const eliminarAnuncio = eliminar

  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatState = (state) => state === 'activo' ? 'Activo' : 'Inactivo'
  const getStateClass = (state) => state === 'activo' ? 'active' : 'inactive'

  return {
    anuncios,
    filteredAnuncios,
    search,
    selectedAnuncio,
    loading,
    fuse,
    showDetailDialog,
    showEditDialog,
    showNewDialog,
    showDeleteDialog,
    totalAnuncios,
    anunciosActivos,
    anunciosInactivos,
    categoriasUnicas,
    isAnyDialogOpen,

    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,

    // Aliases
    agregarAnuncio,
    actualizarAnuncio,
    eliminarAnuncio,

    filterAnuncios,
    setSearch,
    setSelectedAnuncio,
    openDetailDialog,
    closeDetailDialog,
    openEditDialog,
    closeEditDialog,
    openNewDialog,
    closeNewDialog,
    confirmDeleteAnuncio,
    closeDeleteDialog,
    closeAllDialogs,
    getImagePath,
    handleImageError,

    // Helpers
    formatDate,
    formatState,
    getStateClass
  }
})
