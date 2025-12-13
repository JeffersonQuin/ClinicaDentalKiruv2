<template>
  <div class="quotes-page-container">
    <!-- Header Section -->
    <div class="quotes-page-header">
      <div class="quotes-header-background">
        <div class="quotes-header-shape quotes-header-shape-1"></div>
        <div class="quotes-header-shape quotes-header-shape-2"></div>
      </div>
      <div class="quotes-header-content">
        <div class="quotes-title-section">
          <div class="quotes-icon-wrapper">
            <i class="fa-solid fa-calendar-check quotes-header-icon"></i>
          </div>
          <div>
            <h1 class="quotes-page-title">Gestión de Citas</h1>
            <p class="quotes-page-subtitle">Administra las citas de la Clínica Dental Kiru</p>
          </div>
        </div>
        <q-btn
          class="quotes-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Cita"
          @click="openNewQuoteDialog"
          unelevated
          no-caps
          size="md"
          :loading="citaStore.loading"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="quotes-stats-section">
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container total">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ citaStore.totalCitas }}</div>
          <div class="quotes-stat-label">Total Citas</div>
        </div>
        <div class="quotes-stat-glow total"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container today">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ todayQuotesCount }}</div>
          <div class="quotes-stat-label">Citas Hoy</div>
        </div>
        <div class="quotes-stat-glow today"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container upcoming">
          <i class="fa-solid fa-calendar-plus"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ upcomingQuotesCount }}</div>
          <div class="quotes-stat-label">Próximas</div>
        </div>
        <div class="quotes-stat-glow upcoming"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container completed">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ citaStore.citasCompletadas }}</div>
          <div class="quotes-stat-label">Completadas</div>
        </div>
        <div class="quotes-stat-glow completed"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="quotes-search-section">
      <div class="quotes-search-container">
        <q-input
          v-model="citaStore.searchQuery"
          class="quotes-search-input"
          outlined
          type="search"
          placeholder="Buscar por asunto, notas..."
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search quotes-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="citaStore.searchQuery" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="quotes-table-container">
      <div class="quotes-table-header">
        <div class="quotes-table-title-section">
          <h3 class="quotes-table-title">Lista de Citas</h3>
          <div class="quotes-table-underline"></div>
        </div>
        <div class="quotes-results-count">
          <span class="quotes-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ citaStore.citasFiltradas.length }} cita{{ citaStore.citasFiltradas.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="quotes-data-table"
        flat
        :rows="citaStore.citasFiltradas"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
        :loading="citaStore.loading"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:no-data>
          <div class="quotes-no-data-container">
            <div class="quotes-no-data-illustration">
              <i class="fa-solid fa-calendar-xmark quotes-no-data-icon"></i>
              <div class="quotes-no-data-circle quotes-no-data-circle-1"></div>
              <div class="quotes-no-data-circle quotes-no-data-circle-2"></div>
            </div>
            <p class="quotes-no-data-text">No se encontraron citas</p>
            <p class="quotes-no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega una nueva cita</p>
          </div>
        </template>

        <template v-slot:body-cell-asunto="props">
          <q-td :props="props">
            <div class="quotes-subject-info">
              <div class="quotes-subject-icon">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div class="quotes-subject-content">
                <div class="quotes-subject-label">Asunto</div>
                <div class="quotes-subject-value">{{ props.row.asunto }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-dentista="props">
          <q-td :props="props">
            <div class="quotes-dentist-info">
              <div class="quotes-dentist-avatar">
                {{ getDentistInitials(props.row.dentista_id) }}
              </div>
              <div class="quotes-dentist-content">
                <div class="quotes-dentist-name">{{ getDentistaName(props.row.dentista_id) }}</div>
                <div class="quotes-dentist-role">
                  <i class="fa-solid fa-user-md"></i>
                  Dentista
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-paciente="props">
          <q-td :props="props">
            <div class="quotes-patient-info">
              <div class="quotes-patient-avatar">
                {{ getPatientInitials(props.row.paciente_id) }}
              </div>
              <div class="quotes-patient-content">
                <div class="quotes-patient-name">{{ getPacienteName(props.row.paciente_id) }}</div>
                <div class="quotes-patient-role">
                  <i class="fa-solid fa-user-injured"></i>
                  Paciente
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <div class="quotes-date-info">
              <div class="quotes-date-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="quotes-date-content">
                <div class="quotes-date-label">Fecha</div>
                <div class="quotes-date-value">{{ citaStore.formatearFecha(props.row.fecha) }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-hora="props">
          <q-td :props="props">
            <div class="quotes-time-info">
              <div class="quotes-time-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="quotes-time-content">
                <div class="quotes-time-label">Hora</div>
                <div class="quotes-time-value">{{ citaStore.formatearHora(props.row.hora) }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge 
              :color="getEstadoColor(props.row.estado)"
              :label="getEstadoLabel(props.row.estado)"
              rounded
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="quotes-action-buttons">
              <q-btn
                class="quotes-action-btn quotes-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewQuote(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                class="quotes-action-btn quotes-edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editQuote(props.row)"
                color="primary"
              >
                <q-tooltip>Editar cita</q-tooltip>
              </q-btn>
              <q-btn
                class="quotes-action-btn quotes-delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeleteQuote(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Detail Dialog -->
    <DetailQuoteDialog
      v-model="showDetailDialog"
      :quote="citaStore.selectedCita"
    />

    <!-- Edit Dialog -->
    <EditQuoteDialog
      v-model="showEditDialog"
      :quote="citaStore.selectedCita"
      @quote-updated="handleQuoteUpdate"
    />

    <!-- New Dialog -->
    <NewQuoteDialog
      v-model="showNewDialog"
      @quote-created="handleQuoteCreate"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card class="quotes-delete-dialog">
        <q-card-section class="quotes-delete-dialog-header">
          <div class="quotes-delete-icon-wrapper">
            <i class="fa-solid fa-trash-can quotes-delete-icon"></i>
          </div>
          <div class="quotes-delete-title">¿Eliminar Cita?</div>
        </q-card-section>

        <q-card-section class="quotes-delete-dialog-body">
          <p class="quotes-delete-message">
            Esta acción <strong>no se puede deshacer</strong>. La cita será eliminada permanentemente.
          </p>
          <div class="quotes-delete-details" v-if="citaStore.selectedCita">
            <div class="quotes-delete-detail-item">
              <i class="fa-solid fa-stethoscope"></i>
              <span>{{ citaStore.selectedCita.asunto }}</span>
            </div>
            <div class="quotes-delete-detail-item">
              <i class="fa-solid fa-calendar"></i>
              <span>{{ citaStore.formatearFecha(citaStore.selectedCita.fecha) }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="quotes-delete-dialog-actions">
          <q-btn
            label="Cancelar"
            flat
            color="grey-7"
            v-close-popup
            no-caps
          />
          <q-btn
            label="Eliminar"
            unelevated
            color="negative"
            @click="deleteQuote"
            v-close-popup
            no-caps
            icon-right="fa-solid fa-trash"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCitaStore } from 'stores/citaStore'
import { usePacienteStore } from 'stores/pacienteStore'
import { useDentistaStore } from 'stores/dentistaStore'
import { useSucursalStore } from 'stores/sucursalStore'
import DetailQuoteDialog from './DetailQuoteDialog.vue'
import EditQuoteDialog from './EditQuoteDialog.vue'
import NewQuoteDialog from './NewQuoteDialog.vue'

const columns = [
  { 
    name: 'asunto', 
    label: 'Asunto', 
    field: 'asunto', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 200px'
  },
  { 
    name: 'dentista', 
    label: 'Dentista', 
    field: 'dentista_id', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 180px'
  },
  { 
    name: 'paciente', 
    label: 'Paciente', 
    field: 'paciente_id', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 180px'
  },
  { 
    name: 'fecha', 
    label: 'Fecha', 
    field: 'fecha', 
    align: 'center', 
    sortable: true, 
    style: 'width: 140px' 
  },
  { 
    name: 'hora', 
    label: 'Hora', 
    field: 'hora', 
    align: 'center', 
    sortable: true, 
    style: 'width: 120px' 
  },
  { 
    name: 'estado', 
    label: 'Estado', 
    field: 'estado', 
    align: 'center', 
    sortable: true, 
    style: 'width: 140px' 
  },
  { 
    name: 'actions', 
    label: 'Acciones', 
    field: 'actions', 
    align: 'center', 
    sortable: false, 
    style: 'width: 150px' 
  }
]

export default {
  name: 'QuotesPage',
  components: {
    DetailQuoteDialog,
    EditQuoteDialog,
    NewQuoteDialog
  },
  setup() {
    const $q = useQuasar()
    const citaStore = useCitaStore()
    const pacienteStore = usePacienteStore()
    const dentistaStore = useDentistaStore()
    const sucursalStore = useSucursalStore()

    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)

    // Computed properties for statistics
    const todayQuotesCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return citaStore.citasFiltradas.filter(cita => {
        const citaDate = cita.fecha
        return citaDate === today
      }).length
    })

    const upcomingQuotesCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return citaStore.citasFiltradas.filter(cita => {
        const citaDate = cita.fecha
        return citaDate > today
      }).length
    })

    // Utilidades para mostrar nombres
    const getPacienteName = (id) => {
      const paciente = pacienteStore.pacientes.find(p => p.id === id)
      if (!paciente) return 'No encontrado'
      return pacienteStore.getNombreCompleto(paciente)
    }

    const getDentistaName = (id) => {
      // dentistaStore usa Options API, acceder directamente a dentistas
      const dentista = dentistaStore.dentistas.find(d => d.id === id)
      if (!dentista) return 'No encontrado'
      return `${dentista.nombre} ${dentista.apellido_paterno || ''}`.trim()
    }

    // Funciones para obtener iniciales
    const getPatientInitials = (id) => {
      const paciente = pacienteStore.pacientes.find(p => p.id === id)
      if (!paciente) return '?'
      const firstName = paciente.nombre?.charAt(0) || ''
      const lastName = paciente.apellido_paterno?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || 'P'
    }

    const getDentistInitials = (id) => {
      const dentista = dentistaStore.dentistas.find(d => d.id === id)
      if (!dentista) return '?'
      const firstName = dentista.nombre?.charAt(0) || ''
      const lastName = dentista.apellido_paterno?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || 'D'
    }

    // Estado helpers
    const getEstadoColor = (estado) => {
      const colors = {
        'confirmada': 'positive',
        'programada': 'info',
        'completada': 'grey-7',
        'cancelada': 'negative'
      }
      return colors[estado] || 'grey'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        'confirmada': 'Confirmada',
        'programada': 'Programada',
        'completada': 'Completada',
        'cancelada': 'Cancelada'
      }
      return labels[estado] || estado
    }

    const handleQuoteCreate = async (nuevaCita) => {
      try {
        await citaStore.agregarCita(nuevaCita)
        $q.notify({
          type: 'positive',
          message: 'Cita creada exitosamente',
          position: 'top',
          timeout: 2000
        })
      } catch (error) {
        console.error('Error creando cita:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear la cita',
          position: 'top',
          timeout: 3000
        })
      }
    }

    const handleQuoteUpdate = async (citaActualizada) => {
      try {
        await citaStore.actualizarCita(citaActualizada)
        $q.notify({
          type: 'positive',
          message: 'Cita actualizada exitosamente',
          position: 'top',
          timeout: 2000
        })
      } catch (error) {
        console.error('Error actualizando cita:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al actualizar la cita',
          position: 'top',
          timeout: 3000
        })
      }
    }

    const deleteQuote = async () => {
      try {
        await citaStore.eliminarCita(citaStore.selectedCita.id)
        $q.notify({
          type: 'positive',
          message: 'Cita eliminada exitosamente',
          position: 'top',
          timeout: 2000
        })
        citaStore.limpiarCitaSeleccionada()
      } catch (error) {
        console.error('Error eliminando cita:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al eliminar la cita',
          position: 'top',
          timeout: 3000
        })
      }
    }

    const viewQuote = (quote) => {
      citaStore.seleccionarCita(quote)
      showDetailDialog.value = true
    }

    const editQuote = (quote) => {
      citaStore.seleccionarCita(quote)
      showEditDialog.value = true
    }

    const openNewQuoteDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteQuote = (quote) => {
      citaStore.seleccionarCita(quote)
      showDeleteDialog.value = true
    }

    // Cargar datos iniciales
    onMounted(async () => {
      try {
        // Cargar SIEMPRE pacientes, dentistas y sucursales primero (en paralelo)
        await Promise.all([
          pacienteStore.cargarPacientes(),
          dentistaStore.obtenerDentistas(),
          sucursalStore.listar()
        ])
        
        // Luego cargar citas
        await citaStore.cargarCitas()
      } catch (error) {
        console.error('Error cargando datos:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al cargar los datos',
          position: 'top',
          timeout: 3000
        })
      }
    })

    return {
      columns,
      citaStore,
      pacienteStore,
      dentistaStore,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      todayQuotesCount,
      upcomingQuotesCount,
      handleQuoteCreate,
      handleQuoteUpdate,
      deleteQuote,
      viewQuote,
      editQuote,
      openNewQuoteDialog,
      confirmDeleteQuote,
      getPacienteName,
      getDentistaName,
      getPatientInitials,
      getDentistInitials,
      getEstadoColor,
      getEstadoLabel
    }
  }
}
</script>
