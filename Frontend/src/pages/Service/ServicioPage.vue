<template>
  <div class="service-page-container">
    <!-- Header Section -->
    <div class="service-page-header">
      <div class="service-header-background">
        <div class="service-header-shape service-header-shape-1"></div>
        <div class="service-header-shape service-header-shape-2"></div>
      </div>
      <div class="service-header-content">
        <div class="service-title-section">
          <div class="service-icon-wrapper">
            <i class="fa-solid fa-tooth service-header-icon"></i>
          </div>
          <div>
            <h1 class="service-page-title">Gestión de Servicios</h1>
            <p class="service-page-subtitle">Administra los servicios de tu clínica dental</p>
          </div>
        </div>
        <q-btn
          class="service-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nuevo Servicio"
          @click="servicioStore.openNewDialog()"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="service-stats-section">
      <div class="service-stat-card">
        <div class="service-stat-icon-container active">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="service-stat-content">
          <div class="service-stat-value">{{ servicioStore.serviciosActivos.length }}</div>
          <div class="service-stat-label">Servicios Activos</div>
        </div>
        <div class="service-stat-glow active"></div>
      </div>
      
      <div class="service-stat-card">
        <div class="service-stat-icon-container inactive">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <div class="service-stat-content">
          <div class="service-stat-value">{{ servicioStore.serviciosInactivos.length }}</div>
          <div class="service-stat-label">Servicios Inactivos</div>
        </div>
        <div class="service-stat-glow inactive"></div>
      </div>
      
      <div class="service-stat-card">
        <div class="service-stat-icon-container admin">
          <i class="fa-solid fa-tags"></i>
        </div>
        <div class="service-stat-content">
          <div class="service-stat-value">{{ servicioStore.categoriasUnicas.length }}</div>
          <div class="service-stat-label">Categorías</div>
        </div>
        <div class="service-stat-glow admin"></div>
      </div>
      
      <div class="service-stat-card">
        <div class="service-stat-icon-container total">
          <i class="fa-solid fa-tooth"></i>
        </div>
        <div class="service-stat-content">
          <div class="service-stat-value">{{ servicioStore.servicios.length }}</div>
          <div class="service-stat-label">Total de Servicios</div>
        </div>
        <div class="service-stat-glow total"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="service-search-section">
      <div class="service-search-container">
        <q-input
          v-model="servicioStore.search"
          class="service-search-input"
          outlined
          type="search"
          placeholder="Buscar por título, descripción o categoría..."
          @update:model-value="servicioStore.setSearch"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search service-search-icon"></i>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Servicios Activos -->
    <div class="service-table-container">
      <div class="service-section-header">
        <div class="service-section-title-wrapper">
          <h3 class="service-section-title">
            <i class="fa-solid fa-check-circle" style="color: #4caf50; margin-right: 8px;"></i>
            Servicios Activos
          </h3>
          <div class="service-title-underline"></div>
        </div>
        <div class="service-results-count">
          <span class="service-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredActiveServicios.length }} servicio{{ filteredActiveServicios.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="service-data-table"
        flat
        :rows="filteredActiveServicios"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="service-no-data-container">
            <div class="service-no-data-illustration">
              <i class="fa-solid fa-tooth-slash service-no-data-icon"></i>
            </div>
            <p class="service-no-data-text">No hay servicios activos</p>
            <p class="service-no-data-subtext">Los servicios activos aparecerán aquí</p>
          </div>
        </template>

        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <div class="service-image-container">
              <q-img
                v-if="props.row.imagen"
                :src="servicioStore.getImagePath(props.row.imagen)"
                :alt="props.row.titulo"
                class="service-table-image"
                @error="servicioStore.handleImageError"
              />
              <div v-else class="service-no-image-placeholder">
                <i class="fa-solid fa-image"></i>
                <span>Sin imagen</span>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :class="['service-state-badge', servicioStore.getStateClass(props.row.estado)]"
              :label="servicioStore.formatState(props.row.estado)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="service-actions-container">
              <q-btn
                flat
                dense
                round
                icon="fa-solid fa-eye"
                @click="servicioStore.openDetailDialog(props.row)"
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
                @click="servicioStore.openEditDialog(props.row)"
                color="primary"
                size="sm"
              >
                <q-tooltip>Editar servicio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="fa-solid fa-pause-circle"
                @click="toggleServicioStatus(props.row)"
                color="warning"
                size="sm"
              >
                <q-tooltip>Desactivar servicio</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Servicios Inactivos -->
    <div class="service-table-container" style="margin-top: 40px;">
      <div class="service-section-header">
        <div class="service-section-title-wrapper">
          <h3 class="service-section-title">
            <i class="fa-solid fa-pause-circle" style="color: #ff9800; margin-right: 8px;"></i>
            Servicios Inactivos
          </h3>
          <div class="service-title-underline"></div>
        </div>
        <div class="service-results-count">
          <span class="service-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredInactiveServicios.length }} servicio{{ filteredInactiveServicios.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="service-data-table service-inactive-table"
        flat
        :rows="filteredInactiveServicios"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="service-no-data-container">
            <div class="service-no-data-illustration">
              <i class="fa-solid fa-tooth-slash service-no-data-icon"></i>
            </div>
            <p class="service-no-data-text">No hay servicios inactivos</p>
            <p class="service-no-data-subtext">Los servicios inactivos aparecerán aquí</p>
          </div>
        </template>

        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <div class="service-image-container" style="opacity: 0.6;">
              <q-img
                v-if="props.row.imagen"
                :src="servicioStore.getImagePath(props.row.imagen)"
                :alt="props.row.titulo"
                class="service-table-image"
                @error="servicioStore.handleImageError"
              />
              <div v-else class="service-no-image-placeholder">
                <i class="fa-solid fa-image"></i>
                <span>Sin imagen</span>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-titulo="props">
          <q-td :props="props" style="opacity: 0.7;">
            {{ props.row.titulo }}
          </q-td>
        </template>

        <template v-slot:body-cell-categoria="props">
          <q-td :props="props" style="opacity: 0.7;">
            {{ props.row.categoria }}
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :class="['service-state-badge', servicioStore.getStateClass(props.row.estado)]"
              :label="servicioStore.formatState(props.row.estado)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="service-actions-container">
              <q-btn
                flat
                dense
                round
                icon="fa-solid fa-eye"
                @click="servicioStore.openDetailDialog(props.row)"
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
                @click="servicioStore.openEditDialog(props.row)"
                color="primary"
                size="sm"
              >
                <q-tooltip>Editar servicio</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="fa-solid fa-play-circle"
                @click="toggleServicioStatus(props.row)"
                color="positive"
                size="sm"
              >
                <q-tooltip>Activar servicio</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailServicioDialog
      v-model="servicioStore.showDetailDialog"
      :servicio-data="servicioStore.selectedServicio"
      @edit-servicio="servicioStore.openEditDialog"
    />

    <EditServicioDialog
      v-model="servicioStore.showEditDialog"
      :servicio-data="servicioStore.selectedServicio"
      @servicio-updated="servicioStore.actualizar"
    />

    <NewServicioDialog
      v-model="servicioStore.showNewDialog"
    />

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useServicioStore } from 'src/stores/servicioStore'
import DetailServicioDialog from './DetailServicioDialog.vue'
import EditServicioDialog from './EditServicioDialog.vue'
import NewServicioDialog from './NewServicioDialog.vue'

