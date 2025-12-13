<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-plus"></i>
            <span>Crear Nuevo Usuario</span>
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

      <q-form @submit="createUser" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para crear un nuevo usuario en el sistema.</p>
          </div>

          <div class="form-fields">
            <div class="field-row">
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
                  :rules="[
                    val => !!val || 'El nombre de usuario es requerido',
                    val => val.length >= 3 || 'Mínimo 3 caracteres',
                    val => /^[a-zA-Z0-9_]+$/.test(val) || 'Solo letras, números y guiones bajos'
                  ]"
                  class="form-input"
                  placeholder="usuario123"
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
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>

            <div class="field-row">
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
                  :rules="[val => !!val || 'Seleccione un tipo de usuario']"
                  class="form-input"
                  placeholder="Seleccione el tipo"
                  map-options
                  emit-value
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-toggle-on"></i>
                  <span>Estado Inicial</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.state"
                  filled
                  dense
                  :options="stateOptions"
                  :rules="[val => !!val || 'Seleccione un estado']"
                  class="form-input"
                  placeholder="Seleccione el estado"
                  map-options
                  emit-value
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-lock"></i>
                  <span>Contraseña</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.password"
                  filled
                  dense
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[
                    val => !!val || 'La contraseña es requerida',
                    val => val.length >= 6 || 'Mínimo 6 caracteres',
                    val => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val) || 'Debe contener mayúscula, minúscula y número'
                  ]"
                  class="form-input"
                  placeholder="••••••••"
                >
                  <template v-slot:append>
                    <q-btn
                      :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                      flat
                      round
                      dense
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-lock-open"></i>
                  <span>Confirmar Contraseña</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.confirmPassword"
                  filled
                  dense
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="[
                    val => !!val || 'Confirme la contraseña',
                    val => val === form.password || 'Las contraseñas no coinciden'
                  ]"
                  class="form-input"
                  placeholder="••••••••"
                >
                  <template v-slot:append>
                    <q-btn
                      :icon="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                      flat
                      round
                      dense
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="field-group full-width">
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
                placeholder="Información adicional sobre el usuario (opcional)"
              />
            </div>

            <div class="field-group full-width">
              <q-checkbox
                v-model="form.sendWelcomeEmail"
                label="Enviar correo de bienvenida al usuario"
                class="welcome-checkbox"
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
            label="Crear Usuario"
            icon="fa-solid fa-user-plus"
            :loading="loading"
            class="primary-btn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'NewUserDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'user-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const form = ref({
      username: '',
      email: '',
      type: '',
      state: 'active',
      password: '',
      confirmPassword: '',
      notes: '',
      sendWelcomeEmail: true
    })

    const userTypeOptions = [
      { label: 'Administrador', value: 'admin' },
      { label: 'Usuario Regular', value: 'user' },
      { label: 'Moderador', value: 'moderator' },
      { label: 'Estándar', value: 'standard' }
    ]

    const stateOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
      { label: 'Pendiente de Activación', value: 'pending' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        username: '',
        email: '',
        type: '',
        state: 'active',
        password: '',
        confirmPassword: '',
        notes: '',
        sendWelcomeEmail: true
      }
      showPassword.value = false
      showConfirmPassword.value = false
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const createUser = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const newUser = {
          username: form.value.username,
          email: form.value.email,
          type: form.value.type,
          state: form.value.state,
          password: form.value.password,
          notes: form.value.notes,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }

        emit('user-created', newUser)
        closeDialog()
      } catch (error) {
        console.error('Error creating user:', error)
      } finally {
        loading.value = false
      }
    }


    return {
      showDialog,
      form,
      userTypeOptions,
      stateOptions,
      loading,
      showPassword,
      showConfirmPassword,
      closeDialog,
      createUser
    }
  }
}
</script>
