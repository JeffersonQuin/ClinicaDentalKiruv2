<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-circle"></i>
            <span>Detalles del Usuario</span>
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

      <q-card-section class="dialog-content">
        <div class="user-avatar-section">
          <div class="avatar-container">
            <q-avatar
              size="100px"
              :color="userData?.avatar ? 'transparent' : userStore.getAvatarColor(userData?.username)"
              :text-color="userData?.avatar ? 'transparent' : 'white'"
              class="user-avatar"
            >
              <img
                v-if="userData?.avatar && !imageErrored"
                :src="userData.avatar"
                :alt="userData.username"
                @error="handleImageError"
              />
              <span v-else class="avatar-initials">{{ userStore.getInitials(userData?.username) }}</span>
            </q-avatar>
            <div class="status-indicator" :class="userStore.getStateClass(userData?.state)"></div>
          </div>
          
          <div class="user-header-info">
            <h3 class="user-name">{{ userData?.username || 'Sin nombre' }}</h3>
            <p class="user-email">{{ userData?.email || 'Sin correo' }}</p>
            <div class="user-badges">
              <q-chip
                :class="['type-chip', userStore.getTypeClass(userData?.tipo)]"
                :label="userStore.formatType(userData?.tipo)"
                :icon="userStore.getTypeIcon(userData?.tipo)"
                dense
              />
              <q-badge
                :class="['state-badge', userStore.getStateClass(userData?.state)]"
                :label="userStore.formatState(userData?.state)"
              />
            </div>
          </div>
        </div>

        <q-separator class="section-separator" />
        
        <div class="user-details">
          <div class="details-section">
            <h4 class="section-title">
              <i class="fa-solid fa-info-circle"></i>
              Información General
            </h4>
            
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">
                  <i class="fa-solid fa-id-badge"></i>
                  <span>ID</span>
                </div>
                <div class="detail-value">{{ userData?.id || 'N/A' }}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Usuario</span>
                </div>
                <div class="detail-value">{{ userData?.username || 'N/A' }}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">
                  <i class="fa-solid fa-envelope"></i>
                  <span>Email</span>
                </div>
                <div class="detail-value">{{ userData?.email || 'N/A' }}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Proveedor</span>
                </div>
                <div class="detail-value">
                  <q-chip
                    v-if="userData?.provider"
                    dense
                    :icon="getProviderIcon(userData.provider)"
                    size="sm"
                  >
                    {{ userData.provider }}
                  </q-chip>
                  <span v-else>Local</span>
                </div>
              </div>

              <div class="detail-item" v-if="userData?.email_verified !== undefined">
                <div class="detail-label">
                  <i class="fa-solid fa-check-circle"></i>
                  <span>Email Verificado</span>
                </div>
                <div class="detail-value">
                  <q-icon 
                    :name="userData.email_verified ? 'fa-solid fa-check' : 'fa-solid fa-times'"
                    :color="userData.email_verified ? 'positive' : 'negative'"
                    size="sm"
                  />
                  {{ userData.email_verified ? 'Sí' : 'No' }}
                </div>
              </div>
            </div>
          </div>

          <div class="details-section" v-if="userData?.created_at || userData?.updated_at">
            <h4 class="section-title">
              <i class="fa-solid fa-clock"></i>
              Información Temporal
            </h4>
            
            <div class="detail-grid">
              <div class="detail-item" v-if="userData?.created_at">
                <div class="detail-label">
                  <i class="fa-solid fa-calendar-plus"></i>
                  <span>Creado</span>
                </div>
                <div class="detail-value">{{ userStore.formatDate(userData.created_at) }}</div>
              </div>

              <div class="detail-item" v-if="userData?.updated_at">
                <div class="detail-label">
                  <i class="fa-solid fa-calendar-check"></i>
                  <span>Actualizado</span>
                </div>
                <div class="detail-value">{{ userStore.formatDate(userData.updated_at) }}</div>
              </div>
            </div>
          </div>

          <div class="details-section" v-if="!userData?.password && userData?.provider">
            <div class="oauth-notice">
              <i class="fa-solid fa-info-circle"></i>
              <div>
                <strong>Usuario OAuth</strong>
                <p>Este usuario se autentica mediante {{ userData.provider }}. Puede promocionarlo para asignarle un rol y contraseña local.</p>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          @click="closeDialog"
          class="secondary-btn"
        />
        <q-btn
          v-if="!userData?.password && userData?.tipo === 'CLIENT'"
          unelevated
          label="Promocionar"
          icon="fa-solid fa-user-gear"
          color="purple"
          @click="promoteUser"
          class="promote-btn"
        />
        <q-btn
          unelevated
          label="Editar"
          icon="fa-solid fa-edit"
          color="primary"
          @click="editUser"
          class="primary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useUserStore } from 'src/stores/userStore'

export default {
  name: 'DetailUserDialog',
  
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
  
  emits: ['update:modelValue', 'edit-user', 'promote-user'],
  
  setup(props, { emit }) {
    const userStore = useUserStore()
    const imageErrored = ref(false)

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const handleImageError = () => {
      imageErrored.value = true
    }

    const closeDialog = () => {
      imageErrored.value = false
      showDialog.value = false
    }

    const editUser = () => {
      emit('edit-user', props.userData)
      closeDialog()
    }

    const promoteUser = () => {
      emit('promote-user', props.userData)
      closeDialog()
    }

    const getProviderIcon = (provider) => {
      const icons = {
        'google': 'fa-brands fa-google',
        'facebook': 'fa-brands fa-facebook',
        'github': 'fa-brands fa-github'
      }
      return icons[provider?.toLowerCase()] || 'fa-solid fa-shield'
    }

    return {
      userStore,
      showDialog,
      imageErrored,
      handleImageError,
      closeDialog,
      editUser,
      promoteUser,
      getProviderIcon
    }
  }
}
</script>

<style scoped>
.detail-dialog {
  min-width: 650px;
  max-width: 800px;
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
  padding: 0;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px 24px;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar-initials {
  font-size: 40px;
  font-weight: 600;
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
}

.status-indicator.active {
  background: #4caf50;
}

.status-indicator.inactive {
  background: #f44336;
}

.user-header-info {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.user-email {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

.user-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.type-chip {
  font-weight: 500;
}

.type-chip.admin {
  background: #f44336;
  color: white;
}

.type-chip.dentist {
  background: #2196f3;
  color: white;
}

.type-chip.client {
  background: #4caf50;
  color: white;
}

.state-badge.active {
  background: #4caf50;
  color: white;
}

.state-badge.inactive {
  background: #9e9e9e;
  color: white;
}

.section-separator {
  margin: 0;
}

.user-details {
  padding: 24px;
}

.details-section {
  margin-bottom: 24px;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-title i {
  color: #667eea;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.detail-label i {
  color: #667eea;
  font-size: 14px;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.oauth-notice {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
}

.oauth-notice i {
  color: #ffc107;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.oauth-notice strong {
  display: block;
  margin-bottom: 4px;
  color: #856404;
}

.oauth-notice p {
  margin: 0;
  font-size: 13px;
  color: #856404;
}

.dialog-actions {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8f9fa;
}

.secondary-btn {
  color: #666;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.promote-btn {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  color: white;
}
</style>