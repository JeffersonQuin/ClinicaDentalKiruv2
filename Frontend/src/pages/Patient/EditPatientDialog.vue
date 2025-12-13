<template>
  <q-dialog v-model="showDialog" persistent max-width="800px">
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-edit"></i>
            <span>Editar Paciente</span>
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

      <q-form @submit="savePatient" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
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
                  </label>
                  <q-input
                    v-model="form.fecha_nacimiento"
                    filled
                    dense
                    type="date"
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
                    list="client-emails-edit"
                  >
                    <datalist id="client-emails-edit">
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
              <h4 class="section-title text-black">
                <i class="fa-solid fa-stethoscope q-mr-sm"></i>
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
            label="Guardar Cambios"
            icon="fa-solid fa-save"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { usePacienteStore } from 'stores/pacienteStore'
import { useUserStore } from 'stores/userStore'

export default {
  name: 'EditPatientDialog',
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
  emits: ['update:modelValue', 'patient-updated'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const pacienteStore = usePacienteStore()
    const userStore = useUserStore()
    const loading = ref(false)
    
    const form = ref({
      id: null,
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      ci: '',
      gmail: '',
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

    const initializeForm = () => {
      if (props.patientData) {
        form.value = {
          id: props.patientData.id,
          nombre: props.patientData.nombre || '',
          apellido_paterno: props.patientData.apellido_paterno || '',
          apellido_materno: props.patientData.apellido_materno || '',
          ci: props.patientData.ci || '',
          gmail: props.patientData.gmail || '',
          fecha_nacimiento: props.patientData.fecha_nacimiento || '',
          ciudad: props.patientData.ciudad || '',
          profesion: props.patientData.profesion || '',
          estado_civil: props.patientData.estado_civil || '',
          domicilio: props.patientData.domicilio || '',
          telefono: props.patientData.telefono || '',
          motivo_consulta: props.patientData.motivo_consulta || '',
          ultima_visita_odontologo: props.patientData.ultima_visita_odontologo || '',
          descripcion: props.patientData.descripcion || '',
          antecedentes_salud: props.patientData.antecedentes_salud || '',
          alertas_clinicas: props.patientData.alertas_clinicas || ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        ci: '',
        gmail: '',
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

    const savePatient = async () => {
      loading.value = true
      try {
        await pacienteStore.actualizarPaciente({ ...form.value })
        
        $q.notify({
          type: 'positive',
          message: 'Paciente actualizado exitosamente',
          icon: 'fa-solid fa-check'
        })
        
        emit('patient-updated')
        closeDialog()
        
      } catch (error) {
        console.error('Error updating patient:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al actualizar el paciente',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      } finally {
        loading.value = false
      }
    }

    watch(() => props.patientData, (newData) => {
      if (newData) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue && props.patientData) {
        initializeForm()
      }
    })

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
      savePatient
    }
  }
}
</script>