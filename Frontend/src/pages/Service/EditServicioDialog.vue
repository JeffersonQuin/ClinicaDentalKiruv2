<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Editar Servicio</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="formRef" @submit.prevent="updateServicio" class="q-gutter-md">

          <!-- Título -->
          <q-input
            v-model="formData.titulo"
            label="Título del servicio *"
            outlined
            dense
            lazy-rules
            :rules="[
              val => !!val || 'El título es requerido',
              val => (val && val.length >= 3) || 'Mínimo 3 caracteres',
              val => (val && val.length <= 100) || 'Máximo 100 caracteres'
            ]"
            maxlength="100"
            counter
          />

          <!-- Categoría -->
          <q-select
            v-model="formData.categoria"
            :options="categorias"
            label="Categoría *"
            outlined
            dense
            lazy-rules
            :rules="[val => !!val || 'La categoría es requerida']"
            emit-value
            map-options
          />

          <!-- Descripción -->
          <q-input
            v-model="formData.descripcion"
            label="Descripción *"
            type="textarea"
            rows="3"
            outlined
            dense
            lazy-rules
            :rules="[
              val => !!val || 'La descripción es requerida',
              val => (val && val.length >= 10) || 'Mínimo 10 caracteres',
              val => (val && val.length <= 500) || 'Máximo 500 caracteres'
            ]"
            maxlength="500"
            counter
          />

          <!-- Imagen Actual -->
          <div v-if="currentImageUrl && !removeCurrentImageFlag" class="current-image q-mb-md">
            <div class="text-caption text-weight-bold q-mb-xs">Imagen actual:</div>
            <div class="image-preview-container">
              <q-img
                :src="currentImageUrl"
                style="max-height: 150px; max-width: 250px;"
                class="rounded-borders shadow-1"
                @error="handleImageError"
              >
                <template v-slot:loading>
                  <div class="absolute-full flex flex-center bg-grey-2">
                    <q-spinner-gears color="primary" size="30px" />
                  </div>
                </template>
              </q-img>
              <q-btn
                icon="delete"
                round
                dense
                flat
                color="negative"
                size="sm"
                class="remove-image-btn"
                @click="removeCurrentImage"
              />
            </div>
            <div v-if="removeCurrentImageFlag" class="text-negative text-caption q-mt-xs">
              <q-icon name="warning" size="sm" /> La imagen será eliminada
            </div>
          </div>

          <!-- Subir Nueva Imagen -->
          <div class="q-mt-md">
            <div class="text-caption text-weight-bold q-mb-xs">
              {{ hasNewImage ? 'Nueva imagen seleccionada:' : 'Cambiar imagen:' }}
            </div>
            <q-uploader
              ref="uploaderRef"
              accept="image/*"
              :label="hasNewImage ? 'Archivo seleccionado' : 'Arrastra o haz clic para seleccionar una imagen'"
              @added="handleFileAdded"
              @removed="handleFileRemoved"
              :hide-upload-btn="true"
              auto-expand
              color="primary"
              :max-file-size="5242880"
              :max-files="1"
              :filter="checkFileType"
              :no-thumbnails="false"
              class="full-width"
            >
              <template v-slot:list="scope">
                <q-list separator>
                  <q-item v-for="file in scope.files" :key="file.name">
                    <q-item-section>
                      <q-item-label class="full-width ellipsis">
                        {{ file.name }}
                      </q-item-label>
                      <q-item-label caption>
                        Tamaño: {{ (file.size / 1024).toFixed(2) }} KB
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn icon="delete" flat round dense @click="scope.removeFile(file)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </q-uploader>

            <!-- Vista previa de nueva imagen -->
            <div v-if="newImagePreview" class="new-image-preview q-mt-md">
              <div class="text-caption text-weight-bold q-mb-xs">Vista previa nueva imagen:</div>
              <div class="preview-container">
                <q-img
                  :src="newImagePreview"
                  style="max-height: 150px; max-width: 250px;"
                  class="rounded-borders shadow-1"
                  @error="handleImageError"
                >
                  <template v-slot:loading>
                    <div class="absolute-full flex flex-center bg-grey-2">
                      <q-spinner-gears color="primary" size="30px" />
                    </div>
                  </template>
                </q-img>
                <q-btn
                  icon="close"
                  round
                  dense
                  flat
                  color="negative"
                  size="sm"
                  class="preview-close-btn"
                  @click="removeNewImage"
                />
              </div>
            </div>
          </div>

          <!-- Estado -->
          <div class="q-mt-md">
            <div class="text-caption text-weight-bold q-mb-xs">Estado del servicio:</div>
            <q-option-group
              v-model="formData.estado"
              :options="estadoOptions"
              color="primary"
              inline
            />
          </div>

          <!-- Acciones -->
          <q-card-actions align="right" class="q-pt-lg">
            <q-btn label="Cancelar" color="grey-7" @click="closeDialog" flat no-caps />
            <q-btn
              label="Guardar Cambios"
              type="submit"
              color="primary"
              unelevated
              no-caps
              :disable="!isFormValid || loading"
              :loading="loading"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useServicioStore } from 'src/stores/servicioStore'

