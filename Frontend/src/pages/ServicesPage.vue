<template>
  <q-page class="serv-services-page">
    <!-- Hero Section para Servicios -->
    <section class="serv-hero-section">
      <div class="serv-hero-background">
        <div class="serv-hero-shape serv-hero-shape-1"></div>
        <div class="serv-hero-shape serv-hero-shape-2"></div>
        <div class="serv-hero-shape serv-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="serv-hero-badge animated fadeInDown">
              <q-icon name="medical_services" size="20px" />
              <span>Servicios Profesionales</span>
            </div>
            
            <h1 class="serv-hero-title animated fadeInLeft">
              Nuestros Servicios 
              <span class="serv-hero-highlight">Dentales</span>
            </h1>
            
            <p class="serv-hero-subtitle animated fadeInLeft" style="animation-delay: 0.2s">
              Ofrecemos una amplia gama de tratamientos para cuidar tu salud bucal y embellecer tu sonrisa. 
              Nuestro equipo de profesionales especializados utiliza tecnología de vanguardia para brindarte 
              la mejor atención dental.
            </p>
            
            <div class="serv-hero-features animated fadeInUp" style="animation-delay: 0.3s">
              <div class="serv-feature-item">
                <q-icon name="verified" color="primary" size="24px" />
                <span>Profesionales certificados</span>
              </div>
              <div class="serv-feature-item">
                <q-icon name="science" color="primary" size="24px" />
                <span>Tecnología avanzada</span>
              </div>
              <div class="serv-feature-item">
                <q-icon name="emoji_emotions" color="primary" size="24px" />
                <span>Resultados excepcionales</span>
              </div>
            </div>
            
            <div class="serv-hero-actions animated fadeInUp" style="animation-delay: 0.4s">
              <q-btn 
                color="primary" 
                size="lg" 
                label="Agendar Cita" 
                icon="calendar_today"
                @click="openAppointmentDialog"
                unelevated
                no-caps
                class="serv-primary-btn"
              />
              <q-btn 
                flat
                color="primary" 
                size="lg" 
                label="Contáctanos"
                to="/contact"
                no-caps
                class="serv-secondary-btn"
              >
                <q-icon name="arrow_forward" size="20px" class="q-ml-sm" />
              </q-btn>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="serv-hero-image-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="serv-hero-glow"></div>
              <div class="serv-hero-image-container">
                <q-img
                  src="/KiruIMG/services.png"
                  alt="Paciente sonriendo en consulta dental"
                  class="serv-hero-image"
                  fit="contain"
                />
              </div>
              
              <div class="serv-floating-elements">
                <div class="serv-floating-card serv-floating-card-1">
                  <q-icon name="favorite" color="red" size="24px" />
                  <div class="serv-floating-text">
                    <strong>{{ servicioStore.serviciosActivos.length }}</strong>
                    <span>Servicios Activos</span>
                  </div>
                </div>
                
                <div class="serv-floating-card serv-floating-card-2">
                  <q-icon name="star" color="amber" size="24px" />
                  <div class="serv-floating-text">
                    <strong>{{ servicioStore.categoriasUnicas.length }}</strong>
                    <span>Categorías</span>
                  </div>
                </div>
                
                <div class="serv-floating-card serv-floating-card-3">
                  <q-icon name="workspace_premium" color="primary" size="24px" />
                  <div class="serv-floating-text">
                    <strong>Premium</strong>
                    <span>Calidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Servicios -->
    <section class="serv-services-grid-section">
      <div class="serv-services-background">
        <div class="serv-wave serv-wave-top"></div>
      </div>
      
      <q-container>
        <div class="serv-section-header animated fadeIn">
          <div class="serv-section-badge">
            <q-icon name="local_hospital" size="20px" />
            <span>Tratamientos Disponibles</span>
          </div>
          <h2 class="serv-section-title">Explora Nuestros Tratamientos</h2>
          <p class="serv-section-subtitle">Encuentra el servicio dental que necesitas para mantener una sonrisa perfecta</p>
          <div class="serv-title-decoration">
            <div class="serv-title-line"></div>
            <q-icon name="auto_awesome" color="primary" size="32px" />
            <div class="serv-title-line"></div>
          </div>
        </div>
        
        <!-- Filtro de búsqueda -->
        <div class="q-mb-lg" v-if="serviciosActivos.length > 0">
          <q-input
            v-model="servicioStore.search"
            outlined
            type="search"
            placeholder="Buscar servicios por título o categoría..."
            @update:model-value="servicioStore.setSearch"
            clearable
            class="serv-search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(service, index) in serviciosFiltrados" 
            :key="service.id" 
            class="col-12 col-sm-6 col-md-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="serv-service-card">
              <div class="serv-service-image-wrapper">
                <div class="serv-service-gradient"></div>
                <q-img 
                  :src="servicioStore.getImagePath(service.imagen)" 
                  :alt="service.titulo" 
                  class="serv-service-image"
                  ratio="1"
                  @error="servicioStore.handleImageError"
                >
                  <template v-slot:error>
                    <div class="serv-image-placeholder">
                      <q-icon name="medical_services" size="48px" color="white" />
                    </div>
                  </template>
                </q-img>
                <div class="serv-service-overlay">
                  <div class="serv-service-overlay-content">
                    <div class="serv-overlay-icon-wrapper">
                      <q-icon name="medical_services" color="white" size="32px" />
                    </div>
                    <p class="serv-overlay-text">Servicio Dental</p>
                  </div>
                </div>
                <div class="serv-service-badge">
                  <q-chip 
                    :color="getCategoryColor(service.categoria)" 
                    text-color="white" 
                    size="md"
                    icon="label"
                    class="serv-category-chip"
                  >
                    {{ service.categoria }}
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="serv-service-content">
                <div class="serv-service-title">
                  {{ service.titulo }}
                </div>
                
                <div class="serv-service-description">
                  <p>{{ service.descripcion }}</p>
                </div>
                
                <div class="serv-service-info">
                  <div class="serv-info-item">
                    <q-icon name="schedule" size="18px" />
                    <span>Duración personalizada</span>
                  </div>
                  <div class="serv-info-item">
                    <q-icon name="check_circle" color="positive" size="18px" />
                    <span>Disponible</span>
                  </div>
                </div>
              </q-card-section>
              
              <q-separator />
              
            </q-card>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="serviciosActivos.length === 0" class="text-center q-pa-xl">
          <q-icon name="medical_services" size="100px" color="grey-5" class="q-mb-md" />
          <h4 class="text-grey-6">No hay servicios activos disponibles</h4>
          <p class="text-grey-5">Pronto tendremos nuevos servicios para ti</p>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="serv-cta-section">
      <div class="serv-cta-background">
        <div class="serv-cta-shape serv-cta-shape-1"></div>
        <div class="serv-cta-shape serv-cta-shape-2"></div>
        <div class="serv-cta-particles">
          <div class="serv-particle" v-for="i in 20" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="serv-cta-content">
          <div class="serv-cta-badge">
            <q-icon name="auto_awesome" size="18px" />
            <span>Comienza Hoy</span>
          </div>
          
          <h2 class="serv-cta-title">
            ¿Listo para transformar tu <span class="serv-cta-highlight">sonrisa</span>?
          </h2>
          
          <p class="serv-cta-text">
            Agenda una consulta hoy mismo y déjanos cuidar de tu salud dental con la mejor tecnología y profesionalismo.
          </p>
          
          <div class="serv-cta-features">
            <div class="serv-cta-feature">
              <q-icon name="event_available" size="20px" />
              <span>Agenda rápida y fácil</span>
            </div>
            <div class="serv-cta-feature">
              <q-icon name="card_giftcard" size="20px" />
              <span>Primera consulta gratis</span>
            </div>
            <div class="serv-cta-feature">
              <q-icon name="thumb_up" size="20px" />
              <span>Garantía de satisfacción</span>
            </div>
          </div>
          
          <q-btn
            color="white"
            text-color="primary"
            size="xl"
            label="Agendar Cita"
            icon="calendar_today"
            @click="openAppointmentDialog"
            unelevated
            no-caps
            class="serv-cta-btn"
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

    <!-- Dialog para agendar cita específica -->
    <q-dialog v-model="appointmentServiceDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Agendar Cita</div>
          <div class="text-subtitle2">Para: {{ selectedServiceForAppointment?.titulo }}</div>
        </q-card-section>
        
        <q-card-section>
          <p>¿Desea agendar una cita para este servicio?</p>
          <div class="q-mt-md">
            <q-btn 
              color="primary" 
              label="Sí, Agendar" 
              @click="confirmAppointment"
              unelevated
              class="full-width q-mb-sm"
            />
            <q-btn 
              flat 
              label="Cancelar" 
              color="grey" 
              v-close-popup
              class="full-width"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useServicioStore } from 'src/stores/servicioStore'
