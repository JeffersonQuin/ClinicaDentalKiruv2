<template>
  <q-page class="about-about-page">
    <!-- Hero Section para About -->
    <section class="about-hero-section">
      <div class="about-hero-background">
        <div class="about-hero-shape about-hero-shape-1"></div>
        <div class="about-hero-shape about-hero-shape-2"></div>
        <div class="about-hero-shape about-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="text-center">
          <div class="about-hero-badge animated fadeInDown">
            <q-icon name="business" size="20px" />
            <span>Nuestra Historia</span>
          </div>
          
          <h1 class="about-hero-title animated fadeInDown">
            Quiénes Somos
          </h1>
          
          <p class="about-hero-subtitle animated fadeInUp" style="animation-delay: 0.2s">
            Conoce más sobre KIRU Odontología Integral y nuestro equipo de especialistas
          </p>
        </div>
      </q-container>
    </section>

    <!-- Sección Principal - Quiénes Somos Mejorada -->
    <section class="about-quienes-section">
      <div class="about-quienes-background">
        <div class="about-wave about-wave-top"></div>
      </div>
      
      <q-container>
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="about-content-main animated fadeInLeft">
              <div class="about-section-badge">
                <q-icon name="groups" size="20px" />
                <span>Nuestro Equipo</span>
              </div>
              
              <h2 class="about-section-title">Quiénes Somos</h2>
              
              <p class="about-section-text">
                Odontología Integral Kiru está conformada por un equipo de profesionales especialistas, 
                comprometidos en brindar a cada paciente la más alta calidad en atención odontológica. 
                Contamos con una amplia gama de servicios, que abarcan desde la odontología general 
                hasta tratamientos especializados, siempre incorporando los últimos avances en tecnología dental.
              </p>
              
              <div class="about-stats q-mb-lg">
                <div class="about-stat">
                  <div class="about-stat-number">{{ store.dentistasCompletos.length }}</div>
                  <div class="about-stat-label">Especialistas</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-number">{{ activeDentistsCount }}</div>
                  <div class="about-stat-label">Activos</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-number">{{ totalSpecialties }}</div>
                  <div class="about-stat-label">Especialidades</div>
                </div>
              </div>
              
              <div class="about-actions q-gutter-md">
                <q-btn 
                  color="primary" 
                  size="lg" 
                  label="Agendar Cita" 
                  icon="calendar_today"
                  @click="openAppointmentDialog"
                  unelevated
                  no-caps
                  class="about-primary-btn"
                />
                <q-btn 
                  outline 
                  color="primary" 
                  size="lg" 
                  label="Ver Servicios"
                  to="/services"
                  no-caps
                  class="about-secondary-btn"
                />
              </div>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="about-image-main-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="about-image-main-glow"></div>
              <div class="about-image-main-container">
                <q-img
                  src="/icons/prueba.jpeg"
                  alt="Paciente en consulta dental KIRU"
                  class="about-main-image"
                />
              </div>
              
              <div class="about-floating-elements">
                <div class="about-floating-card about-floating-card-1">
                  <q-icon name="verified" color="#1976d2" size="24px" />
                  <div class="about-floating-text">
                    <strong>Certificados</strong>
                    <span>Internacionalmente</span>
                  </div>
                </div>
                
                <div class="about-floating-card about-floating-card-2">
                  <q-icon name="emergency" color="#26a69a" size="24px" />
                  <div class="about-floating-text">
                    <strong>24/7</strong>
                    <span>Urgencias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Personal de KIRU Mejorado -->
    <section class="about-staff-section q-pa-xl">
      <q-container>
        <div class="about-section-header text-center animated fadeIn">
          <div class="about-section-badge">
            <q-icon name="people" size="20px" />
            <span>Nuestro Equipo</span>
          </div>
          <h2 class="about-section-title">Nuestros Dentistas Especializados</h2>
          <p class="about-section-subtitle">Conoce a nuestro equipo de profesionales altamente capacitados</p>
          <div class="about-title-decoration">
            <div class="about-title-line"></div>
            <q-icon name="stethoscope" color="primary" size="32px" />
            <div class="about-title-line"></div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="store.cargando" class="text-center q-pa-xl">
          <q-spinner-gears size="50px" color="primary" />
          <div class="text-h6 q-mt-md">Cargando dentistas...</div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="store.error" class="text-center q-pa-xl">
          <q-icon name="error" size="60px" color="negative" />
          <div class="text-h6 q-mt-md">Error al cargar los datos</div>
          <p class="text-body1 q-mt-sm">{{ store.error }}</p>
          <q-btn color="primary" @click="loadDentistas" label="Reintentar" class="q-mt-md" />
        </div>
        
        <!-- Dentistas Activos -->
        <div v-else class="about-staff-grid">
          <div 
            v-for="(dentista, index) in dentistasActivos" 
            :key="dentista.id"
            class="about-staff-card animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="about-staff-member-card" flat>
              <div class="about-staff-image-container">
                <q-avatar 
                  size="200px"
                  class="about-staff-avatar"
                  :style="{ backgroundColor: !dentista.imagen ? getAvatarColor(dentista.nombre) : 'transparent' }"
                >
                  <img 
                    v-if="dentista.imagen" 
                    :src="getImageUrl(dentista.imagen)" 
                    :alt="getFullName(dentista)"
                    @error="handleImageError"
                    class="about-staff-image"
                  />
                  <div v-else class="about-staff-initials">
                    {{ getInitials(dentista) }}
                  </div>
                </q-avatar>
                <div class="about-staff-status">
                  <q-badge 
                    :label="formatState(dentista.estado)" 
                    :class="getStateClass(dentista.estado)"
                    size="lg"
                  />
                </div>
              </div>
              
              <q-card-section class="about-staff-content text-center">
                <h4 class="about-staff-name">{{ getFullName(dentista) }}</h4>
                
                <!-- Especialidades -->
                <div class="about-staff-specialties q-mb-md">
                  <q-chip
                    v-for="especialidad in dentista.especialidades || []"
                    :key="especialidad.id"
                    dense
                    size="sm"
                    :color="especialidad.estado === 'activo' ? 'primary' : 'grey'"
                    text-color="white"
                    class="about-staff-chip"
                  >
                    {{ especialidad.nombre }}
                  </q-chip>
                  <div v-if="!(dentista.especialidades && dentista.especialidades.length)" class="text-grey-7">
                    Sin especialidades
                  </div>
                </div>
                
                <!-- Información del dentista -->
                <div class="about-staff-info q-mb-md">
                  <div class="about-staff-info-item">
                    <q-icon name="work" size="16px" class="q-mr-xs" />
                    <span class="text-caption">Especialista en odontología</span>
                  </div>
                  
                  <div v-if="dentista.experiencia" class="about-staff-info-item">
                    <q-icon name="schedule" size="16px" class="q-mr-xs" />
                    <span class="text-caption">{{ dentista.experiencia }}</span>
                  </div>
                  
                  <div v-if="dentista.formacion" class="about-staff-info-item">
                    <q-icon name="school" size="16px" class="q-mr-xs" />
                    <span class="text-caption">{{ dentista.formacion }}</span>
                  </div>
                </div>
                
                <!-- Descripción -->
                <p class="about-staff-description text-body2 text-grey-8">
                  {{ getDentistDescription(dentista) }}
                </p>
              </q-card-section>
            </q-card>
          </div>
          
          <!-- Mensaje si no hay dentistas activos -->
          <div v-if="dentistasActivos.length === 0 && !store.cargando" class="text-center col-12 q-pa-xl">
            <q-icon name="person_off" size="60px" color="grey-5" />
            <div class="text-h6 q-mt-md">No hay dentistas activos en este momento</div>
            <p class="text-body1 q-mt-sm text-grey-7">
              Pronto tendremos nuestro equipo de especialistas disponible
            </p>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Misión y Visión Mejorada -->
    <section class="about-mission-section">
      <div class="about-mission-background">
        <div class="about-mission-shape about-mission-shape-1"></div>
        <div class="about-mission-shape about-mission-shape-2"></div>
      </div>
      
      <q-container>
        <div class="about-section-header text-center animated fadeIn">
          <div class="about-section-badge">
            <q-icon name="flag" size="20px" />
            <span>Nuestra Filosofía</span>
          </div>
          <h2 class="about-section-title">Nuestra Misión y Visión</h2>
          <p class="about-section-subtitle">Los principios que guían nuestro trabajo diario</p>
        </div>
        
        <div class="about-mission-content">
          <div class="row q-col-gutter-xl">
            <!-- Misión -->
            <div class="col-12 col-md-6 animated fadeInLeft">
              <q-card class="about-mission-card">
                <q-card-section class="about-mission-card-header">
                  <div class="about-mission-icon-wrapper">
                    <q-icon name="target" size="32px" color="primary" />
                  </div>
                  <h3 class="about-mission-card-title">Misión</h3>
                </q-card-section>
                
                <q-card-section class="about-mission-card-body">
                  <p class="about-mission-text">
                    Odontología Integral Kiru es un proyecto que ha crecido rápidamente gracias al compromiso 
                    y dedicación de nuestro equipo. Nos motiva la frase que guía nuestro trabajo: 
                    <strong>«En Dios Confío»</strong>, y mantenemos nuestro lema: 
                    <strong>«Un centro para toda la familia»</strong>.
                  </p>
                  
                  <p class="about-mission-text">
                    Nuestro objetivo es brindar tratamientos preventivos y correctivos en salud oral, 
                    con especialistas altamente capacitados, equipos de última tecnología y ambientes 
                    cómodos para toda la familia.
                  </p>
                </q-card-section>
              </q-card>
            </div>
            
            <!-- Visión -->
            <div class="col-12 col-md-6 animated fadeInRight">
              <q-card class="about-vision-card">
                <q-card-section class="about-vision-card-header">
                  <div class="about-vision-icon-wrapper">
                    <q-icon name="visibility" size="32px" color="secondary" />
                  </div>
                  <h3 class="about-vision-card-title">Visión</h3>
                </q-card-section>
                
                <q-card-section class="about-vision-card-body">
                  <p class="about-vision-text">
                    Ser la clínica dental de referencia en Oruro, reconocida por nuestra excelencia 
                    en atención, tecnología de vanguardia y compromiso con la salud bucal de toda la familia.
                  </p>
                  
                  <div class="about-vision-goals">
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Innovación constante en tratamientos</span>
                    </div>
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Expansión de servicios especializados</span>
                    </div>
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Liderazgo en educación dental comunitaria</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Mejorado -->
    <section class="about-cta-section">
      <div class="about-cta-background">
        <div class="about-cta-shape about-cta-shape-1"></div>
        <div class="about-cta-shape about-cta-shape-2"></div>
        <div class="about-cta-particles">
          <div class="about-particle" v-for="i in 12" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="about-cta-content text-center">
          <div class="about-cta-badge">
            <q-icon name="calendar_today" size="18px" />
            <span>¿Listo para Conocernos?</span>
          </div>
          
          <h2 class="about-cta-title">
            Agenda tu primera consulta con 
            <span class="about-cta-highlight">nuestros especialistas</span>
          </h2>
          
          <p class="about-cta-text">
            Contamos con {{ activeDentistsCount }} dentistas activos y {{ totalSpecialties }} especialidades 
            para brindarte la mejor atención odontológica.
          </p>
          
          <div class="about-cta-features">
            <div class="about-cta-feature">
              <q-icon name="verified" size="20px" />
              <span>Primera consulta gratuita</span>
            </div>
            <div class="about-cta-feature">
              <q-icon name="schedule" size="20px" />
              <span>Horarios flexibles</span>
            </div>
            <div class="about-cta-feature">
              <q-icon name="payments" size="20px" />
              <span>Planes de financiamiento</span>
            </div>
          </div>
          
          <q-btn
            color="white"
            text-color="primary"
            size="xl"
            label="Agendar Cita Ahora"
            icon="calendar_today"
            @click="openAppointmentDialog"
            unelevated
            no-caps
            class="about-cta-btn"
          />
        </div>
      </q-container>
    </section>

    <!-- Modal para Agendar Cita -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDentistaGestionStore } from 'src/stores/dentistaGestionStore'
