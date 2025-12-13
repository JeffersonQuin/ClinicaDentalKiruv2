<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Nueva Cita</span>
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
      <q-form @submit.prevent="createQuote" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            
            <!-- Asunto y Tipo de Cita -->
            <div class="field-row">
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
            </div>

            <q-separator spaced />

            <!-- Paciente con autocomplete y búsqueda por CI -->
            <div class="field-group highlighted">
              <label class="field-label">
                <i class="fa-solid fa-user-injured"></i>
                <span>Paciente</span>
                <span class="required">*</span>
              </label>
              
              <!-- Búsqueda rápida por CI -->
              <div class="search-row">
                <q-input
                  v-model="searchCI"
                  filled
                  dense
                  placeholder="Buscar por CI"
                  @keyup.enter="buscarPorCI"
                  class="ci-input"
                >
                  <template v-slot:prepend>
                    <i class="fa-solid fa-id-card"></i>
                  </template>
                </q-input>
                <q-btn
                  flat
                  dense
                  icon="fa-solid fa-search"
                  @click="buscarPorCI"
                  color="primary"
                  class="search-btn"
                >
                  <q-tooltip>Buscar por CI</q-tooltip>
                </q-btn>
              </div>

              <!-- Select con autocomplete -->
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
                placeholder="O seleccione de la lista..."
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

              <!-- Paciente seleccionado -->
              <div v-if="pacienteSeleccionado" class="selected-info">
                <i class="fa-solid fa-check-circle"></i>
                <span>{{ pacienteSeleccionado.nombre }}</span>
                <q-chip dense color="primary" text-color="white" size="sm">
                  CI: {{ pacienteSeleccionado.ci }}
                </q-chip>
              </div>
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
            label="Crear Cita"
            icon="fa-solid fa-calendar-plus"
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
import { useQuasar } from 'quasar'
import { usePacienteStore } from 'stores/pacienteStore'
import { useDentistaStore } from 'stores/dentistaStore'
import { useSucursalStore } from 'stores/sucursalStore'

export default {
  name: 'NewQuoteDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'quote-created'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const pacienteStore = usePacienteStore()
    const dentistaStore = useDentistaStore()
    const sucursalStore = useSucursalStore()

    const loading = ref(false)
    const searchCI = ref('')
    const pacientesFiltrados = ref([])
    const dentistasFiltrados = ref([])
    const sucursalesFiltradas = ref([])

    const form = ref({
      asunto: '',
      tipo_cita: 'consulta', // Default
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

    // Preparar opciones de sucursales dinámicamente
    const prepararOpcionesSucursales = () => {
      return sucursalStore.sucursales.map(s => ({
        label: s.nombre || `Sucursal ${s.id}`,
        value: s.id
      }))
    }

    // Paciente seleccionado (computed)
    const pacienteSeleccionado = computed(() => {
      if (!form.value.paciente_id) return null
      const paciente = pacienteStore.pacientes.find(p => p.id === form.value.paciente_id)
      if (!paciente) return null
      return {
        nombre: pacienteStore.getNombreCompleto(paciente),
        ci: paciente.ci
      }
    })

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

    // Buscar paciente por CI
    const buscarPorCI = () => {
      if (!searchCI.value.trim()) {
        $q.notify({
          type: 'warning',
          message: 'Ingrese un número de CI',
          position: 'top',
          timeout: 2000
        })
        return
      }

      const paciente = pacienteStore.pacientes.find(
        p => p.state === 1 && String(p.ci) === String(searchCI.value.trim())
      )

      if (paciente) {
        form.value.paciente_id = paciente.id
        $q.notify({
          type: 'positive',
          message: `Paciente encontrado: ${pacienteStore.getNombreCompleto(paciente)}`,
          position: 'top',
          timeout: 2000
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'No se encontró ningún paciente con ese CI',
          position: 'top',
          timeout: 2000
        })
      }
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

    const resetForm = () => {
      searchCI.value = ''
      form.value = {
        asunto: '',
        tipo_cita: 'consulta',
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

    const createQuote = () => {
      if (!form.value.paciente_id) {
        $q.notify({
          type: 'negative',
          message: 'Debe seleccionar un paciente',
          position: 'top',
          timeout: 2000
        })
        return
      }

      if (!form.value.dentista_id) {
        $q.notify({
          type: 'negative',
          message: 'Debe seleccionar un dentista',
          position: 'top',
          timeout: 2000
        })
        return
      }

      loading.value = true

      const nuevaCita = {
        asunto: form.value.asunto,
        tipo_cita: form.value.tipo_cita,
        estado: 'programada',
        paciente_id: form.value.paciente_id,
        dentista_id: form.value.dentista_id,
        sucursal_id: form.value.sucursal_id,
        fecha: form.value.fecha,
        hora: form.value.hora,
        notas: form.value.notas
      }

      emit('quote-created', nuevaCita)
      loading.value = false
      closeDialog()
    }

    // Inicializar opciones al abrir
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        pacientesFiltrados.value = prepararOpcionesPacientes()
        dentistasFiltrados.value = prepararOpcionesDentistas()
        sucursalesFiltradas.value = prepararOpcionesSucursales()
      }
    })

    return {
      showDialog,
      form,
      loading,
      searchCI,
      tipoCitaOptions,
      sucursalesFiltradas,
      pacientesFiltrados,
      dentistasFiltrados,
      pacienteSeleccionado,
      buscarPorCI,
      filtrarPacientes,
      filtrarDentistas,
      filtrarSucursales,
      closeDialog,
      createQuote
    }
  }
}
</script>

<style scoped>
.new-dialog {
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

.field-group.highlighted {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
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

.search-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ci-input {
  flex: 1;
}

.search-btn {
  min-width: 40px;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.selected-info i {
  color: #28a745;
  font-size: 1.2rem;
}

.selected-info span {
  font-weight: 600;
  color: #212529;
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
  .new-dialog {
    min-width: 90vw;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .search-row {
    flex-direction: column;
  }

  .ci-input {
    width: 100%;
  }
}
</style>