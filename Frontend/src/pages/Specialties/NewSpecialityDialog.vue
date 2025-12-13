<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-tooth"></i>
            <span>Crear Nueva Especialidad</span>
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

      <q-form ref="formRef" @submit.prevent="createSpeciality" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para crear una nueva especialidad en el sistema.</p>
          </div>

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
                placeholder="Ej: Ortodoncia, Endodoncia, Periodoncia..."
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
                placeholder="Ingrese una descripción detallada de la especialidad, sus características y procedimientos principales..."
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
            label="Crear Especialidad"
            icon="fa-solid fa-tooth"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useEspecialidadStore } from 'src/stores/especialidadStore'

export default {
  name: 'NewSpecialityDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const store = useEspecialidadStore()
    const loading = ref(false)
    const formRef = ref(null)

    const form = ref({
      nombre: '',
      descripcion: ''
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        nombre: '',
        descripcion: ''
      }
      if (formRef.value) formRef.value.resetValidation()
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const createSpeciality = async () => {
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
        const newSpeciality = {
          nombre: form.value.nombre.trim(),
          descripcion: form.value.descripcion.trim()
        }

        // Crear la especialidad directamente en el store
        await store.crearEspecialidad(newSpeciality)

        $q.notify({
          type: 'positive',
          message: `Especialidad "${newSpeciality.nombre}" creada correctamente`,
          icon: 'fa-solid fa-check-circle',
          timeout: 3000
        })

        closeDialog()
      } catch (error) {
        console.error('Error creando especialidad:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al crear la especialidad. Inténtelo nuevamente.',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 4000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      loading,
      formRef,
      closeDialog,
      createSpeciality
    }
  }
}
</script>
