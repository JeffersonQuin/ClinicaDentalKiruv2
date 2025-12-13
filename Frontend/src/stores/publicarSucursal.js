import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import sucursales from 'src/data/sucursales.json'
import Fuse from 'fuse.js'

const FUSE_OPTIONS = {
  keys: ['nombre', 'ubicacion', 'direccion', 'descripcion'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export const usePublicarSucursal = defineStore('publicarSucursal', () => {
  // Estado reactivo
  const listaSucursales = ref([])
  const search = ref('')
  const filteredBranches = ref([])
  const selectedBranch = ref(null)
  const fuse = ref(null)
  
  // Estados de diálogos
  const showDetailDialog = ref(false)
  const showEditDialog = ref(false)
  const showNewDialog = ref(false)
  const showDeleteDialog = ref(false)
  
  // Estados de carga
  const loading = ref(false)

  // ========== INICIALIZACIÓN ==========
  const cargarSucursales = () => {
    // Solo cargar desde JSON si no hay sucursales
    if (listaSucursales.value.length === 0) {
      listaSucursales.value = sucursales.sucursales.map(s => ({
        id: s.id,
        nombre: s.nombre,
        ubicacion: s.ubicacion,
        direccion: s.direccion,
        descripcion: s.descripcion,
        imagen: getImagePath(s.imagen),
        latitud: s.latitud,
        longitud: s.longitud,
        activo: s.activo,
      }))
    }
    filteredBranches.value = [...listaSucursales.value]
    rebuildFuse()
  }

  // ========== GESTIÓN DE IMÁGENES ==========
  const getImagePath = (imagePath) => {
    if (!imagePath) return null
    
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/')) return imagePath
    
    return `/${imagePath}`
  }

  // ========== BÚSQUEDA Y FILTRADO ==========
  const rebuildFuse = () => {
    fuse.value = new Fuse(listaSucursales.value, FUSE_OPTIONS)
  }

  const filterBranches = () => {
    if (!search.value.trim()) {
      filteredBranches.value = [...listaSucursales.value]
      return
    }
    const results = fuse.value.search(search.value.trim())
    filteredBranches.value = results.map(r => r.item)
  }

  const setSearch = (value) => {
    search.value = value
    filterBranches()
  }

  // ========== CRUD DE SUCURSALES ==========
  const agregarSucursal = (nueva) => {
    const maxId = Math.max(0, ...listaSucursales.value.map(s => s.id))
    const nuevaSucursal = {
      ...nueva,
      id: maxId + 1,
      imagen: nueva.imagen ? getImagePath(nueva.imagen) : null
    }
    listaSucursales.value.push(nuevaSucursal)
    rebuildFuse()
    filterBranches()
    closeAllDialogs()
  }

  const actualizarSucursal = (actualizada) => {
    loading.value = true
    try {
      const index = listaSucursales.value.findIndex(s => s.id === actualizada.id)
      if (index !== -1) {
        listaSucursales.value[index] = { 
          ...actualizada,
          imagen: actualizada.imagen ? getImagePath(actualizada.imagen) : null
        }
        rebuildFuse()
        filterBranches()
        closeAllDialogs()
      }
    } catch (error) {
      console.error('Error actualizando sucursal:', error)
    } finally {
      loading.value = false
    }
  }

  const eliminarSucursal = () => {
    if (selectedBranch.value) {
      const index = listaSucursales.value.findIndex(s => s.id === selectedBranch.value.id)
      if (index !== -1) {
        listaSucursales.value.splice(index, 1)
        rebuildFuse()
        filterBranches()
        closeAllDialogs()
      }
    }
  }

  // ========== GESTIÓN DE DIÁLOGOS ==========
  const setSelectedBranch = (branch) => {
    selectedBranch.value = branch ? { ...branch } : null
  }

  // Diálogo de Detalles
  const openDetailDialog = (branch) => {
    setSelectedBranch(branch)
    showDetailDialog.value = true
  }

  const closeDetailDialog = () => {
    showDetailDialog.value = false
    setSelectedBranch(null)
  }

  // Diálogo de Edición
  const openEditDialog = (branch) => {
    setSelectedBranch(branch)
    showEditDialog.value = true
  }

  const closeEditDialog = () => {
    showEditDialog.value = false
    setSelectedBranch(null)
  }

  // Diálogo de Nueva Sucursal
  const openNewDialog = () => {
    showNewDialog.value = true
  }

  const closeNewDialog = () => {
    showNewDialog.value = false
  }

  // Diálogo de Eliminación
  const confirmDeleteBranch = (branch) => {
    setSelectedBranch(branch)
    showDeleteDialog.value = true
  }

  const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    setSelectedBranch(null)
  }

  // Cerrar todos los diálogos
  const closeAllDialogs = () => {
    showDetailDialog.value = false
    showEditDialog.value = false
    showNewDialog.value = false
    showDeleteDialog.value = false
    setSelectedBranch(null)
  }

  // ========== UTILIDADES ==========
  const handleImageError = (event) => {
    event.target.style.display = 'none'
  }

  // Simular carga (para operaciones async)
  const simulateLoading = async (duration = 1000) => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, duration))
    loading.value = false
  }

  // ========== GETTERS COMPUTADOS ==========
  const totalSucursales = computed(() => listaSucursales.value.length)
  
  const ciudadesUnicas = computed(() => 
    [...new Set(listaSucursales.value.map(s => s.ubicacion))]
  )
  
  const sucursalesActivas = computed(() => 
    listaSucursales.value.filter(s => s.activo)
  )
  
  const isAnyDialogOpen = computed(() => {
    return showDetailDialog.value || showEditDialog.value || 
           showNewDialog.value || showDeleteDialog.value
  })

  return {
    // Estados
    listaSucursales,
    search,
    filteredBranches,
    selectedBranch,
    fuse,
    showDetailDialog,
    showEditDialog,
    showNewDialog,
    showDeleteDialog,
    loading,
    
    // Acciones
    cargarSucursales,
    getImagePath,
    rebuildFuse,
    filterBranches,
    setSearch,
    agregarSucursal,
    actualizarSucursal,
    eliminarSucursal,
    setSelectedBranch,
    openDetailDialog,
    closeDetailDialog,
    openEditDialog,
    closeEditDialog,
    openNewDialog,
    closeNewDialog,
    confirmDeleteBranch,
    closeDeleteDialog,
    closeAllDialogs,
    handleImageError,
    simulateLoading,
    
    // Getters
    totalSucursales,
    ciudadesUnicas,
    sucursalesActivas,
    isAnyDialogOpen
  }
})