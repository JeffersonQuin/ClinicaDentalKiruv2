<template>
  <q-page class="faq-faq-page">
    <!-- Hero Section para FAQ -->
    <section class="faq-hero-section">
      <div class="faq-hero-background">
        <div class="faq-hero-shape faq-hero-shape-1"></div>
        <div class="faq-hero-shape faq-hero-shape-2"></div>
        <div class="faq-hero-shape faq-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="faq-hero-badge animated fadeInDown">
              <q-icon name="help" size="20px" />
              <span>Centro de Ayuda</span>
            </div>
            
            <h1 class="faq-hero-title animated fadeInLeft">
              Preguntas 
              <span class="faq-hero-highlight">Frecuentes</span>
            </h1>
            
            <p class="faq-hero-subtitle animated fadeInLeft" style="animation-delay: 0.2s">
              Encuentra respuestas rápidas a las dudas más comunes sobre tratamientos dentales, 
              procedimientos, costos y cuidados. Estamos aquí para resolver todas tus inquietudes.
            </p>

            <div class="faq-hero-search animated fadeInUp" style="animation-delay: 0.3s">
              <q-input
                v-model="query"
                size="lg"
                color="primary"
                placeholder="Buscar en preguntas frecuentes..."
                outlined
                clearable
                @input="onInput"
                @keyup.enter="runSearchNow"
                class="faq-search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="primary" />
                </template>
                <template v-slot:append>
                  <q-btn 
                    flat 
                    round 
                    icon="mic" 
                    color="primary"
                    class="faq-voice-search"
                  />
                </template>
              </q-input>
              
              <div class="faq-search-tips">
                <span class="faq-tip-label">Sugerencias:</span>
                <q-btn 
                  flat 
                  size="sm" 
                  label="Blanqueamiento" 
                  @click="setSearchQuery('Blanqueamiento')"
                  class="faq-tag-btn"
                />
                <q-btn 
                  flat 
                  size="sm" 
                  label="Ortodoncia" 
                  @click="setSearchQuery('Ortodoncia')"
                  class="faq-tag-btn"
                />
                <q-btn 
                  flat 
                  size="sm" 
                  label="Emergencias" 
                  @click="setSearchQuery('Emergencias')"
                  class="faq-tag-btn"
                />
              </div>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="faq-hero-image-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="faq-hero-glow"></div>
              <div class="faq-hero-image-container">
                <q-img
                  src="/KiruIMG/questions.png"
                  alt="Preguntas frecuentes KIRU"
                  class="faq-hero-image"
                  fit="contain"
                />
              </div>
              
              <div class="faq-floating-elements">
                <div class="faq-floating-card faq-floating-card-1">
                  <q-icon name="live_help" color="#1976d2" size="24px" />
                  <div class="faq-floating-text">
                    <strong>50+</strong>
                    <span>Preguntas</span>
                  </div>
                </div>
                
                <div class="faq-floating-card faq-floating-card-2">
                  <q-icon name="verified" color="#26a69a" size="24px" />
                  <div class="faq-floating-text">
                    <strong>100%</strong>
                    <span>Verificadas</span>
                  </div>
                </div>
                
                <div class="faq-floating-card faq-floating-card-3">
                  <q-icon name="update" color="#ff4081" size="24px" />
                  <div class="faq-floating-text">
                    <strong>Actualizado</strong>
                    <span>Semanalmente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Categorías -->
    <section class="faq-categories-section">
      <div class="faq-categories-background">
        <div class="faq-wave faq-wave-top"></div>
      </div>
      
      <q-container>
        <div class="faq-section-header animated fadeIn">
          <div class="faq-section-badge">
            <q-icon name="category" size="20px" />
            <span>Categorías Principales</span>
          </div>
          <h2 class="faq-section-title">Explora por Temas</h2>
          <p class="faq-section-subtitle">Encuentra respuestas organizadas por categorías de interés</p>
          <div class="faq-title-decoration">
            <div class="faq-title-line"></div>
            <q-icon name="folder_open" color="primary" size="32px" />
            <div class="faq-title-line"></div>
          </div>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(category, index) in categories" 
            :key="category.id"
            class="col-6 col-sm-4 col-lg-3 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card 
              class="faq-category-card" 
              @click="filterByCategory(category.id)"
              :class="{ 'faq-category-active': activeCategory === category.id }"
            >
              <q-card-section class="faq-category-content text-center">
                <div class="faq-category-icon-wrapper">
                  <q-icon :name="category.icon" size="32px" class="faq-category-icon" />
                </div>
                <div class="faq-category-title">{{ category.name }}</div>
                <div class="faq-category-count">{{ category.count }} preguntas</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Preguntas Frecuentes -->
    <section class="faq-questions-section q-pa-xl">
      <q-container>
        <div class="faq-questions-header">
          <div class="faq-results-info animated fadeIn">
            <h3 class="faq-results-title">
              {{ activeCategory ? `Preguntas sobre ${getCategoryName(activeCategory)}` : 'Todas las Preguntas' }}
            </h3>
            <p class="faq-results-count">
              Mostrando {{ visible.length }} de {{ totalQuestions }} preguntas
            </p>
          </div>
          
          <div class="faq-filter-controls">
            <q-btn 
              flat 
              color="primary" 
              label="Limpiar filtros" 
              icon="refresh"
              @click="clearFilters"
              class="faq-clear-btn"
              v-if="activeCategory || query"
            />
          </div>
        </div>

        <div ref="resultsRef" class="faq-results-container">
          <transition-group name="faq-fade" mode="out-in">
            <q-expansion-item
              v-for="(q, index) in visible"
              :key="q.id"
              class="faq-question-item animated fadeInUp"
              :style="{ animationDelay: `${index * 0.05}s` }"
              :label="q.title"
              :icon="getQuestionIcon(q.category)"
              header-class="faq-question-header"
              expand-icon-class="text-white"
              dense-toggle
              @show="onQuestionExpand(q)"
            >
              <q-card class="faq-question-content">
                <q-card-section class="faq-answer-section">
                  <div class="faq-answer-content" v-html="q.answer"></div>
                  
                  <div class="faq-question-meta">
                    <div class="faq-meta-item">
                      <q-icon name="category" size="16px" />
                      <span>{{ getCategoryName(q.category) }}</span>
                    </div>
                    <div class="faq-meta-item">
                      <q-icon name="update" size="16px" />
                      <span>Actualizado hace 2 días</span>
                    </div>
                  </div>
                  
                  <div class="faq-answer-actions">
                    <q-btn 
                      flat 
                      color="primary" 
                      label="¿Fue útil esta respuesta?" 
                      icon="thumb_up"
                      size="sm"
                      class="faq-helpful-btn"
                    />
                    <q-btn 
                      flat 
                      color="grey-6" 
                      label="Compartir" 
                      icon="share"
                      size="sm"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </transition-group>

          <!-- Estado sin resultados -->
          <div v-if="visible.length === 0" class="faq-no-results text-center q-pa-xl animated fadeIn">
            <div class="faq-empty-illustration">
              <q-icon name="search_off" size="6rem" color="grey-4" class="faq-empty-icon animated bounceIn" />
              <div class="faq-empty-circle faq-empty-circle-1"></div>
              <div class="faq-empty-circle faq-empty-circle-2"></div>
            </div>
            <p class="faq-empty-title text-h6 text-grey-7 q-mb-sm">No se encontraron preguntas</p>
            <p class="faq-empty-text text-body2 text-grey-5 q-mb-md">
              {{ query ? `No hay resultados para "${query}"` : 'No hay preguntas en esta categoría' }}
            </p>
            <q-btn 
              unelevated
              color="primary" 
              label="Limpiar búsqueda" 
              icon="refresh"
              @click="clearSearch"
              class="faq-empty-btn"
            />
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="visible.length > 0" class="faq-pagination animated fadeIn">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="6"
            direction-links
            boundary-links
            color="primary"
            class="faq-pagination-controls"
          />
          <div class="faq-pagination-info">
            Página {{ currentPage }} de {{ totalPages }}
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="faq-cta-section">
      <div class="faq-cta-background">
        <div class="faq-cta-shape faq-cta-shape-1"></div>
        <div class="faq-cta-shape faq-cta-shape-2"></div>
        <div class="faq-cta-particles">
          <div class="faq-particle" v-for="i in 15" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="faq-cta-content text-center">
          <div class="faq-cta-badge">
            <q-icon name="support_agent" size="18px" />
            <span>¿No Encuentras tu Respuesta?</span>
          </div>
          
          <h2 class="faq-cta-title">
            Estamos aquí para <span class="faq-cta-highlight">ayudarte</span>
          </h2>
          
          <p class="faq-cta-text">
            Si no encontraste la respuesta que buscabas, nuestro equipo de especialistas 
            está disponible para resolver todas tus dudas personalmente.
          </p>
          
          <div class="faq-cta-features">
            <div class="faq-cta-feature">
              <q-icon name="chat" size="20px" />
              <span>Chat en vivo 24/7</span>
            </div>
            <div class="faq-cta-feature">
              <q-icon name="phone" size="20px" />
              <span>Atención telefónica</span>
            </div>
            <div class="faq-cta-feature">
              <q-icon name="email" size="20px" />
              <span>Respuesta por email</span>
            </div>
          </div>
          
          <div class="faq-cta-actions">
            <q-btn
              color="white"
              text-color="primary"
              size="lg"
              label="Contactar Soporte"
              icon="support_agent"
              to="/contact"
              unelevated
              no-caps
              class="faq-cta-btn"
            />
            <q-btn
              outline
              color="white"
              size="lg"
              label="Agendar Consulta"
              icon="calendar_today"
              to="/appointment"
              no-caps
              class="faq-cta-btn-outline"
            />
          </div>
        </div>
      </q-container>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import Fuse from 'fuse.js'