import { useNotifications } from 'src/composables/useNotifications'
import AppointmentModal from 'components/AppointmentModal.vue'

const { notifyInfo } = useNotifications()
const store = useDentistaGestionStore()

// Datos reactivos
const appointmentDialog = ref(false)

// Computed properties
const activeDentistsCount = computed(() => {
  return store.dentistasCompletos.filter(d => d.estado === 'activo').length
})

const totalSpecialties = computed(() => {
  return store.dentistasCompletos.reduce((acc, d) => acc + (d.especialidades?.length || 0), 0)
})

const dentistasActivos = computed(() => {
  return store.dentistasCompletos
    .filter(d => d.estado === 'activo')
    .sort((a, b) => {
      // Ordenar por nombre
      const nameA = getFullName(a).toLowerCase()
      const nameB = getFullName(b).toLowerCase()
      return nameA.localeCompare(nameB)
    })
})

// Funciones auxiliares
const getFullName = (dentista) => {
  if (!dentista) return ''
  return [dentista.nombre, dentista.segundo_nombre, dentista.apellido_paterno, dentista.apellido_materno]
    .filter(Boolean)
    .join(' ')
}

const getInitials = (dentista) => {
  if (!dentista) return '?'
  const first = dentista.nombre?.charAt(0) || ''
  const last = dentista.apellido_paterno?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
}

