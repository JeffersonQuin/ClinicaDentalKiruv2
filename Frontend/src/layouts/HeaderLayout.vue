<template>
  <div class="header-layout">
    <!-- Banner Superior Elegante -->
    <div class="header-premium-banner">
      <div class="header-premium-content">
        <div class="header-premium-left">
          <div class="header-sparkle-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <span class="header-premium-text">Descubre nuestra experiencia dental premium</span>
          <div class="header-premium-divider"></div>
          <span class="header-premium-subtext">Primera consulta gratuita</span>
        </div>
        
        <div class="header-premium-right">
          <div class="header-premium-controls">
            <!-- Selector de idioma premium -->
            <div class="header-premium-language">
              <q-icon name="translate" size="16px" class="header-premium-globe" />
              <q-select
                v-model="selectedLanguage"
                :options="languages"
                dense
                borderless
                class="header-premium-select"
                emit-value
                map-options
                dropdown-icon="keyboard_arrow_down"
              >
                <template v-slot:selected>
                  <span class="header-premium-lang-label">{{ getLanguageLabel(selectedLanguage) }}</span>
                </template>
              </q-select>
            </div>
            
            <!-- Dark mode toggle premium -->
            <div class="header-premium-theme">
              <div class="header-theme-container">
                <q-icon name="light_mode" size="16px" class="header-theme-icon" />
                <q-toggle
                  v-model="darkMode"
                  color="white"
                  size="sm"
                  class="header-premium-toggle"
                  @update:model-value="toggleDarkMode"
                />
                <q-icon name="dark_mode" size="16px" class="header-theme-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Navegación Principal Premium -->
    <div class="header-premium-navbar">
      <div class="header-premium-nav-content">
         <!-- Logo KIRU con Imagen -->
        <div class="header-premium-logo">
          <div class="header-premium-logo-container" @click="$router.push('/')">
            <div class="header-logo-image">
              <!-- Reemplaza 'logo-kiru.png' con la ruta de tu imagen -->
              <img 
                src="/KiruIMG/LogoKiru.png" 
                alt="KIRU Odontología Integral"
                style="width: 150px; height: 80px; "
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
        <!-- Navegación Desktop Premium -->
        <nav class="header-premium-navigation">
          <div class="header-premium-links">
            <router-link 
              to="/" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/' }"
            >
              <q-icon name="home" size="18px" class="header-link-icon" />
              <span>Inicio</span>
            </router-link>
            <router-link 
              to="/about" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/about' }"
            >
              <q-icon name="business" size="18px" class="header-link-icon" />
              <span>Conócenos</span>
            </router-link>
            <router-link 
              to="/services" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/services' }"
            >
              <q-icon name="medical_services" size="18px" class="header-link-icon" />
              <span>Servicios</span>
            </router-link>
            <router-link 
              to="/branch" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/branch' }"
            >
              <q-icon name="location_on" size="18px" class="header-link-icon" />
              <span>Sucursales</span>
            </router-link>
            <router-link 
              to="/faq" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/faq' }"
            >
              <q-icon name="help" size="18px" class="header-link-icon" />
              <span>FAQ</span>
            </router-link>
            <router-link 
              to="/contact" 
              class="header-premium-link"
              :class="{ 'header-premium-active': $route.path === '/contact' }"
            >
              <q-icon name="contact_page" size="18px" class="header-link-icon" />
              <span>Contacto</span>
            </router-link>
          </div>
        </nav>

        <!-- Botones de Acción Premium -->
        <div class="header-premium-actions">
          <router-link 
            to="/login" 
            class="header-premium-login"
            :class="{ 'header-premium-active': $route.path === '/login' }"
          >
            <q-icon name="account_circle" size="20px" />
            <span>Mi Cuenta</span>
          </router-link>
          <q-btn 
            unelevated
            class="header-premium-appointment"
            @click="openAppointmentDialog"
          >
            <div class="header-appointment-content">
              <q-icon name="calendar_today" size="20px" />
              <span>Agendar Cita</span>
            </div>
          </q-btn>
        </div>

        <!-- Botón Menú Mobile Premium -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="header-premium-mobile-btn"
          @click="toggleMobileMenu"
        />
      </div>
    </div>

    <!-- Menú Mobile Premium -->
    <q-slide-transition>
      <div v-show="mobileMenuOpen" class="header-premium-mobile-menu">
        <div class="header-premium-mobile-content">
          <div class="header-mobile-header">
            <div class="header-mobile-logo">
              <div class="header-premium-tooth">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path 
                    d="M16 4C12 4 8 6 8 12C8 18 10 24 12 26C13 27 15 28 16 28C17 28 19 27 20 26C22 24 24 18 24 12C24 6 20 4 16 4Z" 
                    fill="url(#toothGradient)" 
                    stroke="url(#toothGradient)" 
                    stroke-width="1.5"
                  />
                </svg>
              </div>
              <span class="header-mobile-brand">KIRU</span>
            </div>
            <q-btn
              flat
              dense
              round
              icon="close"
              class="header-mobile-close"
              @click="mobileMenuOpen = false"
            />
          </div>
          
          <q-list class="header-premium-mobile-list">
            <q-item 
              clickable 
              v-ripple 
              class="header-premium-mobile-item"
              @click="navigateAndClose('/')"
            >
              <q-item-section avatar>
                <q-icon name="home" size="22px" class="header-mobile-icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="header-premium-mobile-label">Inicio</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" size="16px" />
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="header-premium-mobile-item"
              @click="navigateAndClose('/about')"
            >
              <q-item-section avatar>
                <q-icon name="business" size="22px" class="header-mobile-icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="header-premium-mobile-label">Conócenos</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" size="16px" />
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="header-premium-mobile-item"
              @click="navigateAndClose('/services')"
            >
              <q-item-section avatar>
                <q-icon name="medical_services" size="22px" class="header-mobile-icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="header-premium-mobile-label">Servicios</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" size="16px" />
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="header-premium-mobile-item"
              @click="navigateAndClose('/contact')"
            >
              <q-item-section avatar>
                <q-icon name="contact_page" size="22px" class="header-mobile-icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="header-premium-mobile-label">Contacto</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" size="16px" />
              </q-item-section>
            </q-item>
          </q-list>
          
          <div class="header-premium-mobile-actions">
            <q-btn 
              flat
              class="header-mobile-login"
              @click="openLoginDialog"
            >
              <q-icon name="account_circle" size="20px" class="q-mr-sm" />
              Iniciar Sesión
            </q-btn>
            <q-btn 
              unelevated
              class="header-mobile-appointment"
              @click="openAppointmentDialog"
            >
              <q-icon name="calendar_today" size="18px" class="q-mr-sm" />
              Agendar Cita
            </q-btn>
          </div>
        </div>
      </div>
    </q-slide-transition>

    <!-- Modal de Login -->
    <LoginModal 
      v-model="loginDialog"
      @login-success="onLoginSuccess"
      @register-click="onRegisterClick"
      @forgot-password-click="onForgotPasswordClick"
    />

    <!-- Modal de Citas -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"  
    />

    <!-- Formulario de Nueva Cita -->
    <NewAppointmentForm
      v-model="newAppointmentDialog"
      @abrir-pago="onAbrirPago"
    />

    <PaymentModal
      v-model="paymentDialog"
      :datos-reserva="datosReservaParaPago"
      @pago-exitoso="onPagoExitoso"
      @pago-cancelado="onPagoCancelado"
    />

    <!-- Historial de Citas -->
    <AppointmentHistory 
      v-model="appointmentHistory"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import LoginModal from 'components/LoginModal.vue'
