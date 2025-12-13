<template>
  <div class="branch-page-container">
    <!-- Header Section -->
    <div class="branch-page-header">
      <div class="branch-header-background">
        <div class="branch-header-shape branch-header-shape-1"></div>
        <div class="branch-header-shape branch-header-shape-2"></div>
      </div>
      <div class="branch-header-content">
        <div class="branch-title-section">
          <div class="branch-icon-wrapper">
            <i class="fa-solid fa-building branch-header-icon"></i>
          </div>
          <div>
            <h1 class="branch-page-title">Gestión de Sucursales</h1>
            <p class="branch-page-subtitle">Administra las ubicaciones de tu empresa</p>
          </div>
        </div>
        <q-btn
          class="branch-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Sucursal"
          @click="sucursalStore.openNewDialog()"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="branch-stats-section">
      <div class="branch-stat-card">
        <div class="branch-stat-icon-container total">
          <i class="fa-solid fa-store"></i>
        </div>
        <div class="branch-stat-content">
          <div class="branch-stat-value">{{ sucursalStore.totalSucursales }}</div>
          <div class="branch-stat-label">Total Sucursales</div>
        </div>
        <div class="branch-stat-glow total"></div>
      </div>

      <div class="branch-stat-card">
        <div class="branch-stat-icon-container cities">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <div class="branch-stat-content">
          <div class="branch-stat-value">{{ sucursalStore.ciudadesUnicas.length }}</div>
          <div class="branch-stat-label">Ciudades</div>
        </div>
        <div class="branch-stat-glow cities"></div>
      </div>

      <div class="branch-stat-card">
        <div class="branch-stat-icon-container active">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="branch-stat-content">
          <div class="branch-stat-value">{{ activeBranchesCount }}</div>
          <div class="branch-stat-label">Sucursales Activas</div>
        </div>
        <div class="branch-stat-glow active"></div>
      </div>

      <div class="branch-stat-card">
        <div class="branch-stat-icon-container inactive">
          <i class="fa-solid fa-pause-circle"></i>
        </div>
        <div class="branch-stat-content">
          <div class="branch-stat-value">{{ inactiveBranchesCount }}</div>
          <div class="branch-stat-label">Sucursales Inactivas</div>
        </div>
        <div class="branch-stat-glow inactive"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="branch-search-section">
      <div class="branch-search-container">
        <q-input
          v-model="sucursalStore.search"
          class="branch-search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, ubicación o dirección..."
          @update:model-value="sucursalStore.filterBranches"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search branch-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="sucursalStore.search" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Sucursales Activas -->
    <div class="branch-content-section">
      <div class="branch-section-header">
        <div class="branch-section-title-wrapper">
          <h3 class="branch-section-title">
            <i class="fa-solid fa-check-circle" style="color: #4caf50; margin-right: 8px;"></i>
            Sucursales Activas
          </h3>
          <div class="branch-title-underline"></div>
        </div>
        <div class="branch-results-count">
          <span class="branch-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredActiveBranches.length }} sucursal{{ filteredActiveBranches.length !== 1 ? 'es' : '' }}
          </span>
        </div>
      </div>

      <div class="branch-cards-container">
        <div v-if="filteredActiveBranches.length === 0" class="branch-no-data-container">
          <div class="branch-no-data-illustration">
            <i class="fa-solid fa-store-slash branch-no-data-icon"></i>
            <div class="branch-no-data-circle branch-no-data-circle-1"></div>
            <div class="branch-no-data-circle branch-no-data-circle-2"></div>
          </div>
          <p class="branch-no-data-text">No hay sucursales activas</p>
          <p class="branch-no-data-subtext">Las sucursales activas aparecerán aquí</p>
        </div>

        <transition-group v-else name="branch-card-fade" tag="div" class="branch-cards-grid">
          <q-card
            v-for="branch in filteredActiveBranches"
            :key="branch.id"
            class="branch-speciality-card"
          >
            <!-- Image Section -->
            <div class="branch-card-image-container">
              <img
                v-if="branch.imagen"
                :src="`http://localhost:5050${branch.imagen}`"
                :alt="branch.nombre"
                class="branch-card-image"
                @error="sucursalStore.handleImageError"
              />
              <div v-else class="branch-card-image-placeholder">
                <i class="fa-solid fa-building"></i>
              </div>
              <div class="branch-image-overlay"></div>
              
              <!-- Location Badge -->
              <div class="branch-card-location-badge">
                <i class="fa-solid fa-location-dot"></i>
                {{ branch.ubicacion }}
              </div>

              <!-- Status Badge -->
              <div class="branch-card-status-badge active">
                <i class="fa-solid fa-check"></i>
                Activa
              </div>
            </div>

            <!-- Content Section -->
            <q-card-section class="branch-card-content">
              <h4 class="branch-card-title">{{ branch.nombre }}</h4>
              
              <div class="branch-info-grid">
                <div class="branch-info-item">
                  <div class="branch-info-icon">
                    <i class="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <div class="branch-info-content">
                    <div class="branch-info-label">Dirección</div>
                    <div class="branch-info-value">{{ branch.direccion }}</div>
                  </div>
                </div>

                <div class="branch-info-item">
                  <div class="branch-info-icon">
                    <i class="fa-solid fa-circle-info"></i>
                  </div>
                  <div class="branch-info-content">
                    <div class="branch-info-label">Descripción</div>
                    <div class="branch-info-value">{{ truncateText(branch.descripcion, 60) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <!-- Actions Section -->
            <q-separator />
            <q-card-actions class="branch-card-actions">
              <q-btn
                flat
                dense
                icon="fa-solid fa-eye"
                label="Ver"
                @click="sucursalStore.openDetailDialog(branch)"
                class="branch-action-btn branch-view-btn"
                no-caps
                size="sm"
              />
              <q-btn
                flat
                dense
                icon="fa-solid fa-edit"
                label="Editar"
                @click="sucursalStore.openEditDialog(branch)"
                class="branch-action-btn branch-edit-btn"
                no-caps
                size="sm"
              />
              <q-btn
                flat
                dense
                icon="fa-solid fa-pause-circle"
                label="Desactivar"
                @click="toggleBranchStatus(branch)"
                class="branch-action-btn branch-deactivate-btn"
                no-caps
                size="sm"
                color="warning"
              />
            </q-card-actions>
          </q-card>
        </transition-group>
      </div>
    </div>

    <!-- Sucursales Inactivas -->
    <div class="branch-content-section" style="margin-top: 40px;">
      <div class="branch-section-header">
        <div class="branch-section-title-wrapper">
          <h3 class="branch-section-title">
            <i class="fa-solid fa-pause-circle" style="color: #ff9800; margin-right: 8px;"></i>
            Sucursales Inactivas
          </h3>
          <div class="branch-title-underline"></div>
        </div>
        <div class="branch-results-count">
          <span class="branch-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredInactiveBranches.length }} sucursal{{ filteredInactiveBranches.length !== 1 ? 'es' : '' }}
          </span>
        </div>
      </div>

      <div class="branch-cards-container">
        <div v-if="filteredInactiveBranches.length === 0" class="branch-no-data-container">
          <div class="branch-no-data-illustration">
            <i class="fa-solid fa-store-slash branch-no-data-icon"></i>
            <div class="branch-no-data-circle branch-no-data-circle-1"></div>
            <div class="branch-no-data-circle branch-no-data-circle-2"></div>
          </div>
          <p class="branch-no-data-text">No hay sucursales inactivas</p>
          <p class="branch-no-data-subtext">Las sucursales inactivas aparecerán aquí</p>
        </div>

        <transition-group v-else name="branch-card-fade" tag="div" class="branch-cards-grid">
          <q-card
            v-for="branch in filteredInactiveBranches"
            :key="branch.id"
            class="branch-speciality-card branch-inactive-card"
          >
            <!-- Image Section -->
            <div class="branch-card-image-container">
              <img
                v-if="branch.imagen"
                :src="`http://localhost:5050${branch.imagen}`"
                :alt="branch.nombre"
                class="branch-card-image"
                @error="sucursalStore.handleImageError"
                style="opacity: 0.6;"
              />
              <div v-else class="branch-card-image-placeholder">
                <i class="fa-solid fa-building"></i>
              </div>
              <div class="branch-image-overlay"></div>
              
              <!-- Location Badge -->
              <div class="branch-card-location-badge">
                <i class="fa-solid fa-location-dot"></i>
                {{ branch.ubicacion }}
              </div>

              <!-- Status Badge -->
              <div class="branch-card-status-badge inactive">
                <i class="fa-solid fa-pause"></i>
                Inactiva
              </div>
            </div>

            <!-- Content Section -->
            <q-card-section class="branch-card-content">
              <h4 class="branch-card-title">{{ branch.nombre }}</h4>
              
              <div class="branch-info-grid">
                <div class="branch-info-item">
                  <div class="branch-info-icon">
                    <i class="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <div class="branch-info-content">
                    <div class="branch-info-label">Dirección</div>
                    <div class="branch-info-value">{{ branch.direccion }}</div>
                  </div>
                </div>

                <div class="branch-info-item">
                  <div class="branch-info-icon">
                    <i class="fa-solid fa-circle-info"></i>
                  </div>
                  <div class="branch-info-content">
                    <div class="branch-info-label">Descripción</div>
                    <div class="branch-info-value">{{ truncateText(branch.descripcion, 60) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <!-- Actions Section -->
            <q-separator />
            <q-card-actions class="branch-card-actions">
              <q-btn
                flat
                dense
                icon="fa-solid fa-eye"
                label="Ver"
                @click="sucursalStore.openDetailDialog(branch)"
                class="branch-action-btn branch-view-btn"
                no-caps
                size="sm"
              />
              <q-btn
                flat
                dense
                icon="fa-solid fa-edit"
                label="Editar"
                @click="sucursalStore.openEditDialog(branch)"
                class="branch-action-btn branch-edit-btn"
                no-caps
                size="sm"
              />
              <q-btn
                flat
                dense
                icon="fa-solid fa-play-circle"
                label="Activar"
                @click="toggleBranchStatus(branch)"
                class="branch-action-btn branch-activate-btn"
                no-caps
                size="sm"
                color="positive"
              />
            </q-card-actions>
          </q-card>
        </transition-group>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailBranchDialog
      v-model="sucursalStore.showDetailDialog"
      :branch-data="sucursalStore.selectedBranch"
      @edit-branch="sucursalStore.openEditDialog"
      @close="sucursalStore.closeDetailDialog"
    />

    <EditBranchDialog
      v-model="sucursalStore.showEditDialog"
      :branch-data="sucursalStore.selectedBranch"
      @branch-updated="async ({ id, data, file }) => {
        const updated = await sucursalStore.actualizar(id, data, file)
        sucursalStore.closeEditDialog()          // cerrar el diálogo
        sucursalStore.setSelectedBranch(updated) // opcional, mantener la sucursal seleccionada
      }"
      @close="sucursalStore.closeEditDialog"
    />


    <NewBranchDialog
      v-model="sucursalStore.showNewDialog"
      @branch-created="({ data, file }) => sucursalStore.crear(data, file)"
      @close="sucursalStore.closeNewDialog"
    />

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useSucursalStore } from 'src/stores/sucursalStore'
import DetailBranchDialog from './DetailBranchDialog.vue'
import EditBranchDialog from './EditBranchDialog.vue'
import NewBranchDialog from './NewBranchDialog.vue'

// Inicializamos el store y Quasar
const $q = useQuasar()
const sucursalStore = useSucursalStore()

// Contadores activos e inactivos usando computed
const activeBranchesCount = computed(() => sucursalStore.sucursalesActivas.length)
const inactiveBranchesCount = computed(() => sucursalStore.sucursalesInactivas.length)

// Filtrar sucursales activas e inactivas según la búsqueda
const filteredActiveBranches = computed(() => {
  const activas = sucursalStore.sucursalesActivas
  if (!sucursalStore.search.trim()) return activas
  
  // Aplicar filtro de búsqueda
  const fuse = sucursalStore.fuse
  if (fuse) {
    const results = fuse.search(sucursalStore.search.trim())
    return results.map(r => r.item).filter(b => b.activo)
  }
  return activas.filter(b => 
    b.nombre.toLowerCase().includes(sucursalStore.search.toLowerCase()) ||
    b.ubicacion.toLowerCase().includes(sucursalStore.search.toLowerCase()) ||
    b.direccion.toLowerCase().includes(sucursalStore.search.toLowerCase())
  )
})

const filteredInactiveBranches = computed(() => {
  const inactivas = sucursalStore.sucursalesInactivas
  if (!sucursalStore.search.trim()) return inactivas
  
  // Aplicar filtro de búsqueda
  const fuse = sucursalStore.fuse
  if (fuse) {
    const results = fuse.search(sucursalStore.search.trim())
    return results.map(r => r.item).filter(b => !b.activo)
  }
  return inactivas.filter(b => 
    b.nombre.toLowerCase().includes(sucursalStore.search.toLowerCase()) ||
    b.ubicacion.toLowerCase().includes(sucursalStore.search.toLowerCase()) ||
    b.direccion.toLowerCase().includes(sucursalStore.search.toLowerCase())
  )
})

// Función de truncar texto (para las cards)
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}

// Función para activar/desactivar sucursal
const toggleBranchStatus = async (branch) => {
  try {
    const nuevoEstado = !branch.activo
    await sucursalStore.toggleActivo(branch.id, nuevoEstado)
    
    $q.notify({
      type: 'positive',
      message: `Sucursal ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente`,
      position: 'top-right',
      timeout: 3000
    })
  } catch (error) {
    console.error('Error al cambiar estado de la sucursal:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el estado de la sucursal',
      position: 'top-right',
      timeout: 5000
    })
  }
}

// Cargar las sucursales al montar la página
onMounted(() => {
  sucursalStore.listar()
})
</script>