<template>
  <div class="flex flex-center" style="min-height: 100vh;">
    <div class="text-center">
      <q-spinner-dots
        color="primary"
        size="50px"
      />
      <p class="q-mt-md text-grey-7">Procesando autenticación...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotifications()

onMounted(async () => {
  try {
    const token = route.query.token ? String(route.query.token) : ''
    const userEncoded = route.query.user ? String(route.query.user) : ''
    const error = route.query.error ? String(route.query.error) : ''

    if (error) {
      notifyError('Error en la autenticación con Google')
      router.push('/login')
      return
    }

    if (!token || !userEncoded) {
      notifyError('Datos de autenticación incompletos')
      router.push('/login')
      return
    }

    const userData = JSON.parse(decodeURIComponent(userEncoded))
    const result = authStore.handleGoogleCallback(userData, token)

    if (result.success) {
      notifySuccess(`¡Bienvenido ${result.user.username}!`)
      router.push(result.redirectTo)
    } else {
      notifyError(result.message || 'Error al procesar autenticación')
      router.push('/login')
    }
  } catch (error) {
    console.error('Error en callback:', error)
    notifyError('Error inesperado al procesar autenticación')
    router.push('/login')
  }
})
</script>