import AppointmentModal from 'components/AppointmentModal.vue'

const $q = useQuasar()
const servicioStore = useServicioStore()

// Datos reactivos
const appointmentDialog = ref(false)
const appointmentServiceDialog = ref(false)
const selectedServiceForAppointment = ref(null)

// Computed: Solo servicios activos
const serviciosActivos = computed(() => {
  return servicioStore.servicios.filter(servicio => servicio.estado === 'activo')
})

// Computed: Servicios filtrados (activos + búsqueda)
const serviciosFiltrados = computed(() => {
  if (!servicioStore.search.trim()) {
    return serviciosActivos.value
  }
  return servicioStore.filteredServicios.filter(servicio => servicio.estado === 'activo')
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const confirmAppointment = () => {
  if (selectedServiceForAppointment.value) {
    $q.notify({
      type: 'positive',
      message: `Cita agendada para: ${selectedServiceForAppointment.value.titulo}`,
      icon: 'calendar_today'
    })
    appointmentServiceDialog.value = false
    selectedServiceForAppointment.value = null
  }
}

// Función para obtener color según categoría
const getCategoryColor = (categoria) => {
  const colors = {
    'Odontología General': 'blue',
    'Estética Dental': 'pink',
    'Ortodoncia': 'teal',
    'Implantes Dentales': 'orange',
    'Endodoncia': 'purple',
    'Periodoncia': 'green',
    'Cirugía Oral': 'red',
    'Prótesis Dental': 'amber',
    'Limpieza Dental': 'light-blue',
    'Blanqueamiento': 'cyan',
    'Emergencias Dentales': 'deep-orange'
  }
  return colors[categoria] || 'primary'
}

// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  $q.notify({
    type: 'info',
    message: 'Abriendo formulario de nueva cita...',
    icon: 'calendar_today'
  })
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

// Cargar servicios al montar el componente
onMounted(() => {
  servicioStore.listar()
})
</script>

