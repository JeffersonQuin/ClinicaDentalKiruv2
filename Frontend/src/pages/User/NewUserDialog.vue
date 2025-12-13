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
                    val => val.length >= 3 || 'Mínimo 3 caracteres'
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
                  v-model="form.tipo"
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
                  v-model="form.estado"
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
                    val => val.length >= 6 || 'Mínimo 6 caracteres'
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
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'

export default {
  name: 'NewUserDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'created'],
  
  setup(props, { emit }) {
    const $q = useQuasar()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const form = ref({
      username: '',
      email: '',
      tipo: '',
      state: 'activo',
      password: '',
      confirmPassword: ''
    })

    const userTypeOptions = [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Dentista', value: 'DENTIST' },
      { label: 'Cliente', value: 'CLIENT' }
    ]

    const stateOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        username: '',
        email: '',
        tipo: '',
        state: 'activo',
        password: '',
        confirmPassword: ''
      }
      showPassword.value = false
      showConfirmPassword.value = false
    }

    const closeDialog = () => {
      resetForm()
      showDialog.value = false
    }

    const createUser = async () => {
      if (form.value.password !== form.value.confirmPassword) {
        $q.notify({
          type: 'warning',
          message: 'Las contraseñas no coinciden'
        })
        return
      }

      loading.value = true
      
      try {
        const userData = {
          username: form.value.username,
          email: form.value.email,
          tipo: form.value.tipo,
          state: form.value.state,
          password: form.value.password
        }

        await userStore.agregarUser(userData)

        $q.notify({
          type: 'positive',
          message: 'Usuario creado exitosamente',
          icon: 'fa-solid fa-check'
        })

        emit('created')
        closeDialog()
      } catch (error) {
        console.error('Error creating user:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear el usuario',
          icon: 'fa-solid fa-exclamation-triangle'
        })
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

<style scoped>
.new-dialog {
  min-width: 700px;
  max-width: 900px;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
}

.header-title i {
  font-size: 24px;
}

.close-btn {
  color: white;
}

.dialog-content {
  padding: 24px;
}

.welcome-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  margin-bottom: 24px;
}

.welcome-message i {
  color: #2196f3;
  font-size: 20px;
}

.welcome-message p {
  margin: 0;
  color: #1565c0;
  font-size: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.field-label i {
  color: #667eea;
  font-size: 14px;
}

.required {
  color: #f44336;
  font-weight: 600;
}

.dialog-actions {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-btn {
  color: #666;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-width: 160px;
}
</style>