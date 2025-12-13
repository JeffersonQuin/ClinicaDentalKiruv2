<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="promote-user-dialog">
      <q-card-section class="promote-header">
        <div class="promote-header-content">
          <div class="promote-icon-wrapper">
            <i class="fa-solid fa-user-gear"></i>
          </div>
          <div>
            <div class="promote-title">Promocionar Usuario</div>
            <div class="promote-subtitle">Asignar rol y contraseña al usuario OAuth</div>
          </div>
        </div>
        <q-btn 
          flat 
          round 
          dense 
          icon="fa-solid fa-times" 
          @click="closeDialog"
          class="promote-close-btn"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="promote-body">
        <div class="promote-user-info">
          <q-avatar size="64px" :color="getAvatarColor(userData?.username)">
            <img v-if="userData?.avatar" :src="userData.avatar" />
            <span v-else class="promote-avatar-initials">{{ getInitials(userData?.username) }}</span>
          </q-avatar>
          <div class="promote-user-details">
            <div class="promote-username">{{ userData?.username }}</div>
            <div class="promote-email">{{ userData?.email }}</div>
          </div>
        </div>

        <q-form @submit="handlePromote" class="promote-form">
          <div class="promote-form-group">
            <label class="promote-label">
              <i class="fa-solid fa-user-tag"></i>
              Nuevo Rol
            </label>
            <q-select
              v-model="formData.tipo"
              :options="roleOptions"
              outlined
              dense
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="[val => !!val || 'Seleccione un rol']"
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-shield-halved"></i>
              </template>
            </q-select>
          </div>

          <div class="promote-form-group">
            <label class="promote-label">
              <i class="fa-solid fa-lock"></i>
              Nueva Contraseña
            </label>
            <q-input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              placeholder="Ingrese contraseña"
              :rules="[
                val => !!val || 'La contraseña es requerida',
                val => val.length >= 6 || 'Mínimo 6 caracteres'
              ]"
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-key"></i>
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  round
                  :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="promote-form-group">
            <label class="promote-label">
              <i class="fa-solid fa-lock"></i>
              Confirmar Contraseña
            </label>
            <q-input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              dense
              placeholder="Confirme la contraseña"
              :rules="[
                val => !!val || 'Confirme la contraseña',
                val => val === formData.password || 'Las contraseñas no coinciden'
              ]"
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-key"></i>
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  round
                  :icon="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="promote-warning">
            <i class="fa-solid fa-info-circle"></i>
            <span>Esta acción asignará un rol y contraseña permanente al usuario. El usuario podrá iniciar sesión con su email y la nueva contraseña.</span>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions class="promote-actions">
        <q-btn
          flat
          label="Cancelar"
          @click="closeDialog"
          class="promote-cancel-btn"
        />
        <q-btn
          unelevated
          label="Promocionar Usuario"
          color="primary"
          @click="handlePromote"
          :loading="loading"
          class="promote-submit-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'

export default {
  name: 'PromoteUserDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    userData: {
      type: Object,
      default: null
    }
  },

  emits: ['update:modelValue', 'promoted'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const userStore = useUserStore()

    const showDialog = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    })

    const formData = ref({
      tipo: '',
      password: '',
      confirmPassword: ''
    })

    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loading = ref(false)

    const roleOptions = [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Dentista', value: 'DENTIST' }
    ]

    const resetForm = () => {
      formData.value = {
        tipo: '',
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

    const handlePromote = async () => {
      if (!formData.value.tipo || !formData.value.password) {
        $q.notify({
          type: 'warning',
          message: 'Complete todos los campos requeridos'
        })
        return
      }

      if (formData.value.password !== formData.value.confirmPassword) {
        $q.notify({
          type: 'warning',
          message: 'Las contraseñas no coinciden'
        })
        return
      }

      if (formData.value.password.length < 6) {
        $q.notify({
          type: 'warning',
          message: 'La contraseña debe tener al menos 6 caracteres'
        })
        return
      }

      loading.value = true

      try {
        await userStore.promocionarUser(props.userData.id, {
          tipo: formData.value.tipo,
          password: formData.value.password
        })

        $q.notify({
          type: 'positive',
          message: 'Usuario promocionado exitosamente',
          icon: 'fa-solid fa-check'
        })

        emit('promoted')
        closeDialog()
      } catch (error) {
        console.error('Error promoting user:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al promocionar usuario',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      } finally {
        loading.value = false
      }
    }

    const getAvatarColor = (username) => {
      return userStore.getAvatarColor(username)
    }

    const getInitials = (name) => {
      return userStore.getInitials(name)
    }

    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        resetForm()
      }
    })

    return {
      showDialog,
      formData,
      showPassword,
      showConfirmPassword,
      loading,
      roleOptions,
      closeDialog,
      handlePromote,
      getAvatarColor,
      getInitials
    }
  }
}
</script>

<style scoped>
.promote-user-dialog {
  min-width: 500px;
  max-width: 600px;
}

.promote-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.promote-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.promote-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.promote-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.promote-subtitle {
  font-size: 13px;
  opacity: 0.9;
}

.promote-close-btn {
  color: white;
}

.promote-body {
  padding: 24px;
}

.promote-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 24px;
}

.promote-avatar-initials {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.promote-user-details {
  flex: 1;
}

.promote-username {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.promote-email {
  font-size: 14px;
  color: #666;
}

.promote-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.promote-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.promote-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.promote-label i {
  color: #667eea;
  font-size: 14px;
}

.promote-warning {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  font-size: 13px;
  color: #856404;
}

.promote-warning i {
  color: #ffc107;
  font-size: 18px;
  flex-shrink: 0;
}

.promote-actions {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.promote-cancel-btn {
  color: #666;
}

.promote-submit-btn {
  min-width: 180px;
}
</style>