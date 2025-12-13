<template>
  <div class="odontogram-page-container">
    <!-- Header Section -->
    <div class="odontogram-page-header">
      <div class="odontogram-header-background">
        <div class="odontogram-header-shape odontogram-header-shape-1"></div>
        <div class="odontogram-header-shape odontogram-header-shape-2"></div>
      </div>
      <div class="odontogram-header-content">
        <div class="odontogram-title-section">
          <div class="odontogram-icon-wrapper">
            <i class="fa-solid fa-tooth odontogram-header-icon"></i>
          </div>
          <div>
            <h1 class="odontogram-page-title">Odontograma</h1>
            <p class="odontogram-page-subtitle">Visualiza y gestiona el tratamiento dental del paciente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Component -->
    <div class="odontogram-search-section">
      <SearchPaciente @paciente-seleccionado="cargarOdontograma" />
    </div>

    <!-- Odontogram Content -->
    <div v-if="pacienteSeleccionado && odontograma" class="odontogram-content-container">
      <!-- Patient Info Card -->
      <div class="odontogram-patient-card">
        <div class="odontogram-card-header">
          <div class="odontogram-patient-info">
            <h3 class="odontogram-patient-name">Odontograma de {{ pacienteSeleccionado.nombre }}</h3>
            <div class="odontogram-patient-details">
              <span class="odontogram-patient-detail">
                <i class="fa-solid fa-id-card"></i>
                CI: {{ pacienteSeleccionado.ci }}
              </span>
              <span class="odontogram-patient-detail">
                <i class="fa-solid fa-teeth"></i>
                Tipo: {{ odontograma.tipo_denticion }}
              </span>
            </div>
          </div>
          <q-btn 
            class="odontogram-edit-btn"
            flat 
            icon="fa-solid fa-edit" 
            label="Editar" 
            size="md"
          />
        </div>

        <div class="odontogram-diagnosis-section">
          <div class="odontogram-diagnosis-item">
            <div class="odontogram-diagnosis-label">
              <i class="fa-solid fa-stethoscope"></i>
              Diagnóstico General:
            </div>
            <div class="odontogram-diagnosis-text">{{ odontograma.diagnostico_general }}</div>
          </div>
          <div class="odontogram-diagnosis-item">
            <div class="odontogram-diagnosis-label">
              <i class="fa-solid fa-clipboard-list"></i>
              Plan de Tratamiento:
            </div>
            <div class="odontogram-diagnosis-text">{{ odontograma.plan_tratamiento }}</div>
          </div>
        </div>
      </div>

      <!-- Odontogram Grid -->
      <div class="odontogram-grid-card">
        <div class="odontogram-grid-container">
          <div class="odontogram-quadrant odontogram-quadrant-superior-derecho">
            <div class="odontogram-quadrant-label">
              <i class="fa-solid fa-arrow-up-right"></i>
              Superior Derecho
            </div>
            <div class="odontogram-teeth-row">
              <Tooth
                v-for="num in [18, 17, 16, 15, 14, 13, 12, 11]"
                :key="num"
                :pieza="obtenerPieza(num)"
                posicion="superior"
                @select-face="handleSelectFace"
              />
            </div>
          </div>

          <div class="odontogram-quadrant odontogram-quadrant-superior-izquierdo">
            <div class="odontogram-quadrant-label">
              <i class="fa-solid fa-arrow-up-left"></i>
              Superior Izquierdo
            </div>
            <div class="odontogram-teeth-row">
              <Tooth
                v-for="num in [21, 22, 23, 24, 25, 26, 27, 28]"
                :key="num"
                :pieza="obtenerPieza(num)"
                posicion="superior"
                @select-face="handleSelectFace"
              />
            </div>
          </div>

          <div class="odontogram-separator">
            <div class="odontogram-separator-line"></div>
          </div>

          <div class="odontogram-quadrant odontogram-quadrant-inferior-derecho">
            <div class="odontogram-teeth-row">
              <Tooth
                v-for="num in [48, 47, 46, 45, 44, 43, 42, 41]"
                :key="num"
                :pieza="obtenerPieza(num)"
                posicion="inferior"
                @select-face="handleSelectFace"
              />
            </div>
            <div class="odontogram-quadrant-label">
              <i class="fa-solid fa-arrow-down-right"></i>
              Inferior Derecho
            </div>
          </div>

          <div class="odontogram-quadrant odontogram-quadrant-inferior-izquierdo">
            <div class="odontogram-teeth-row">
              <Tooth
                v-for="num in [31, 32, 33, 34, 35, 36, 37, 38]"
                :key="num"
                :pieza="obtenerPieza(num)"
                posicion="inferior"
                @select-face="handleSelectFace"
              />
            </div>
            <div class="odontogram-quadrant-label">
              <i class="fa-solid fa-arrow-down-left"></i>
              Inferior Izquierdo
            </div>
          </div>
        </div>
      </div>

      <!-- Treatment Summary -->
      <div class="odontogram-summary-card">
        <div class="odontogram-card-header">
          <h3 class="odontogram-summary-title">
            <i class="fa-solid fa-list-check"></i>
            Resumen de Tratamientos
          </h3>
        </div>

        <div class="odontogram-treatments-list">
          <div 
            v-for="pieza in piezasConTratamiento" 
            :key="pieza.id" 
            class="odontogram-treatment-item"
          >
            <div class="odontogram-treatment-avatar">
              <q-avatar 
                :color="getColorEstado(pieza.estado_general)" 
                text-color="white"
                size="48px"
                class="odontogram-tooth-avatar"
              >
                {{ pieza.numero }}
              </q-avatar>
              <div class="odontogram-tooth-badge" :class="`odontogram-status-${pieza.estado_general}`"></div>
            </div>

            <div class="odontogram-treatment-info">
              <div class="odontogram-treatment-name">Diente #{{ pieza.numero }}</div>
              <div class="odontogram-treatment-diagnosis">{{ pieza.diagnostico }}</div>
            </div>

            <div class="odontogram-treatment-details">
              <q-chip 
                :class="['odontogram-status-chip', `odontogram-status-${pieza.estado_general}`]"
                :label="pieza.estado_general"
                size="sm"
              />
              <div class="odontogram-treatment-price">Bs. {{ pieza.precio.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <div class="odontogram-total-section">
          <div class="odontogram-total-content">
            <div class="odontogram-total-label">Total del Tratamiento:</div>
            <div class="odontogram-total-amount">Bs. {{ costoTotal.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Patient State -->
    <div v-else class="odontogram-no-patient">
      <div class="odontogram-empty-state">
        <div class="odontogram-empty-illustration">
          <i class="fa-solid fa-tooth odontogram-empty-icon"></i>
          <div class="odontogram-empty-circle odontogram-empty-circle-1"></div>
          <div class="odontogram-empty-circle odontogram-empty-circle-2"></div>
        </div>
        <h3 class="odontogram-empty-title">Selecciona un paciente</h3>
        <p class="odontogram-empty-description">
          Ingresa el CI del paciente en el campo de búsqueda para cargar su odontograma
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePacientesStore } from 'src/stores/pacientes'
import SearchPaciente from '../../components/SearchPatien.vue'
import Tooth from '../../components/ToothComponent.vue'
import odontogramaData from '../../data/odontograma.json'

const store = usePacientesStore()

const odontograma = ref(null)
const piezas = ref([])
const caras = ref([])

onMounted(() => {
  store.cargarPacientes()
})

const pacienteSeleccionado = computed(() => store.pacienteSeleccionado)
console.log('Paciente seleccionado:', pacienteSeleccionado.value)

const cargarOdontograma = (paciente) => {
  if (!paciente || !paciente.ci) {
    console.error('No se puede cargar odontograma sin CI del paciente')
    return
  }

  // Buscar el odontograma que corresponde al CI del paciente
  const odontogramaEncontrado = odontogramaData.odontogramas.find(
    (o) => o.paciente_ci === paciente.ci
  )

  if (!odontogramaEncontrado) {
    console.warn(`No se encontró odontograma para el paciente con CI: ${paciente.ci}`)
    odontograma.value = null
    piezas.value = []
    caras.value = []
    return
  }

  // Cargar el odontograma encontrado
  odontograma.value = odontogramaEncontrado

  // Filtrar solo las piezas que pertenecen a este odontograma
  piezas.value = odontogramaData.piezas.filter(
    (p) => p.id_odontograma === odontogramaEncontrado.id
  )

  // Obtener los IDs de las piezas encontradas
  const idsPiezas = piezas.value.map((p) => p.id)

  // Filtrar solo las caras que pertenecen a las piezas de este odontograma
  caras.value = odontogramaData.caras.filter(
    (c) => idsPiezas.includes(c.id_pieza)
  )

  console.log('Odontograma cargado:', {
    paciente_ci: paciente.ci,
    odontograma: odontogramaEncontrado,
    total_piezas: piezas.value.length,
    total_caras: caras.value.length
  })
}

const obtenerPieza = (numero) => {
  const pieza = piezas.value.find((p) => p.numero === numero)
  
  if (!pieza) {
    return {
      numero,
      caras: [],
      estado_general: 'sano',
      precio: 0,
      diagnostico: '',
      image_tooth: numero >= 11 && numero <= 28 ? 'tooth_up.png' : 'tooth_down.png'
    }
  }

  const carasPieza = caras.value.filter((c) => c.id_pieza === pieza.id)
  
  return {
    ...pieza,
    caras: carasPieza
  }
}

const piezasConTratamiento = computed(() => {
  return piezas.value.filter((p) => p.estado_general !== 'sano')
})

const costoTotal = computed(() => {
  return piezas.value.reduce((sum, pieza) => sum + (pieza.precio || 0), 0)
})

const getColorEstado = (estado) => {
  const colores = {
    sano: 'positive',
    enfermo: 'negative',
    tratado: 'info',
    ausente: 'grey'
  }
  return colores[estado] || 'grey'
}

const handleSelectFace = (data) => {
  console.log('Cara seleccionada:', data)
}
</script>

