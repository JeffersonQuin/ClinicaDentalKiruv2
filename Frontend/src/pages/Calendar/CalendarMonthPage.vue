<template>
  <div class="calendar-page-container">
    <!-- Header Section -->
    <div class="calendar-page-header">
      <div class="calendar-header-background">
        <div class="calendar-header-shape calendar-header-shape-1"></div>
        <div class="calendar-header-shape calendar-header-shape-2"></div>
        <div class="calendar-header-shape calendar-header-shape-3"></div>
      </div>
      <div class="calendar-header-content">
        <div class="calendar-title-section">
          <div class="calendar-icon-wrapper">
            <i class="fa-solid fa-calendar-alt calendar-header-icon"></i>
          </div>
          <div>
            <h1 class="calendar-page-title">Calendario Mensual</h1>
            <p class="calendar-page-subtitle">{{ monthYear }}</p>
          </div>
        </div>
        <div class="calendar-header-actions">
          <q-btn
            class="calendar-back-btn"
            flat
            icon="fa-solid fa-arrow-left"
            label="Volver al Inicio"
            color="white"
            @click="salir"
            no-caps
            size="md"
          />
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="calendar-stats-section">
      <div class="calendar-stat-card">
        <div class="calendar-stat-icon-container total">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="calendar-stat-content">
          <div class="calendar-stat-value">{{ reservasCompletas.length }}</div>
          <div class="calendar-stat-label">Reservas Totales</div>
        </div>
        <div class="calendar-stat-glow total"></div>
      </div>
      <div class="calendar-stat-card">
        <div class="calendar-stat-icon-container today">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="calendar-stat-content">
          <div class="calendar-stat-value">{{ getMonthEventsCount() }}</div>
          <div class="calendar-stat-label">Eventos del Mes</div>
        </div>
        <div class="calendar-stat-glow today"></div>
      </div>
      <div class="calendar-stat-card">
        <div class="calendar-stat-icon-container upcoming">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="calendar-stat-content">
          <div class="calendar-stat-value">{{ new Date(currentYear, currentMonth + 1, 0).getDate() }}</div>
          <div class="calendar-stat-label">Días del Mes</div>
        </div>
        <div class="calendar-stat-glow upcoming"></div>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="calendar-navigation-section">
      <div class="calendar-navigation-container">
        <div class="calendar-month-navigation">
          <q-btn
            class="calendar-nav-btn"
            flat
            icon="fa-solid fa-chevron-left"
            label="Mes Anterior"
            @click="prevMonth"
            color="primary"
            no-caps
            size="md"
          />
          
          <div class="calendar-current-month">
            <span class="calendar-month-display">{{ monthYear }}</span>
            <q-btn
              class="calendar-today-btn"
              flat
              icon="fa-solid fa-calendar-day"
              label="Hoy"
              @click="goToToday"
              color="primary"
              no-caps
              size="sm"
            />
          </div>
          
          <q-btn
            class="calendar-nav-btn"
            flat
            icon="fa-solid fa-chevron-right"
            label="Mes Siguiente"
            @click="nextMonth"
            color="primary"
            no-caps
            size="md"
          />
        </div>

        <div class="calendar-view-switcher">
          <q-btn-group class="calendar-view-buttons" outline>
            <q-btn
              outline
              label="Día"
              @click="goToDay"
              :color="view==='day' ? 'primary' : 'grey-7'"
              no-caps
              size="md"
            />
            <q-btn
              outline
              label="Semana"
              @click="goToWeek"
              :color="view==='week' ? 'primary' : 'grey-7'"
              no-caps
              size="md"
            />
            <q-btn
              outline
              label="Mes"
              @click="goToMonth"
              :color="view==='month' ? 'primary' : 'grey-7'"
              no-caps
              size="md"
            />
          </q-btn-group>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-main-container">
      <div class="calendar-table-header">
        <div class="calendar-table-title-section">
          <h3 class="calendar-table-title">Vista Mensual</h3>
          <div class="calendar-table-underline"></div>
        </div>
        <div class="calendar-table-actions">
          <q-btn
            class="calendar-info-btn"
            flat
            icon="fa-solid fa-info-circle"
            color="primary"
            no-caps
            size="sm"
          >
            <q-tooltip class="calendar-tooltip">
              <div class="tooltip-content">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Arrastra eventos entre fechas para reprogramar</span>
              </div>
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="calendar-grid-container">
        <!-- Week Days Header -->
        <div class="calendar-week-header">
          <div
            v-for="day in weekDays"
            :key="day"
            class="calendar-week-day"
            :class="{ 'weekend': day === 'Sábado' || day === 'Domingo' }"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div
            v-for="(week, wIdx) in monthMatrix"
            :key="wIdx"
            class="calendar-week"
          >
            <div
              v-for="(cell, dIdx) in week"
              :key="dIdx"
              class="calendar-day-cell"
              :class="{
                'not-current-month': !cell.isCurrentMonth,
                'today': isToday(cell.date),
                'weekend': isWeekend(cell.date),
                'has-events': cell.events.length > 0
              }"
              @dragover.prevent
              @drop="onDrop(cell.date)"
            >
              <div class="day-header">
                <span class="day-number" :class="{ 'today': isToday(cell.date) }">
                  {{ cell.day }}
                </span>
                <div class="day-badge" v-if="cell.events.length > 0">
                  {{ cell.events.length }}
                </div>
              </div>
              
              <div class="day-events">
                <div
                  v-for="event in cell.events.slice(0, 3)"
                  :key="event.id"
                  class="calendar-event"
                  :class="event.type"
                  draggable="true"
                  @dragstart="onDragStart(event, cell.date)"
                  @click="showDetail(event)"
                >
                  <div class="event-indicator" :class="event.type"></div>
                  <div class="event-content">
                    <div class="event-time">{{ event.time }}</div>
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-email" v-if="event.email">{{ event.email }}</div>
                  </div>
                </div>
                
                <div v-if="cell.events.length > 3" class="more-events">
                  +{{ cell.events.length - 3 }} más
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Move Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card class="calendar-confirm-dialog">
        <q-card-section class="calendar-dialog-header">
          <div class="calendar-dialog-icon-container warning">
            <i class="fa-solid fa-calendar-arrow-up calendar-dialog-icon"></i>
          </div>
          <h3 class="calendar-dialog-title">Confirmar Cambio de Fecha</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="calendar-dialog-text">
            ¿Está seguro que desea mover <strong>{{ confirmEvent?.title }}</strong> al 
            <strong>{{ formatDate(confirmToDate) }}</strong>?
          </p>
          <div class="calendar-dialog-details">
            <div class="calendar-detail-item">
              <i class="fa-solid fa-arrow-right-arrow-left"></i>
              <span>De: {{ formatDate(draggedFromDate) }} → A: {{ formatDate(confirmToDate) }}</span>
            </div>
            <div class="calendar-detail-item">
              <i class="fa-solid fa-clock"></i>
              <span>Hora: {{ confirmEvent?.time }}</span>
            </div>
            <div class="calendar-detail-item">
              <i class="fa-solid fa-tag"></i>
              <span>Tipo: {{ confirmEvent?.type === 'cita' ? 'Cita Médica' : 'Reserva' }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="calendar-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="calendar-dialog-btn"
          />
          <q-btn 
            unelevated
            label="Confirmar Cambio" 
            color="primary" 
            @click="confirmMoveEvent"
            v-close-popup 
            no-caps
            class="calendar-dialog-btn calendar-dialog-confirm-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Detail Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card class="calendar-detail-dialog">
        <q-card-section class="calendar-dialog-header">
          <div class="calendar-dialog-icon-container" :class="detailEvent?.type">
            <i :class="detailEvent?.type === 'cita' ? 'fa-solid fa-user-doctor' : 'fa-solid fa-calendar-check'"></i>
          </div>
          <h3 class="calendar-dialog-title">
            {{ detailEvent?.type === 'cita' ? 'Detalle de Cita' : 'Detalle de Reserva' }}
          </h3>
        </q-card-section>

        <q-card-section class="calendar-detail-content">
          <div v-if="detailEvent" class="detail-grid">
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="detail-info">
                <div class="detail-label">Fecha</div>
                <div class="detail-value">{{ formatDate(detailEvent.date) }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="detail-info">
                <div class="detail-label">Hora</div>
                <div class="detail-value">{{ detailEvent.time }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fa-solid fa-tag"></i>
              </div>
              <div class="detail-info">
                <div class="detail-label">Tipo</div>
                <div class="detail-value badge" :class="detailEvent.type">
                  {{ detailEvent.type === 'cita' ? 'Cita Médica' : 'Reserva' }}
                </div>
              </div>
            </div>

            <template v-if="detailEvent.type === 'cita'">
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="fa-solid fa-user-injured"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Paciente</div>
                  <div class="detail-value">{{ getPacienteName(detailEvent.pacienteId) }}</div>
                </div>
              </div>
            </template>
            
            <template v-else>
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Nombre</div>
                  <div class="detail-value">{{ detailEvent.title }}</div>
                </div>
              </div>
              
              <div class="detail-item" v-if="detailEvent.email">
                <div class="detail-icon">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Email</div>
                  <div class="detail-value">{{ detailEvent.email }}</div>
                </div>
              </div>
              
              <div class="detail-item" v-if="detailEvent.servicio">
                <div class="detail-icon">
                  <i class="fa-solid fa-stethoscope"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Servicio</div>
                  <div class="detail-value">{{ detailEvent.servicio }}</div>
                </div>
              </div>
              
              <div class="detail-item" v-if="detailEvent.sucursal">
                <div class="detail-icon">
                  <i class="fa-solid fa-building"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Sucursal</div>
                  <div class="detail-value">{{ detailEvent.sucursal }}</div>
                </div>
              </div>
              
              <div class="detail-item" v-if="detailEvent.dependiente">
                <div class="detail-icon">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div class="detail-info">
                  <div class="detail-label">Dependiente</div>
                  <div class="detail-value">
                    {{ detailEvent.dependiente.nombreCompleto }} 
                    <span class="dependiente-relation">({{ detailEvent.dependiente.parentesco }})</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </q-card-section>

        <q-card-actions class="calendar-dialog-actions">
          <q-btn 
            unelevated
            label="Cerrar" 
            color="primary" 
            v-close-popup 
            no-caps
            class="calendar-dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReserveStore } from 'src/stores/reservaStore'
import citasData from 'src/data/citas.json'
import pacientes from 'src/data/pacientes.json'

export default {
  name: 'CalendarMonthPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore()
    
    const today = new Date()
    const currentMonth = ref(today.getMonth())
    const currentYear = ref(today.getFullYear())
    const view = ref('month')
    const draggedEvent = ref(null)
    const draggedFromDate = ref(null)
    const showConfirmDialog = ref(false)
    const confirmEvent = ref(null)
    const confirmToDate = ref('')
    const showDetailDialog = ref(false)
    const detailEvent = ref(null)
    const refreshKey = ref(0)

    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const monthMatrix = computed(() => {
      refreshKey.value
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
      const firstWeekDay = (firstDay.getDay() + 6) % 7
      const daysInMonth = lastDay.getDate()
      const prevMonthDays = firstWeekDay
      const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7

      const cells = []
      for (let i = 0; i < totalCells; i++) {
        const date = new Date(currentYear.value, currentMonth.value, i - prevMonthDays + 1)
        const isCurrentMonth = date.getMonth() === currentMonth.value
        cells.push({
          day: date.getDate(),
          date: date.toISOString().slice(0, 10),
          isCurrentMonth,
          events: []
        })
      }

      citasData.citas.forEach(cita => {
        const cell = cells.find(c => c.date === cita.fecha)
        if (cell) {
          cell.events.push({
            id: `cita-${cita.id}`,
            type: 'cita',
            time: cita.hora,
            title: getPacienteName(cita.pacienteId),
            date: cita.fecha,
            pacienteId: cita.pacienteId
          })
        }
      })

      reservasCompletas.value.forEach(reserva => {
        const cell = cells.find(c => c.date === reserva.fechaReserva)
        if (cell) {
          cell.events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            time: reserva.horaReserva,
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            email: reserva.gmail,
            servicio: reserva.servicio,
            sucursal: reserva.sucursal,
            dependiente: reserva.dependiente
          })
        }
      })

      const matrix = []
      for (let i = 0; i < cells.length; i += 7) {
        matrix.push(cells.slice(i, i + 7))
      }
      return matrix
    })

    const monthYear = computed(() => {
      const date = new Date(currentYear.value, currentMonth.value)
      return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^./, m => m.toUpperCase())
    })

    const getMonthEventsCount = () => {
      let count = 0
      monthMatrix.value.forEach(week => {
        week.forEach(cell => {
          if (cell.isCurrentMonth) {
            count += cell.events.length
          }
        })
      })
      return count
    }

    const isToday = (dateString) => {
      const today = new Date().toISOString().slice(0, 10)
      return dateString === today
    }

    const isWeekend = (dateString) => {
      const date = new Date(dateString)
      const day = date.getDay()
      return day === 0 || day === 6
    }

    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }
    
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }

    const goToToday = () => {
      const today = new Date()
      currentMonth.value = today.getMonth()
      currentYear.value = today.getFullYear()
    }
    
    const goToDay = () => router.push('/Calendar-Day')
    const goToWeek = () => router.push('/Calendar-Week')
    const goToMonth = () => router.push('/Calendar-Month')
    
    const salir = () => {
      router.push({ name: 'home' })
    }

    const onDragStart = (event, fromDate) => {
      draggedEvent.value = event
      draggedFromDate.value = fromDate
    }
    
    const onDrop = (toDate) => {
      if (!draggedEvent.value) return
      if (draggedFromDate.value === toDate) return
      confirmEvent.value = draggedEvent.value
      confirmToDate.value = toDate
      showConfirmDialog.value = true
    }
    
    const confirmMoveEvent = () => {
      if (!confirmEvent.value) return
      let changed = false
      
      if (confirmEvent.value.type === 'cita') {
        const cita = citasData.citas.find(c => `cita-${c.id}` === confirmEvent.value.id)
        if (cita && cita.fecha !== confirmToDate.value) {
          cita.fecha = confirmToDate.value
          changed = true
        }
      } else if (confirmEvent.value.type === 'reserva') {
        const reserva = reserveStore.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
        if (reserva && reserva.fechaReserva !== confirmToDate.value) {
          reserva.fechaReserva = confirmToDate.value
          changed = true
        }
      }
      
      draggedEvent.value = null
      draggedFromDate.value = null
      confirmEvent.value = null
      confirmToDate.value = ''
      if (changed) refreshKey.value++
    }

    const showDetail = (event) => {
      detailEvent.value = event
      showDetailDialog.value = true
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Fecha inválida'
      }
    }

    onMounted(() => {
      console.log('📅 Calendario Mensual cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      weekDays,
      monthMatrix,
      monthYear,
      currentMonth,
      currentYear,
      prevMonth,
      nextMonth,
      goToToday,
      view,
      goToDay,
      goToWeek,
      goToMonth,
      salir,
      onDragStart,
      onDrop,
      showConfirmDialog,
      confirmEvent,
      confirmToDate,
      confirmMoveEvent,
      showDetailDialog,
      detailEvent,
      showDetail,
      formatDate,
      getPacienteName,
      reservasCompletas,
      getMonthEventsCount,
      isToday,
      isWeekend
    }
  }
}
</script>
