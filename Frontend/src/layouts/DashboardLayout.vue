<template>
  <q-layout view="hHh LpR fFf" class="kiru-dashboard-layout">
    <!-- Header del Dashboard Mejorado -->
    <q-header elevated class="kiru-header">
      <q-toolbar class="kiru-toolbar">
        <!-- Botón para toggle del drawer en móvil -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="lt-md kiru-menu-btn"
        />

        <!-- Logo y título mejorado -->
        <q-toolbar-title class="kiru-toolbar-title">
          <div class="kiru-logo-container">
            <div class="kiru-logo-icon">
              <img 
                src="/KiruIMG/LogoKiru.png" 
                alt="Logo KIRU" 
                style="width:100px; height:60px; object-fit: contain;"
              />
            </div>
            <div class="kiru-logo-text">
              <div class="kiru-brand-name">Kiru</div>
              <div class="kiru-brand-subtitle">Odontología</div>
            </div>
          </div>
        </q-toolbar-title>

        <!-- Breadcrumbs mejorado -->
        <div class="kiru-breadcrumbs gt-sm">
          <q-breadcrumbs class="kiru-breadcrumbs-inner">
            <q-breadcrumbs-el icon="fa-solid fa-home" :to="getDefaultRoute()" />
            <q-breadcrumbs-el 
              v-if="currentPageTitle" 
              :label="currentPageTitle" 
              class="text-weight-bold"
            />
          </q-breadcrumbs>
        </div>

        <q-space />

        <!-- Notificaciones mejorado -->
        <q-btn flat round dense icon="fa-solid fa-bell" class="kiru-notification-btn">
          <q-badge color="red" floating class="kiru-notification-badge">3</q-badge>
          <q-menu class="kiru-notification-menu">
            <q-list class="kiru-notification-list">
              <q-item class="kiru-notification-header">
                <q-item-section>
                  <q-item-label class="kiru-notification-title">Notificaciones</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense icon="fa-solid fa-check-double" size="sm" class="text-grey-6" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple class="kiru-notification-item">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="fa-solid fa-calendar-check" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="kiru-notification-message">Nueva cita agendada</q-item-label>
                  <q-item-label caption class="kiru-notification-time">Hace 5 minutos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="kiru-notification-item">
                <q-item-section avatar>
                  <q-avatar color="green" text-color="white" icon="fa-solid fa-user-plus" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="kiru-notification-message">Nuevo paciente registrado</q-item-label>
                  <q-item-label caption class="kiru-notification-time">Hace 1 hora</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple class="kiru-notification-footer">
                <q-item-section class="text-center text-primary">
                  Ver todas las notificaciones
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Toggle modo oscuro/claro mejorado -->
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"
          :aria-label="$q.dark.isActive ? 'Desactivar modo oscuro' : 'Activar modo oscuro'"
          @click="$q.dark.toggle()"
          class="kiru-theme-toggle"
          v-ripple
        >
          <q-tooltip anchor="bottom">Alternar modo oscuro</q-tooltip>
        </q-btn>
        
        <!-- Perfil de usuario mejorado -->
        <q-btn flat round dense class="kiru-profile-btn">
          <q-avatar size="40px" class="kiru-user-avatar">
            <img :src="userAvatar" />
            <div class="kiru-user-status" :class="getUserStatusClass()"></div>
          </q-avatar>
          <q-menu class="kiru-profile-menu">
            <q-list class="kiru-profile-list">
              <q-item class="kiru-profile-header">
                <q-item-section avatar>
                  <q-avatar size="60px" class="kiru-profile-avatar">
                    <img :src="userAvatar" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="kiru-profile-name">{{ userName }}</q-item-label>
                  <q-item-label caption class="kiru-profile-email">{{ userEmail }}</q-item-label>
                  <q-item-label caption>
                    <q-chip size="sm" :class="['kiru-role-chip', `kiru-role-${userRole.toLowerCase()}`]">
                      {{ getRoleLabel(userRole) }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="handleLogout" class="kiru-logout-item">
                <q-item-section avatar>
                  <q-icon name="fa-solid fa-right-from-bracket" class="kiru-logout-icon" />
                </q-item-section>
                <q-item-section class="kiru-logout-text">Cerrar Sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar / Drawer Mejorado -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :breakpoint="1024"
      bordered
      class="kiru-drawer"
    >
      <q-scroll-area class="fit kiru-scroll-area">
        <div class="kiru-drawer-content">
          <!-- Información del usuario en el drawer mejorado -->
          <div class="kiru-user-info">
            <div class="kiru-user-avatar-large">
              <q-avatar size="64px" class="kiru-user-avatar-img">
                <img :src="userAvatar" />
              </q-avatar>
              <div class="kiru-user-status-large" :class="getUserStatusClass()"></div>
            </div>
            <div class="kiru-user-details">
              <div class="kiru-user-name">{{ userName }}</div>
              <div class="kiru-user-role">{{ getRoleLabel(userRole) }}</div>
              <div class="kiru-user-email">{{ userEmail }}</div>
            </div>
          </div>

          <q-separator class="kiru-drawer-separator" />

          <!-- Menú de navegación dinámico mejorado -->
          <q-list padding class="kiru-menu-list">
            <template v-for="(item, index) in filteredMenu" :key="index">
              <!-- Item con hijos (expandible) -->
              <q-expansion-item
                v-if="item.children"
                :icon="item.icon"
                :label="item.title"
                :default-opened="isCurrentSection(item)"
                class="kiru-menu-expansion-item"
                expand-icon-class="kiru-expand-icon"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon :name="item.icon" class="kiru-menu-icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.title }}
                  </q-item-section>
                </template>

                <q-list class="kiru-submenu-list">
                  <q-item
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                    clickable
                    v-ripple
                    :to="child.to"
                    exact
                    class="kiru-submenu-item"
                    :class="{ 'kiru-submenu-item-active': $route.path === child.to }"
                  >
                    <q-item-section avatar>
                      <q-icon :name="child.icon" size="18px" class="kiru-submenu-icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="kiru-submenu-label">{{ child.title }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <!-- Item simple (sin hijos) -->
              <q-item
                v-else
                clickable
                v-ripple
                :to="item.to"
                exact
                class="kiru-menu-item"
                :class="{ 'kiru-menu-item-active': $route.path === item.to }"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" class="kiru-menu-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="kiru-menu-label">{{ item.title }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="item.badge" class="kiru-menu-badge-container">
                  <q-badge :color="item.badgeColor || 'primary'" class="kiru-menu-badge">
                    {{ item.badge }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </template>
          </q-list>

          <q-separator class="kiru-drawer-separator" />

          <!-- Botón para volver al sitio público mejorado -->
          <div class="kiru-public-site-section">
            <q-btn
              flat
              dense
              icon="fa-solid fa-globe"
              label="Ver Sitio Público"
              class="kiru-public-site-btn"
              @click="goToPublicSite"
            />
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container class="kiru-page-container">
      <router-view />
    </q-page-container>

    <!-- Footer mejorado -->
    <q-footer class="kiru-footer">
      <q-toolbar class="kiru-footer-toolbar">
        <q-toolbar-title class="kiru-footer-text">
          <div class="kiru-footer-content">
            <div class="kiru-footer-copyright">
              © 2025 KIRU Odontología - Panel de Administración
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { dashboardMenuConfig, rolePermissions } from '../router/routes'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado del drawer
const leftDrawerOpen = ref(false)

// Datos del usuario desde el store
const userName = computed(() => authStore.userName || 'Usuario KIRU')
const userEmail = computed(() => authStore.userEmail || 'usuario@kiru.com')
const userAvatar = computed(() => authStore.userAvatar || 'https://cdn.quasar.dev/img/avatar.png')
const userRole = computed(() => authStore.userRole || 'ADMIN')

// Título de la página actual
const currentPageTitle = computed(() => route.meta.title || '')

// Toggle del drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Obtener el menú filtrado según el rol del usuario
const filteredMenu = computed(() => {
  const role = userRole.value
  const menuConfig = dashboardMenuConfig[role] || []
  const permissions = rolePermissions[role] || []

  // Filtrar el menú según los permisos del rol
  return menuConfig
    .filter(item => {
      // Si el item tiene permiso, verificar si el usuario lo tiene
      if (item.permission) {
        return permissions.includes(item.permission)
      }
      // Si no tiene permiso definido, mostrarlo
      return true
    })
    .map(item => {
      // Si tiene hijos, filtrarlos también
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (child.permission) {
              return permissions.includes(child.permission)
            }
            return true
          })
        }
      }
      return item
    })
})