const getAvatarColor = (name) => {
  if (!name) return '#9e9e9e'
  const colors = ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722']
  let hash = 0
  for (let i=0; i<name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const avatar = event.target.closest('.about-staff-avatar')
  if (avatar) {
    const name = event.target.alt || ''
    avatar.style.backgroundColor = getAvatarColor(name)
  }
}

const getImageUrl = (imagen) => {
  if (!imagen) return ''
  // Si ya es una URL completa, retornarla
  if (imagen.startsWith('http')) return imagen
  // Si empieza con /uploads, agregar el dominio
  if (imagen.startsWith('/uploads')) return `http://localhost:5050${imagen}`
  // Si es solo el nombre del archivo, construir la ruta completa
  return `http://localhost:5050/uploads/${imagen}`
}

const formatState = (state) => {
  const translations = { activo: 'Activo', inactivo: 'Inactivo' }
  return translations[state] || state
}

const getStateClass = (state) => {
  const classes = { activo: 'bg-positive', inactivo: 'bg-grey' }
  return classes[state] || 'bg-grey'
}

const getDentistDescription = (dentista) => {
  const nombreCompleto = getFullName(dentista)
  const especialidades = dentista.especialidades || []
  
  if (especialidades.length > 0) {
    const especialidadesNombres = especialidades.map(e => e.nombre).join(', ')
    return `${nombreCompleto} es especialista en ${especialidadesNombres}. Cuenta con amplia experiencia en el área odontológica y está comprometido con la excelencia en el tratamiento de pacientes.`
  }
  
  return `${nombreCompleto} es un profesional odontológico con amplia experiencia en el área. Comprometido con la salud bucal y el bienestar de nuestros pacientes.`
}

// Métodos
const loadDentistas = async () => {
  try {
    await store.cargarDentistasCompletos()
  } catch (err) { 
    console.error('Error cargando dentistas:', err)
  }
}

const openAppointmentDialog = () => {
  appointmentDialog.value = true
}


// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  notifyInfo('Abriendo formulario de nueva cita...')
}

const onHistory = () => {
  notifyInfo('Abriendo historial de citas...')
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas')
}

// Cargar datos al montar
onMounted(() => {
  loadDentistas()
})
</script>

