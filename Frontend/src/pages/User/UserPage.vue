<template>
  <div class="user-page-container">
    <!-- Header Section -->
    <div class="user-page-header">
      <div class="user-header-background">
        <div class="user-header-shape user-header-shape-1"></div>
        <div class="user-header-shape user-header-shape-2"></div>
      </div>
      <div class="user-header-content">
        <div class="user-title-section">
          <div class="user-icon-wrapper">
            <i class="fa-solid fa-users user-header-icon"></i>
          </div>
          <div>
            <h1 class="user-page-title">Gestión de Usuarios</h1>
            <p class="user-page-subtitle">Administra permisos y accesos del personal de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="user-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Usuario"
          @click="userStore.openNewDialog()"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="user-stats-section">
      <div class="user-stat-card">
        <div class="user-stat-icon-container active">
          <i class="fa-solid fa-user-check"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ userStore.activeUsersCount }}</div>
          <div class="user-stat-label">Usuarios Activos</div>
        </div>
        <div class="user-stat-glow active"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container inactive">
          <i class="fa-solid fa-user-slash"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ userStore.inactiveUsersCount }}</div>
          <div class="user-stat-label">Usuarios Inactivos</div>
        </div>
        <div class="user-stat-glow inactive"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container admin">
          <i class="fa-solid fa-user-shield"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ userStore.adminUsersCount }}</div>
          <div class="user-stat-label">Administradores</div>
        </div>
        <div class="user-stat-glow admin"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ userStore.searchResults.length }}</div>
          <div class="user-stat-label">Total de Usuarios</div>
        </div>
        <div class="user-stat-glow total"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="user-search-section">
      <div class="user-search-container">
        <q-input
          v-model="userStore.search"
          class="user-search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, email o tipo de usuario..."
          @input="userStore.applySearch()"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search user-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="userStore.search" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="user-table-container">
      <div class="user-table-header">
        <div class="user-table-title-section">
          <h3 class="user-table-title">Lista de Usuarios</h3>
          <div class="user-table-underline"></div>
        </div>
        <div class="user-results-count">
          <span class="user-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ userStore.searchResults.length }} usuario{{ userStore.searchResults.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="user-data-table"
        flat
        :rows="userStore.searchResults"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="user-no-data-container">
            <div class="user-no-data-illustration">
              <i class="fa-solid fa-users-slash user-no-data-icon"></i>
              <div class="user-no-data-circle user-no-data-circle-1"></div>
              <div class="user-no-data-circle user-no-data-circle-2"></div>
            </div>
            <p class="user-no-data-text">No se encontraron usuarios</p>
            <p class="user-no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega un nuevo usuario</p>
          </div>
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <div class="user-avatar-container">
              <div class="user-avatar-wrapper">
                <q-avatar 
                  size="56px"
                  class="user-user-avatar"
                  :color="props.row.avatar ? 'transparent' : userStore.getAvatarColor(props.row.username)"
                  :text-color="props.row.avatar ? 'transparent' : 'white'"
                >
                  <img 
                    v-if="props.row.avatar" 
                    :src="props.row.avatar" 
                    :alt="props.row.username"
                    @error="userStore.handleImageError"
                  />
                  <span v-else class="user-avatar-initials">{{ userStore.getInitials(props.row.username) }}</span>
                </q-avatar>
                <div class="user-avatar-status" :class="userStore.getStateClass(props.row.state)"></div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-username="props">
          <q-td :props="props">
            <div class="user-user-info">
              <span class="user-user-name">{{ props.row.username }}</span>
              <span class="user-user-role">{{ userStore.formatType(props.row.tipo) }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            <div class="user-email-content">
              <i class="fa-solid fa-envelope user-email-icon"></i>
              <span class="user-email-text">{{ props.row.email || 'No especificado' }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-chip
              :class="['user-type-chip', userStore.getTypeClass(props.row.tipo)]"
              :label="userStore.formatType(props.row.tipo)"
              :icon="userStore.getTypeIcon(props.row.tipo)"
              dense
            />
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :class="['user-state-badge', userStore.getStateClass(props.row.state)]"
              :label="userStore.formatState(props.row.state)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="user-action-buttons">
              <q-btn
                v-if="!props.row.password && props.row.tipo === 'CLIENT'"
                class="user-action-btn user-promote-btn"
                flat
                dense
                round
                icon="fa-solid fa-user-gear"
                size="sm"
                @click="userStore.openPromoteDialog(props.row)"
                color="purple"
              >
                <q-tooltip>Promocionar usuario</q-tooltip>
              </q-btn>

              <q-btn
                class="user-action-btn user-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="userStore.openDetailDialog(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn
                class="user-action-btn user-edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="userStore.openEditDialog(props.row)"
                color="primary"
              >
                <q-tooltip>Editar usuario</q-tooltip>
              </q-btn>
              
              <q-btn
                class="user-action-btn user-delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="userStore.confirmDeleteUser(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar usuario</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailUserDialog
      v-model="userStore.showDetailDialog"
      :user-data="userStore.selectedUser"
      @edit-user="userStore.openEditDialog"
      @promote-user="userStore.openPromoteDialog"
    />

    <EditUserDialog
      v-model="userStore.showEditDialog"
      :user-data="userStore.selectedUser"
      @updated="handleUserUpdate"
    />

    <NewUserDialog
      v-model="userStore.showNewDialog"
      @created="handleUserCreate"
    />

    <PromoteUserDialog
      v-model="userStore.showPromoteDialog"
      :user-data="userStore.selectedUser"
      @promoted="handleUserPromoted"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="userStore.showDeleteDialog" persistent>
      <q-card class="user-delete-card">
        <q-card-section class="user-delete-header">
          <div class="user-delete-icon-wrapper">
            <i class="fa-solid fa-trash-alt"></i>
          </div>
          <div>
            <div class="user-delete-title">Confirmar Eliminación</div>
            <div class="user-delete-subtitle">Esta acción no se puede deshacer</div>
          </div>
        </q-card-section>

        <q-card-section class="user-delete-body">
          <p class="user-delete-text">
            ¿Estás seguro de que deseas eliminar al usuario 
            <strong>{{ userStore.selectedUser?.username }}</strong>?
          </p>
          <p class="user-delete-warning">
            Se perderán todos los datos asociados a este usuario.
          </p>
        </q-card-section>

        <q-card-actions class="user-delete-actions">
          <q-btn
            flat
            label="Cancelar"
            @click="userStore.closeDeleteDialog()"
            class="user-delete-cancel-btn"
          />
          <q-btn
            unelevated
            label="Eliminar Usuario"
            color="negative"
            @click="handleDeleteUser"
            class="user-delete-confirm-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'
import DetailUserDialog from './DetailUserDialog.vue'
import EditUserDialog from './EditUserDialog.vue'
import NewUserDialog from './NewUserDialog.vue'
import PromoteUserDialog from './PromoteUserDialog.vue'

const columns = [
  {
    name: 'avatar',
    label: '',
    align: 'center',
    field: 'avatar',
    style: 'width: 80px'
  },
  {
    name: 'username',
    required: true,
    label: 'Usuario',
    align: 'left',
    field: 'username',
    sortable: true
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center',
    field: 'tipo',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'center',
    field: 'actions'
  }
]

export default {
  name: 'UserPage',
  
  components: {
    DetailUserDialog,
    EditUserDialog,
    NewUserDialog,
    PromoteUserDialog
  },
  
  setup() {
    const $q = useQuasar()
    const userStore = useUserStore()

    onMounted(async () => {
      try {
        await userStore.initialize()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al cargar usuarios' + error.message,
          icon: 'fa-solid fa-exclamation-triangle'
        })
      }
    })

    const handleUserCreate = async () => {
      await userStore.fetchUsers()
      $q.notify({
        type: 'positive',
        message: 'Usuario creado exitosamente',
        icon: 'fa-solid fa-check'
      })
    }

    const handleUserUpdate = async () => {
      await userStore.fetchUsers()
      $q.notify({
        type: 'positive',
        message: 'Usuario actualizado exitosamente',
        icon: 'fa-solid fa-check'
      })
    }

    const handleUserPromoted = async () => {
      await userStore.fetchUsers()
      $q.notify({
        type: 'positive',
        message: 'Usuario promocionado exitosamente',
        icon: 'fa-solid fa-check'
      })
    }

    const handleDeleteUser = async () => {
      try {
        await userStore.eliminarUser()
        $q.notify({
          type: 'positive',
          message: 'Usuario eliminado exitosamente',
          icon: 'fa-solid fa-check'
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al eliminar usuario' + error.message,
          icon: 'fa-solid fa-exclamation-triangle'
        })
      }
    }

    return {
      userStore,
      columns,
      handleUserCreate,
      handleUserUpdate,
      handleUserPromoted,
      handleDeleteUser
    }
  }
}
</script>