import questions from 'src/data/questions.json'

const $q = useQuasar()

// Datos reactivos
const query = ref('')
const resultsRef = ref(null)
const timerId = ref(null)
const fuse = ref(null)
const activeCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Categorías de preguntas
const categories = ref([
  { id: 'general', name: 'General', icon: 'help', count: 12 },
  { id: 'tratamientos', name: 'Tratamientos', icon: 'medical_services', count: 18 },
  { id: 'costos', name: 'Costos y Pagos', icon: 'payments', count: 8 },
  { id: 'emergencias', name: 'Emergencias', icon: 'emergency', count: 6 },
  { id: 'citas', name: 'Citas y Horarios', icon: 'calendar_today', count: 7 },
  { id: 'seguros', name: 'Seguros', icon: 'verified_user', count: 5 },
  { id: 'blanqueamiento', name: 'Blanqueamiento', icon: 'brightness_high', count: 4 },
  { id: 'ortodoncia', name: 'Ortodoncia', icon: 'straighten', count: 9 }
])

const fuseOptions = {
  keys: ['title', 'snippet', 'tags', 'answer', 'category'],
  threshold: 0.35,
  ignoreLocation: true
}

const results = ref([...questions])

onMounted(() => {
  fuse.value = new Fuse(questions, fuseOptions)
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
})

