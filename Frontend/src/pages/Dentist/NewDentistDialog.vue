<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-doctor"></i>
            <span>Crear Nuevo Dentista</span>
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

      <q-form ref="formRef" @submit.prevent="createDentist" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar un nuevo dentista en el sistema.</p>
          </div>

          <!-- Mensaje de error -->
          <q-banner 
            v-if="error" 
            class="bg-negative text-white q-mb-md"
            dense
          >
            <template v-slot:avatar>
              <q-icon name="fa-solid fa-exclamation-triangle" />
            </template>
            {{ error }}
          </q-banner>

          <div class="form-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Nombre</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.nombre"
                  filled
                  dense
                  lazy-rules
                  :rules="[
                    val => !!val || 'El nombre es requerido',
                    val => (val && val.length >= 2) || 'Mínimo 2 caracteres',
                    val => (val && val.length <= 50) || 'Máximo 50 caracteres'
                  ]"
                  class="form-input"
                  placeholder="Carlos"
                  :disable="loading"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Segundo Nombre</span>
                </label>
                <q-input
                  v-model="form.segundo_nombre"
                  filled
                  dense
                  lazy-rules
                  class="form-input"
                  placeholder="Andrés (opcional)"
                  :disable="loading"
                  :rules="[
                    val => !val || (val && val.length <= 50) || 'Máximo 50 caracteres'
                  ]"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-id-card"></i>
                  <span>Apellido Paterno</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.apellido_paterno"
                  filled
                  dense
                  lazy-rules
                  :rules="[
                    val => !!val || 'El apellido paterno es requerido',
                    val => (val && val.length >= 2) || 'Mínimo 2 caracteres',
                    val => (val && val.length <= 50) || 'Máximo 50 caracteres'
                  ]"
                  class="form-input"
                  placeholder="García"
                  :disable="loading"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-id-card"></i>
                  <span>Apellido Materno</span>
                </label>
                <q-input
                  v-model="form.apellido_materno"
                  filled
                  dense
                  lazy-rules
                  class="form-input"
                  placeholder="López (opcional)"
                  :disable="loading"
                  :rules="[
                    val => !val || (val && val.length <= 50) || 'Máximo 50 caracteres'
                  ]"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group full-width">
                <label class="field-label">
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>Especialidades</span>
                </label>
                <q-select
                  v-model="especialidadesSeleccionadas"
                  filled
                  dense
                  multiple
                  :options="especialidadesOptions"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  class="form-input"
                  placeholder="Seleccione las especialidades"
                  use-chips
                  :loading="especialidadesLoading"
                  :disable="loading || especialidadesLoading"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        <q-item-label caption v-if="scope.opt.descripcion">
                          {{ scope.opt.descripcion }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge :color="scope.opt.estado === 'activo' ? 'positive' : 'grey'">
                          {{ scope.opt.estado === 'activo' ? 'Activa' : 'Inactiva' }}
                        </q-badge>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ especialidadesLoading ? 'Cargando especialidades...' : 'No hay especialidades disponibles' }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-toggle-on"></i>
                  <span>Estado Inicial</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.estado"
                  filled
                  dense
                  lazy-rules
                  :options="estadoOptions"
                  :rules="[val => !!val || 'Seleccione un estado']"
                  class="form-input"
                  placeholder="Seleccione el estado"
                  map-options
                  emit-value
                  :disable="loading"
                />
              </div>
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-camera"></i>
                <span>Foto del Dentista</span>
              </label>
              
              <q-file
                v-model="imagenFile"
                filled
                dense
                accept="image/*"
                class="form-input"
                label="Seleccionar imagen"
                @update:model-value="handleImageSelect"
                :disable="loading"
                :max-file-size="5242880"
              >
                <template v-slot:prepend>
                  <q-icon name="fa-solid fa-image" />
                </template>
                <template v-slot:hint>
                  Tamaño máximo: 5MB. Formatos: JPEG, PNG, WebP
                </template>
              </q-file>

              <div v-if="imagenPreview" style="margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <q-avatar size="80px" style="border: 2px solid #ddd;">
                    <img :src="imagenPreview" alt="Preview" style="object-fit: cover; width: 100%; height: 100%;" />
                  </q-avatar>
                  <div style="display: flex; flex-direction: column; gap: 5px;">
                    <q-btn
                      flat
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeImage"
                      label="Eliminar"
                      :disable="loading"
                    />
                    <div class="text-caption text-grey">
                      Vista previa
                    </div>
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
            :disable="loading"
          />
          <q-btn
            type="submit"
            label="Crear Dentista"
            icon="fa-solid fa-user-plus"
            :loading="loading"
            class="primary-btn"
            :disable="!formValid"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useDentistaGestionStore } from 'src/stores/dentistaGestionStore'
