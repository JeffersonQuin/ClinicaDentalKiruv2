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
              </label>
              <q-input
                v-model="form.username"
                filled
                dense
                class="form-input"
                placeholder="Ingrese el nombre de usuario"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-envelope"></i>
                <span>Correo Electrónico</span>
              </label>
              <q-input
                v-model="form.email"
                filled
                dense
                type="email"
                :rules="[
                  val => !val || /.+@.+\..+/.test(val) || 'Ingrese un correo válido'
                ]"
                class="form-input"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user-tag"></i>
                <span>Tipo de Usuario</span>
              </label>
              <q-select
                v-model="form.tipo"
                filled
                dense
                :options="userTypeOptions"
                emit-value
                map-options
                class="form-input"
                placeholder="Seleccione el tipo"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Estado</span>
              </label>
              <q-select
                v-model="form.state"
                filled
                dense
                :options="stateOptions"
                emit-value
                map-options
                class="form-input"
                placeholder="Seleccione el estado"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-lock"></i>
                <span>Nueva Contraseña</span>
                <span class="optional">(dejar vacío para mantener)</span>
              </label>
              <q-input
                v-model="form.password"
                filled
                dense
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  val => !val || val.length >= 6 || 'Mínimo 6 caracteres'
                ]"
                class="form-input"
                placeholder="Nueva contraseña"
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
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'

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
  
  emits: ['update:modelValue', 'updated'],
  
  setup(props, { emit }) {
    const $q = useQuasar()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const showPassword = ref(false)
    
    const form = ref({
      id: null,
      username: '',
      email: '',
      tipo: '',
      state: '',
      password: ''
    })

    const userTypeOptions = [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Dentista', value: 'DENTIST' },
      { label: 'Cliente', value: 'CLIENT' }
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
          tipo: props.userData.tipo || '',
          state: props.userData.state || '',
          password: ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        username: '',
        email: '',
        tipo: '',
        state: '',
        password: ''
      }
      showPassword.value = false
    }

    const closeDialog = () => {
      resetForm()
      showDialog.value = false
    }

    const saveUser = async () => {
      loading.value = true
      
      try {
        const updateData = {}
        
        if (form.value.username) updateData.username = form.value.username
        if (form.value.email) updateData.email = form.value.email
        if (form.value.tipo) updateData.tipo = form.value.tipo
        if (form.value.state) updateData.state = form.value.state
        if (form.value.password) updateData.password = form.value.password

        if (Object.keys(updateData).length === 0) {
          $q.notify({
            type: 'warning',
            message: 'No hay cambios para guardar'
          })
          loading.value = false
          return
        }

        updateData.id = form.value.id

        await userStore.actualizarUser(updateData)

        $q.notify({
          type: 'positive',
          message: 'Usuario actualizado exitosamente',
          icon: 'fa-solid fa-check'
        })

        emit('updated')
        closeDialog()
      } catch (error) {
        console.error('Error updating user:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Error al actualizar el usuario',
          icon: 'fa-solid fa-exclamation-triangle'
        })
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
      showPassword,
      closeDialog,
      saveUser
    }
  }
}
</script>

<style scoped>
.edit-dialog {
  min-width: 600px;
  max-width: 700px;
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.optional {
  color: #999;
  font-size: 12px;
  font-weight: normal;
  font-style: italic;
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