// Computed properties
const filteredQuestions = computed(() => {
  let filtered = results.value
  
  if (activeCategory.value) {
    filtered = filtered.filter(q => q.category === activeCategory.value)
  }
  
  return filtered
})

const visible = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredQuestions.value.slice(start, end)
})

const totalQuestions = computed(() => filteredQuestions.value.length)
const totalPages = computed(() => Math.ceil(totalQuestions.value / itemsPerPage.value))

// Métodos
const onInput = () => {
  if (timerId.value) {
    clearTimeout(timerId.value)
  }
  timerId.value = setTimeout(() => {
    runSearch()
  }, 300)
}

const runSearchNow = () => {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
  runSearch()
}

const runSearch = () => {
  let items = questions
  currentPage.value = 1

  if (query.value && fuse.value) {
    const r = fuse.value.search(query.value)
    items = r.map(x => x.item)
    
    if (items.length > 0) {
      $q.notify({
        type: 'positive',
        message: `Se encontraron ${items.length} resultados`,
        timeout: 1500,
        icon: 'check_circle',
        position: 'top'
      })
    }
  }

  results.value = items
  activeCategory.value = ''

  setTimeout(() => {
    scrollToResults()
  }, 100)
}

const scrollToResults = () => {
  const el = resultsRef.value
  if (!el) return
  
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const clearSearch = () => {
  query.value = ''
  activeCategory.value = ''
  currentPage.value = 1
  results.value = [...questions]
}

const clearFilters = () => {
  activeCategory.value = ''
  currentPage.value = 1
}

const setSearchQuery = (searchTerm) => {
  query.value = searchTerm
  runSearchNow()
}

const filterByCategory = (categoryId) => {
  activeCategory.value = activeCategory.value === categoryId ? '' : categoryId
  currentPage.value = 1
  query.value = ''
  
  setTimeout(() => {
    scrollToResults()
  }, 100)
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : 'General'
}

const getQuestionIcon = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.icon : 'help'
}

const onQuestionExpand = (question) => {
  // Aquí puedes agregar analytics o tracking
  console.log('Pregunta expandida:', question.title)
}
</script>

