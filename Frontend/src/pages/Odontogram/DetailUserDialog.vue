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
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content">
        <div class="user-avatar-section">
          <div class="avatar-container">
            <q-avatar
              size="80px"
              :color="userData?.avatar ? 'transparent' : getAvatarColor(userData?.username)"
              :text-color="userData?.avatar ? 'transparent' : 'white'"
              class="user-avatar"
            >
              <!-- Mostrar imagen solo si existe y no hubo error -->
              <img
                v-if="userData?.avatar && !imageErrored"
                :src="userData.avatar"
                :alt="userData.username"
                @error="handleImageError"
              />
              <!-- fallback con iniciales -->
              <span v-else>{{ getInitials(userData?.username) }}</span>
            </q-avatar>
          </div>
          <div class="user-status">
            <q-badge
              :class="getStateClass(userData?.state)"
              :label="formatState(userData?.state)"
            />
          </div>
        </div>
        
        <div class="user-details">
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-id-badge"></i>
              <span>ID de Usuario</span>
            </div>
            <div class="detail-value">{{ userData?.id ?? 'No disponible' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-user"></i>
              <span>Nombre de Usuario</span>
            </div>
            <div class="detail-value">{{ userData?.username ?? 'No disponible' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-envelope"></i>
              <span>Correo Electrónico</span>
            </div>
            <div class="detail-value">{{ userData?.email ?? 'No disponible' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-user-tag"></i>
              <span>Tipo de Usuario</span>
            </div>
            <div class="detail-value">
              <q-chip
                :class="getTypeClass(userData?.type)"
                :label="formatType(userData?.type)"
                dense
              />
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-toggle-on"></i>
              <span>Estado</span>
            </div>
            <div class="detail-value">
              <q-badge
                :class="getStateClass(userData?.state)"
                :label="formatState(userData?.state)"
              />
            </div>
          </div>

          <div class="detail-row" v-if="userData?.createdAt">
            <div class="detail-label">
              <i class="fa-solid fa-calendar-plus"></i>
              <span>Fecha de Creación</span>
            </div>
            <div class="detail-value">{{ formatDate(userData?.createdAt) }}</div>
          </div>

          <div class="detail-row" v-if="userData?.lastLogin">
            <div class="detail-label">
              <i class="fa-solid fa-clock"></i>
              <span>Último Acceso</span>
            </div>
            <div class="detail-value">{{ formatDate(userData?.lastLogin) }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="secondary-btn"
        />
        <q-btn
          flat
          label="Editar Usuario"
          icon="fa-solid fa-edit"
          @click="editUser"
          class="primary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'

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
  emits: ['update:modelValue', 'edit-user'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // ref local para controlar error de carga de imagen (NO mutamos props)
    const imageErrored = ref(false)

    const getAvatarColor = (name) => {
      if (!name) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    }

    const getInitials = (name) => {
      if (!name) return '?'
      const words = name.trim().split(' ')
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase()
    }

    const handleImageError = () => {
      imageErrored.value = true
    }

    const formatState = (state) => {
      const s = String(state || '').toLowerCase()
      const states = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente'
      }
      return states[s] || (state ? String(state) : 'No disponible')
    }

    const formatType = (type) => {
      const t = String(type || '').toLowerCase()
      const types = {
        admin: 'Administrador',
        user: 'Usuario',
        moderator: 'Moderador'
      }
      return types[t] || (type ? String(type) : 'No definido')
    }

    const getStateClass = (state) => {
      const s = String(state || '').toLowerCase()
      const classes = {
        active: 'state-active',
        inactive: 'state-inactive',
        pending: 'state-pending'
      }
      return classes[s] || 'state-default'
    }

    const getTypeClass = (type) => {
      const t = String(type || '').toLowerCase()
      const classes = {
        admin: 'type-admin',
        user: 'type-user',
        moderator: 'type-moderator'
      }
      return classes[t] || 'type-default'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error(error)
        return 'Fecha inválida'
      }
    }

    const editUser = () => {
      emit('edit-user', props.userData)
      // cerramos el dialog desde el computed
      showDialog.value = false
      // reset fallback para la próxima vez que se abra
      imageErrored.value = false
    }

    return {
      showDialog,
      imageErrored,
      formatState,
      getStateClass,
      formatType,
      getTypeClass,
      getInitials,
      handleImageError,
      getAvatarColor,
      formatDate,
      editUser
    }
  }
}
</script>
