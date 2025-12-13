import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import anuncios from 'src/data/anuncios.json'
import users from 'src/data/users.json'
import Fuse from 'fuse.js'

const FUSE_OPTIONS = {
  keys: ['titulo', 'descripcion', 'categoria'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

const STATE_TRANSLATIONS = {
  activo: 'Activo',
  inactivo: 'Inactivo'
}

const STATE_CLASSES = {
  activo: 'state-active',
  inactivo: 'state-inactive'
}

// Clave para localStorage
const STORAGE_KEY = 'kiru-anuncios'

export const usePublicarAnuncio = defineStore('publicarAnuncio', () => {
  // ========== ESTADOS ==========
  const search = ref('')
  const rows = ref([])
  const selectedAnuncio = ref(null)
  const showDetailDialog = ref(false)
  const showEditDialog = ref(false)
  const showNewDialog = ref(false)
  const showDeleteDialog = ref(false)
  const usersMap = ref({})
  let fuse = null

  // ========== PERSISTENCIA ==========
  
  // Cargar desde localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
    }
    return null
  }

  // Guardar en localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.value))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  // ========== GETTERS COMPUTADOS ==========
  
  // Anuncios que NO están eliminados
  const filteredRows = computed(() => {
    return rows.value.filter(a => a.estado !== 'eliminado')
  })

  // Resultados de búsqueda
  const searchResults = computed(() => {
    if (!search.value?.trim()) {
      return filteredRows.value
    }
    
    if (!fuse) return filteredRows.value
    
    const results = fuse.search(search.value.trim())
    return results.map(result => result.item)
  })

  const activeAnunciosCount = computed(() => 
    filteredRows.value.filter(a => a.estado === 'activo').length
  )

  const inactiveAnunciosCount = computed(() => 
    filteredRows.value.filter(a => a.estado === 'inactivo').length
  )

  const uniqueCategories = computed(() => {
    return [...new Set(filteredRows.value.map(a => a.categoria))]
  })

  const totalAnuncios = computed(() => filteredRows.value.length)

  // ========== ACCIONES ==========
  
  // Cargar datos iniciales
  const loadAnuncios = () => {
    // Primero intentar cargar desde localStorage
    const storedAnuncios = loadFromStorage()
    
    if (storedAnuncios && storedAnuncios.length > 0) {
      rows.value = storedAnuncios
    } else {
      // Si no hay datos en localStorage, cargar del JSON
      rows.value = anuncios.anuncios.map(a => ({ 
        ...a, 
        id: Number(a.id) 
      }))
      // Guardar la versión inicial en localStorage
      saveToStorage()
    }
    
    rebuildFuse()
  }

  const loadUsers = () => {
    users.users.forEach(user => {
      usersMap.value[user.id] = user.username
    })
  }

  // Búsqueda y filtrado
  const rebuildFuse = () => {
    const collection = filteredRows.value
    
    if (fuse && typeof fuse.setCollection === 'function') {
      fuse.setCollection(collection)
    } else {
      fuse = new Fuse(collection, FUSE_OPTIONS)
    }
  }

  const setSearch = (value) => {
    search.value = value
  }

  // CRUD de anuncios
  const agregarAnuncio = (nuevoAnuncio) => {
    const anuncioToAdd = {
      titulo: nuevoAnuncio.titulo || '',
      descripcion: nuevoAnuncio.descripcion || '',
      categoria: nuevoAnuncio.categoria || 'Promoción',
      fecha_publicacion: nuevoAnuncio.fecha_publicacion || new Date().toISOString().split('T')[0],
      fecha_expiracion: nuevoAnuncio.fecha_expiracion || '',
      userId: nuevoAnuncio.userId || 101,
      imagen: nuevoAnuncio.imagen || '',
      estado: nuevoAnuncio.estado || 'activo'
    }

    const numericIds = rows.value
      .map(a => Number(a.id))
      .filter(n => !Number.isNaN(n))
    
    const maxId = numericIds.length ? Math.max(...numericIds) : 0
    anuncioToAdd.id = maxId + 1

    rows.value.push(anuncioToAdd)
    rebuildFuse()
    saveToStorage()
    closeAllDialogs()
  }

  const actualizarAnuncio = (anuncioActualizado) => {
    const index = rows.value.findIndex(
      a => Number(a.id) === Number(anuncioActualizado.id)
    )
    
    if (index > -1) {
      rows.value[index] = { 
        ...anuncioActualizado, 
        id: Number(anuncioActualizado.id) 
      }
      rebuildFuse()
      saveToStorage()
      closeAllDialogs()
    }
  }

  const eliminarAnuncio = () => {
    if (selectedAnuncio.value) {
      const index = rows.value.findIndex(
        a => Number(a.id) === Number(selectedAnuncio.value.id)
      )
      
      if (index > -1) {
        rows.value[index].estado = 'eliminado'
        rebuildFuse()
        saveToStorage()
        closeAllDialogs()
      }
    }
  }

  // Gestión de diálogos
  const setSelectedAnuncio = (anuncio) => {
    selectedAnuncio.value = anuncio ? { ...anuncio } : null
  }

  const openDetailDialog = (anuncio) => {
    setSelectedAnuncio(anuncio)
    showDetailDialog.value = true
  }

  const closeDetailDialog = () => {
    showDetailDialog.value = false
    setSelectedAnuncio(null)
  }

  const openEditDialog = (anuncio) => {
    setSelectedAnuncio(anuncio)
    showEditDialog.value = true
  }

  const closeEditDialog = () => {
    showEditDialog.value = false
    setSelectedAnuncio(null)
  }

  const openNewDialog = () => {
    showNewDialog.value = true
  }

  const closeNewDialog = () => {
    showNewDialog.value = false
  }

  const confirmDeleteAnuncio = (anuncio) => {
    setSelectedAnuncio(anuncio)
    showDeleteDialog.value = true
  }

  const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    setSelectedAnuncio(null)
  }

  const closeAllDialogs = () => {
    showDetailDialog.value = false
    showEditDialog.value = false
    showNewDialog.value = false
    showDeleteDialog.value = false
    setSelectedAnuncio(null)
  }

  // Utilidades
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  const getUserName = (userId) => {
    return usersMap.value[userId] || `Usuario ${userId}`
  }

  const formatState = (state) => STATE_TRANSLATIONS[state] || state
  const getStateClass = (state) => STATE_CLASSES[state] || 'state-default'

  const handleImageError = (event) => {
    event.target.style.display = 'none'
    const nextSibling = event.target.nextElementSibling
    if (nextSibling && nextSibling.style) {
      nextSibling.style.display = 'flex'
    }
  }

  // Método para resetear datos (útil para testing)
  const resetToInitialData = () => {
    rows.value = anuncios.anuncios.map(a => ({ 
      ...a, 
      id: Number(a.id) 
    }))
    rebuildFuse()
    saveToStorage()
  }

  // Inicialización
  const initialize = () => {
    loadUsers()
    loadAnuncios()
  }

  return {
    // Estados
    search,
    rows,
    selectedAnuncio,
    showDetailDialog,
    showEditDialog,
    showNewDialog,
    showDeleteDialog,
    
    // Getters
    filteredRows,
    searchResults,
    activeAnunciosCount,
    inactiveAnunciosCount,
    uniqueCategories,
    totalAnuncios,
    
    // Acciones
    initialize,
    setSearch,
    rebuildFuse,
    agregarAnuncio,
    actualizarAnuncio,
    eliminarAnuncio,
    openDetailDialog,
    closeDetailDialog,
    openEditDialog,
    closeEditDialog,
    openNewDialog,
    closeNewDialog,
    confirmDeleteAnuncio,
    closeDeleteDialog,
    closeAllDialogs,
    resetToInitialData,
    
    // Utilidades
    formatDate,
    getUserName,
    formatState,
    getStateClass,
    handleImageError
  }
})