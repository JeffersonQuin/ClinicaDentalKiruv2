<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Nuevo Anuncio</div>
            <div class="text-caption">Completa todos los campos para crear un nuevo anuncio</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="formRef" @submit.prevent="createAnuncio" class="q-gutter-md">
          <!-- Título -->
          <q-input 
            v-model="formData.titulo" 
            label="Título del anuncio *" 
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

          <!-- Fechas -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input 
                v-model="formData.fecha_publicacion" 
                label="Fecha de publicación *" 
                type="date" 
                outlined 
                dense
                lazy-rules
                :rules="[val => !!val || 'La fecha de publicación es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input 
                v-model="formData.fecha_expiracion" 
                label="Fecha de expiración" 
                type="date" 
                outlined 
                dense
                lazy-rules
                :rules="[val => !val || val >= formData.fecha_publicacion || 'La fecha de expiración debe ser posterior a la de publicación']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Subir Imagen -->
          <div class="q-mt-md">
            <div class="text-caption text-weight-bold q-mb-xs">Imagen del anuncio:</div>
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
            <div class="text-caption text-weight-bold q-mb-xs">Estado del anuncio:</div>
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
            <q-btn label="Crear Anuncio" type="submit" color="primary" :loading="loading" :disable="!isFormValid" unelevated />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAnuncioStore } from 'src/stores/anuncioStore'
import { useAuthStore } from 'src/stores/authStore'

export default {
  name: 'NewAnuncioDialog',
  props: { modelValue: Boolean },
  emits: ['update:modelValue', 'anuncio-created'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const anuncioStore = useAnuncioStore()
    const authStore = useAuthStore()
    const loading = ref(false)
    const isSubmitting = ref(false)
    const formRef = ref(null)

    const showDialog = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val)
    })

    // Obtener el userId del usuario logueado
    const getCurrentUserId = () => {
      return authStore.user?.id || null
    }

    const formData = ref({
      titulo: '',
      descripcion: '',
      categoria: 'Promoción',
      fecha_publicacion: new Date().toISOString().split('T')[0],
      fecha_expiracion: '',
      imagen: null,
      imagenPreview: '',
      estado: 'activo',
      userId: getCurrentUserId()
    })

    const categorias = [
      { label: 'Promoción', value: 'Promoción' },
      { label: 'Evento', value: 'Evento' },
      { label: 'Aviso', value: 'Aviso' },
      { label: 'Noticia', value: 'Noticia' },
      { label: 'Novedad', value: 'Novedad' },
      { label: 'Oferta Especial', value: 'Oferta Especial' }
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
             formData.value.fecha_publicacion &&
             formData.value.estado
    })

    const resetForm = () => {
      formData.value = {
        titulo: '',
        descripcion: '',
        categoria: 'Promoción',
        fecha_publicacion: new Date().toISOString().split('T')[0],
        fecha_expiracion: '',
        imagen: null,
        imagenPreview: '',
        estado: 'activo',
        userId: getCurrentUserId()
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
          $q.notify({
            type: 'warning',
            message: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)',
            position: 'top-right'
          })
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          $q.notify({
            type: 'warning',
            message: 'La imagen debe ser menor a 5MB',
            position: 'top-right'
          })
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
          // Remover el archivo si no es válido
          files.splice(0, 1)
        }
      }
    }

    const handleFileRemoved = () => {
      if (formData.value.imagenPreview) {
        URL.revokeObjectURL(formData.value.imagenPreview)
      }
      formData.value.imagen = null
      formData.value.imagenPreview = ''
    }

    const removeImage = () => handleFileRemoved()
    const handleImageError = (event) => {
      console.error('Error cargando imagen:', event)
      $q.notify({ 
        type: 'warning', 
        message: 'Error cargando la imagen', 
        position: 'top-right' 
      })
    }

    const createAnuncio = async () => {
      // Prevenir doble submit
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
      
      // Verificar que el usuario esté autenticado
      if (!authStore.isAuthenticated || !authStore.user?.id) {
        $q.notify({
          type: 'negative',
          message: 'Debes estar autenticado para crear un anuncio',
          position: 'top-right',
          timeout: 5000
        })
        return
      }
      
      isSubmitting.value = true
      loading.value = true
      
      try {
        // Asegurar que el userId esté actualizado con el usuario logueado
        const currentUserId = getCurrentUserId()
        if (!currentUserId) {
          throw new Error('No se pudo obtener el ID del usuario autenticado')
        }

        // DEBUG: Verificar los datos antes de enviar
        console.log('Datos del formulario:', {
          ...formData.value,
          imagen: formData.value.imagen ? `Archivo: ${formData.value.imagen.name}` : 'null',
          userId: currentUserId
        })

        // Preparar los datos de texto (excluyendo el archivo)
        const textData = {
          titulo: formData.value.titulo,
          descripcion: formData.value.descripcion,
          categoria: formData.value.categoria,
          fecha_publicacion: formData.value.fecha_publicacion,
          estado: formData.value.estado,
          userId: currentUserId
        }

        // Agregar fecha de expiración solo si existe
        if (formData.value.fecha_expiracion) {
          textData.fecha_expiracion = formData.value.fecha_expiracion
        }

        // DEBUG: Verificar qué enviamos al store
        console.log('Enviando al store:', {
          textData,
          imagen: formData.value.imagen
        })

        // Llamar al store con los datos separados
        const nuevoAnuncio = await anuncioStore.crear(textData, formData.value.imagen)
        
        if (nuevoAnuncio) {
          console.log('Anuncio creado:', nuevoAnuncio)
          emit('anuncio-created', nuevoAnuncio)
          $q.notify({ 
            type: 'positive', 
            message: '¡Anuncio creado exitosamente!', 
            position: 'top-right',
            timeout: 3000
          })
          closeDialog()
        }
      } catch (error) {
        console.error('Error creando anuncio:', error)
        $q.notify({ 
          type: 'negative', 
          message: error.response?.data?.message || 'Error creando el anuncio', 
          position: 'top-right',
          timeout: 5000
        })
      } finally {
        loading.value = false
        isSubmitting.value = false
      }
    }

    // Verificar cómo se abre el diálogo desde el componente padre
    watch(() => props.modelValue, val => { 
      if (val) {
        console.log('Diálogo abierto')
        // Actualizar el userId cada vez que se abre el diálogo
        formData.value.userId = getCurrentUserId()
        resetForm()
        isSubmitting.value = false
      }
    })

    return {
      showDialog,
      formData,
      categorias,
      estadoOptions,
      isFormValid,
      formRef,
      createAnuncio,
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

