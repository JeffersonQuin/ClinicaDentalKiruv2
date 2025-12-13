<template>
  <q-dialog v-model="isOpen" maximized>
    <q-card class="appointment-history">
      <!-- Header -->
      <q-card-section class="history-header">
        <div class="header-content">
          <h2 class="history-title">Mis Reservas</h2>
          <p class="user-email">{{ userEmail }}</p>
          <q-btn 
            flat 
            round 
            icon="close" 
            @click="closeModal"
            class="close-btn"
          />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="history-content">
        <h3 class="section-title">Citas programadas:</h3>
        
        <!-- Estado de carga -->
        <div v-if="cargandoHistorial" class="loading-state">
          <q-spinner size="50px" color="primary" />
          <p>Cargando reservas...</p>
        </div>
        
        <div v-else-if="appointments.length === 0" class="empty-state">
          <q-icon name="event_busy" size="64px" color="grey-5" />
          <p class="empty-text">No tienes citas programadas</p>
          <q-btn 
            color="primary" 
            label="Agendar Primera Cita" 
            @click="abrirNuevaReserva"
            class="q-mt-md"
          />
        </div>
        
        <div v-else class="appointments-list">
          <div 
            v-for="(appointment, index) in appointments" 
            :key="appointment.id"
            class="appointment-card"
            :class="getEstadoClass(appointment.estado)"
          >
            <div class="appointment-number">{{ index + 1 }}</div>
            <div class="appointment-details">
              <!-- Estado de la reserva -->
              <div class="detail-item estado-item">
                <q-badge 
                  :color="getEstadoColor(appointment.estado)" 
                  :label="formatEstado(appointment.estado)"
                  class="estado-badge"
                />
              </div>

              <!-- Información del paciente -->
              <div class="detail-item">
                <strong>Paciente:</strong> 
                <span v-if="appointment.dependiente_nombre">
                  {{ appointment.dependiente_nombre }}
                  <q-chip dense size="sm" color="info" text-color="white" class="q-ml-sm">
                    {{ appointment.parentesco }}
                  </q-chip>
                </span>
                <span v-else>Yo mismo</span>
              </div>

              <div class="detail-item">
                <strong>Sucursal:</strong> {{ appointment.sucursal_nombre }}
              </div>
              <div class="detail-item">
                <strong>Dirección:</strong> {{ appointment.sucursal_direccion }}
              </div>
              <div class="detail-item">
                <strong>Fecha:</strong> {{ formatDate(appointment.fecha_reserva) }}
              </div>
              <div class="detail-item">
                <strong>Hora:</strong> {{ formatTime(appointment.hora_reserva) }}
              </div>
              <div class="detail-item">
                <strong>Servicio:</strong> {{ appointment.servicio_nombre }}
              </div>
              <div v-if="appointment.duracion_minutos" class="detail-item">
                <strong>Duración:</strong> {{ appointment.duracion_minutos }} minutos
              </div>
              <div v-if="appointment.precio" class="detail-item">
                <strong>Precio:</strong> Bs. {{ appointment.precio }}
              </div>
              <div v-if="appointment.notas" class="detail-item">
                <strong>Notas:</strong> {{ appointment.notas }}
              </div>
              
              <!-- Información del dependiente -->
              <div v-if="appointment.dependiente_telefono" class="dependiente-info">
                <div class="detail-item">
                  <strong>Teléfono del paciente:</strong> {{ appointment.dependiente_telefono }}
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="appointment-actions">
              <q-btn 
                v-if="appointment.estado === 'pendiente' || appointment.estado === 'confirmada'"
                flat 
                color="warning" 
                icon="cancel" 
                @click="cancelAppointment(appointment.id)"
                class="action-btn"
                size="sm"
              >
                Cancelar
              </q-btn>
              <q-btn 
                flat 
                color="negative" 
                icon="delete" 
                @click="deleteAppointment(appointment.id)"
                class="action-btn"
                size="sm"
              >
                Eliminar
              </q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useReserveStore } from 'src/stores/reservaStore'
import { useAuthStore } from 'src/stores/authStore'

