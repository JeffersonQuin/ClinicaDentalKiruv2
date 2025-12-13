<template>
  <div class="dentist-page-container">
    <!-- Header Section -->
    <div class="dentist-page-header">
      <div class="dentist-header-background">
        <div class="dentist-header-shape dentist-header-shape-1"></div>
        <div class="dentist-header-shape dentist-header-shape-2"></div>
      </div>
      <div class="dentist-header-content">
        <div class="dentist-title-section">
          <div class="dentist-icon-wrapper">
            <i class="fa-solid fa-user-doctor dentist-header-icon"></i>
          </div>
          <div>
            <h1 class="dentist-page-title">Gestión de Dentistas</h1>
            <p class="dentist-page-subtitle">Administra el equipo odontológico de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="dentist-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Dentista"
          @click="openNewDentistDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="dentist-stats-section">
      <div class="dentist-stat-card" v-for="stat in stats" :key="stat.label">
        <div :class="['dentist-stat-icon-container', stat.type]">
          <i :class="stat.icon"></i>
        </div>
        <div class="dentist-stat-content">
          <div class="dentist-stat-value">{{ stat.value }}</div>
          <div class="dentist-stat-label">{{ stat.label }}</div>
        </div>
        <div :class="['dentist-stat-glow', stat.type]"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="dentist-search-section">
      <div class="dentist-search-container">
        <q-input
          v-model="search"
          class="dentist-search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, apellido o especialidad..."
          @input="filterRows"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search dentist-search-icon"></i>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Loading, Error & Table -->
    <div v-if="store.cargando && store.dentistasCompletos.length === 0" class="dentist-loading-container">
      <div class="dentist-loading-content">
        <q-spinner-gears size="50px" color="primary" />
        <h4 class="dentist-loading-text">Cargando dentistas...</h4>
      </div>
    </div>

    <div v-else-if="store.error" class="dentist-error-container">
      <div class="dentist-error-content">
        <i class="fa-solid fa-exclamation-triangle dentist-error-icon"></i>
        <h4 class="dentist-error-title">Error al cargar datos</h4>
        <p class="dentist-error-message">{{ store.error }}</p>
        <q-btn color="primary" @click="loadDentistas" icon="fa-solid fa-refresh" label="Reintentar" />
      </div>
    </div>

    <div v-else>
      <!-- Dentistas Activos -->
      <div class="dentist-table-container">
        <div class="dentist-table-header">
          <div class="dentist-table-title-section">
            <h3 class="dentist-table-title">
              <i class="fa-solid fa-check-circle" style="color: #4caf50; margin-right: 8px;"></i>
              Dentistas Activos
            </h3>
            <div class="dentist-table-underline"></div>
          </div>
          <div class="dentist-results-count">
            <span class="dentist-count-badge">
              <i class="fa-solid fa-list-check"></i>
              {{ filteredActiveDentists.length }} dentista{{ filteredActiveDentists.length !== 1 ? 's' : '' }}
            </span>
            <q-btn 
              flat 
              round 
              icon="fa-solid fa-sync-alt" 
              @click="loadDentistas"
              :loading="store.cargando"
              class="dentist-refresh-btn"
              size="sm"
            >
              <q-tooltip>Actualizar lista</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-table
          class="dentist-data-table"
          flat
          :rows="filteredActiveDentists"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[5, 10, 15, 20, 0]"
          :pagination="{ rowsPerPage: 10 }"
          separator="cell"
          :loading="store.cargando"
        >
          <template v-slot:no-data>
            <div class="dentist-no-data-container">
              <div class="dentist-no-data-illustration">
                <i class="fa-solid fa-user-doctor-slash dentist-no-data-icon"></i>
                <div class="dentist-no-data-circle dentist-no-data-circle-1"></div>
                <div class="dentist-no-data-circle dentist-no-data-circle-2"></div>
              </div>
              <p class="dentist-no-data-text">No hay dentistas activos</p>
              <p class="dentist-no-data-subtext">Los dentistas activos aparecerán aquí</p>
            </div>
          </template>

        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <q-avatar 
              size="56px"
              :color="props.row.imagen ? 'transparent' : getAvatarColor(props.row.nombre)"
            >
              <img 
                v-if="props.row.imagen" 
                :src="getImageUrl(props.row.imagen)" 
                :alt="getFullName(props.row)"
                @error="handleImageError"
              />
              <span v-else>{{ getInitials(props.row) }}</span>
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            <div>{{ getFullName(props.row) }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-especialidades="props">
          <q-td :props="props">
            <q-chip
              v-for="esp in props.row.especialidades || []"
              :key="esp.id"
              dense
              size="sm"
              :color="esp.estado === 'activo' ? 'primary' : 'grey'"
              text-color="white"
            >
              {{ esp.nombre }}
            </q-chip>
            <span v-if="!(props.row.especialidades && props.row.especialidades.length)">Sin especialidades</span>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge :label="formatState(props.row.estado)" :class="getStateClass(props.row.estado)" />
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <div class="dentist-actions-container">
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-eye" 
                @click="viewDentist(props.row)" 
                color="grey-7"
                size="sm"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-edit" 
                @click="editDentist(props.row)" 
                color="primary"
                size="sm"
              >
                <q-tooltip>Editar dentista</q-tooltip>
              </q-btn>
              
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-pause-circle" 
                @click="toggleDentistStatus(props.row)" 
                color="warning"
                size="sm"
              >
                <q-tooltip>Desactivar dentista</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dentistas Inactivos -->
    <div class="dentist-table-container" style="margin-top: 40px;">
      <div class="dentist-table-header">
        <div class="dentist-table-title-section">
          <h3 class="dentist-table-title">
            <i class="fa-solid fa-pause-circle" style="color: #ff9800; margin-right: 8px;"></i>
            Dentistas Inactivos
          </h3>
          <div class="dentist-table-underline"></div>
        </div>
        <div class="dentist-results-count">
          <span class="dentist-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredInactiveDentists.length }} dentista{{ filteredInactiveDentists.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="dentist-data-table dentist-inactive-table"
        flat
        :rows="filteredInactiveDentists"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
        :loading="store.cargando"
      >
        <template v-slot:no-data>
          <div class="dentist-no-data-container">
            <div class="dentist-no-data-illustration">
              <i class="fa-solid fa-user-doctor-slash dentist-no-data-icon"></i>
              <div class="dentist-no-data-circle dentist-no-data-circle-1"></div>
              <div class="dentist-no-data-circle dentist-no-data-circle-2"></div>
            </div>
            <p class="dentist-no-data-text">No hay dentistas inactivos</p>
            <p class="dentist-no-data-subtext">Los dentistas inactivos aparecerán aquí</p>
          </div>
        </template>

        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <q-avatar 
              size="56px"
              :color="props.row.imagen ? 'transparent' : getAvatarColor(props.row.nombre)"
              style="opacity: 0.6;"
            >
              <img 
                v-if="props.row.imagen" 
                :src="getImageUrl(props.row.imagen)" 
                :alt="getFullName(props.row)"
                @error="handleImageError"
              />
              <span v-else>{{ getInitials(props.row) }}</span>
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-nombre="props">
          <q-td :props="props" style="opacity: 0.7;">
            <div>{{ getFullName(props.row) }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-especialidades="props">
          <q-td :props="props" style="opacity: 0.7;">
            <q-chip
              v-for="esp in props.row.especialidades || []"
              :key="esp.id"
              dense
              size="sm"
              :color="esp.estado === 'activo' ? 'primary' : 'grey'"
              text-color="white"
            >
              {{ esp.nombre }}
            </q-chip>
            <span v-if="!(props.row.especialidades && props.row.especialidades.length)">Sin especialidades</span>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge :label="formatState(props.row.estado)" :class="getStateClass(props.row.estado)" />
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <div class="dentist-actions-container">
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-eye" 
                @click="viewDentist(props.row)" 
                color="grey-7"
                size="sm"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-edit" 
                @click="editDentist(props.row)" 
                color="primary"
                size="sm"
              >
                <q-tooltip>Editar dentista</q-tooltip>
              </q-btn>
              
              <q-btn 
                flat 
                dense 
                round 
                icon="fa-solid fa-play-circle" 
                @click="toggleDentistStatus(props.row)" 
                color="positive"
                size="sm"
              >
                <q-tooltip>Activar dentista</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    </div>

    <!-- Dialogs -->
    <DetailDentistDialog v-model="showDetailDialog" :dentist-data="selectedDentist" @edit-dentist="editDentist" />
    <EditDentistDialog v-model="showEditDialog" :dentist-data="selectedDentist" @dentist-updated="handleDentistUpdate" />
    <NewDentistDialog v-model="showNewDialog" @dentist-created="handleDentistCreate" />
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar' // AGREGADO: Para notificaciones
import { useDentistaGestionStore } from 'src/stores/dentistaGestionStore'
import Fuse from 'fuse.js'
import DetailDentistDialog from './DetailDentistDialog.vue'
import EditDentistDialog from './EditDentistDialog.vue'
import NewDentistDialog from './NewDentistDialog.vue'

// MODIFICADO: Ajustar ancho de columna acciones
const columns = [
  { name: 'imagen', label: 'Foto', align: 'center', field: 'imagen', sortable: false, style: 'width: 80px' },
  { name: 'nombre', label: 'Nombre Completo', align: 'left', field: row => getFullName(row), sortable: true },
  { name: 'especialidades', label: 'Especialidades', field: 'especialidades', sortable: false, align: 'left', style: 'min-width: 300px' },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, align: 'center', style: 'width: 130px' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center', sortable: false, style: 'width: 150px' } // MODIFICADO: 150px para 3 botones
]

const FUSE_OPTIONS = {
  keys: ['nombre', 'segundo_nombre', 'apellido_paterno', 'apellido_materno'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

const STATE_TRANSLATIONS = { activo: 'Activo', inactivo: 'Inactivo' }
const STATE_CLASSES = { activo: 'dentist-state-active', inactivo: 'dentist-state-inactive' }

const getFullName = (dentist) => {
  if (!dentist) return ''
  return [dentist.nombre, dentist.segundo_nombre, dentist.apellido_paterno, dentist.apellido_materno].filter(Boolean).join(' ')
}

const getInitials = (dentist) => {
  if (!dentist) return '?'
  const first = dentist.nombre?.charAt(0) || ''
  const last = dentist.apellido_paterno?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
}

export default {
  name: 'DentistPage',
  
  components: { DetailDentistDialog, EditDentistDialog, NewDentistDialog },
  
  setup() {
    const $q = useQuasar() // AGREGADO: Para notificaciones
    const store = useDentistaGestionStore()
    const search = ref('')
    const selectedDentist = ref(null)
    
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    let fuse = null

    const activeDentistsCount = computed(() => store.dentistasCompletos.filter(d => d.estado === 'activo').length)
    const inactiveDentistsCount = computed(() => store.dentistasCompletos.filter(d => d.estado === 'inactivo').length)
    const totalSpecialties = computed(() => store.dentistasCompletos.reduce((acc, d) => acc + (d.especialidades?.length || 0), 0))
    const rows = computed(() => store.dentistasCompletos || [])

    // Filtrar dentistas activos e inactivos según la búsqueda
    const filteredActiveDentists = computed(() => {
      const activos = store.dentistasCompletos.filter(d => d.estado === 'activo')
      if (!search.value?.trim()) return activos
      
      if (fuse) {
        const results = fuse.search(search.value.trim())
        return results.map(r => r.item).filter(d => d.estado === 'activo')
      }
      return activos.filter(d => 
        getFullName(d).toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const filteredInactiveDentists = computed(() => {
      const inactivos = store.dentistasCompletos.filter(d => d.estado === 'inactivo')
      if (!search.value?.trim()) return inactivos
      
      if (fuse) {
        const results = fuse.search(search.value.trim())
        return results.map(r => r.item).filter(d => d.estado === 'inactivo')
      }
      return inactivos.filter(d => 
        getFullName(d).toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const stats = computed(() => [
      {
        label: 'Dentistas Activos',
        value: activeDentistsCount.value,
        icon: 'fa-solid fa-user-doctor',
        type: 'active'
      },
      {
        label: 'Dentistas Inactivos',
        value: inactiveDentistsCount.value,
        icon: 'fa-solid fa-user-slash',
        type: 'inactive'
      },
      {
        label: 'Total Especialidades',
        value: totalSpecialties.value,
        icon: 'fa-solid fa-graduation-cap',
        type: 'specialties'
      },
      {
        label: 'Total Dentistas',
        value: store.dentistasCompletos.length,
        icon: 'fa-solid fa-users',
        type: 'total'
      }
    ])

    const getAvatarColor = (name) => {
      if (!name) return '#9e9e9e'
      const colors = ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722']
      let hash = 0
      for (let i=0; i<name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
      return colors[Math.abs(hash) % colors.length]
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
      const avatar = event.target.closest('.q-avatar')
      if (avatar) {
        const name = selectedDentist.value?.nombre || ''
        avatar.style.backgroundColor = getAvatarColor(name)
      }
    }

    const getImageUrl = (imagen) => {
      if (!imagen) return ''
      // Si ya es una URL completa, retornarla
      if (imagen.startsWith('http')) return imagen
      // Si empieza con /uploads, agregar el dominio
      if (imagen.startsWith('/uploads')) return `http://localhost:5050${imagen}`
      // Si es solo el nombre del archivo, construir la ruta completa
      return `http://localhost:5050/uploads/${imagen}`
    }
    
    const formatState = (state) => STATE_TRANSLATIONS[state] || state
    const getStateClass = (state) => STATE_CLASSES[state] || 'dentist-state-default'

    const rebuildFuse = () => {
      // Incluir todos los dentistas para búsqueda
      fuse ? fuse.setCollection(rows.value) : fuse = new Fuse(rows.value, FUSE_OPTIONS)
    }

    const loadDentistas = async () => {
      try {
        await store.cargarDentistasCompletos()
        rebuildFuse()
      } catch (err) { 
        console.error('Error cargando dentistas:', err)
      }
    }

    const handleDentistCreate = async () => {
      try {
        showNewDialog.value = false
        rebuildFuse()
        
        // Notificación de éxito
        $q.notify({
          type: 'positive',
          message: 'Dentista creado exitosamente',
          position: 'top-right',
          timeout: 3000
        })
      } catch (err) { 
        console.error('Error en handleDentistCreate:', err) 
      }
    }

    const handleDentistUpdate = async () => {
      try {
        showEditDialog.value = false
        rebuildFuse()
        
        // Notificación de éxito
        $q.notify({
          type: 'positive',
          message: 'Dentista actualizado exitosamente',
          position: 'top-right',
          timeout: 3000
        })
      } catch (err) { 
        console.error('Error en handleDentistUpdate:', err) 
      }
    }

    // Función para activar/desactivar dentista
    const toggleDentistStatus = async (dentist) => {
      try {
        const nuevoEstado = dentist.estado === 'activo' ? 'inactivo' : 'activo'
        await store.toggleEstadoDentista(dentist.id, nuevoEstado)
        
        // Actualizar lista
        rebuildFuse()
        
        $q.notify({
          type: 'positive',
          message: `Dentista ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`,
          position: 'top-right',
          timeout: 3000
        })
      } catch (error) {
        console.error('Error al cambiar estado del dentista:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al cambiar el estado del dentista',
          position: 'top-right',
          timeout: 5000
        })
      }
    }

    const viewDentist = (dentist) => { 
      selectedDentist.value = { ...dentist }
      showDetailDialog.value = true 
    }
    
    const editDentist = (dentist) => { 
      selectedDentist.value = { ...dentist }
      showEditDialog.value = true
      showDetailDialog.value = false 
    }
    
    const openNewDentistDialog = () => { showNewDialog.value = true }

    onMounted(async () => { 
      await loadDentistas() 
    })
    
    watch(rows, () => { 
      rebuildFuse()
    }, { immediate: true })

    return {
      store,
      search,
      columns,
      filteredActiveDentists,
      filteredInactiveDentists,
      selectedDentist,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      activeDentistsCount,
      inactiveDentistsCount,
      totalSpecialties,
      stats,
      loadDentistas,
      handleDentistCreate,
      handleDentistUpdate,
      toggleDentistStatus,
      viewDentist,
      editDentist,
      openNewDentistDialog,
      getFullName,
      getInitials,
      handleImageError,
      getImageUrl,
      formatState,
      getStateClass,
      getAvatarColor
    }
  }
}
</script>

