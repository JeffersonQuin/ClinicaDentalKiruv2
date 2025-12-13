<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Nuevo Servicio</div>
            <div class="text-caption">Completa todos los campos para crear un nuevo servicio</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="formRef" @submit.prevent="createServicio" class="q-gutter-md">
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

          <!-- Subir Imagen -->
          <div class="q-mt-md">
            <div class="text-caption text-weight-bold q-mb-xs">Imagen del servicio:</div>
            <q-uploader 
              accept="image/*" 
              label="Arrastra o haz clic para seleccionar una imagen"
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

            <!-- Vista previa de imagen -->
            <div v-if="formData.imagenPreview" class="image-preview q-mt-md">
              <div class="text-caption text-weight-bold q-mb-xs">Vista previa:</div>
              <div class="preview-container">
                <q-img 
                  :src="formData.imagenPreview" 
                  style="max-height: 200px; max-width: 300px;"
                  class="rounded-borders shadow-1"
                  @error="handleImageError"
                >
                  <template v-slot:loading>
                    <div class="absolute-full flex flex-center bg-grey-2">
                      <q-spinner-gears color="primary" size="50px" />
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
                  @click="removeImage"
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
            <q-btn label="Cancelar" color="grey-7" @click="closeDialog" flat />
            <q-btn label="Crear Servicio" type="submit" color="primary" :loading="loading" :disable="!isFormValid" unelevated />
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
  name: 'NewServicioDialog',
  props: { modelValue: Boolean },
  emits: ['update:modelValue', 'servicio-created'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const servicioStore = useServicioStore()
    const loading = ref(false)
    const isSubmitting = ref(false)
    const formRef = ref(null)

    const showDialog = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val)
    })

    const formData = ref({
      titulo: '',
      descripcion: '',
      categoria: 'Restauración',
      imagen: null,
      imagenPreview: '',
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

    const resetForm = () => {
      formData.value = {
        titulo: '',
        descripcion: '',
        categoria: 'Restauración',
        imagen: null,
        imagenPreview: '',
        estado: 'activo'
      }
      formRef.value?.resetValidation()
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
          formData.value.imagen = file
          formData.value.imagenPreview = URL.createObjectURL(file)
        } else {
          files.splice(0, 1)
        }
      }
    }

    const handleFileRemoved = () => {
      if (formData.value.imagenPreview) URL.revokeObjectURL(formData.value.imagenPreview)
      formData.value.imagen = null
      formData.value.imagenPreview = ''
    }

    const removeImage = () => handleFileRemoved()
    const handleImageError = (event) => { 
      console.error('Error cargando imagen:', event)
      $q.notify({ type: 'warning', message: 'Error cargando la imagen', position: 'top-right' }) 
    }

    const createServicio = async () => {
      if (isSubmitting.value) return
      
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
      isSubmitting.value = true
      loading.value = true

      try {
        const textData = {
          titulo: formData.value.titulo,
          descripcion: formData.value.descripcion,
          categoria: formData.value.categoria,
          estado: formData.value.estado
        }

        const nuevoServicio = await servicioStore.crear(textData, formData.value.imagen)
        if (nuevoServicio) {
          emit('servicio-created', nuevoServicio)
          $q.notify({ type: 'positive', message: '¡Servicio creado exitosamente!', position: 'top-right', timeout: 3000 })
          closeDialog()
        }
      } catch (error) {
        console.error('Error creando servicio:', error)
        $q.notify({ type: 'negative', message: error.response?.data?.message || 'Error creando el servicio', position: 'top-right', timeout: 5000 })
      } finally {
        loading.value = false
        isSubmitting.value = false
      }
    }

    watch(() => props.modelValue, val => { 
      if (val) resetForm(), isSubmitting.value = false
    })

    return {
      showDialog,
      formData,
      categorias,
      estadoOptions,
      isFormValid,
      formRef,
      createServicio,
      closeDialog,
      loading,
      handleFileAdded,
      handleFileRemoved,
      removeImage,
      handleImageError
    }
  }
}
</script>