// Props
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['update:modelValue', 'nueva-reserva'])

// Quasar
const $q = useQuasar()

// Stores
const reservaStore = useReserveStore()
const authStore = useAuthStore()

// Estado del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos desde Pinia
const userEmail = computed(() => authStore.user?.email || 'Usuario')
const appointments = computed(() => reservaStore.reservasCompletas || [])
const cargandoHistorial = computed(() => reservaStore.cargandoHistorial)

// Cargar datos cuando se abre el modal
watch(isOpen, async (newValue) => {
  if (newValue) {
    await reservaStore.cargarDatos()
  }
})

// Métodos
const closeModal = () => {
  isOpen.value = false
}

const abrirNuevaReserva = () => {
  closeModal()
  emit('nueva-reserva')
}

const cancelAppointment = async (appointmentId) => {
  $q.dialog({
    title: 'Cancelar Reserva',
    message: '¿Estás seguro de que quieres cancelar esta reserva?',
    cancel: {
      label: 'No',
      flat: true
    },
    ok: {
      label: 'Sí, cancelar',
      color: 'warning'
    },
    persistent: true
  }).onOk(async () => {
    const resultado = await reservaStore.cancelarReserva(appointmentId)
    
    if (resultado.success) {
      $q.notify({
        type: 'positive',
        message: 'Reserva cancelada exitosamente',
        icon: 'cancel'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: resultado.message || 'Error al cancelar la reserva',
        icon: 'error'
      })
    }
  })
}

const deleteAppointment = (appointmentId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar esta reserva del historial?',
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    ok: {
      label: 'Eliminar',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    const resultado = await reservaStore.eliminarReserva(appointmentId)
    
    if (resultado.success) {
      $q.notify({
        type: 'positive',
        message: 'Reserva eliminada exitosamente',
        icon: 'delete'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: resultado.message || 'Error al eliminar la reserva',
        icon: 'error'
      })
    }
  })
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  
  try {
    // Si está en formato YYYY-MM-DD, convertir manualmente
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-')
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
    
    // Si está en formato YYYY/MM/DD
    if (dateString.includes('/') && dateString.split('/')[0].length === 4) {
      const [year, month, day] = dateString.split('/')
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
    
    return dateString
  } catch {
    return 'Fecha inválida'
  }
}

// Formatear hora
const formatTime = (timeString) => {
  if (!timeString) return 'No disponible'
  
  try {
    // Si viene en formato HH:MM:SS, solo tomar HH:MM
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':')
      return `${hours}:${minutes}`
    }
    
    return timeString
  } catch {
    return 'Hora inválida'
  }
}

// Formatear estado
const formatEstado = (estado) => {
  const estados = {
    'pendiente': 'Pendiente',
    'confirmada': 'Confirmada',
    'cancelada': 'Cancelada',
    'completada': 'Completada'
  }
  return estados[estado] || estado
}

// Color del estado
const getEstadoColor = (estado) => {
  const colores = {
    'pendiente': 'warning',
    'confirmada': 'positive',
    'cancelada': 'negative',
    'completada': 'info'
  }
  return colores[estado] || 'grey'
}

// Clase CSS del estado
const getEstadoClass = (estado) => {
  return `estado-${estado}`
}
</script>

<style scoped>
.appointment-history {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.history-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.user-email {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-top: 16px;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.appointment-card.estado-cancelada {
  border-left-color: #f44336;
  opacity: 0.7;
}

.appointment-card.estado-completada {
  border-left-color: #4caf50;
}

.appointment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.appointment-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.appointment-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  font-size: 14px;
  color: #333;
}

.detail-item strong {
  color: #667eea;
  margin-right: 8px;
}

.estado-item {
  margin-bottom: 8px;
}

.estado-badge {
  font-size: 12px;
  padding: 4px 12px;
}

.dependiente-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.appointment-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
}

.action-btn {
  min-width: 100px;
}

@media (max-width: 600px) {
  .appointment-card {
    flex-direction: column;
  }
  
  .appointment-actions {
    flex-direction: row;
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
  }
}
</style>