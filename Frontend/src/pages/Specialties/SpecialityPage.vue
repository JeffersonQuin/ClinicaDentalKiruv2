<template>
  <div class="specialty-page-container">
    <!-- Header Section -->
    <div class="specialty-page-header">
      <div class="specialty-header-background">
        <div class="specialty-header-shape specialty-header-shape-1"></div>
        <div class="specialty-header-shape specialty-header-shape-2"></div>
      </div>
      <div class="specialty-header-content">
        <div class="specialty-title-section">
          <div class="specialty-icon-wrapper">
            <i class="fa-solid fa-tooth specialty-header-icon"></i>
          </div>
          <div>
            <h1 class="specialty-page-title">Gestión de Especialidades</h1>
            <p class="specialty-page-subtitle">Configure y administre los servicios odontológicos de su clínica</p>
          </div>
        </div>
        <q-btn
          class="specialty-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Especialidad"
          @click="openNewSpecialityDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Search Section -->
    <div class="specialty-search-section">
      <div class="specialty-search-container">
        <q-input
          v-model="store.search"
          class="specialty-search-input"
          outlined
          type="search"
          placeholder="Buscar especialidades por nombre o descripción..."
          @update:model-value="store.applySearch"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search specialty-search-icon"></i>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="specialty-content-layout">
      <!-- Left Side - Info and Stats -->
      <div class="specialty-info-section">
        <div class="specialty-info-card">
          <div class="specialty-info-header">
            <div class="specialty-info-icon-container">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h2 class="specialty-info-title">Panel de Especialidades</h2>
          </div>
          <div class="specialty-info-content">
            <p class="specialty-info-description">
              Administre el catálogo completo de especialidades odontológicas disponibles 
              en su clínica. Cada especialidad puede ser editada, visualizada o eliminada 
              según las necesidades de su práctica dental.
            </p>
            
            <div class="specialty-stats-grid">
              <div class="specialty-stat-item">
                <div class="specialty-stat-icon">
                  <i class="fa-solid fa-clipboard-list"></i>
                </div>
                <div class="specialty-stat-content">
                  <div class="specialty-stat-value">{{ store.searchResults.length }}</div>
                  <div class="specialty-stat-label">Especialidades Registradas</div>
                </div>
              </div>
              <div class="specialty-stat-item">
                <div class="specialty-stat-icon">
                  <i class="fa-solid fa-file-invoice"></i>
                </div>
                <div class="specialty-stat-content">
                  <div class="specialty-stat-value">{{ store.totalPaginas }}</div>
                  <div class="specialty-stat-label">Páginas Disponibles</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Branding Circle -->
        <div class="specialty-branding-card">
          <div class="specialty-branding-circle">
            <div class="specialty-branding-glow"></div>
            <q-img
              src="/KiruIMG/speciality.png"
              spinner-color="primary"
              fit="contain"
              class="specialty-brand-image"
            />
          </div>
          <p class="specialty-branding-text">Sistema de Gestión Dental</p>
          <div class="specialty-branding-badge">
            <i class="fa-solid fa-shield-heart"></i>
            <span>Profesional</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Specialities Grid -->
      <div class="specialty-specialities-section">
        <!-- Especialidades Activas -->
        <div class="specialty-section-header">
          <div class="specialty-section-title-wrapper">
            <h3 class="specialty-section-title">
              <i class="fa-solid fa-check-circle" style="color: #4caf50; margin-right: 8px;"></i>
              Especialidades Activas
            </h3>
            <div class="specialty-title-underline"></div>
          </div>
          <div class="specialty-results-count">
            <span class="specialty-count-badge">
              <i class="fa-solid fa-list-check"></i>
              {{ filteredActiveEspecialidades.length }} especialidad{{ filteredActiveEspecialidades.length !== 1 ? 'es' : '' }}
            </span>
          </div>
        </div>

        <div class="specialty-cards-container">
          <div v-if="filteredActiveEspecialidades.length === 0" class="specialty-no-data-container">
            <div class="specialty-no-data-illustration">
              <i class="fa-solid fa-tooth specialty-no-data-icon"></i>
              <div class="specialty-no-data-circle specialty-no-data-circle-1"></div>
              <div class="specialty-no-data-circle specialty-no-data-circle-2"></div>
            </div>
            <p class="specialty-no-data-text">No hay especialidades activas</p>
            <p class="specialty-no-data-subtext">Las especialidades activas aparecerán aquí</p>
          </div>
          
          <transition-group v-else name="specialty-card-fade" tag="div" class="specialty-cards-grid">
            <div 
              v-for="speciality in filteredActiveEspecialidades" 
              :key="speciality.id"
              class="specialty-speciality-card"
            >
              <div class="specialty-card-image-container">
                <q-img 
                  :src="speciality.image || 'https://i.pinimg.com/originals/ea/d5/5a/ead55a380087931b94a3968f54d8fbda.jpg'"
                  :ratio="4/3"
                  spinner-color="primary"
                  @error="handleImageError"
                  class="specialty-card-image"
                >
                  <div class="specialty-image-overlay"></div>
                </q-img>
                <div class="specialty-card-badge">
                  <i class="fa-solid fa-star"></i>
                </div>
                <div class="specialty-card-status-badge active">
                  <i class="fa-solid fa-check"></i>
                  Activa
                </div>
              </div>
              
              <div class="specialty-card-content">
                <h4 class="specialty-card-title">{{ speciality.nombre }}</h4>
                <p class="specialty-card-description">{{ truncateText(speciality.descripcion, 80) }}</p>
                
                <div class="specialty-card-actions">
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-eye"
                    label="Ver"
                    @click="viewSpeciality(speciality)"
                    class="specialty-action-btn specialty-view-btn"
                    no-caps
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-edit"
                    label="Editar"
                    color="primary"
                    @click="editSpeciality(speciality)"
                    class="specialty-action-btn specialty-edit-btn"
                    no-caps
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-pause-circle"
                    label="Desactivar"
                    color="warning"
                    @click="toggleSpecialityStatus(speciality)"
                    class="specialty-action-btn specialty-deactivate-btn"
                    no-caps
                  />
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Especialidades Inactivas -->
        <div class="specialty-section-header" style="margin-top: 40px;">
          <div class="specialty-section-title-wrapper">
            <h3 class="specialty-section-title">
              <i class="fa-solid fa-pause-circle" style="color: #ff9800; margin-right: 8px;"></i>
              Especialidades Inactivas
            </h3>
            <div class="specialty-title-underline"></div>
          </div>
          <div class="specialty-results-count">
            <span class="specialty-count-badge">
              <i class="fa-solid fa-list-check"></i>
              {{ filteredInactiveEspecialidades.length }} especialidad{{ filteredInactiveEspecialidades.length !== 1 ? 'es' : '' }}
            </span>
          </div>
        </div>

        <div class="specialty-cards-container">
          <div v-if="filteredInactiveEspecialidades.length === 0" class="specialty-no-data-container">
            <div class="specialty-no-data-illustration">
              <i class="fa-solid fa-tooth specialty-no-data-icon"></i>
              <div class="specialty-no-data-circle specialty-no-data-circle-1"></div>
              <div class="specialty-no-data-circle specialty-no-data-circle-2"></div>
            </div>
            <p class="specialty-no-data-text">No hay especialidades inactivas</p>
            <p class="specialty-no-data-subtext">Las especialidades inactivas aparecerán aquí</p>
          </div>
          
          <transition-group v-else name="specialty-card-fade" tag="div" class="specialty-cards-grid">
            <div 
              v-for="speciality in filteredInactiveEspecialidades" 
              :key="speciality.id"
              class="specialty-speciality-card specialty-inactive-card"
            >
              <div class="specialty-card-image-container">
                <q-img 
                  :src="speciality.image || 'https://i.pinimg.com/originals/ea/d5/5a/ead55a380087931b94a3968f54d8fbda.jpg'"
                  :ratio="4/3"
                  spinner-color="primary"
                  @error="handleImageError"
                  class="specialty-card-image"
                  style="opacity: 0.6;"
                >
                  <div class="specialty-image-overlay"></div>
                </q-img>
                <div class="specialty-card-badge">
                  <i class="fa-solid fa-star"></i>
                </div>
                <div class="specialty-card-status-badge inactive">
                  <i class="fa-solid fa-pause"></i>
                  Inactiva
                </div>
              </div>
              
              <div class="specialty-card-content">
                <h4 class="specialty-card-title" style="opacity: 0.7;">{{ speciality.nombre }}</h4>
                <p class="specialty-card-description" style="opacity: 0.7;">{{ truncateText(speciality.descripcion, 80) }}</p>
                
                <div class="specialty-card-actions">
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-eye"
                    label="Ver"
                    @click="viewSpeciality(speciality)"
                    class="specialty-action-btn specialty-view-btn"
                    no-caps
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-edit"
                    label="Editar"
                    color="primary"
                    @click="editSpeciality(speciality)"
                    class="specialty-action-btn specialty-edit-btn"
                    no-caps
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-play-circle"
                    label="Activar"
                    color="positive"
                    @click="toggleSpecialityStatus(speciality)"
                    class="specialty-action-btn specialty-activate-btn"
                    no-caps
                  />
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailSpecialityDialog
      v-model="showDetailDialog"
      :speciality-data="selectedSpeciality"
      @edit-speciality="editSpeciality"
    />

    <EditSpecialityDialog
      v-model="showEditDialog"
      :speciality-data="selectedSpeciality"
      @speciality-updated="handleSpecialityUpdate"
    />

    <NewSpecialityDialog
      v-model="showNewDialog"
      @speciality-created="handleSpecialityCreate"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useEspecialidadStore } from 'src/stores/especialidadStore'
