<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <!-- Header Fijo -->
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-day"></i>
            <span>Detalle Reserva</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            @click="closeDialog"
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Contenido Scrollable -->
      <q-card-section
        class="dialog-content-scrollable"
        style="flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px;"
      >
        <div class="content-wrapper">
          <!-- Información Principal de la Reserva -->
          <div class="info-section">
            <div class="section-title">
              <i class="fa-solid fa-info-circle"></i>
              Información de la Reserva
            </div>

            <div class="reserva-row">
              <div class="reserva-box">
                <div class="box-label">Fecha</div>
                <div class="box-value">{{ formatDate(reserveData?.fechaReserva) }}</div>
              </div>
              <div class="reserva-box">
                <div class="box-label">Hora</div>
                <div class="box-value">{{ reserveData?.horaReserva }}</div>
              </div>
            </div>

            <div class="reserva-details">
              <div class="detail-item">
                <span class="detail-label">Paciente:</span>
                <span class="detail-value">{{ reserveData?.nombreCompleto }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ reserveData?.gmail }}</span>
              </div>
              <div v-if="reserveData?.servicio" class="detail-item">
                <span class="detail-label">Servicio:</span>
                <span class="detail-value">{{ reserveData.servicio }}</span>
              </div>
              <div v-if="reserveData?.sucursal" class="detail-item">
                <span class="detail-label">Sucursal:</span>
                <span class="detail-value">{{ reserveData.sucursal }}</span>
              </div>
            </div>
          </div>

          <!-- Indicador de tipo de reserva -->
          <div class="tipo-reserva-section" :class="{ 'for-other': hasDependiente }">
            <q-icon :name="hasDependiente ? 'fa-solid fa-users' : 'fa-solid fa-user'" />
            <span>{{ hasDependiente ? 'Reserva para Dependiente' : 'Reserva para Titular' }}</span>
          </div>

          <!-- Sección de dependiente (solo si existe) -->
          <div v-if="hasDependiente" class="dependiente-section">
            <div class="section-title">
              <i class="fa-solid fa-user-friends"></i>
              Información del Dependiente
            </div>
            <div class="dependiente-info">
              <div class="info-row">
                <span class="label">Nombre Completo:</span>
                <span class="value">{{ reserveData?.dependiente?.nombreCompleto }}</span>
              </div>
              <div class="info-row">
                <span class="label">Género:</span>
                <span class="value">{{ reserveData?.dependiente?.genero }}</span>
              </div>
              <div class="info-row">
                <span class="label">Parentesco:</span>
                <span class="value">{{ reserveData?.dependiente?.parentesco }}</span>
              </div>
              <div class="info-row">
                <span class="label">Teléfono:</span>
                <span class="value">{{ reserveData?.dependiente?.telefono }}</span>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando no hay dependiente -->
          <div v-else class="no-dependiente-section">
            <q-icon name="fa-solid fa-user-check" size="32px" />
            <p>Esta reserva es para el titular principal</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer Fijo -->
      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          @click="closeDialog"
          class="secondary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DetailReserveDialog',
  props: {
    modelValue: Boolean,
    reserveData: Object
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const hasDependiente = computed(() => {
      return props.reserveData?.dependiente?.nombreCompleto && props.reserveData.dependiente.parentesco
    })

    const closeDialog = () => { showDialog.value = false }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-')
          return `${day}/${month}/${year}`
        }
        if (dateString.includes('/')) return dateString
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        }
        return 'Fecha inválida'
      } catch { return 'Fecha inválida' }
    }

    return { showDialog, hasDependiente, closeDialog, formatDate }
  }
}
</script>

<style scoped>
.detail-dialog {
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  background: #fafafa;
  padding: 10px 0; /* un poquito más de espacio interno */
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.header-title {
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  color: #555;
}

.dialog-content-scrollable {
  padding: 24px; /* un poquito más de padding */
  gap: 16px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.reserva-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.reserva-box {
  flex: 1;
  background: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
}

.box-label {
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.box-value {
  font-weight: 600;
}

.reserva-details .detail-item {
  margin-bottom: 12px;
}

.detail-label {
  font-weight: 500;
  margin-right: 6px;
}

.tipo-reserva-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
  font-weight: 500;
}

.dependiente-section {
  margin-top: 16px;
  padding: 12px;
  background: #f3f3f3;
  border-radius: 8px;
}

.info-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.no-dependiente-section {
  text-align: center;
  margin-top: 16px;
}

.dialog-actions {
  padding: 12px 24px;
}
</style>
