<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card row no-wrap animated zoomIn">
      <div class="col-12 col-md-6 login-form-section">
        <div class="row items-center justify-center q-mb-lg animated fadeInDown">
          <q-img 
            :src="logo" 
            fit="contain"  
            style="width: 120px; height: 120px;"  
          />
        </div>

        <div class="text-center q-mb-md animated fadeInUp" style="animation-delay: 0.2s">
          <h5 class="text-h5 q-my-sm text-weight-bold">Iniciar Sesión</h5>
          <p class="text-grey-7">Accede a tu panel de control</p>
        </div>

        <q-form @submit="onSubmit" class="column q-gutter-md animated fadeInUp" style="animation-delay: 0.3s">
          <q-input 
            v-model="username" 
            label="Usuario" 
            outlined
            autofocus
            :rules="[
              val => !!val || 'El usuario es requerido'
            ]"
            lazy-rules
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input 
            v-model="password" 
            label="Contraseña" 
            outlined
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'La contraseña es requerida'
            ]"
            lazy-rules
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon 
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-6"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox 
              v-model="rememberMe" 
              label="Recordarme" 
              color="primary"
            />
            <q-btn 
              flat 
              dense 
              label="¿Olvidaste tu contraseña?" 
              color="primary"
              size="sm"
              @click="forgotPassword"
              no-caps
            />
          </div>

          <q-btn 
            unelevated 
            label="INGRESAR" 
            color="primary" 
            type="submit"
            :loading="isLoading"
            :disable="isLoading"
            class="primary-btn"
            size="lg"
            push
            no-caps
          />

          <q-separator class="q-my-md">
            <span class="text-grey-7 text-caption">O continúa con</span>
          </q-separator>

          <q-btn 
            outline
            label="Iniciar sesión con Google" 
            color="red-6"
            @click="loginWithGoogle"
            :disable="isLoading"
            no-caps
            class="google-btn"
            size="md"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-google" />
            </template>
          </q-btn>

          <q-btn 
            flat 
            label="CANCELAR" 
            color="grey-7"
            @click="goBack"
            :disable="isLoading"
            no-caps
            class="secondary-btn"
          />
        </q-form>

        <div class="q-mt-lg text-center">
          <small class="text-grey">© 2025 KIRU Odontología</small>
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center welcome-panel">
        <div class="q-pa-lg text-center welcome-content">
          <div class="welcome-icon q-mb-md animated bounceIn">
            <q-icon name="favorite" size="64px" color="white" />
          </div>
          <div class="text-h5 welcome-title animated fadeInUp" style="animation-delay: 0.2s">
            ¡Bienvenido de vuelta!
          </div>
          <div class="text-subtitle2 q-mt-md welcome-subtitle animated fadeInUp" style="animation-delay: 0.3s">
            Accede rápido a tu panel para administrar citas, pacientes y más.
          </div>
          <div class="q-mt-lg features-list">
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.4s">
              <q-icon name="event" size="24px" />
              <span>Gestión de Citas</span>
            </div>
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.5s">
              <q-icon name="people" size="24px" />
              <span>Control de Pacientes</span>
            </div>
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.6s">
              <q-icon name="analytics" size="24px" />
              <span>Reportes y Estadísticas</span>
            </div>
          </div>
          <div class="q-mt-lg animated fadeIn" style="animation-delay: 0.7s">
            <q-btn 
              flat 
              round 
              dense 
              icon="info" 
              color="white" 
              class="q-mr-sm"
              @click="showInfo"
            >
              <q-tooltip>Información</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              round 
              dense 
              icon="phone" 
              color="white"
              @click="contactSupport"
            >
              <q-tooltip>Contactar Soporte</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess, notifyError, showLoading, hideLoading } = useNotifications()

const logo = '/KiruIMG/LogoKiru.png'
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const isLoading = computed(() => authStore.isLoading)

const onSubmit = async () => {
  try {
    showLoading('Iniciando sesión...')
    
    const result = await authStore.login(username.value, password.value)
    
    hideLoading()
    
    if (result.success) {
      notifySuccess(`¡Bienvenido ${result.user.username}!`)
      const redirectTo = route.query.redirect || result.redirectTo
      router.push(redirectTo)
    } else {
      notifyError(result.message || 'Error al iniciar sesión')
    }
  } catch (error) {
    hideLoading()
    console.error('Error en login:', error)
    notifyError('Error inesperado al iniciar sesión')
  }
}

const loginWithGoogle = () => {
  authStore.loginWithGoogle()
}

const goBack = () => {
  router.push('/')
}

const forgotPassword = () => {
  $q.dialog({
    title: 'Recuperar Contraseña',
    message: 'Ingresa tu correo electrónico para recibir instrucciones de recuperación.',
    prompt: {
      model: '',
      type: 'email',
      label: 'Correo electrónico'
    },
    cancel: {
      flat: true,
      label: 'Cancelar'
    },
    ok: {
      push: true,
      label: 'Enviar'
    },
    persistent: true
  }).onOk(data => {
    notifySuccess(`Se han enviado las instrucciones a ${data}`)
  })
}

const showInfo = () => {
  $q.dialog({
    title: 'Sistema de Gestión KIRU',
    message: 'Plataforma integral para la gestión de clínicas odontológicas. Administra pacientes, citas, tratamientos y más desde un solo lugar.',
    ok: {
      push: true,
      label: 'Entendido'
    }
  })
}

const contactSupport = () => {
  $q.dialog({
    title: 'Contactar Soporte',
    message: '¿Necesitas ayuda? Contáctanos:',
    options: {
      type: 'radio',
      model: 'phone',
      items: [
        { label: 'Teléfono: +591 78900785', value: 'phone' },
        { label: 'Email: soporte@kiruodontologia.com', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' }
      ]
    },
    cancel: {
      flat: true,
      label: 'Cancelar'
    },
    ok: {
      push: true,
      label: 'Seleccionar'
    }
  }).onOk(data => {
    if (data === 'whatsapp') {
      window.open('https://wa.me/59178900785?text=Necesito ayuda con el sistema', '_blank')
    }
  })
}
</script>