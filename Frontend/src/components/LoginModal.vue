<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="login-modal">
      <q-card-section class="login-header">
        <div class="text-h5 text-weight-bold text-center">Inicia sesión</div>
      </q-card-section>
      
      <q-card-section class="login-content">
        <!-- Botón de Google -->
        <q-btn
          class="google-btn full-width q-mb-md"
          @click="loginWithGoogle"
          :loading="googleLoading"
        >
          <q-icon name="fab fa-google" size="20px" class="q-mr-sm" />
          Iniciar sesión con Google
        </q-btn>
        
        <!-- Separador -->
        <div class="separator q-my-md">
          <div class="separator-line"></div>
          <span class="separator-text">o</span>
          <div class="separator-line"></div>
        </div>
        
        <!-- Formulario de email -->
        <q-form @submit="loginWithEmail" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[val => !!val || 'El email es requerido', val => isValidEmail(val) || 'Email inválido']"
            class="email-input"
          />
          
          <q-btn
            type="submit"
            color="primary"
            label="Continuar"
            class="continue-btn full-width"
            :loading="emailLoading"
          />
        </q-form>
        
        <!-- Enlaces adicionales -->
        <div class="login-footer q-mt-lg">
          <div class="text-center">
            <q-btn
              flat
              dense
              label="¿No tienes cuenta? Regístrate"
              color="primary"
              @click="openRegister"
              class="register-link"
            />
          </div>
          
          <div class="text-center q-mt-sm">
            <q-btn
              flat
              dense
              label="¿Olvidaste tu contraseña?"
              color="grey-6"
              @click="openForgotPassword"
              class="forgot-link"
            />
          </div>
        </div>
      </q-card-section>
      
      <!-- Botón de cerrar -->
      <q-btn
        icon="close"
        flat
        round
        dense
        class="close-btn"
        @click="closeModal"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login-success', 'register-click', 'forgot-password-click'])

const $q = useQuasar()

// Controlar la visibilidad del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos reactivos
const email = ref('')
const googleLoading = ref(false)
const emailLoading = ref(false)

// Métodos
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const loginWithGoogle = async () => {
  googleLoading.value = true
  
  try {
    // Simular autenticación con Google
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la lógica real de autenticación con Google
    console.log('Iniciando sesión con Google...')
    
    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión exitoso con Google',
      position: 'top'
    })
    
    // Emitir evento de éxito
    emit('login-success', { method: 'google', email: 'usuario@gmail.com' })
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al iniciar sesión con Google',
      position: 'top'
    })
  } finally {
    googleLoading.value = false
  }
}

const loginWithEmail = async () => {
  emailLoading.value = true
  
  try {
    // Simular autenticación con email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Iniciando sesión con email:', email.value)
    
    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Código de verificación enviado a tu email',
      position: 'top'
    })
    
    // Emitir evento de éxito
    emit('login-success', { method: 'email', email: email.value })
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al enviar código de verificación',
      position: 'top'
    })
  } finally {
    emailLoading.value = false
  }
}

const openRegister = () => {
  emit('register-click')
  closeModal()
}

const openForgotPassword = () => {
  emit('forgot-password-click')
  closeModal()
}

const closeModal = () => {
  isOpen.value = false
  email.value = ''
}
</script>

<!-- Los estilos están en app.scss global -->
