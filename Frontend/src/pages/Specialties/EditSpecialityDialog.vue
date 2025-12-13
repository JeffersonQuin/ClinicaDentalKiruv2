<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-tooth"></i>
            <span>Editar Especialidad</span>
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

      <q-form ref="formRef" @submit="saveSpeciality" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-tag"></i>
                <span>Nombre de la Especialidad</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.nombre"
                filled
                dense
                lazy-rules
                :rules="[
                  val => !!val || 'El nombre de la especialidad es requerido',
                  val => (val && val.length >= 3) || 'Mínimo 3 caracteres',
                  val => (val && val.length <= 100) || 'Máximo 100 caracteres'
                ]"
                class="form-input"
                placeholder="Ingrese el nombre de la especialidad"
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-align-left"></i>
                <span>Descripción</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.descripcion"
                filled
                dense
                type="textarea"
                rows="6"
                lazy-rules
                :rules="[
                  val => !!val || 'La descripción es requerida',
                  val => (val && val.length >= 20) || 'Mínimo 20 caracteres',
                  val => (val && val.length <= 1000) || 'Máximo 1000 caracteres'
                ]"
                class="form-input"
                placeholder="Ingrese una descripción detallada de la especialidad"
              />
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
            type="button"
          />
          <q-btn
            type="submit"
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
            :disable="!form.nombre || form.nombre.length < 3 || !form.descripcion || form.descripcion.length < 20"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'EditSpecialityDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    specialityData: {  // Cambiado de specialityId a specialityData
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'speciality-updated'],  // Agregado este emit
  setup(props, { emit }) {
    const $q = useQuasar()
    const loading = ref(false)
    const formRef = ref(null)

    const form = ref({
      id: null,
      nombre: '',
      descripcion: '',
      estado: 'activo'
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.specialityData && props.specialityData.id) {
        form.value = {
          id: props.specialityData.id,
          nombre: props.specialityData.nombre || '',
          descripcion: props.specialityData.descripcion || '',
          estado: props.specialityData.estado || 'activo'
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        nombre: '',
        descripcion: '',
        estado: 'activo'
      }
      if (formRef.value) formRef.value.resetValidation()
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveSpeciality = async () => {
      const isValid = await formRef.value.validate()
      if (!isValid) {
        $q.notify({
          type: 'warning',
          message: 'Por favor, complete todos los campos requeridos correctamente',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 3000
        })
        return
      }

      loading.value = true
      try {
        // Emitir los datos actualizados al componente padre, incluyendo el estado
        const updatedSpeciality = {
          id: form.value.id,
          nombre: form.value.nombre.trim(),
          descripcion: form.value.descripcion.trim(),
          estado: form.value.estado || 'activo'
        }
        
        emit('speciality-updated', updatedSpeciality)
        
        $q.notify({
          type: 'positive',
          message: `Especialidad "${form.value.nombre}" actualizada correctamente`,
          icon: 'fa-solid fa-check-circle',
          timeout: 3000
        })
        
        closeDialog()
      } catch (error) {
        console.error('Error en el diálogo de edición:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al actualizar la especialidad. Inténtelo nuevamente.',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 4000
        })
      } finally {
        loading.value = false
      }
    }

    watch(() => props.modelValue, (val) => {
      if (val) initializeForm()
    })

    // También observar cambios en specialityData
    watch(() => props.specialityData, (val) => {
      if (val && val.id) {
        initializeForm()
      }
    }, { immediate: true })

    return {
      showDialog,
      form,
      loading,
      formRef,
      closeDialog,
      saveSpeciality
    }
  }
}
</script>