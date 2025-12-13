<template>
  <q-dialog v-model="showDialog" persistent max-width="800px">
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-plus"></i>
            <span>Registrar Nuevo Paciente</span>
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

      <q-form @submit="createPatient" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar un nuevo paciente. <br>
              <b>La fecha de registro se llena automáticamente con la fecha de hoy.</b>
            </p>
          </div>

          <div class="form-fields">
            <!-- Información del Registro -->
            <div class="form-section">
              <h4 class="section-title text-black">
                <i class="fa-solid fa-calendar-plus q-mr-sm"></i>
                Información del Registro
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <span>Fecha de Registro</span>
                  </label>
                  <q-input
                    v-model="form.fecha_registro"
                    filled
                    dense
                    readonly
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Información Personal -->
            <div class="form-section">
              <h4 class="section-title text-black">
                <i class="fa-solid fa-user q-mr-sm"></i>
                Información Personal
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <span>Nombre</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.nombre"
                    filled
                    dense
                    :rules="[val => !!val || 'El nombre es requerido']"
                    class="form-input"
                    placeholder="Nombre"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <span>Apellido Paterno</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.apellido_paterno"
                    filled
                    dense
                    :rules="[val => !!val || 'El apellido paterno es requerido']"
                    class="form-input"
                    placeholder="Apellido Paterno"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <span>Apellido Materno</span>
                  </label>
                  <q-input
                    v-model="form.apellido_materno"
                    filled
                    dense
                    class="form-input"
                    placeholder="Apellido Materno"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-id-card"></i>
                    <span>C.I.</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.ci"
                    filled
                    dense
                    :rules="[val => !!val || 'El CI es requerido']"
                    class="form-input"
                    placeholder="Número de CI"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar"></i>
                    <span>Fecha Nacimiento</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.fecha_nacimiento"
                    filled
                    dense
                    type="date"
                    :rules="[val => !!val || 'La fecha de nacimiento es requerida']"
                    class="form-input"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-heart"></i>
                    <span>Estado Civil</span>
                  </label>
                  <q-select
                    v-model="form.estado_civil"
                    filled
                    dense
                    :options="estadoCivilOptions"
                    class="form-input"
                    placeholder="Seleccionar estado civil"
                  />
                </div>
              </div>
            </div>

            <!-- Información de Contacto -->
            <div class="form-section">
              <h4 class="section-title text-black">
                <i class="fa-solid fa-address-book q-mr-sm"></i>
                Información de Contacto
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Email</span>
                    <span class="optional">(Opcional - Se autocompleta con clientes registrados)</span>
                  </label>
                  <q-input
                    v-model="form.gmail"
                    filled
                    dense
                    type="email"
                    class="form-input"
                    placeholder="paciente@ejemplo.com"
                    list="client-emails"
                  >
                    <datalist id="client-emails">
                      <option 
                        v-for="client in clientUsers" 
                        :key="client.id" 
                        :value="client.email"
                      >
                        {{ client.username }} - {{ client.email }}
                      </option>
                    </datalist>
                  </q-input>
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-phone"></i>
                    <span>Teléfono</span>
                  </label>
                  <q-input
                    v-model="form.telefono"
                    filled
                    dense
                    class="form-input"
                    placeholder="Teléfono"
                    mask="########"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-city"></i>
                    <span>Ciudad</span>
                  </label>
                  <q-select
                    v-model="form.ciudad"
                    filled
                    dense
                    :options="ciudadOptions"
                    class="form-input"
                    placeholder="Seleccionar ciudad"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-home"></i>
                    <span>Domicilio</span>
                  </label>
                  <q-input
                    v-model="form.domicilio"
                    filled
                    dense
                    class="form-input"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </div>

            <!-- Información Profesional -->
            <div class="form-section">
              <h4 class="section-title text-black">
                <i class="fa-solid fa-briefcase q-mr-sm"></i>
                Información Profesional
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <span>Profesión</span>
                  </label>
                  <q-input
                    v-model="form.profesion"
                    filled
                    dense
                    class="form-input"
                    placeholder="Profesión u ocupación"
                  />
                </div>
              </div>
            </div>

            <!-- Información Médica -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-stethoscope"></i>
                Información Médica
              </h4>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Última visita odontológica</span>
                  </label>
                  <q-input
                    v-model="form.ultima_visita_odontologo"
                    filled
                    dense
                    type="date"
                    class="form-input"
                  />
                </div>
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-comment-medical"></i>
                    <span>Motivo de Consulta</span>
                  </label>
                  <q-input
                    v-model="form.motivo_consulta"
                    filled
                    dense
                    class="form-input"
                    placeholder="Motivo principal de la consulta"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-align-left"></i>
                    <span>Descripción</span>
                  </label>
                  <q-input
                    v-model="form.descripcion"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Descripción detallada de los síntomas"
                  />
                </div>
              </div>
            </div>

            <!-- Antecedentes y Alertas -->
            <div class="form-section">
              <h4 class="section-title text-black">
                <i class="fa-solid fa-clipboard-list q-mr-sm"></i>
                Antecedentes y Alertas
              </h4>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-notes-medical"></i>
                    <span>Antecedentes de Salud</span>
                  </label>
                  <q-input
                    v-model="form.antecedentes_salud"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Enfermedades crónicas, medicamentos, cirugías previas..."
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>Alertas Clínicas</span>
                  </label>
                  <q-input
                    v-model="form.alertas_clinicas"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Alergias, condiciones especiales, precauciones..."
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Cancelar"
            @click="closeDialog"
            class="secondary-btn"
            no-caps
          />
          <q-space />
          <q-btn
            type="submit"
            label="Registrar Paciente"
            icon="fa-solid fa-user-plus"
            :loading="loading"
            class="primary-btn"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { usePacienteStore } from 'stores/pacienteStore'