export default {
  name: 'EditServicioDialog',

  props: {
    modelValue: { type: Boolean, required: true },
    servicioData: { type: Object, default: () => ({}) }
  },

  emits: ['update:modelValue', 'servicio-updated'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const servicioStore = useServicioStore()
    const loading = ref(false)
    const formRef = ref(null)

    // Para manejar archivos
    const newImageFile = ref(null)
    const newImagePreview = ref('')
    const removeCurrentImageFlag = ref(false)

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const formData = ref({
      titulo: '',
      descripcion: '',
      categoria: 'Restauración',
      imagen: null,
      estado: 'activo'
    })

    const categorias = [
      { label: 'Restauración', value: 'Restauración' },
      { label: 'Ortodoncia', value: 'Ortodoncia' },
      { label: 'Endodoncia', value: 'Endodoncia' },
      { label: 'Limpieza', value: 'Limpieza' },
      { label: 'Blanqueamiento', value: 'Blanqueamiento' },
      { label: 'Otros', value: 'Otros' }
    ]

    const estadoOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const isFormValid = computed(() => {
      return formData.value.titulo &&
             formData.value.titulo.length >= 3 &&
             formData.value.descripcion &&
             formData.value.descripcion.length >= 10 &&
             formData.value.categoria &&
             formData.value.estado
    })

    // URL de la imagen actual
    const currentImageUrl = computed(() => {
      if (!props.servicioData?.imagen) return null
      return servicioStore.getImagePath(props.servicioData.imagen)
    })

    const hasNewImage = computed(() => !!newImageFile.value || !!newImagePreview.value)

    const resetForm = () => {
      formData.value = {
        titulo: '',
        descripcion: '',
        categoria: 'Restauración',
        imagen: null,
        estado: 'activo'
      }
      newImageFile.value = null
      newImagePreview.value = ''
      removeCurrentImageFlag.value = false
      formRef.value?.resetValidation()
    }

    const loadServicioData = () => {
      if (props.servicioData && Object.keys(props.servicioData).length > 0) {
        formData.value = {
          id: props.servicioData.id,
          titulo: props.servicioData.titulo || '',
          descripcion: props.servicioData.descripcion || '',
          categoria: props.servicioData.categoria || 'Restauración',
          imagen: props.servicioData.imagen || null,
          estado: props.servicioData.estado || 'activo'
        }
        newImageFile.value = null
        newImagePreview.value = ''
        removeCurrentImageFlag.value = false
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const checkFileType = (files) => {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      for (const file of files) {
        if (!acceptedTypes.includes(file.type)) {
          $q.notify({ type: 'warning', message: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)', position: 'top-right' })
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          $q.notify({ type: 'warning', message: 'La imagen debe ser menor a 5MB', position: 'top-right' })
          return false
        }
      }
      return true
    }

    const handleFileAdded = (files) => {
      if (files.length > 0) {
        const file = files[0]
        if (checkFileType([file])) {
          newImageFile.value = file
          newImagePreview.value = URL.createObjectURL(file)
          removeCurrentImageFlag.value = false
        }
      }
    }

    const handleFileRemoved = () => {
      if (newImagePreview.value) URL.revokeObjectURL(newImagePreview.value)
      newImageFile.value = null
      newImagePreview.value = ''
    }

    const removeNewImage = () => handleFileRemoved()
    const removeCurrentImage = () => {
      removeCurrentImageFlag.value = true
      newImageFile.value = null
      newImagePreview.value = ''
    }
    const handleImageError = (event) => { 
      console.error('Error cargando imagen:', event)
      $q.notify({ type: 'warning', message: 'Error cargando la imagen', position: 'top-right' }) 
    }

    const updateServicio = async () => {
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
      
      if (!isFormValid.value) return
      loading.value = true
      try {
        const textData = {
          titulo: formData.value.titulo,
          descripcion: formData.value.descripcion,
          categoria: formData.value.categoria,
          estado: formData.value.estado
        }

        let imageFile = null
        if (newImageFile.value) imageFile = newImageFile.value
        else if (removeCurrentImageFlag.value) imageFile = null

        const servicioActualizado = await servicioStore.actualizar(
          formData.value.id,
          textData,
          imageFile
        )

        if (servicioActualizado) {
          emit('servicio-updated', servicioActualizado)
          $q.notify({ type: 'positive', message: '¡Servicio actualizado exitosamente!', position: 'top-right', timeout: 3000 })
          closeDialog()
        }
      } catch (error) {
        console.error('Error actualizando servicio:', error)
        $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error al actualizar el servicio', position: 'top-right', timeout: 5000 })
      } finally {
        loading.value = false
      }
    }

    watch(() => props.modelValue, (val) => { if (val) loadServicioData() }, { immediate: true })

    return {
      showDialog,
      formData,
      categorias,
      estadoOptions,
      isFormValid,
      formRef,
      loading,
      currentImageUrl,
      newImagePreview,
      hasNewImage,
      removeCurrentImageFlag,
      updateServicio,
      closeDialog,
      handleFileAdded,
      handleFileRemoved,
      removeNewImage,
      removeCurrentImage,
      handleImageError
    }
  }
}
</script>