import DetailSpecialityDialog from './DetailSpecialityDialog.vue'
import EditSpecialityDialog from './EditSpecialityDialog.vue'
import NewSpecialityDialog from './NewSpecialityDialog.vue'

export default {
  name: 'SpecialityPage',
  components: {
    DetailSpecialityDialog,
    EditSpecialityDialog,
    NewSpecialityDialog
  },
  setup() {
    const $q = useQuasar()
    const store = useEspecialidadStore()

    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const selectedSpeciality = ref(null)

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
    }

    const handleImageError = (event) => {
      event.target.src = 'https://cdn.quasar.dev/img/parallax2.jpg'
    }

    // Filtrar especialidades activas e inactivas según la búsqueda
    const filteredActiveEspecialidades = computed(() => {
      const activas = store.especialidadesActivas
      if (!store.search.trim()) return activas
      
      // Aplicar filtro de búsqueda
      const fuse = store.fuse
      if (fuse) {
        const results = fuse.search(store.search.trim())
        return results.map(r => r.item).filter(e => e.estado === 'activo')
      }
      return activas.filter(e => 
        e.nombre.toLowerCase().includes(store.search.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(store.search.toLowerCase())
      )
    })

    const filteredInactiveEspecialidades = computed(() => {
      const inactivas = store.especialidadesInactivas
      if (!store.search.trim()) return inactivas
      
      // Aplicar filtro de búsqueda simple para inactivas
      return inactivas.filter(e => 
        e.nombre.toLowerCase().includes(store.search.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(store.search.toLowerCase())
      )
    })

    const viewSpeciality = (speciality) => {
      selectedSpeciality.value = { ...speciality }
      showDetailDialog.value = true
    }

    const editSpeciality = (speciality) => {
      selectedSpeciality.value = { ...speciality }
      showEditDialog.value = true
      showDetailDialog.value = false
    }

    const openNewSpecialityDialog = () => {
      showNewDialog.value = true
    }

    // Función para activar/desactivar especialidad
    const toggleSpecialityStatus = async (speciality) => {
      try {
        const nuevoEstado = speciality.estado === 'activo' ? 'inactivo' : 'activo'
        await store.toggleEstado(speciality.id, nuevoEstado)
        
        $q.notify({
          type: 'positive',
          message: `Especialidad ${nuevoEstado === 'activo' ? 'activada' : 'desactivada'} exitosamente`,
          position: 'top-right',
          timeout: 3000
        })
      } catch (error) {
        console.error('Error al cambiar estado de la especialidad:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al cambiar el estado de la especialidad',
          position: 'top-right',
          timeout: 5000
        })
      }
    }

    const handleSpecialityUpdate = async (updatedSpeciality) => {
      await store.actualizarEspecialidad(updatedSpeciality)
      showEditDialog.value = false
    }

    const handleSpecialityCreate = async (newSpeciality) => {
      await store.crearEspecialidad(newSpeciality)
      showNewDialog.value = false
    }

    onMounted(() => {
      store.cargarEspecialidades()
    })

    return {
      store,
      selectedSpeciality,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      filteredActiveEspecialidades,
      filteredInactiveEspecialidades,
      truncateText,
      handleImageError,
      viewSpeciality,
      editSpeciality,
      openNewSpecialityDialog,
      toggleSpecialityStatus,
      handleSpecialityUpdate,
      handleSpecialityCreate
    }
  }
}
</script>