<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-doctor"></i>
            <span>Editar Dentista</span>
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

      <q-form ref="formRef" @submit.prevent="saveDentist" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
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
                placeholder="Ingrese el nombre"
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
                placeholder="Ingrese el segundo nombre (opcional)"
                :rules="[
                  val => !val || (val && val.length <= 50) || 'Máximo 50 caracteres'
                ]"
              />
            </div>

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
                placeholder="Ingrese el apellido paterno"
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
                placeholder="Ingrese el apellido materno (opcional)"
                :rules="[
                  val => !val || (val && val.length <= 50) || 'Máximo 50 caracteres'
                ]"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>Especialidades</span>
              </label>
              <q-select
                v-model="especialidadesSeleccionadas"
                filled
                dense
                multiple
                :options="specialtyOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                use-chips
                class="form-input"
                placeholder="Seleccione las especialidades"
                :loading="gestionStore.cargando"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Estado</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.estado"
                filled
                dense
                lazy-rules
                :options="stateOptions"
                emit-value
                map-options
                :rules="[val => !!val || 'El estado es requerido']"
                class="form-input"
                placeholder="Seleccione el estado"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-image"></i>
                <span>Foto del Dentista</span>
              </label>
              
              <div v-if="form.imagen && !newImageFile" style="margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <q-avatar size="60px">
                    <img :src="getImageUrl(form.imagen)" alt="Preview" />
                  </q-avatar>
                  <q-btn
                    flat
                    dense
                    icon="fa-solid fa-trash"
                    color="negative"
                    size="sm"
                    @click="removeCurrentImage"
                    label="Eliminar foto actual"
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
                <template v-slot:hint>
                  La imagen se guardará en /public/dentists/
                </template>
              </q-file>

              <div v-if="imagePreview" style="margin-top: 10px;">
                <q-avatar size="60px">
                  <img :src="imagePreview" alt="Preview" />
                </q-avatar>
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
          />
          <q-btn
            type="submit"
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useDentistaGestionStore } from 'src/stores/dentistaGestionStore'
import { useEspecialidadStore } from 'src/stores/especialidadStore'

export default {
  name: 'EditDentistDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    dentistData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'dentist-updated'],
  setup(props, { emit }) {
    const gestionStore = useDentistaGestionStore()
    const especialidadStore = useEspecialidadStore()
    const loading = ref(false)
    const newImageFile = ref(null)
    const imagePreview = ref(null)
    const especialidadesSeleccionadas = ref([])
    const formRef = ref(null)
    
    const form = ref({
      id: null,
      nombre: '',
      segundo_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      estado: 'activo',
      imagen: null
    })

    const specialtyOptions = computed(() => 
      especialidadStore.especialidades
        .filter(spec => spec.estado === 'activo')
        .map(spec => ({
          label: spec.nombre,
          value: spec.id
        }))
    )

    const stateOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.dentistData) {
        form.value = {
          id: props.dentistData.id,
          nombre: props.dentistData.nombre || '',
          segundo_nombre: props.dentistData.segundo_nombre || '',
          apellido_paterno: props.dentistData.apellido_paterno || '',
          apellido_materno: props.dentistData.apellido_materno || '',
          estado: props.dentistData.estado || 'activo',
          imagen: props.dentistData.imagen || null
        }
        // Cargar especialidades del dentista
        especialidadesSeleccionadas.value = props.dentistData.especialidades?.map(e => e.id) || []
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        nombre: '',
        segundo_nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        estado: 'activo',
        imagen: null
      }
      newImageFile.value = null
      imagePreview.value = null
      especialidadesSeleccionadas.value = []
      formRef.value?.resetValidation()
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
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
      form.value.imagen = null
      newImageFile.value = null
      imagePreview.value = null
    }

    const getImageUrl = (imagen) => {
      if (!imagen) return ''
      if (imagen.startsWith('http')) return imagen
      return `http://localhost:5050${imagen}`
    }

    const saveDentist = async () => {
      // Prevenir múltiples envíos
      if (loading.value) {
        console.log('Ya hay una operación en curso, ignorando...')
        return
      }

      // Validar formulario
      const isValid = await formRef.value?.validate()
      if (!isValid) {
        alert('Por favor, complete todos los campos requeridos correctamente')
        return
      }

      // Validación básica
      if (!form.value.nombre?.trim() || !form.value.apellido_paterno?.trim()) {
        alert('Nombre y apellido paterno son requeridos')
        return
      }

      if (!form.value.id) {
        alert('Error: No se encontró el ID del dentista')
        return
      }

      loading.value = true
      
      try {
        const datosDentista = {
          nombre: form.value.nombre.trim(),
          segundo_nombre: form.value.segundo_nombre?.trim() || '',
          apellido_paterno: form.value.apellido_paterno.trim(),
          apellido_materno: form.value.apellido_materno?.trim() || '',
          estado: form.value.estado
        }

        console.log('Actualizando dentista:', {
          id: form.value.id,
          datos: datosDentista,
          especialidades: especialidadesSeleccionadas.value,
          tieneImagenNueva: !!newImageFile.value
        })

        // Usar el store de gestión que maneja todo (dentista + especialidades)
        const dentistaActualizado = await gestionStore.actualizarDentistaCompleto(
          form.value.id,
          datosDentista,
          especialidadesSeleccionadas.value,
          newImageFile.value
        )

        if (!dentistaActualizado) {
          throw new Error('No se pudo actualizar el dentista')
        }

        console.log('Dentista actualizado exitosamente:', dentistaActualizado)
        emit('dentist-updated', dentistaActualizado)
        closeDialog()
      } catch (error) {
        console.error('Error updating dentist:', error)
        const errorMessage = error.response?.data?.error?.message || 
                           error.response?.data?.message || 
                           error.message || 
                           'Error al actualizar el dentista'
        alert(errorMessage)
      } finally {
        loading.value = false
      }
    }

    const loadEspecialidades = async () => {
      if (especialidadStore.especialidades.length === 0) {
        await especialidadStore.cargarEspecialidades()
      }
    }

    watch(() => props.dentistData, (newData) => {
      if (newData) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        initializeForm()
        loadEspecialidades()
      }
    })

    onMounted(() => {
      loadEspecialidades()
    })

    return {
      showDialog,
      form,
      specialtyOptions,
      stateOptions,
      loading,
      newImageFile,
      imagePreview,
      especialidadesSeleccionadas,
      gestionStore,
      formRef,
      closeDialog,
      saveDentist,
      handleImageSelect,
      removeCurrentImage,
      getImageUrl
    }
  }
}
</script>