import { useUserStore } from 'stores/userStore'

export default {
  name: 'NewPatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'patient-created'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const pacienteStore = usePacienteStore()
    const userStore = useUserStore()
    const loading = ref(false)
    const today = new Date().toISOString().slice(0, 10)
    
    const form = ref({
      fecha_registro: today,
      gmail: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      ci: '',
      fecha_nacimiento: '',
      ciudad: '',
      profesion: '',
      estado_civil: '',
      domicilio: '',
      telefono: '',
      motivo_consulta: '',
      ultima_visita_odontologo: '',
      descripcion: '',
      antecedentes_salud: '',
      alertas_clinicas: ''
    })

    // Computed para obtener usuarios CLIENT
    const clientUsers = computed(() => {
      return userStore.users.filter(u => 
        (u.tipo === 'CLIENT' || u.tipo === 'client') && u.email
      )
    })

    // Opciones para los selects
    const estadoCivilOptions = [
      'Soltero', 'Soltera', 'Casado', 'Casada', 
      'Divorciado', 'Divorciada', 'Viudo', 'Viuda'
    ]

    const ciudadOptions = [
      'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Tarija', 
      'Potosí', 'Sucre', 'Beni', 'Pando'
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        fecha_registro: today,
        gmail: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        ci: '',
        fecha_nacimiento: '',
        ciudad: '',
        profesion: '',
        estado_civil: '',
        domicilio: '',
        telefono: '',
        motivo_consulta: '',
        ultima_visita_odontologo: '',
        descripcion: '',
        antecedentes_salud: '',
        alertas_clinicas: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const createPatient = async () => {
      loading.value = true
      try {
        await pacienteStore.agregarPaciente({ ...form.value })
        
        $q.notify({
          type: 'positive',
          message: 'Paciente creado exitosamente',
          icon: 'fa-solid fa-check'
        })
        
        emit('patient-created')
        closeDialog()
        
      } catch (error) {
        console.error('Error creating patient:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear el paciente',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      // Cargar usuarios si no están cargados
      if (userStore.users.length === 0) {
        await userStore.fetchUsers()
      }
    })

    return {
      showDialog,
      form,
      estadoCivilOptions,
      ciudadOptions,
      loading,
      clientUsers,
      closeDialog,
      createPatient
    }
  }
}
</script>