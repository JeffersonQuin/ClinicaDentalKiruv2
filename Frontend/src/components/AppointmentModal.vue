<template>
  <q-dialog v-model="estaAbierto" persistent>
    <q-card class="appointment-modal">
      <!-- Si NO está autenticado -->
      <template v-if="!authStore.isAuthenticated">
        <q-card-section class="auth-header">
          <div class="text-h5 text-weight-bold text-center">Inicia Sesión</div>
          <p class="text-center text-subtitle2 q-mt-sm">Para agendar una cita necesitas iniciar sesión</p>
        </q-card-section>
        
        <q-card-section class="auth-content">
          <div class="auth-message">
            <q-icon name="lock" size="64px" color="primary" />
            <p>Inicia sesión con tu cuenta de Google para continuar</p>
          </div>
          
          <div class="auth-actions">
            <q-btn
              class="google-btn"
              @click="loginWithGoogle"
              unelevated
              no-caps
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" class="google-icon" />
              <span>Continuar con Google</span>
            </q-btn>
            
            <q-btn
              flat
              label="Cancelar"
              @click="cerrarModal"
              class="cancel-btn"
            />
          </div>
        </q-card-section>
      </template>

      <!-- Si SÍ está autenticado -->
      <template v-else>
        <q-card-section class="appointment-header">
          <div class="text-h5 text-weight-bold text-center">Gestión de Citas</div>
          <p class="text-center text-subtitle2 q-mt-sm">¿Qué deseas hacer?</p>
        </q-card-section>
        
        <q-card-section class="appointment-content">
          <div class="appointment-options">
            <!-- Botón Nueva Cita -->
            <q-btn
              class="appointment-option-btn new-appointment-btn"
              @click="abrirNuevaReserva"
              :loading="reservaStore.cargandoNuevaReserva"
              unelevated
            >
              <div class="option-content">
                <div class="option-icon">
                  <q-icon name="event" size="3em" />
                </div>
                <div class="option-text">Nueva Cita</div>
                <div class="option-description">Agenda una nueva reserva</div>
              </div>
            </q-btn>
            
            <!-- Botón Historial -->
            <q-btn
              class="appointment-option-btn history-btn"
              @click="abrirHistorial"
              :loading="reservaStore.cargandoHistorial"
              unelevated
            >
              <div class="option-content">
                <div class="option-icon">
                  <q-icon name="history" size="3em" />
                </div>
                <div class="option-text">Historial</div>
                <div class="option-description">Ver mis citas programadas</div>
              </div>
            </q-btn>
          </div>
          
          <!-- Botón Cancelar -->
          <div class="cancel-section">
            <q-btn
              class="cancel-btn"
              v-close-popup
              flat
            >
              Cancelar
            </q-btn>
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import { useReserveStore } from 'src/stores/reservaStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'new-appointment', 'history', 'cancel'])

const $q = useQuasar()
const authStore = useAuthStore()
const reservaStore = useReserveStore()

const estaAbierto = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor)
})

const loginWithGoogle = () => {
  authStore.loginWithGoogle()
  cerrarModal()
}

const abrirNuevaReserva = async () => {
  reservaStore.cargandoNuevaReserva = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    emit('new-appointment')
    cerrarModal()
  } catch (error) {
    console.error('Error al abrir nueva reserva:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al abrir formulario',
      icon: 'error'
    })
  } finally {
    reservaStore.cargandoNuevaReserva = false
  }
}

const abrirHistorial = async () => {
  reservaStore.cargandoHistorial = true
  try {
    await reservaStore.cargarDatos()
    emit('history')
    cerrarModal()
  } catch (error) {
    console.error('Error al abrir historial:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar historial',
      icon: 'error'
    })
  } finally {
    reservaStore.cargandoHistorial = false
  }
}

const cerrarModal = () => {
  emit('cancel')
  estaAbierto.value = false
}
</script>

<style scoped>
.appointment-modal {
  min-width: 400px;
  max-width: 600px;
  border-radius: 16px;
}

/* Auth styles */
.auth-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 24px;
  border-radius: 16px 16px 0 0;
}

.auth-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.auth-message p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.auth-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.google-btn {
  background: white;
  border: 2px solid #e0e0e0;
  color: #333;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  transition: all 0.3s ease;
}

.google-btn:hover {
  border-color: #4285f4;
  background: #f8f9fa;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Appointment styles */
.appointment-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 24px;
  border-radius: 16px 16px 0 0;
}

.appointment-content {
  padding: 32px 24px;
}

.appointment-options {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.appointment-option-btn {
  flex: 1;
  height: auto;
  padding: 24px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.appointment-option-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.new-appointment-btn:hover {
  border-color: #667eea;
  background: #f0f3ff;
}

.history-btn:hover {
  border-color: #764ba2;
  background: #f8f0ff;
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.option-icon {
  color: #667eea;
}

.history-btn .option-icon {
  color: #764ba2;
}

.option-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.option-description {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.cancel-section {
  display: flex;
  justify-content: center;
}

.cancel-btn {
  color: #666;
  min-width: 120px;
}

@media (max-width: 600px) {
  .appointment-modal {
    min-width: auto;
    width: 100%;
  }
  
  .appointment-options {
    flex-direction: column;
  }
}
</style>