// Verificar si una sección está activa
const isCurrentSection = (item) => {
  if (!item.children) return false
  return item.children.some(child => route.path === child.to)
}

// Obtener ruta por defecto según rol
const getDefaultRoute = () => {
  return authStore.getDefaultRoute ? authStore.getDefaultRoute() : '/dashboard'
}

// Obtener clase de estado del usuario
const getUserStatusClass = () => {
  return 'kiru-status-online' // Siempre online en esta implementación
}

// Obtener etiqueta del rol
const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Administrador',
    DENTIST: 'Dentista',
    CLIENT: 'Cliente'
  }
  return labels[role] || role
}

// Ir al sitio público
const goToPublicSite = () => {
  router.push('/')
}

// Manejar logout
const handleLogout = () => {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro que deseas cerrar sesión?',
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'Cerrar Sesión',
      color: 'negative',
      icon: 'fa-solid fa-right-from-bracket'
    },
    persistent: true
  }).onOk(() => {
    if (authStore.logout) {
      authStore.logout()
    }
    router.push('/login')
    $q.notify({
      message: 'Sesión cerrada exitosamente',
      color: 'positive',
      position: 'top',
      icon: 'fa-solid fa-check',
      timeout: 2000
    })
  })
}

// Cerrar drawer en móvil al cambiar de ruta
watch(route, () => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
})
</script>