import { useEspecialidadStore } from 'src/stores/especialidadStore'

export default {
  name: 'NewDentistDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'dentist-created'],
  setup(props, { emit }) {
    const gestionStore = useDentistaGestionStore()
    const especialidadStore = useEspecialidadStore()
    const imagenFile = ref(null)
    const imagenPreview = ref(null)
    const especialidadesSeleccionadas = ref([])
    const especialidadesLoading = ref(false)
    const error = ref(null)
    const loading = ref(false)
    const isCreating = ref(false)
    const formRef = ref(null)

    const form = ref({
      nombre: '',
      segundo_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      estado: 'activo'
    })

    const estadoOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const especialidadesOptions = computed(() => especialidadStore.especialidades)

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const formValid = computed(() => {
      return form.value.nombre &&
             form.value.nombre.length >= 2 &&
             form.value.apellido_paterno &&
             form.value.apellido_paterno.length >= 2 &&
             form.value.estado &&
             !isCreating.value &&
             !loading.value
    })

    const resetForm = () => {
      form.value = {
        nombre: '',
        segundo_nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        estado: 'activo'
      }
      imagenFile.value = null
      imagenPreview.value = null
      especialidadesSeleccionadas.value = []
      error.value = null
      loading.value = false
      isCreating.value = false
      formRef.value?.resetValidation()
    }

    const closeDialog = () => {
      showDialog.value = false
      // Esperar un poco antes de resetear para evitar efectos visuales
      setTimeout(() => {
        resetForm()
      }, 300)
    }

    const handleImageSelect = (file) => {
      if (!file) {
        imagenFile.value = null
        imagenPreview.value = null
        return
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        error.value = 'Formato no válido. Use JPEG, PNG o WebP'
        imagenFile.value = null
        return
      }

      if (file.size > 5242880) {
        error.value = 'La imagen no debe superar los 5MB'
        imagenFile.value = null
        return
      }

      error.value = null
      imagenFile.value = file

      const reader = new FileReader()
      reader.onload = (e) => {
        imagenPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const removeImage = () => {
      imagenFile.value = null
      imagenPreview.value = null
    }

    const loadEspecialidades = async () => {
      if (especialidadStore.especialidades.length > 0) return

      try {
        especialidadesLoading.value = true
        await especialidadStore.cargarEspecialidades()
      } catch (err) {
        console.error('Error cargando especialidades:', err)
      } finally {
        especialidadesLoading.value = false
      }
    }

    const createDentist = async () => {
      // Prevenir múltiples envíos
      if (isCreating.value || loading.value) {
        console.log('Ya hay una operación en curso, ignorando...')
        return
      }

      // Validar formulario
      const isValid = await formRef.value?.validate()
      if (!isValid) {
        error.value = 'Por favor, complete todos los campos requeridos correctamente'
        return
      }

      isCreating.value = true
      loading.value = true
      error.value = null

      try {
        // Validación básica
        if (!form.value.nombre.trim() || !form.value.apellido_paterno.trim()) {
          error.value = 'Nombre y apellido paterno son requeridos'
          return
        }

        const nuevoDentista = {
          nombre: form.value.nombre.trim(),
          segundo_nombre: form.value.segundo_nombre?.trim() || '',
          apellido_paterno: form.value.apellido_paterno.trim(),
          apellido_materno: form.value.apellido_materno?.trim() || '',
          estado: form.value.estado
        }

        console.log('Creando dentista...', nuevoDentista)

        // Crear dentista con especialidades
        const dentistaCreado = await gestionStore.crearDentistaCompleto(
          nuevoDentista,
          especialidadesSeleccionadas.value,
          imagenFile.value
        )

        console.log('Dentista creado exitosamente:', dentistaCreado)

        if (!dentistaCreado || !dentistaCreado.id) {
          throw new Error('No se recibió el dentista creado con ID válido')
        }

        // Emitir evento SOLO con el dentista creado, sin recargar nada
        emit('dentist-created', dentistaCreado)
        
        // Cerrar el diálogo
        closeDialog()

      } catch (err) {
        console.error('Error al crear dentista:', err)
        error.value = err.response?.data?.error?.message || 
                     err.response?.data?.message || 
                     err.message || 
                     'Error al crear dentista'
      } finally {
        loading.value = false
        isCreating.value = false
      }
    }

    onMounted(() => {
      loadEspecialidades()
    })

    return {
      showDialog,
      form,
      estadoOptions,
      especialidadesOptions,
      especialidadesSeleccionadas,
      especialidadesLoading,
      imagenFile,
      imagenPreview,
      error,
      loading,
      formValid,
      formRef,
      closeDialog,
      createDentist,
      handleImageSelect,
      removeImage
    }
  }
}
</script>