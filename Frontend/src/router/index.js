// router/index.js
import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  /**
   * GUARD PRINCIPAL DE NAVEGACIÓN
   * Este guard se ejecuta antes de cada navegación
   */
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // 1. Intentar restaurar sesión si existe
    if (!authStore.isAuthenticated) {
      await authStore.restoreSession()
    }

    // 2. Si la ruta no requiere autenticación, permitir acceso
    if (!to.meta.requiresAuth) {
      // Si está autenticado y intenta ir al login, redirigir al dashboard
      if (to.meta.redirectIfAuthenticated && authStore.isAuthenticated) {
        next(authStore.getDefaultRoute())
        return
      }
      
      next()
      return
    }

    // 3. Si requiere autenticación pero el usuario no está autenticado
    if (!authStore.isAuthenticated) {
      // Guardar la ruta a la que intentaba acceder
      authStore.setRedirectPath(to.fullPath)
      
      Notify.create({
        type: 'warning',
        message: 'Debes iniciar sesión para acceder a esta sección',
        position: 'top'
      })
      
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 4. Usuario autenticado - verificar roles si la ruta los requiere
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = authStore.userRole
      
      // Verificar si el usuario tiene uno de los roles permitidos
      if (to.meta.roles.includes(userRole)) {
        next() // Tiene permiso
      } else {
        // No tiene permiso
        console.warn(`Usuario con rol ${userRole} intentó acceder a ${to.path} (requiere: ${to.meta.roles.join(', ')})`)
        
        Notify.create({
          type: 'negative',
          message: 'No tienes permisos para acceder a esta sección',
          position: 'top'
        })
        
        next({
          path: '/unauthorized',
          query: { from: to.fullPath }
        })
      }
    } else {
      // Ruta protegida sin roles específicos - cualquier usuario autenticado puede acceder
      next()
    }
  })

  /**
   * AFTER EACH - Se ejecuta después de cada navegación
   * Útil para analytics, cambiar título, etc.
   */
  Router.afterEach((to, from, failure) => {
    if (failure) {
      console.error('Error de navegación:', failure)
      return
    }

    // Cambiar el título de la página según la ruta
    if (to.meta.title) {
      document.title = `${to.meta.title} | KIRU Odontología`
    } else {
      document.title = 'KIRU Odontología'
    }

    // Log de navegación (solo en desarrollo)
    if (process.env.DEV) {
      console.log(`📍 Navegación: ${from.path} → ${to.path}`)
    }
  })

  /**
   * ERROR HANDLER
   * Captura errores de navegación no manejados
   */
  Router.onError((error) => {
    console.error('Error del router:', error)
    
    Notify.create({
      type: 'negative',
      message: 'Ocurrió un error al navegar. Por favor, intenta nuevamente.',
      position: 'top'
    })
  })

  return Router
})