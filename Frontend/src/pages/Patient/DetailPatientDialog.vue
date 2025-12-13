<template>
  <q-dialog v-model="showDialog" persistent max-width="900px">
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-circle"></i>
            <span>Detalles del Paciente</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-tabs">
        <q-tabs v-model="tab" dense align="justify" class="tabs-bar">
          <q-tab name="info" label="Información General" />
          <q-tab name="clinica" label="Historia Clínica" />
          <q-tab name="odontograma" label="Odontograma" />
          <q-tab name="imagenes" label="Imágenes" />
          <q-tab name="historial" label="Historial" />
        </q-tabs>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content">
        <q-tab-panels v-model="tab" animated>
          <!-- Información General -->
          <q-tab-panel name="info" class="tab-panel">
            <div class="info-grid">
              <!-- Datos Personales -->
              <div class="info-card personal-data">
                <h4 class="card-title">
                  <i class="fa-solid fa-id-card"></i>
                  Datos Personales
                </h4>
                <div class="data-grid">
                  <div class="data-item">
                    <label>Nombre Completo:</label>
                    <span class="data-value">{{ fullName }}</span>
                  </div>
                  <div class="data-item">
                    <label>C.I.:</label>
                    <span class="data-value">{{ currentPatient?.ci || 'No especificado' }}</span>
                  </div>
                  <div class="data-item">
                    <label>Fecha de Nacimiento:</label>
                    <span class="data-value">{{ formatDate(currentPatient?.fechaNacimiento) }}</span>
                  </div>
                  <div class="data-item">
                    <label>Edad:</label>
                    <span class="data-value">{{ calculateAge(currentPatient?.fechaNacimiento) }} años</span>
                  </div>
                  <div class="data-item">
                    <label>Estado Civil:</label>
                    <span class="data-value">{{ currentPatient?.estadoCivil || 'No especificado' }}</span>
                  </div>
                  <div class="data-item">
                    <label>Profesión:</label>
                    <span class="data-value">{{ currentPatient?.profesion || 'No especificado' }}</span>
                  </div>
                </div>
              </div>

              <!-- Información de Contacto -->
              <div class="info-card contact-data">
                <h4 class="card-title">
                  <i class="fa-solid fa-address-book"></i>
                  Información de Contacto
                </h4>
                <div class="data-grid">
                  <div class="data-item">
                    <label>Email:</label>
                    <span class="data-value">{{ currentPatient?.gmail || 'No especificado' }}</span>
                  </div>
                  <div class="data-item">
                    <label>Teléfono:</label>
                    <span class="data-value">{{ currentPatient?.telefono || 'No especificado' }}</span>
                  </div>
                  <div class="data-item">
                    <label>Ciudad:</label>
                    <span class="data-value city-badge">{{ currentPatient?.ciudad || 'No especificada' }}</span>
                  </div>
                  <div class="data-item full-width">
                    <label>Domicilio:</label>
                    <span class="data-value">{{ currentPatient?.domicilio || 'No especificado' }}</span>
                  </div>
                </div>
              </div>

              <!-- Información del Registro -->
              <div class="info-card registry-data">
                <h4 class="card-title">
                  <i class="fa-solid fa-calendar-check"></i>
                  Información del Registro
                </h4>
                <div class="data-grid">
                  <div class="data-item">
                    <label>Fecha de Registro:</label>
                    <span class="data-value highlight">{{ formatDate(currentPatient?.fechaRegistro) }}</span>
                  </div>
                  <div class="data-item">
                    <label>Estado:</label>
                    <span class="data-value status-badge" :class="currentPatient?.state">
                      {{ currentPatient?.state === 'active' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- Historia Clínica -->
          <q-tab-panel name="clinica" class="tab-panel">
            <div class="clinical-grid">
              <!-- Motivo de Consulta -->
              <div class="clinical-card consultation-reason">
                <h4 class="card-title">
                  <i class="fa-solid fa-stethoscope"></i>
                  Motivo de Consulta
                </h4>
                <div class="clinical-data">
                  <div class="clinical-item">
                    <label>Motivo Principal:</label>
                    <span class="clinical-value">{{ currentPatient?.motivoConsulta || 'No especificado' }}</span>
                  </div>
                  <div class="clinical-item">
                    <label>Descripción:</label>
                    <span class="clinical-value description">{{ currentPatient?.descripcion || 'No hay descripción disponible' }}</span>
                  </div>
                  <div class="clinical-item">
                    <label>Última Visita al Odontólogo:</label>
                    <span class="clinical-value">{{ formatDate(currentPatient?.ultimaVisitaOdontologo) }}</span>
                  </div>
                </div>
              </div>

              <!-- Antecedentes de Salud -->
              <div class="clinical-card health-background">
                <h4 class="card-title">
                  <i class="fa-solid fa-heart-pulse"></i>
                  Antecedentes de Salud
                </h4>
                <div class="clinical-data">
                  <div class="clinical-item full-width">
                    <span class="clinical-value">{{ currentPatient?.antecedentesSalud || 'Sin antecedentes relevantes' }}</span>
                  </div>
                </div>
              </div>

              <!-- Alertas Clínicas -->
              <div class="clinical-card clinical-alerts" v-if="hasClinicalAlerts">
                <h4 class="card-title alert">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  Alertas Clínicas Importantes
                </h4>
                <div class="alert-content">
                  <div class="alert-item">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>{{ currentPatient?.alertasClinicas }}</span>
                  </div>
                </div>
              </div>

              <div class="clinical-card no-alerts" v-else>
                <h4 class="card-title">
                  <i class="fa-solid fa-circle-check"></i>
                  Alertas Clínicas
                </h4>
                <div class="no-alerts-content">
                  <span>No hay alertas clínicas registradas</span>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- Odontograma -->
          <q-tab-panel name="odontograma" class="tab-panel">
            <div class="empty-section">
              <i class="fa-solid fa-tooth empty-icon"></i>
              <h4>Odontograma</h4>
              <p>Esta funcionalidad estará disponible próximamente</p>
              <q-btn 
                color="primary" 
                label="Crear Odontograma" 
                icon="fa-solid fa-plus"
                unelevated
                class="action-btn"
                disabled
              />
            </div>
          </q-tab-panel>

          <!-- Imágenes -->
          <q-tab-panel name="imagenes" class="tab-panel">
            <div class="empty-section">
              <i class="fa-solid fa-images empty-icon"></i>
              <h4>Imágenes Dentales</h4>
              <p>Gestiona las imágenes radiográficas y fotografías del paciente</p>
              <q-btn 
                color="primary" 
                label="Subir Imágenes" 
                icon="fa-solid fa-upload"
                unelevated
                class="action-btn"
                disabled
              />
            </div>
          </q-tab-panel>

          <!-- Historial -->
          <q-tab-panel name="historial" class="tab-panel">
            <div class="empty-section">
              <i class="fa-solid fa-clock-rotate-left empty-icon"></i>
              <h4>Historial de Tratamientos</h4>
              <p>Consulta el historial completo de tratamientos y procedimientos</p>
              <q-btn 
                color="primary" 
                label="Ver Historial Completo" 
                icon="fa-solid fa-history"
                unelevated
                class="action-btn"
                disabled
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-space />
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="secondary-btn"
          no-caps
        />
        <q-btn
          color="primary"
          label="Editar Información"
          icon="fa-solid fa-edit"
          @click="editPatient"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { usePacienteStore } from 'stores/pacienteStore'

export default {
  name: 'DetailPatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    patientData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'edit-patient'],
  setup(props, { emit }) {
    const store = usePacienteStore()
    const tab = ref('info')

    // Usamos el paciente seleccionado del store en lugar de la prop
    const currentPatient = computed(() => {
      return store.selectedPatient || props.patientData
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // Computed properties
    const fullName = computed(() => {
      if (!currentPatient.value) return ''
      return `${currentPatient.value.nombre || ''} ${currentPatient.value.apellidoPaterno || ''} ${currentPatient.value.apellidoMaterno || ''}`.trim()
    })

    const hasClinicalAlerts = computed(() => {
      return currentPatient.value?.alertasClinicas && currentPatient.value.alertasClinicas.trim() !== ''
    })

    // Methods - Podemos usar las del store si están disponibles
    const formatDate = (dateString) => {
      if (!dateString) return 'No registrada'
      try {
        // Si el store tiene un formateador, lo usamos, sino usamos este
        if (store.formatearFecha) {
          return store.formatearFecha(dateString)
        }
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Fecha inválida'
      }
    }

    const calculateAge = (fechaNacimiento) => {
      if (!fechaNacimiento) return '--'
      try {
        // Si el store tiene un calculador de edad, lo usamos
        if (store.calcularEdad) {
          return store.calcularEdad(fechaNacimiento)
        }
        const nacimiento = new Date(fechaNacimiento)
        const hoy = new Date()
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const m = hoy.getMonth() - nacimiento.getMonth()
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--
        }
        return edad
      } catch {
        return '--'
      }
    }

    const editPatient = () => {
      // Emitimos el evento para que el componente padre abra el diálogo de edición
      emit('edit-patient', currentPatient.value)
      showDialog.value = false
    }

    // Reset tab cuando se abre el diálogo
    watch(showDialog, (newValue) => {
      if (newValue) {
        tab.value = 'info'
      }
    })

    return {
      showDialog,
      tab,
      currentPatient,
      fullName,
      hasClinicalAlerts,
      formatDate,
      calculateAge,
      editPatient
    }
  }
}
</script>