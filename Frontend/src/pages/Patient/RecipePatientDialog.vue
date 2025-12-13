<template>
  <q-dialog v-model="showDialog" persistent max-width="700px">
    <q-card class="recipe-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-file-prescription"></i>
            <span>Receta Médica Odontológica</span>
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

      <q-form @submit="saveRecipe" class="form-container">
        <q-card-section class="dialog-content">
          <!-- Información del Paciente -->
          <div class="patient-info-section">
            <h4 class="section-title">
              <i class="fa-solid fa-user-injured"></i>
              Información del Paciente
            </h4>
            <div class="patient-details">
              <div class="patient-main-info">
                <div class="patient-name">{{ pacienteNombre }}</div>
                <div class="patient-meta">
                  <span class="patient-ci"><strong>C.I.:</strong> {{ currentPatient?.ci }}</span>
                  <span class="patient-age"><strong>Edad:</strong> {{ calcularEdad(currentPatient?.fecha_nacimiento) }} años</span>
                  <span class="patient-city"><strong>Ciudad:</strong> {{ currentPatient?.ciudad }}</span>
                </div>
              </div>
              <div class="patient-alerts" v-if="hasClinicalAlerts">
                <div class="alert-badge">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>Alerta Clínica: {{ currentPatient?.alertas_clinicas }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-fields">
            <!-- Información de la Receta -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-file-medical"></i>
                Información de la Receta
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar"></i>
                    <span>Fecha de Emisión</span>
                  </label>
                  <q-input
                    v-model="form.fecha"
                    filled
                    dense
                    readonly
                    class="form-input"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Válida hasta</span>
                  </label>
                  <q-input
                    v-model="form.valida_hasta"
                    filled
                    dense
                    type="date"
                    :rules="[val => !!val || 'La fecha de validez es requerida']"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Diagnóstico -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-stethoscope"></i>
                Diagnóstico
                <span class="required">*</span>
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.diagnostico"
                    filled
                    dense
                    type="textarea"
                    rows="3"
                    :rules="[val => !!val || 'El diagnóstico es requerido']"
                    class="form-input"
                    placeholder="Describa el diagnóstico odontológico..."
                  />
                </div>
              </div>
            </div>

            <!-- Medicamentos -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-pills"></i>
                Medicamentos Recetados
                <span class="required">*</span>
              </h4>
              <div class="medicines-container">
                <div v-for="(medicine, index) in form.medicamentos" :key="index" class="medicine-item">
                  <div class="medicine-header">
                    <span class="medicine-number">Medicamento {{ index + 1 }}</span>
                    <q-btn
                      v-if="form.medicamentos.length > 1"
                      flat
                      round
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeMedicine(index)"
                    />
                  </div>
                  <div class="field-row">
                    <div class="field-group">
                      <label class="field-label">Nombre del Medicamento</label>
                      <q-input
                        v-model="medicine.nombre"
                        filled
                        dense
                        :rules="[val => !!val || 'El nombre es requerido']"
                        placeholder="Ej: Amoxicilina 500mg"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Dosis</label>
                      <q-input
                        v-model="medicine.dosis"
                        filled
                        dense
                        :rules="[val => !!val || 'La dosis es requerida']"
                        placeholder="Ej: 1 tableta cada 8 horas"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Duración</label>
                      <q-input
                        v-model="medicine.duracion"
                        filled
                        dense
                        :rules="[val => !!val || 'La duración es requerida']"
                        placeholder="Ej: 7 días"
                      />
                    </div>
                  </div>
                  <div class="field-row">
                    <div class="field-group full-width">
                      <label class="field-label">Indicaciones Especiales</label>
                      <q-input
                        v-model="medicine.indicaciones"
                        filled
                        dense
                        type="textarea"
                        rows="1"
                        placeholder="Indicaciones adicionales..."
                      />
                    </div>
                  </div>
                </div>
                
                <q-btn
                  outline
                  color="primary"
                  icon="fa-solid fa-plus"
                  label="Agregar Medicamento"
                  @click="addMedicine"
                  class="add-medicine-btn"
                  no-caps
                />
              </div>
            </div>

            <!-- Indicaciones Generales -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-list-check"></i>
                Indicaciones Generales
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.indicaciones_generales"
                    filled
                    dense
                    type="textarea"
                    rows="3"
                    class="form-input"
                    placeholder="Indicaciones generales para el paciente..."
                  />
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-note-sticky"></i>
                Observaciones
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.observaciones"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </div>

            <!-- Odontólogo -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-user-md"></i>
                Información del Odontólogo
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">Odontólogo</label>
                  <q-select
                    v-model="form.dentista_id"
                    :options="dentistOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    filled
                    dense
                    :rules="[val => !!val || 'Seleccione un dentista']"
                    placeholder="Seleccionar dentista"
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
            label="Guardar Receta"
            icon="fa-solid fa-file-prescription"
            :loading="loading"
            class="primary-btn"
            unelevated
            no-caps
          />
          <q-btn
            v-if="savedRecipe"
            label="Imprimir Receta"
            icon="fa-solid fa-print"
            color="secondary"
            @click="printRecipe"
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>

    <!-- PDF Template (hidden) -->
    <div id="recipe-pdf-template" style="position: absolute; left: -9999px; width: 210mm; background: white;">
      <div style="padding: 20px; font-family: Arial, sans-serif; font-size: 12px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="margin: 0; color: #2c3e50;">RECETA MÉDICA ODONTOLÓGICA</h2>
          <p style="margin: 5px 0; font-size: 10px;">{{ clinicaInfo.nombre }}</p>
          <p style="margin: 0; font-size: 10px;">{{ clinicaInfo.direccion }} - Tel: {{ clinicaInfo.telefono }}</p>
        </div>

        <div style="margin-bottom: 15px;">
          <table style="width: 100%; font-size: 11px;">
            <tr>
              <td style="width: 50%;">
                <strong>Paciente:</strong> {{ pacienteNombre }}<br>
                <strong>C.I.:</strong> {{ currentPatient?.ci }}<br>
                <strong>Edad:</strong> {{ calcularEdad(currentPatient?.fecha_nacimiento) }} años
              </td>
              <td style="width: 50%; text-align: right;">
                <strong>Fecha:</strong> {{ formatDate(savedRecipe?.fecha) }}<br>
                <strong>Válida hasta:</strong> {{ formatDate(savedRecipe?.valida_hasta) }}
              </td>
            </tr>
          </table>
        </div>

        <div v-if="currentPatient?.alertas_clinicas" style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 8px; margin-bottom: 15px;">
          <strong style="color: #856404;">⚠ ALERTA CLÍNICA:</strong>
          <span style="color: #856404;">{{ currentPatient.alertas_clinicas }}</span>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DIAGNÓSTICO</h3>
          <p style="margin: 0;">{{ savedRecipe?.diagnostico }}</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">MEDICAMENTOS</h3>
          <div v-for="(med, idx) in savedRecipe?.medicamentos" :key="idx" style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-left: 3px solid #667eea;">
            <div style="font-weight: bold; margin-bottom: 3px;">{{ idx + 1 }}. {{ med.nombre }}</div>
            <div style="font-size: 11px;">
              <strong>Dosis:</strong> {{ med.dosis }}<br>
              <strong>Duración:</strong> {{ med.duracion }}
              <span v-if="med.indicaciones"><br><strong>Indicaciones:</strong> {{ med.indicaciones }}</span>
            </div>
          </div>
        </div>

        <div v-if="savedRecipe?.indicaciones_generales" style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">INDICACIONES GENERALES</h3>
          <p style="margin: 0; font-size: 11px;">{{ savedRecipe.indicaciones_generales }}</p>
        </div>

        <div v-if="savedRecipe?.observaciones" style="margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">OBSERVACIONES</h3>
          <p style="margin: 0; font-size: 11px;">{{ savedRecipe.observaciones }}</p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <div style="border-top: 1px solid #333; display: inline-block; padding-top: 5px; min-width: 200px;">
            <strong>{{ selectedDentistName }}</strong><br>
            <span style="font-size: 10px;">Odontólogo(a)</span>
            <span v-if="selectedDentistColegiatura" style="font-size: 10px;"><br>Reg. {{ selectedDentistColegiatura }}</span>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { usePacienteStore } from 'stores/pacienteStore'
import { useDentistaStore } from 'stores/dentistaStore'
import { useRecetaStore } from 'stores/recetaStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'RecipePatientDialog',
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const pacienteStore = usePacienteStore()
    const dentistaStore = useDentistaStore()
    const recetaStore = useRecetaStore()
    
    const loading = ref(false)
    const savedRecipe = ref(null)
    const today = new Date().toISOString().slice(0, 10)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    
    const clinicaInfo = ref({
      nombre: 'Clínica Dental',
      direccion: 'Av. Principal #123',
      telefono: '(591) 12345678'
    })

    const form = ref({
      fecha: today,
      valida_hasta: nextWeek,
      diagnostico: '',
      medicamentos: [
        {
          nombre: '',
          dosis: '',
          duracion: '',
          indicaciones: ''
        }
      ],
      indicaciones_generales: '',
      observaciones: '',
      dentista_id: null
    })

    // Computed
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const currentPatient = computed(() => props.patientData || pacienteStore.selectedPatient)
    
    const pacienteNombre = computed(() => {
      if (!currentPatient.value) return ''
      const parts = [
        currentPatient.value.nombre,
        currentPatient.value.apellido_paterno,
        currentPatient.value.apellido_materno
      ].filter(Boolean)
      return parts.join(' ')
    })

    const hasClinicalAlerts = computed(() => {
      return currentPatient.value?.alertas_clinicas && 
             currentPatient.value.alertas_clinicas.trim() !== ''
    })

    const dentistOptions = computed(() => {
      return dentistaStore.dentistas.map(d => {
        const nombreCompleto = [
          d.nombre,
          d.segundo_nombre,
          d.apellido_paterno,
          d.apellido_materno
        ].filter(Boolean).join(' ')
        
        return {
          label: nombreCompleto,
          value: d.id
        }
      })
    })

    const selectedDentistName = computed(() => {
      const dentist = dentistaStore.dentistas.find(d => d.id === form.value.dentista_id)
      if (!dentist) return 'Dentista'
      
      return [
        dentist.nombre,
        dentist.segundo_nombre,
        dentist.apellido_paterno,
        dentist.apellido_materno
      ].filter(Boolean).join(' ')
    })

    const selectedDentistColegiatura = computed(() => {
      const dentist = dentistaStore.dentistas.find(d => d.id === form.value.dentista_id)
      return dentist?.colegiatura || null
    })

    // Methods
    const calcularEdad = (fechaNacimiento) => {
      if (!fechaNacimiento) return '--'
      const birth = new Date(fechaNacimiento)
      const today = new Date()
      let edad = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        edad--
      }
      return edad
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('es-ES')
    }

    const addMedicine = () => {
      form.value.medicamentos.push({
        nombre: '',
        dosis: '',
        duracion: '',
        indicaciones: ''
      })
    }

    const removeMedicine = (index) => {
      if (form.value.medicamentos.length > 1) {
        form.value.medicamentos.splice(index, 1)
      }
    }

    const resetForm = () => {
      form.value = {
        fecha: today,
        valida_hasta: nextWeek,
        diagnostico: '',
        medicamentos: [
          {
            nombre: '',
            dosis: '',
            duracion: '',
            indicaciones: ''
          }
        ],
        indicaciones_generales: '',
        observaciones: '',
        dentista_id: null
      }
      savedRecipe.value = null
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveRecipe = async () => {
      if (!currentPatient.value) {
        $q.notify({
          type: 'negative',
          message: 'No hay paciente seleccionado',
          icon: 'fa-solid fa-exclamation-triangle'
        })
        return
      }

      loading.value = true
      try {
        const recetaData = {
          paciente_id: currentPatient.value.id,
          dentista_id: form.value.dentista_id,
          fecha: form.value.fecha,
          valida_hasta: form.value.valida_hasta,
          diagnostico: form.value.diagnostico,
          indicaciones_generales: form.value.indicaciones_generales,
          observaciones: form.value.observaciones,
          medicamentos: form.value.medicamentos
        }

        const result = await recetaStore.crearReceta(recetaData)
        savedRecipe.value = result

        $q.notify({
          type: 'positive',
          message: 'Receta guardada exitosamente',
          icon: 'fa-solid fa-check'
        })
      } catch (error) {
        console.error('Error saving recipe:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al guardar la receta',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      } finally {
        loading.value = false
      }
    }

    const printRecipe = async () => {
      if (!savedRecipe.value) {
        $q.notify({
          type: 'warning',
          message: 'Primero debe guardar la receta',
          icon: 'fa-solid fa-exclamation-triangle'
        })
        return
      }

      try {
        const element = document.getElementById('recipe-pdf-template')
        
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })

        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`receta_${currentPatient.value.ci}_${today}.pdf`)

        $q.notify({
          type: 'positive',
          message: 'PDF generado exitosamente',
          icon: 'fa-solid fa-file-pdf'
        })
      } catch (error) {
        console.error('Error generating PDF:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al generar el PDF',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      }
    }

    watch(() => props.modelValue, (newValue) => {
      if (newValue) resetForm()
    })

    onMounted(async () => {
      if (dentistaStore.dentistas.length === 0) {
        await dentistaStore.obtenerDentistas()
      }
    })

    return {
      showDialog,
      form,
      currentPatient,
      pacienteNombre,
      hasClinicalAlerts,
      dentistOptions,
      selectedDentistName,
      selectedDentistColegiatura,
      loading,
      savedRecipe,
      clinicaInfo,
      addMedicine,
      removeMedicine,
      closeDialog,
      saveRecipe,
      printRecipe,
      calcularEdad,
      formatDate
    }
  }
}
</script>