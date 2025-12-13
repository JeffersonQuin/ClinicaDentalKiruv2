<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-edit"></i>
            <span>Editar Sucursal</span>
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

      <q-form ref="formRef" @submit.prevent="saveBranch" class="form-container">
        <q-card-section class="dialog-content" style="overflow-y: auto;">
          <div class="edit-form-grid">
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

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-image"></i>
                  <span>Imagen de la Sucursal</span>
                </label>

                <div v-if="form.imagen && !newImageFile" style="margin-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="imagePath" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                    <q-btn
                      flat
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeCurrentImage"
                      label="Eliminar imagen"
                    />
                  </div>
                </div>

                <q-file
                  v-model="newImageFile"
                  filled
                  dense
                  accept="image/*"
                  class="form-input"
                  label="Seleccionar nueva imagen"
                  @update:model-value="handleImageSelect"
                >
                  <template v-slot:prepend>
                    <i class="fa-solid fa-camera"></i>
                  </template>
                </q-file>

                <div v-if="imagePreview" style="margin-top: 10px;">
                  <img :src="imagePreview" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
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
                      allowfullscreen=""
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
            :disabled="loading"
          />
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
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useSucursalStore } from 'src/stores/sucursalStore' // Ajusta la ruta según tu estructura

export default {
  name: 'EditBranchDialog',
  props: {
    modelValue: Boolean,
    branchData: Object
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const sucursalStore = useSucursalStore()
    const loading = ref(false)
    const newImageFile = ref(null)
    const imagePreview = ref(null)
    const error = ref(null)
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
      id: null,
      nombre: '',
      ubicacion: '',
      direccion: '',
      descripcion: '',
      imagen: '',
      latitud: 0,
      longitud: 0,
      activo: true
    })

    // Computed para obtener la imagen con la ruta completa
    const imagePath = computed(() => {
      if (!form.value.imagen) return ''
      return sucursalStore.getImagePath(form.value.imagen)
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      error.value = null
      if (props.branchData) {
        form.value = {
          ...props.branchData,
          activo: props.branchData.activo === 1 // convierte 1 a true, 0 a false
        }
        newImageFile.value = null
        imagePreview.value = null
      }
    }

    const closeDialog = () => {
      emit('close')
    }

    const handleImageSelect = (file) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        imagePreview.value = null
      }
    }

    const removeCurrentImage = () => {
      form.value.imagen = ''
    }

    const saveBranch = async () => {
      if (loading.value) return
      
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
      error.value = null

      try {
        const dataToUpdate = {
          nombre: form.value.nombre,
          ubicacion: form.value.ubicacion,
          direccion: form.value.direccion,
          descripcion: form.value.descripcion,
          latitud: form.value.latitud,
          longitud: form.value.longitud,
          activo: form.value.activo ? 1 : 0,
          // Solo enviar imagen si se eliminó la existente o se seleccionó nueva
          imagen: form.value.imagen || null
        }

        // Usar el store para actualizar
        const updatedBranch = await sucursalStore.actualizar(
          form.value.id,
          dataToUpdate,
          newImageFile.value
        )

        if (updatedBranch) {
          // Cerrar el diálogo después de actualizar
          closeDialog()
          // Limpiar estados
          newImageFile.value = null
          imagePreview.value = null
        } else {
          throw new Error('No se pudo actualizar la sucursal')
        }
        
      } catch (err) {
        console.error('Error actualizando sucursal:', err)
        error.value = err.message || 'Error al actualizar la sucursal'
        
        // Mostrar mensaje de error (puedes usar Quasar Notify aquí)
        // this.$q.notify({
        //   type: 'negative',
        //   message: error.value
        // })
        
      } finally {
        loading.value = false
      }
    }

    // Reiniciar estados cuando se cierra el diálogo
    watch(showDialog, (newValue) => {
      if (!newValue) {
        loading.value = false
        newImageFile.value = null
        imagePreview.value = null
        error.value = null
      }
    })

    // Inicializar el formulario cuando cambia branchData
    watch(() => props.branchData, initializeForm, { immediate: true })

    return {
      showDialog,
      form,
      formRef,
      departamentos,
      loading,
      newImageFile,
      imagePreview,
      imagePath,
      error,
      closeDialog,
      saveBranch,
      handleImageSelect,
      removeCurrentImage
    }
  }
}
</script>

