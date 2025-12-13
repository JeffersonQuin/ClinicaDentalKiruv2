<template>
  <q-page class="branch-branch-page">
    <!-- Hero Section para Sucursales -->
    <section class="branch-hero-section">
      <div class="branch-hero-background">
        <div class="branch-hero-shape branch-hero-shape-1"></div>
        <div class="branch-hero-shape branch-hero-shape-2"></div>
        <div class="branch-hero-shape branch-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="branch-hero-badge animated fadeInDown">
              <q-icon name="apartment" size="20px" />
              <span>Ubicaciones Estratégicas</span>
            </div>
            
            <h1 class="branch-hero-title animated fadeInLeft">
              Nuestras 
              <span class="branch-hero-highlight">Sucursales</span>
            </h1>
            
            <p class="branch-hero-subtitle animated fadeInLeft" style="animation-delay: 0.2s">
              Encuentra la sucursal más cercana a ti. Contamos con múltiples ubicaciones estratégicas 
              en Oruro para brindarte la mejor atención dental con la comodidad que mereces.
            </p>
            
            <div class="branch-hero-features animated fadeInUp" style="animation-delay: 0.3s">
              <div class="branch-feature-item">
                <q-icon name="location_on" color="primary" size="24px" />
                <span>Ubicaciones accesibles</span>
              </div>
              <div class="branch-feature-item">
                <q-icon name="access_time" color="primary" size="24px" />
                <span>Horarios flexibles</span>
              </div>
              <div class="branch-feature-item">
                <q-icon name="local_parking" color="primary" size="24px" />
                <span>Estacionamiento disponible</span>
              </div>
            </div>
            
            <div class="branch-hero-actions animated fadeInUp" style="animation-delay: 0.4s">
              <q-btn 
                color="primary" 
                size="lg" 
                label="Agendar Cita" 
                icon="calendar_today"
                @click="openAppointmentDialog"
                unelevated
                no-caps
                class="branch-primary-btn"
              />
              <q-btn 
                flat
                color="primary" 
                size="lg" 
                label="Ver Mapa Completo"
                @click="openMapDialog"
                no-caps
                class="branch-secondary-btn"
              >
                <q-icon name="arrow_forward" size="20px" class="q-ml-sm" />
              </q-btn>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="branch-hero-image-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="branch-hero-glow"></div>
              <div class="branch-hero-image-container">
                <q-img
                  src="/KiruIMG/sucursales.png"
                  alt="Sucursales KIRU"
                  class="branch-hero-image"
                  fit="contain"
                />
              </div>
              
              <div class="branch-floating-elements">
                <div class="branch-floating-card branch-floating-card-1">
                  <q-icon name="location_on" color="red" size="24px" />
                  <div class="branch-floating-text">
                    <strong>{{ sucursalesActivasCount }}</strong>
                    <span>Sucursales Activas</span>
                  </div>
                </div>
                
                <div class="branch-floating-card branch-floating-card-2">
                  <q-icon name="schedule" color="blue" size="24px" />
                  <div class="branch-floating-text">
                    <strong>8am-8pm</strong>
                    <span>Horario</span>
                  </div>
                </div>
                
                <div class="branch-floating-card branch-floating-card-3">
                  <q-icon name="map" color="primary" size="24px" />
                  <div class="branch-floating-text">
                    <strong>GPS</strong>
                    <span>Precisión</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Sucursales -->
    <section class="branch-branches-section">
      <div class="branch-branches-background">
        <div class="branch-wave branch-wave-top"></div>
      </div>
      
      <q-container>
        <div class="branch-section-header animated fadeIn">
          <div class="branch-section-badge">
            <q-icon name="room" size="20px" />
            <span>Nuestras Ubicaciones</span>
          </div>
          <h2 class="branch-section-title">Ubicaciones Disponibles</h2>
          <p class="branch-section-subtitle">Selecciona la sucursal que mejor se adapte a tus necesidades</p>
          <div class="branch-title-decoration">
            <div class="branch-title-line"></div>
            <q-icon name="place" color="primary" size="32px" />
            <div class="branch-title-line"></div>
          </div>
          
          <!-- Barra de búsqueda -->
          <div class="branch-search-container">
            <q-input
              v-model="searchQuery"
              placeholder="Buscar sucursal por nombre, dirección o ubicación..."
              outlined
              dense
              class="branch-search-input"
              @update:model-value="sucursalStore.setSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon v-if="searchQuery" name="clear" class="cursor-pointer" @click="clearSearch" />
              </template>
            </q-input>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="sucursalStore.loading" class="branch-loading-state">
          <div class="branch-loading-content">
            <q-spinner-gears color="primary" size="60px" />
            <div class="branch-loading-text">Cargando sucursales...</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="sucursalesActivasFiltradas.length === 0" class="branch-empty-state">
          <div class="branch-empty-illustration">
            <q-icon name="location_off" size="80px" />
            <div class="branch-empty-circle branch-empty-circle-1"></div>
            <div class="branch-empty-circle branch-empty-circle-2"></div>
          </div>
          <div class="branch-empty-title">
            {{ searchQuery ? 'No se encontraron sucursales' : 'No hay sucursales activas disponibles' }}
          </div>
          <p class="branch-empty-text">
            {{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'Próximamente abriremos nuevas sucursales en tu zona.' }}
          </p>
          <q-btn
            v-if="searchQuery"
            color="primary"
            label="Limpiar búsqueda"
            @click="clearSearch"
            unelevated
            no-caps
          />
        </div>
        
        <!-- Sucursales Grid -->
        <div v-else class="row q-col-gutter-lg">
          <div 
            v-for="(branch, index) in sucursalesActivasFiltradas" 
            :key="branch.id" 
            class="col-12 col-sm-6 col-lg-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="branch-branch-card" @click="openBranchDetail(branch)">
              <div class="branch-branch-image-wrapper">
                <div class="branch-branch-gradient"></div>
                <q-img 
                  :src="sucursalStore.getImagePath(branch.imagen) || '/default-branch.jpg'" 
                  :alt="branch.nombre" 
                  class="branch-branch-image"
                  @error="sucursalStore.handleImageError"
                  ratio="4/3"
                />
                <div class="branch-branch-overlay">
                  <div class="branch-branch-overlay-content">
                    <div class="branch-overlay-icon-wrapper">
                      <q-icon name="visibility" color="white" size="32px" />
                    </div>
                    <p class="branch-overlay-text">Ver detalles completos</p>
                  </div>
                </div>
              </div>
              
              <q-card-section class="branch-branch-content">
                <div class="branch-branch-title">
                  {{ branch.nombre }}
                </div>
                
                <div class="branch-branch-location">
                  <q-icon name="location_on" size="18px" />
                  <span>{{ branch.direccion }}</span>
                </div>
                
                <div class="branch-branch-info">
                  <div class="branch-info-item">
                    <q-icon name="place" size="18px" />
                    <span>{{ branch.ubicacion }}</span>
                  </div>
                  
                  <div v-if="branch.latitud && branch.longitud" class="branch-info-item">
                    <q-icon name="gps_fixed" size="18px" />
                    <span>Coordenadas: {{ formatCoordinates(branch.latitud, branch.longitud) }}</span>
                  </div>
                </div>
                
                <div class="branch-branch-description">
                  <p>{{ truncateDescription(branch.descripcion) }}</p>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions class="branch-branch-actions">
                <q-btn 
                  flat 
                  label="Ver Detalles" 
                  color="primary" 
                  icon-right="arrow_forward"
                  no-caps
                  class="branch-details-btn"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="branch-cta-section">
      <div class="branch-cta-background">
        <div class="branch-cta-shape branch-cta-shape-1"></div>
        <div class="branch-cta-shape branch-cta-shape-2"></div>
        <div class="branch-cta-particles">
          <div class="branch-particle" v-for="i in 20" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="branch-cta-content">
          <div class="branch-cta-badge">
            <q-icon name="support_agent" size="18px" />
            <span>Estamos Aquí Para Ti</span>
          </div>
          
          <h2 class="branch-cta-title">
            ¿No encuentras la sucursal que <span class="branch-cta-highlight">buscas</span>?
          </h2>
          
          <p class="branch-cta-text">
            Contáctanos y te ayudaremos a encontrar la ubicación más conveniente para ti.
          </p>
          
          <div class="branch-cta-features">
            <div class="branch-cta-feature">
              <q-icon name="phone_in_talk" size="20px" />
              <span>Atención telefónica</span>
            </div>
            <div class="branch-cta-feature">
              <q-icon name="email" size="20px" />
              <span>Respuesta rápida</span>
            </div>
            <div class="branch-cta-feature">
              <q-icon name="chat" size="20px" />
              <span>Chat en línea</span>
            </div>
          </div>
          
          <q-btn
            color="white"
            text-color="primary"
            size="xl"
            label="Contactar"
            icon="phone"
            to="/contact"
            unelevated
            no-caps
            class="branch-cta-btn"
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

    <!-- Dialog de detalle de la sucursal -->
    <q-dialog v-model="branchDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedBranch" class="branch-dialog-card">
        <q-card-section class="branch-dialog-header bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="branch-dialog-title">{{ selectedBranch.nombre }}</div>
              <div class="branch-dialog-location">
                <q-icon name="place" size="16px" />
                {{ selectedBranch.ubicacion }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" size="md" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="branch-dialog-content">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="branch-dialog-image-wrapper">
                <q-img
                  :src="sucursalStore.getImagePath(selectedBranch.imagen) || '/default-branch.jpg'"
                  :alt="selectedBranch.nombre"
                  class="branch-dialog-image"
                  @error="sucursalStore.handleImageError"
                />
              </div>
              
              <!-- Mapa embebido -->
              <div class="branch-map-section">
                <h5 class="branch-map-title">
                  <q-icon name="map" size="20px" />
                  Ubicación en el Mapa
                </h5>
                <div class="branch-map-container">
                  <iframe
                    :src="generateMapUrl(selectedBranch)"
                    width="100%"
                    height="300"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    class="branch-map-iframe"
                  ></iframe>
                </div>
                
                <!-- Información de coordenadas -->
                <div v-if="selectedBranch.latitud && selectedBranch.longitud" class="branch-coordinates-info">
                  <div class="branch-coordinates-header">
                    <q-icon name="gps_fixed" size="18px" />
                    <h6>Coordenadas GPS</h6>
                  </div>
                  <div class="branch-coordinates-details">
                    <div class="branch-coordinate-item">
                      <span class="branch-coordinate-label">Latitud:</span>
                      <span class="branch-coordinate-value">{{ selectedBranch.latitud }}°</span>
                    </div>
                    <div class="branch-coordinate-item">
                      <span class="branch-coordinate-label">Longitud:</span>
                      <span class="branch-coordinate-value">{{ selectedBranch.longitud }}°</span>
                    </div>
                    <div class="branch-coordinate-item">
                      <span class="branch-coordinate-label">Formato:</span>
                      <span class="branch-coordinate-value">{{ formatCoordinates(selectedBranch.latitud, selectedBranch.longitud) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="branch-dialog-text-content">
                <h3 class="branch-detail-title">
                  {{ selectedBranch.nombre }}
                </h3>
                
                <div class="branch-detail-badge">
                  <q-chip 
                    color="green" 
                    text-color="white" 
                    icon="check_circle"
                    size="lg"
                  >
                    Abierto Ahora
                  </q-chip>
                </div>
                
                <div class="branch-detail-info-card">
                  <h5 class="branch-info-card-title">
                    <q-icon name="info" size="20px" />
                    Información de Contacto
                  </h5>
                  
                  <q-list bordered class="rounded-borders">
                    <q-item class="branch-detail-info-item">
                      <q-item-section avatar>
                        <q-avatar color="red-1" text-color="red" icon="location_on" size="48px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="branch-info-label">Dirección</q-item-label>
                        <q-item-label class="branch-info-value">{{ selectedBranch.direccion }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-separator />
                    
                    <q-item class="branch-detail-info-item">
                      <q-item-section avatar>
                        <q-avatar color="blue-1" text-color="blue" icon="place" size="48px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="branch-info-label">Ubicación</q-item-label>
                        <q-item-label class="branch-info-value">{{ selectedBranch.ubicacion }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-separator />
                    
                    <q-item v-if="selectedBranch.latitud && selectedBranch.longitud" class="branch-detail-info-item">
                      <q-item-section avatar>
                        <q-avatar color="purple-1" text-color="purple" icon="gps_fixed" size="48px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="branch-info-label">Coordenadas GPS</q-item-label>
                        <q-item-label class="branch-info-value">
                          {{ formatCoordinates(selectedBranch.latitud, selectedBranch.longitud) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    
                    <q-separator v-if="selectedBranch.latitud && selectedBranch.longitud" />
                    
                    <q-item class="branch-detail-info-item">
                      <q-item-section avatar>
                        <q-avatar 
                          color="green-1" 
                          text-color="green" 
                          icon="check_circle"
                          size="48px" 
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="branch-info-label">Estado</q-item-label>
                        <q-item-label class="branch-info-value">
                          Abierto
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                
                <div class="branch-detail-description">
                  <h5 class="branch-description-label">
                    <q-icon name="description" size="20px" />
                    Descripción
                  </h5>
                  <p class="branch-description-text">{{ selectedBranch.descripcion }}</p>
                </div>
                
                <div class="branch-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialog"
                    unelevated
                    no-caps
                    class="branch-action-btn-primary"
                  />
                  <q-btn 
                    color="secondary" 
                    label="Cómo Llegar" 
                    size="lg"
                    icon="directions"
                    :href="generateDirectionsUrl(selectedBranch)"
                    target="_blank"
                    unelevated
                    no-caps
                    class="branch-action-btn-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog del mapa completo con todas las sucursales -->
    <q-dialog v-model="mapDialog" maximized transition-show="scale" transition-hide="scale">
      <q-card class="branch-map-dialog-card">
        <q-card-section class="branch-map-dialog-header bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="branch-map-dialog-title">
                <q-icon name="map" size="24px" class="q-mr-sm" />
                Mapa de Todas las Sucursales
              </div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" size="md" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="branch-map-dialog-content">
          <!-- Mapa dinámico con todas las sucursales activas -->
          <div class="branch-map-container-full">
            <iframe
              :src="generateAllBranchesMapUrl()"
              width="100%"
              height="600"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="branch-map-iframe-full"
            ></iframe>
          </div>
          
          <!-- Lista de sucursales en el mapa -->
          <div class="branch-map-sucursales-list">
            <h5 class="branch-map-list-title">
              <q-icon name="apartment" size="20px" />
              Sucursales en el Mapa
            </h5>
            <div class="row q-col-gutter-md">
              <div 
                v-for="branch in sucursalesActivasFiltradas" 
                :key="branch.id" 
                class="col-12 col-sm-6 col-md-4"
              >
                <q-card flat bordered class="branch-map-sucursal-card">
                  <q-card-section>
                    <div class="branch-map-sucursal-title">{{ branch.nombre }}</div>
                    <div class="branch-map-sucursal-location">
                      <q-icon name="location_on" size="14px" />
                      {{ branch.ubicacion }}
                    </div>
                    <div v-if="branch.latitud && branch.longitud" class="branch-map-sucursal-coords">
                      <q-icon name="gps_fixed" size="14px" />
                      {{ formatCoordinates(branch.latitud, branch.longitud) }}
                    </div>
                    <q-btn
                      flat
                      color="primary"
                      label="Ver en mapa"
                      size="sm"
                      @click="centerMapOnBranch(branch)"
                      class="branch-map-center-btn"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNotifications } from 'src/composables/useNotifications'
import { useSucursalStore } from 'src/stores/sucursalStore'
import AppointmentModal from 'components/AppointmentModal.vue'

const { notifyInfo } = useNotifications()
const sucursalStore = useSucursalStore()

// Datos reactivos
const appointmentDialog = ref(false)
const branchDialog = ref(false)
const mapDialog = ref(false)
const searchQuery = ref('')
const selectedBranch = ref(null)

// Computed properties
const sucursalesActivasFiltradas = computed(() => {
  // Filtrar solo sucursales activas (activo === 1)
  return sucursalStore.filteredBranches.filter(branch => branch.activo === 1)
})

const sucursalesActivasCount = computed(() => {
  return sucursalStore.sucursalesActivas.length
})

// Cargar datos de sucursales al montar el componente
onMounted(() => {
  sucursalStore.listar()
})

// Métodos
const openAppointmentDialog = () => {
  branchDialog.value = false
  appointmentDialog.value = true
}

const openBranchDetail = (branch) => {
  selectedBranch.value = branch
  sucursalStore.setSelectedBranch(branch)
  branchDialog.value = true
}

const openMapDialog = () => {
  mapDialog.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  sucursalStore.setSearch('')
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 120 
    ? description.substring(0, 120) + '...' 
    : description
}

const formatCoordinates = (lat, lng) => {
  // Formatear coordenadas a un formato legible
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'O'
  const absLat = Math.abs(lat).toFixed(4)
  const absLng = Math.abs(lng).toFixed(4)
  return `${absLat}°${latDir}, ${absLng}°${lngDir}`
}

const generateMapUrl = (branch) => {
  if (branch.latitud && branch.longitud) {
    // Usar coordenadas exactas si están disponibles
    return `https://maps.google.com/maps?q=${branch.latitud},${branch.longitud}&z=15&output=embed`
  }
  // Fallback a la dirección si no hay coordenadas
  const address = encodeURIComponent(`${branch.direccion}, ${branch.ubicacion}`)
  return `https://maps.google.com/maps?q=${address}&z=15&output=embed`
}

const generateAllBranchesMapUrl = () => {
  const sucursales = sucursalesActivasFiltradas.value
  
  if (sucursales.length === 0) {
    return 'https://maps.google.com/maps?q=Oruro,Bolivia&z=12&output=embed'
  }

  // Si hay sucursales con coordenadas, centrar el mapa en el promedio
  const sucursalesConCoordenadas = sucursales.filter(s => s.latitud && s.longitud)
  
  if (sucursalesConCoordenadas.length > 0) {
    // Calcular centro promedio
    const avgLat = sucursalesConCoordenadas.reduce((sum, s) => sum + parseFloat(s.latitud), 0) / sucursalesConCoordenadas.length
    const avgLng = sucursalesConCoordenadas.reduce((sum, s) => sum + parseFloat(s.longitud), 0) / sucursalesConCoordenadas.length
    
    // Crear marcadores para cada sucursal
    const markers = sucursalesConCoordenadas
      .map((s, i) => 
        `&markers=color:red%7Clabel:${i+1}%7C${s.latitud},${s.longitud}`
      )
      .join('')
    
    return `https://maps.google.com/maps?q=${avgLat},${avgLng}&z=12${markers}&output=embed`
  }

  // Fallback a Oruro como centro
  return 'https://maps.google.com/maps?q=Oruro,Bolivia&z=12&output=embed'
}

const centerMapOnBranch = (branch) => {
  if (branch.latitud && branch.longitud) {
    // Aquí podrías implementar lógica para centrar el iframe en la sucursal
    notifyInfo(`Centrando mapa en ${branch.nombre}`)
    // Nota: Para cambiar el iframe dinámicamente, necesitarías reemplazar el src
    // o usar la API de Google Maps JavaScript
  }
}

const generateDirectionsUrl = (branch) => {
  if (branch.latitud && branch.longitud) {
    return `https://www.google.com/maps/dir/?api=1&destination=${branch.latitud},${branch.longitud}`
  }
  const address = encodeURIComponent(`${branch.direccion}, ${branch.ubicacion}`)
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`
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
</script>