import AppointmentModal from 'components/AppointmentModal.vue'
import NewAppointmentForm from 'components/NewAppointmentForm.vue'
import AppointmentHistory from 'components/AppointmentHistory.vue'
import PaymentModal from 'components/PaymentModal.vue'

const $q = useQuasar()
const router = useRouter()

// Datos reactivos
const selectedLanguage = ref('es')
const darkMode = ref(false)
const mobileMenuOpen = ref(false)
const loginDialog = ref(false)
const appointmentDialog = ref(false)
const newAppointmentDialog = ref(false)
const appointmentHistory = ref(false)
const paymentDialog = ref(false)
const datosReservaParaPago = ref(null)

const languages = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' }
]

// Métodos
const getLanguageLabel = (value) => {
  const lang = languages.find(l => l.value === value)
  return lang ? lang.label.substring(0, 2).toUpperCase() : 'ES'
}

const toggleDarkMode = (value) => {
  $q.dark.set(value)
  localStorage.setItem('darkMode', value)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateAndClose = (path) => {
  router.push(path)
  mobileMenuOpen.value = false
}

const openLoginDialog = () => {
  mobileMenuOpen.value = false
  loginDialog.value = true
}

const openAppointmentDialog = () => {
  mobileMenuOpen.value = false
  appointmentDialog.value = true
}

// Funciones para manejar eventos del modal de login
const onLoginSuccess = (loginData) => {
  console.log('Login exitoso:', loginData)
  // Aquí implementarías la lógica después del login exitoso
  // Por ejemplo: guardar token, redirigir, actualizar estado del usuario, etc.
}

const onRegisterClick = () => {
  console.log('Abrir registro')
  // Aquí implementarías la lógica para abrir el modal de registro
}

const onForgotPasswordClick = () => {
  console.log('Recuperar contraseña')
  // Aquí implementarías la lógica para recuperar contraseña
}

const onNewAppointment = () => {
  console.log('📝 Abriendo formulario de nueva cita')
  newAppointmentDialog.value = true
}

const onHistory = () => {
  $q.notify({
    type: 'info',
    message: 'Abriendo historial de citas...',
    icon: 'history'
  })
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas')
}

// ✅ NUEVOS MÉTODOS (SOLO AGREGADOS)
const onAbrirPago = (datosReserva) => {
  console.log('💳 Abriendo modal de pago con datos:', datosReserva)
  datosReservaParaPago.value = datosReserva
  newAppointmentDialog.value = false
  setTimeout(() => {
    paymentDialog.value = true
  }, 300)
}

const onPagoExitoso = (reserva) => {
  console.log('✅ Pago exitoso, reserva creada:', reserva)
  paymentDialog.value = false
  appointmentDialog.value = false
}

const onPagoCancelado = () => {
  console.log('⚠️ Pago cancelado')
  paymentDialog.value = false
  setTimeout(() => {
    newAppointmentDialog.value = true
  }, 300)
  $q.notify({
    type: 'warning',
    message: 'Pago cancelado. Puedes intentar nuevamente.',
    icon: 'warning'
  })
}

const loadPreferences = () => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    darkMode.value = savedDarkMode === 'true'
    $q.dark.set(darkMode.value)
  }
}

loadPreferences()
</script>

