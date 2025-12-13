<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="new-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-plus-circle"></i>
            <span>Crear Nueva Sucursal</span>
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
      <q-form ref="formRef" @submit.prevent="createBranch" class="form-container">
        <q-card-section class="dialog-content" style="overflow-y: auto;">
          <div class="welcome-message" style="max-width: 800px; margin: 0 auto 30px;">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar una nueva sucursal de la clínica dental.</p>
          </div>

          <div class="create-form-grid">
            <!-- Left Column -->
            <div class="form-column">
              <h4 class="section-header">Información General</h4>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-building"></i>
                  <span>Nombre de la Sucursal</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.nombre"
                  filled
                  dense
                  lazy-rules
                  :rules="[
                    val => !!val || 'El nombre es requerido',
                    val => (val && val.length >= 3) || 'Mínimo 3 caracteres',
                    val => (val && val.length <= 100) || 'Máximo 100 caracteres'
                  ]"
                  class="form-input"
                  placeholder="Ej: Sucursal Centro"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Departamento</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.ubicacion"
                  filled
                  dense
                  lazy-rules
                  :options="departamentos"
                  :rules="[val => !!val || 'El departamento es requerido']"
                  class="form-input"
                  placeholder="Seleccione un departamento"
                  emit-value
                  map-options
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-map-marker-alt"></i>
                  <span>Dirección Completa</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.direccion"
                  filled
                  dense
                  lazy-rules
                  :rules="[
                    val => !!val || 'La dirección es requerida',
                    val => (val && val.length >= 10) || 'Mínimo 10 caracteres',
                    val => (val && val.length <= 200) || 'Máximo 200 caracteres'
                  ]"
                  class="form-input"
                  placeholder="Ej: Av. 6 de Agosto #123, Centro, Oruro"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-circle-info"></i>
                  <span>Descripción</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.descripcion"
                  filled
                  dense
                  type="textarea"
                  rows="3"
                  lazy-rules
                  :rules="[
                    val => !!val || 'La descripción es requerida',
                    val => (val && val.length >= 10) || 'Mínimo 10 caracteres',
                    val => (val && val.length <= 500) || 'Máximo 500 caracteres'
                  ]"
                  class="form-input"
                  placeholder="Descripción de la sucursal..."
                />
              </div>

              <!-- Imagen -->
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-image"></i>
                  <span>Imagen de la Sucursal</span>
                </label>

                <q-file
                  v-model="imageFile"
                  filled
                  dense
                  accept="image/*"
                  class="form-input"
                  @change="handleImageSelect"
                >
                  <template v-slot:prepend>
                    <i class="fa-solid fa-camera"></i>
                  </template>
                </q-file>

                <div v-if="imagePreview" style="margin-top: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="imagePreview" alt="Preview" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />
                    <q-btn
                      flat
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeImage"
                      label="Eliminar"
                    />
                  </div>
                </div>
              </div>

              <div class="field-group">
                <q-toggle
                  v-model="form.activo"
                  label="Sucursal Activa"
                  color="positive"
                  checked-icon="fa-solid fa-check"
                  unchecked-icon="fa-solid fa-xmark"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <h4 class="section-header">Coordenadas GPS</h4>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>Latitud</span>
                  </label>
                  <q-input
                    v-model.number="form.latitud"
                    filled
                    dense
                    type="number"
                    step="0.000001"
                    class="form-input"
                    placeholder="-17.9758"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>Longitud</span>
                  </label>
                  <q-input
                    v-model.number="form.longitud"
                    filled
                    dense
                    type="number"
                    step="0.000001"
                    class="form-input"
                    placeholder="-67.1101"
                  />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-map"></i>
                  <span>Vista Previa del Mapa</span>
                </label>
                <div class="map-preview">
                  <div v-if="form.latitud && form.longitud" class="map-container-small">
                    <iframe
                      :src="`https://www.google.com/maps?q=${form.latitud},${form.longitud}&hl=es&z=15&output=embed`"
                      width="100%"
                      height="150"
                      style="border:0; border-radius: 8px;"
                      allowfullscreen
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div v-else class="map-placeholder-small">
                    <i class="fa-solid fa-map-location-dot"></i>
                    <p>Ingresa las coordenadas para ver el mapa</p>
                  </div>
                </div>
              </div>

              <div class="field-group">
                <q-btn
                  outline
                  icon="fa-solid fa-location-arrow"
                  label="Usar ubicación por defecto (Oruro)"
                  @click="setDefaultLocation"
                  color="primary"
                  no-caps
                  size="sm"
                />
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
          <q-btn
            type="submit"
            label="Crear Sucursal"
            icon="fa-solid fa-plus-circle"
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

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useSucursalStore } from 'src/stores/sucursalStore'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'branch-created', 'close'])

const $q = useQuasar()
const sucursalStore = useSucursalStore()

// Estado
const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)
const formRef = ref(null)

// Departamentos de Bolivia
const departamentos = [
  { label: 'La Paz', value: 'La Paz' },
  { label: 'Cochabamba', value: 'Cochabamba' },
  { label: 'Santa Cruz', value: 'Santa Cruz' },
  { label: 'Potosí', value: 'Potosí' },
  { label: 'Chuquisaca', value: 'Chuquisaca' },
  { label: 'Oruro', value: 'Oruro' },
  { label: 'Tarija', value: 'Tarija' },
  { label: 'Beni', value: 'Beni' },
  { label: 'Pando', value: 'Pando' },
  { label: 'Otro', value: 'Otro' }
]

const form = ref({
  nombre: '',
  ubicacion: '',
  direccion: '',
  descripcion: '',
  imagen: '',
  latitud: -17.9758,
  longitud: -67.1101,
  activo: true
})

// Computed para el diálogo
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Funciones
const closeDialog = () => {
  emit('close')
  resetForm()
}

const handleImageSelect = (file) => {
  imageFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (imagePreview.value = e.target.result)
    reader.readAsDataURL(file)
  } else {
    imagePreview.value = null
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

const setDefaultLocation = () => {
  form.value.latitud = -17.9758
  form.value.longitud = -67.1101
  form.value.ubicacion = 'Oruro'
}

const resetForm = () => {
  form.value = {
    nombre: '',
    ubicacion: '',
    direccion: '',
    descripcion: '',
    imagen: '',
    latitud: -17.9758,
    longitud: -67.1101,
    activo: true
  }
  removeImage()
  formRef.value?.resetValidation()
}

const createBranch = async () => {
  // Validar formulario
  const isValid = await formRef.value?.validate()
  if (!isValid) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, complete todos los campos requeridos correctamente',
      position: 'top-right'
    })
    return
  }
  
  loading.value = true
  try {
    const created = await sucursalStore.crear(form.value, imageFile.value)
    emit('branch-created', created)
    closeDialog()
  } catch (err) {
    console.error('Error al crear sucursal:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Error al crear la sucursal',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

// Si quieres limpiar la imagen si se cierra el diálogo externamente
watch(showDialog, (val) => {
  if (!val) resetForm()
})
</script>