const $q = useQuasar()
const servicioStore = useServicioStore()

const columns = [
  { name: 'imagen', label: 'Imagen', align: 'center', field: 'imagen', sortable: false, style: 'width: 120px' },
  { name: 'titulo', label: 'Título', align: 'left', field: 'titulo', sortable: true },
  { name: 'categoria', label: 'Categoría', align: 'center', field: 'categoria', sortable: true },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'actions', sortable: false, style: 'width: 150px' }
]

// Filtrar servicios activos e inactivos según la búsqueda
const filteredActiveServicios = computed(() => {
  const activos = servicioStore.serviciosActivos
  if (!servicioStore.search.trim()) return activos
  
  // Aplicar filtro de búsqueda
  const fuse = servicioStore.fuse
  if (fuse) {
    const results = fuse.search(servicioStore.search.trim())
    return results.map(r => r.item).filter(s => s.estado === 'activo')
  }
  return activos.filter(s => 
    s.titulo.toLowerCase().includes(servicioStore.search.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(servicioStore.search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(servicioStore.search.toLowerCase())
  )
})

const filteredInactiveServicios = computed(() => {
  const inactivos = servicioStore.serviciosInactivos
  if (!servicioStore.search.trim()) return inactivos
  
  // Aplicar filtro de búsqueda
  const fuse = servicioStore.fuse
  if (fuse) {
    const results = fuse.search(servicioStore.search.trim())
    return results.map(r => r.item).filter(s => s.estado === 'inactivo')
  }
  return inactivos.filter(s => 
    s.titulo.toLowerCase().includes(servicioStore.search.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(servicioStore.search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(servicioStore.search.toLowerCase())
  )
})

// Función para activar/desactivar servicio
const toggleServicioStatus = async (servicio) => {
  try {
    const nuevoEstado = servicio.estado === 'activo' ? 'inactivo' : 'activo'
    await servicioStore.toggleEstado(servicio.id, nuevoEstado)
    
    $q.notify({
      type: 'positive',
      message: `Servicio ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`,
      position: 'top-right',
      timeout: 3000
    })
  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el estado del servicio',
      position: 'top-right',
      timeout: 5000
    })
  }
}

onMounted(() => {
  servicioStore.listar()
})
</script>
