import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5050'

const sanitizeUser = (user) => {
  if (!user) return null
  
  return {
    id: user.id,
    email: String(user.email).trim(),
    username: String(user.username).trim(),
    role: (user.tipo || 'CLIENT').toUpperCase(),
    avatar: user.avatar || null,
    provider: user.provider || 'local',
    email_verified: !!user.email_verified
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const redirectPath = ref(null)
  
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'PUBLIC')
  const userName = computed(() => user.value?.username || '')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  const isPublicUser = computed(() => userRole.value === 'PUBLIC' || !isAuthenticated.value)
  
  const getDefaultRoute = () => {
    if (!isAuthenticated.value) return '/'
    
    switch (userRole.value) {
      case 'ADMIN':
      case 'DENTIST':
      case 'CLIENT':
        return '/dashboard'
      default:
        return '/'
    }
  }

  const login = async (username, password) => {
    try {
      isLoading.value = true
      error.value = null

      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos')
      }

      const response = await axios.post(`${API_URL}/users/login`, {
        username: username.trim(),
        password: password.trim()
      })

      if (response.data && response.data.token) {
        const generatedToken = response.data.token
        const sanitizedUser = sanitizeUser(response.data.data)

        token.value = generatedToken
        user.value = sanitizedUser

        sessionStorage.setItem('authToken', generatedToken)
        sessionStorage.setItem('user', JSON.stringify(sanitizedUser))

        return {
          success: true,
          user: sanitizedUser,
          redirectTo: redirectPath.value || getDefaultRoute()
        }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en la autenticación'
      error.value = errorMessage
      user.value = null
      token.value = null
      return {
        success: false,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  const handleGoogleCallback = (userData, tokenData) => {
    try {
      const sanitizedUser = sanitizeUser(userData)
      token.value = tokenData
      user.value = sanitizedUser

      sessionStorage.setItem('authToken', tokenData)
      sessionStorage.setItem('user', JSON.stringify(sanitizedUser))

      return {
        success: true,
        user: sanitizedUser,
        redirectTo: redirectPath.value || getDefaultRoute()
      }
    } catch (err) {
      error.value = err.message || 'Error procesando autenticación de Google'
      return {
        success: false,
        message: error.value
      }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    redirectPath.value = null
    
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
  }

  const restoreSession = async () => {
    try {
      const savedToken = sessionStorage.getItem('authToken')
      const savedUser = sessionStorage.getItem('user')

      if (!savedToken || !savedUser) {
        return false
      }

      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      return true
    } catch (err) {
      logout()
      return err
    }
  }

  const checkAuth = async () => {
    if (token.value && user.value) {
      return true
    }
    
    return await restoreSession()
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.includes(userRole.value)
  }

  const canAccessRoute = (route) => {
    if (!route.meta?.requiresAuth) {
      return true
    }

    if (!isAuthenticated.value) {
      return false
    }

    if (!route.meta.roles || !Array.isArray(route.meta.roles)) {
      return true
    }

    return hasAnyRole(route.meta.roles)
  }

  const setRedirectPath = (path) => {
    redirectPath.value = path
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading,
    error: computed(() => error.value),
    userRole,
    userName,
    userEmail,
    userAvatar,
    isPublicUser,
    login,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    checkAuth,
    restoreSession,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    getDefaultRoute,
    setRedirectPath
  }
})
