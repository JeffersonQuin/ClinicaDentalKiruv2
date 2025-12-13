<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-edit"></i>
            <span>Editar Cita</span>
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

      <!-- Form -->
      <q-form @submit.prevent="saveQuote" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            
            <!-- Asunto -->
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-comment-medical"></i>
                <span>Asunto</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.asunto"
                filled
                dense
                :rules="[val => !!val || 'El asunto es requerido']"
                placeholder="Motivo de la cita"
              />
            </div>

            <!-- Tipo de Cita y Estado -->
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-stethoscope"></i>
                  <span>Tipo de Cita</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.tipo_cita"
                  filled
                  dense
                  :options="tipoCitaOptions"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Seleccione el tipo de cita']"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-flag"></i>
                  <span>Estado</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.estado"
                  filled
                  dense
                  :options="estadoOptions"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Seleccione el estado']"
                />
              </div>
            </div>

            <q-separator spaced />

            <!-- Paciente con autocomplete -->
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user-injured"></i>
                <span>Paciente</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.paciente_id"
                filled
                dense
                use-input
                input-debounce="300"
                :options="pacientesFiltrados"
                option-value="id"
                option-label="label"
                emit-value
                map-options
                @filter="filtrarPacientes"
                placeholder="Buscar por nombre o CI..."
                :rules="[val => !!val || 'Seleccione un paciente']"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-search"></i>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <div class="avatar-small">
                        {{ scope.opt.initials }}
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      <q-item-label caption>CI: {{ scope.opt.ci }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Dentista con autocomplete -->
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user-md"></i>
                <span>Dentista</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.dentista_id"
                filled
                dense
                use-input
                input-debounce="300"
                :options="dentistasFiltrados"
                option-value="id"
                option-label="label"
                emit-value
                map-options
                @filter="filtrarDentistas"
                placeholder="Buscar dentista..."
                :rules="[val => !!val || 'Seleccione un dentista']"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-search"></i>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <div class="avatar-small dentist">
                        {{ scope.opt.initials }}
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Sucursal (opcional) -->
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-building"></i>
                <span>Sucursal</span>
              </label>
              <q-select
                v-model="form.sucursal_id"
                filled
                dense
                use-input
                input-debounce="300"
                :options="sucursalesFiltradas"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                @filter="filtrarSucursales"
                clearable
                placeholder="Seleccione sucursal (opcional)"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-search"></i>
                </template>
              </q-select>
            </div>

            <q-separator spaced />

            <!-- Fecha y Hora -->
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-calendar"></i>
                  <span>Fecha</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.fecha"
                  filled
                  dense
                  type="date"
                  :rules="[val => !!val || 'La fecha es requerida']"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-clock"></i>
                  <span>Hora</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.hora"
                  filled
                  dense
                  type="time"
                  :rules="[val => !!val || 'La hora es requerida']"
                />
              </div>
            </div>

            <!-- Notas -->
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-sticky-note"></i>
                <span>Notas</span>
              </label>
              <q-input
                v-model="form.notas"
                filled
                dense
                type="textarea"
                rows="3"
                placeholder="Notas adicionales (opcional)"
              />
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <!-- Actions -->
        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Cancelar"
            @click="closeDialog"
            class="secondary-btn"
            no-caps
          />
          <q-btn
            type="submit"
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { usePacienteStore } from 'stores/pacienteStore'
import { useDentistaStore } from 'stores/dentistaStore'
import { useSucursalStore } from 'stores/sucursalStore'

export default {
  name: 'EditQuoteDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    quote: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'quote-updated'],
  setup(props, { emit }) {
    const pacienteStore = usePacienteStore()
    const dentistaStore = useDentistaStore()
    const sucursalStore = useSucursalStore()

    const loading = ref(false)
    const pacientesFiltrados = ref([])
    const dentistasFiltrados = ref([])
    const sucursalesFiltradas = ref([])

    const form = ref({
      asunto: '',
      tipo_cita: '',
      estado: '',
      paciente_id: null,
      dentista_id: null,
      sucursal_id: null,
      fecha: '',
      hora: '',
      notas: ''
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // Opciones de tipo de cita
    const tipoCitaOptions = [
      { label: 'Consulta', value: 'consulta' },
      { label: 'Control', value: 'control' },
      { label: 'Seguimiento', value: 'seguimiento' },
      { label: 'Urgencia', value: 'urgencia' },
      { label: 'Cirugía', value: 'cirugia' },
      { label: 'Otro', value: 'otro' }
    ]

    // Opciones de estado
    const estadoOptions = [
      { label: 'Programada', value: 'programada' },
      { label: 'Confirmada', value: 'confirmada' },
      { label: 'Completada', value: 'completada' },
      { label: 'Cancelada', value: 'cancelada' }
    ]

    // Preparar opciones de sucursales dinámicamente
    const prepararOpcionesSucursales = () => {
      return sucursalStore.sucursales.map(s => ({
        label: s.nombre || `Sucursal ${s.id}`,
        value: s.id
      }))
    }

    // Preparar opciones de pacientes
    const prepararOpcionesPacientes = () => {
      return pacienteStore.pacientes
        .filter(p => p.state === 1)
        .map(p => {
          const nombre = pacienteStore.getNombreCompleto(p)
          const initials = `${p.nombre?.charAt(0) || ''}${p.apellido_paterno?.charAt(0) || ''}`.toUpperCase()
          return {
            id: p.id,
            label: `${nombre} - CI: ${p.ci}`,
            nombre,
            ci: p.ci,
            initials
          }
        })
    }

    // Preparar opciones de dentistas
    const prepararOpcionesDentistas = () => {
      return dentistaStore.dentistas.map(d => {
        const nombre = `${d.nombre} ${d.apellido_paterno || ''}`.trim()
        const initials = `${d.nombre?.charAt(0) || ''}${d.apellido_paterno?.charAt(0) || ''}`.toUpperCase()
        return {
          id: d.id,
          label: nombre,
          nombre,
          initials
        }
      })
    }

    // Filtrar pacientes (autocomplete)
    const filtrarPacientes = (val, update) => {
      update(() => {
        const opciones = prepararOpcionesPacientes()
        if (val === '') {
          pacientesFiltrados.value = opciones
        } else {
          const needle = val.toLowerCase()
          pacientesFiltrados.value = opciones.filter(p => 
            p.nombre.toLowerCase().includes(needle) || 
            p.ci.includes(needle)
          )
        }
      })
    }

    // Filtrar dentistas (autocomplete)
    const filtrarDentistas = (val, update) => {
      update(() => {
        const opciones = prepararOpcionesDentistas()
        if (val === '') {
          dentistasFiltrados.value = opciones
        } else {
          const needle = val.toLowerCase()
          dentistasFiltrados.value = opciones.filter(d => 
            d.nombre.toLowerCase().includes(needle)
          )
        }
      })
    }

    // Filtrar sucursales (autocomplete)
    const filtrarSucursales = (val, update) => {
      update(() => {
        const opciones = prepararOpcionesSucursales()
        if (val === '') {
          sucursalesFiltradas.value = opciones
        } else {
          const needle = val.toLowerCase()
          sucursalesFiltradas.value = opciones.filter(s => 
            s.label.toLowerCase().includes(needle)
          )
        }
      })
    }

    // Inicializar formulario con datos de la cita
    const initializeForm = () => {
      if (props.quote) {
        form.value = {
          asunto: props.quote.asunto || '',
          tipo_cita: props.quote.tipo_cita || '',
          estado: props.quote.estado || '',
          paciente_id: props.quote.paciente_id || null,
          dentista_id: props.quote.dentista_id || null,
          sucursal_id: props.quote.sucursal_id || null,
          fecha: props.quote.fecha || '',
          hora: props.quote.hora ? props.quote.hora.substring(0, 5) : '', // Solo HH:MM
          notas: props.quote.notas || ''
        }
      }

      // Inicializar opciones filtradas
      pacientesFiltrados.value = prepararOpcionesPacientes()
      dentistasFiltrados.value = prepararOpcionesDentistas()
      sucursalesFiltradas.value = prepararOpcionesSucursales()
    }

    const resetForm = () => {
      form.value = {
        asunto: '',
        tipo_cita: '',
        estado: '',
        paciente_id: null,
        dentista_id: null,
        sucursal_id: null,
        fecha: '',
        hora: '',
        notas: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveQuote = () => {
      loading.value = true
      
      const updatedQuote = {
        id: props.quote.id, // Mantener ID para la actualización
        asunto: form.value.asunto,
        tipo_cita: form.value.tipo_cita,
        estado: form.value.estado,
        paciente_id: form.value.paciente_id,
        dentista_id: form.value.dentista_id,
        sucursal_id: form.value.sucursal_id,
        fecha: form.value.fecha,
        hora: form.value.hora,
        notas: form.value.notas
      }

      emit('quote-updated', updatedQuote)
      loading.value = false
      closeDialog()
    }

    // Watchers
    watch(() => props.quote, (newQuote) => {
      if (newQuote) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        initializeForm()
      }
    })

    return {
      showDialog,
      form,
      loading,
      tipoCitaOptions,
      estadoOptions,
      sucursalesFiltradas,
      pacientesFiltrados,
      dentistasFiltrados,
      filtrarPacientes,
      filtrarDentistas,
      filtrarSucursales,
      closeDialog,
      saveQuote
    }
  }
}
</script>

<style scoped>
.edit-dialog {
  min-width: 700px;
  max-width: 800px;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  color: white;
}

.dialog-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.field-label i {
  color: #667eea;
  width: 16px;
}

.required {
  color: #f5576c;
  margin-left: 4px;
}

.avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.avatar-small.dentist {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.dialog-actions {
  padding: 16px 24px;
  justify-content: space-between;
}

.secondary-btn {
  color: #6c757d;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.primary-btn:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-dialog {
    min-width: 90vw;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>