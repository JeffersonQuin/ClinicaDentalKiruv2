<template>
  <div class="reserve-page-container">
    <!-- Header Section -->
    <div class="reserve-page-header">
      <div class="reserve-header-background">
        <div class="reserve-header-shape reserve-header-shape-1"></div>
        <div class="reserve-header-shape reserve-header-shape-2"></div>
      </div>
      <div class="reserve-header-content">
        <div class="reserve-title-section">
          <div class="reserve-icon-wrapper">
            <i class="fa-solid fa-calendar-check reserve-header-icon"></i>
          </div>
          <div>
            <h1 class="reserve-page-title">Gestión de Reservas</h1>
            <p class="reserve-page-subtitle">Administra las reservas de pacientes y sus dependientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="reserve-stats-section">
      <div class="reserve-stat-card">
        <div class="reserve-stat-icon-container total">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="reserve-stat-content">
          <div class="reserve-stat-value">{{ filteredRows.length }}</div>
          <div class="reserve-stat-label">Total de Reservas</div>
        </div>
        <div class="reserve-stat-glow total"></div>
      </div>
      <div class="reserve-stat-card">
        <div class="reserve-stat-icon-container dependientes">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="reserve-stat-content">
          <div class="reserve-stat-value">{{ reservasConDependientes }}</div>
          <div class="reserve-stat-label">Con Dependientes</div>
        </div>
        <div class="reserve-stat-glow dependientes"></div>
      </div>
      <div class="reserve-stat-card">
        <div class="reserve-stat-icon-container today">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="reserve-stat-content">
          <div class="reserve-stat-value">{{ reservasHoy }}</div>
          <div class="reserve-stat-label">Reservas Hoy</div>
        </div>
        <div class="reserve-stat-glow today"></div>
      </div>
      <div class="reserve-stat-card">
        <div class="reserve-stat-icon-container pending">
          <i class="fa-solid fa-hourglass-half"></i>
        </div>
        <div class="reserve-stat-content">
          <div class="reserve-stat-value">{{ reservasPendientes }}</div>
          <div class="reserve-stat-label">Pendientes</div>
        </div>
        <div class="reserve-stat-glow pending"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="reserve-search-section">
      <div class="reserve-search-container">
        <q-input
          v-model="search"
          class="reserve-search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, email, dependiente o fecha..."
          @input="filterRows"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search reserve-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="search" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="reserve-table-container">
      <div class="reserve-table-header">
        <div class="reserve-table-title-section">
          <h3 class="reserve-table-title">Lista de Reservas</h3>
          <div class="reserve-table-underline"></div>
        </div>
        <div class="reserve-results-count">
          <span class="reserve-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredRows.length }} reserva{{ filteredRows.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="reserve-data-table"
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="reserve-no-data-container">
            <div class="reserve-no-data-illustration">
              <i class="fa-solid fa-calendar-xmark reserve-no-data-icon"></i>
              <div class="reserve-no-data-circle reserve-no-data-circle-1"></div>
              <div class="reserve-no-data-circle reserve-no-data-circle-2"></div>
            </div>
            <p class="reserve-no-data-text">No se encontraron reservas</p>
            <p class="reserve-no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-fechaReserva="props">
          <q-td :props="props">
            <div class="reserve-date-info">
              <div class="reserve-date-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="reserve-date-content">
                <div class="reserve-date-label">Fecha</div>
                <div class="reserve-date-value">{{ formatDate(props.row.fechaReserva) }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-horaReserva="props">
          <q-td :props="props">
            <div class="reserve-time-info">
              <div class="reserve-time-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="reserve-time-content">
                <div class="reserve-time-label">Hora</div>
                <div class="reserve-time-value">{{ props.row.horaReserva }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-nombreCompleto="props">
          <q-td :props="props">
            <div class="reserve-patient-info">
              <div class="reserve-patient-main">
                <div class="reserve-patient-avatar">
                  {{ getPatientInitials(props.row.nombreCompleto) }}
                </div>
                <div class="reserve-patient-content">
                  <div class="reserve-patient-name">{{ props.row.nombreCompleto }}</div>
                  <div class="reserve-patient-email">
                    <i class="fa-solid fa-envelope"></i>
                    {{ props.row.gmail }}
                  </div>
                </div>
              </div>
              <div v-if="props.row.dependiente" class="reserve-dependiente-info">
                <div class="reserve-dependiente-badge">
                  <i class="fa-solid fa-user-friends"></i>
                  Dependiente: {{ props.row.dependiente.nombreCompleto }}
                </div>
                <div class="reserve-dependiente-relation">
                  <i class="fa-solid fa-heart"></i>
                  {{ props.row.dependiente.parentesco }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-servicio="props">
          <q-td :props="props">
            <div class="reserve-service-badge">
              <i class="fa-solid fa-stethoscope"></i>
              {{ props.row.servicio }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            <div class="reserve-branch-info">
              <div class="reserve-branch-icon">
                <i class="fa-solid fa-map-marker-alt"></i>
              </div>
              <div class="reserve-branch-content">
                <div class="reserve-branch-label">Sucursal</div>
                <div class="reserve-branch-value">{{ props.row.sucursal }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="reserve-action-buttons">
              <q-btn
                class="reserve-action-btn reserve-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewReserve(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                class="reserve-action-btn reserve-confirm-btn"
                flat
                dense
                round
                icon="fa-solid fa-check"
                size="sm"
                @click="confirmReserve(props.row)"
                color="positive"
              >
                <q-tooltip>Confirmar reserva</q-tooltip>
              </q-btn>
              <q-btn
                class="reserve-action-btn reserve-reject-btn"
                flat
                dense
                round
                icon="fa-solid fa-ban"
                size="sm"
                @click="confirmRejectReserve(props.row)"
                color="negative"
              >
                <q-tooltip>Rechazar reserva</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailReserveDialog
      v-model="showDetailDialog"
      :reserveData="selectedReserve"
    />

    <!-- Reject Confirmation Dialog -->
    <q-dialog v-model="showRejectDialog" persistent>
      <q-card class="reserve-confirm-dialog">
        <q-card-section class="reserve-dialog-header">
          <div class="reserve-dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle reserve-dialog-icon"></i>
          </div>
          <h3 class="reserve-dialog-title">Confirmar Rechazo</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="reserve-dialog-text">
            ¿Está seguro que desea rechazar la reserva de <strong>{{ selectedReserve?.nombreCompleto }}</strong>?
          </p>
          <p class="reserve-dialog-subtext" v-if="selectedReserve?.dependiente">
            <i class="fa-solid fa-user-friends"></i>
            También se rechazará la reserva del dependiente: <strong>{{ selectedReserve.dependiente.nombreCompleto }}</strong>
          </p>
          <div class="reserve-dialog-details">
            <div class="reserve-detail-item">
              <i class="fa-solid fa-calendar-day"></i>
              <span>Fecha: {{ formatDate(selectedReserve?.fechaReserva) }}</span>
            </div>
            <div class="reserve-detail-item">
              <i class="fa-solid fa-clock"></i>
              <span>Hora: {{ selectedReserve?.horaReserva }}</span>
            </div>
            <div class="reserve-detail-item">
              <i class="fa-solid fa-stethoscope"></i>
              <span>Servicio: {{ selectedReserve?.servicio }}</span>
            </div>
          </div>
          <p class="reserve-dialog-warning">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Esta acción no se puede deshacer.
          </p>
        </q-card-section>

        <q-card-actions class="reserve-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="reserve-dialog-btn"
          />
          <q-btn 
            unelevated
            label="Rechazar Reserva" 
            color="negative" 
            @click="rejectReserve"
            v-close-popup 
            no-caps
            class="reserve-dialog-btn reserve-dialog-reject-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReserveStore } from 'src/stores/reservaStore'
import Fuse from 'fuse.js'
import DetailReserveDialog from './DetailReserveDialog.vue'

const columns = [
  {
    name: 'fechaReserva',
    label: 'Fecha Reserva',
    align: 'center',
    field: 'fechaReserva',
    sortable: true,
    style: 'width: 140px'
  },
  {
    name: 'horaReserva',
    label: 'Hora Reserva',
    align: 'center',
    field: 'horaReserva',
    sortable: true,
    style: 'width: 120px'
  },
  {
    name: 'nombreCompleto',
    label: 'Paciente',
    align: 'left',
    field: 'nombreCompleto',
    sortable: true,
    style: 'min-width: 250px'
  },
  {
    name: 'servicio',
    label: 'Servicio',
    align: 'center',
    field: 'servicio',
    sortable: true,
    style: 'width: 160px'
  },
  {
    name: 'sucursal',
    label: 'Sucursal',
    align: 'center',
    field: 'sucursal',
    sortable: true,
    style: 'width: 150px'
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
    sortable: false,
    style: 'width: 180px'
  }
]

const FUSE_OPTIONS = {
  keys: [
    'nombreCompleto', 
    'gmail', 
    'fechaReserva', 
    'horaReserva',
    'servicio',
    'sucursal',
    'dependiente.nombreCompleto',
    'dependiente.parentesco'
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'ReserveTable',
  components: {
    DetailReserveDialog,
  },
  setup() {
    const $q = useQuasar()
    const reservaStore = useReserveStore()

    const search = ref('')
    const selectedReserve = ref(null)
    const showDetailDialog = ref(false)
    const showRejectDialog = ref(false)
    let fuse = null

    const allReservas = computed(() => reservaStore.reservas || [])
    const filteredRows = ref([])

    // Estadísticas mejoradas
    const reservasConDependientes = computed(() => {
      return allReservas.value.filter(row => row.dependiente).length
    })

    const reservasHoy = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return allReservas.value.filter(row => {
        const reservaDate = formatDateForFilter(row.fechaReserva)
        return reservaDate === today
      }).length
    })

    const reservasPendientes = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return allReservas.value.filter(row => {
        const reservaDate = formatDateForFilter(row.fechaReserva)
        return reservaDate >= today
      }).length
    })

    const loadReservas = () => {
      filteredRows.value = allReservas.value
      initializeFuse()
    }

    const initializeFuse = () => {
      fuse = new Fuse(allReservas.value, FUSE_OPTIONS)
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = allReservas.value
        return
      }
      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const rejectReserve = () => {
      if (!selectedReserve.value) return
      
      reservaStore.eliminarReserva(selectedReserve.value.id)
      
      $q.notify({
        type: 'positive',
        message: 'Reserva eliminada exitosamente',
        position: 'top',
        icon: 'fa-solid fa-check-circle'
      })
    }

    const confirmReserve = (reserve) => {
      $q.notify({
        type: 'info',
        message: `Reserva de ${reserve.nombreCompleto} confirmada`,
        position: 'top',
        icon: 'fa-solid fa-calendar-check'
      })
    }

    const viewReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showDetailDialog.value = true
    }

    const confirmRejectReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showRejectDialog.value = true
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-')
          return `${day}/${month}/${year}`
        }
        return dateString
      } catch {
        return 'Fecha inválida'
      }
    }

    const formatDateForFilter = (dateString) => {
      if (!dateString) return ''
      try {
        if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        return dateString
      } catch {
        return ''
      }
    }

    const getPatientInitials = (name) => {
      if (!name) return '?'
      const words = name.trim().split(' ')
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
    }

    onMounted(() => {
      loadReservas()
      reservaStore.cargarDatos()
      console.log('Reservas cargadas:', reservaStore.reservas)
    })

    watch(search, () => {
      filterRows()
    })

    watch(allReservas, () => {
      loadReservas()
    })

    return {
      search,
      columns,
      filteredRows,
      selectedReserve,
      showDetailDialog,
      showRejectDialog,
      reservasConDependientes,
      reservasHoy,
      reservasPendientes,
      filterRows,
      rejectReserve,
      confirmReserve,
      viewReserve,
      confirmRejectReserve,
      formatDate,
      getPatientInitials
    }
  }
}
</script>

