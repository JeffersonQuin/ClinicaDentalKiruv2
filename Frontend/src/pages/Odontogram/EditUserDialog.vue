<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-edit"></i>
            <span>Editar Usuario</span>
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

      <q-form @submit="saveUser" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user"></i>
                <span>Nombre de Usuario</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.username"
                filled
                dense
                :rules="[val => !!val || 'El nombre de usuario es requerido']"
                class="form-input"
                placeholder="Ingrese el nombre de usuario"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-envelope"></i>
                <span>Correo Electrónico</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.email"
                filled
                dense
                type="email"
                :rules="[
                  val => !!val || 'El correo electrónico es requerido',
                  val => /.+@.+\..+/.test(val) || 'Ingrese un correo válido'
                ]"
                class="form-input"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user-tag"></i>
                <span>Tipo de Usuario</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.type"
                filled
                dense
                :options="userTypeOptions"
                emit-value
                map-options
                :rules="[val => !!val || 'El tipo de usuario es requerido']"
                class="form-input"
                placeholder="Seleccione el tipo"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Estado</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.state"
                filled
                dense
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
                <i class="fa-solid fa-lock"></i>
                <span>Nueva Contraseña</span>
                <span class="optional">(opcional)</span>
              </label>
              <q-input
                v-model="form.password"
                filled
                dense
                type="password"
                :rules="[
                  val => !val || val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
                ]"
                class="form-input"
                placeholder="Dejar vacío para mantener la actual"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-sticky-note"></i>
                <span>Notas Adicionales</span>
              </label>
              <q-input
                v-model="form.notes"
                filled
                dense
                type="textarea"
                rows="3"
                class="form-input"
                placeholder="Información adicional sobre el usuario"
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
import { ref, computed, watch } from 'vue'

export default {
  name: 'EditUserDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'user-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = ref({
      id: null,
      username: '',
      email: '',
      type: '',
      state: '',
      password: '',
      notes: ''
    })

    const userTypeOptions = [
      { label: 'Administrador', value: 'admin' },
      { label: 'Usuario', value: 'user' },
      { label: 'Moderador', value: 'moderator' },
    ]

    const stateOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.userData) {
        form.value = {
          id: props.userData.id,
          username: props.userData.username || '',
          email: props.userData.email || '',
          type: props.userData.type || '',
          state: props.userData.state || '',
          password: '',
          notes: props.userData.notes || ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        username: '',
        email: '',
        type: '',
        state: '',
        password: '',
        notes: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveUser = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedUser = {
          ...props.userData,
          username: form.value.username,
          email: form.value.email,
          type: form.value.type,
          state: form.value.state,
          notes: form.value.notes,
          updatedAt: new Date().toISOString()
        }

        if (form.value.password) {
          updatedUser.password = form.value.password
        }

        emit('user-updated', updatedUser)
        
        closeDialog()
      } catch (error) {
        console.error('Error updating user:', error)
        
      } finally {
        loading.value = false
      }
    }

    watch(() => props.userData, (newData) => {
      if (newData) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        initializeForm()
      }
    })

    return {
      showDialog,
      form,
      userTypeOptions,
      stateOptions,
      loading,
      closeDialog,
      saveUser
    }
  }
}
</script>
