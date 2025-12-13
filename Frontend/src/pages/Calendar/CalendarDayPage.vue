<template>
  <div class="calendar_day-container">
    <!-- Header Section -->
    <div class="calendar_day-header">
      <div class="calendar_header-background">
        <div class="calendar_header-shape calendar_header-shape-1"></div>
        <div class="calendar_header-shape calendar_header-shape-2"></div>
        <div class="calendar_header-shape calendar_header-shape-3"></div>
      </div>
      <div class="calendar_header-content">
        <div class="calendar_title-section">
          <div class="calendar_icon-wrapper">
            <i class="fa-solid fa-calendar-day calendar_header-icon"></i>
          </div>
          <div>
            <h1 class="calendar_page-title">Calendario Diario</h1>
            <p class="calendar_page-subtitle">{{ dayTitle }}</p>
          </div>
        </div>
        <div class="calendar_header-actions">
          <q-btn
            class="calendar_back-btn"
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
    <div class="calendar_stats-section">
      <div class="calendar_stat-card">
        <div class="calendar_stat-icon-container total">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="calendar_stat-content">
          <div class="calendar_stat-value">{{ reservasCompletas.length }}</div>
          <div class="calendar_stat-label">Reservas Totales</div>
        </div>
        <div class="calendar_stat-glow total"></div>
      </div>
      <div class="calendar_stat-card">
        <div class="calendar_stat-icon-container today">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="calendar_stat-content">
          <div class="calendar_stat-value">{{ getTodayEventsCount() }}</div>
          <div class="calendar_stat-label">Eventos del Día</div>
        </div>
        <div class="calendar_stat-glow today"></div>
      </div>
      <div class="calendar_stat-card">
        <div class="calendar_stat-icon-container upcoming">
          <i class="fa-solid fa-calendar-alt"></i>
        </div>
        <div class="calendar_stat-content">
          <div class="calendar_stat-value">{{ dayName }}</div>
          <div class="calendar_stat-label">Día de la Semana</div>
        </div>
        <div class="calendar_stat-glow upcoming"></div>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="calendar_navigation-section">
      <div class="calendar_navigation-container">
        <div class="calendar_day-navigation">
          <q-btn
            class="calendar_nav-btn"
            flat
            icon="fa-solid fa-chevron-left"
            label="Día Anterior"
            @click="prevDay"
            color="primary"
            no-caps
            size="md"
          />
          
          <div class="calendar_current-day">
            <span class="calendar_day-display">{{ dayTitle }}</span>
            <q-btn
              class="calendar_today-btn"
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
            class="calendar_nav-btn"
            flat
            icon="fa-solid fa-chevron-right"
            label="Día Siguiente"
            @click="nextDay"
            color="primary"
            no-caps
            size="md"
          />
        </div>

        <div class="calendar_view-switcher">
          <q-btn-group class="calendar_view-buttons" outline>
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
    <div class="calendar_main-container">
      <div class="calendar_table-header">
        <div class="calendar_table-title-section">
          <h3 class="calendar_table-title">Horario del Día</h3>
          <div class="calendar_table-underline"></div>
        </div>
        <div class="calendar_table-actions">
          <div class="calendar_legend">
            <div class="legend-item">
              <div class="legend-color cita"></div>
              <span>Citas Médicas</span>
            </div>
            <div class="legend-item">
              <div class="legend-color reserva"></div>
              <span>Reservas</span>
            </div>
            <div class="legend-item">
              <div class="legend-color bloqueado"></div>
              <span>Horarios Bloqueados</span>
            </div>
          </div>
          <q-btn
            class="calendar_info-btn"
            flat
            icon="fa-solid fa-info-circle"
            color="primary"
            no-caps
            size="sm"
          >
            <q-tooltip class="calendar_tooltip">
              <div class="tooltip-content">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Click en celdas vacías para bloquear/desbloquear horarios</span>
              </div>
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Daily Calendar Grid -->
      <div class="calendar_day-grid-container">
        <div class="calendar_day-grid">
          <!-- Header Row -->
          <div class="calendar_day-header-row">
            <div class="time-header-cell">Hora</div>
            <div class="day-header-cell">
              <div class="day-header-content">
                <div class="day-name">{{ dayName }}</div>
                <div class="day-date">{{ currentDate.getDate() }}</div>
                <div class="day-month">{{ currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }) }}</div>
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="calendar_time-row"
            :class="{
              'current-hour': isCurrentHour(hour),
              'madrugada': isMadrugada(hour),
              'mañana': isManana(hour),
              'tarde': isTarde(hour),
              'noche': isNoche(hour)
            }"
          >
            <div class="time-slot-label">
              <div class="time-display">{{ hour }}</div>
              <div class="time-period" v-if="showTimePeriod(hour)">{{ getTimePeriod(hour) }}</div>
            </div>
            
            <div
              class="time-slot-content"
              :class="{
                'bloqueado': estaHorarioBloqueado(currentDateStr, hour),
                'has-events': getEvents(hour).length > 0
              }"
              @dragover.prevent
              @drop="onDrop(hour)"
              @click="handleCellClick(hour)"
            >
              <div class="slot-inner">
                <template v-if="getEvents(hour).length">
                  <div
                    v-for="event in getEvents(hour)"
                    :key="event.id"
                    class="day-event-card"
                    :class="event.type"
                    draggable="true"
                    @dragstart="onDragStart(event, hour)"
                    @click.stop="showDetail(event)"
                  >
                    <div class="event-type-indicator" :class="event.type"></div>
                    <div class="event-details">
                      <div class="event-header">
                        <div class="event-type-badge" :class="event.type">
                          {{ event.type === 'cita' ? 'Cita' : 'Reserva' }}
                        </div>
                        <div class="event-time">{{ hour }}</div>
                      </div>
                      <div class="event-title">{{ event.title }}</div>
                      <div class="event-email" v-if="event.email">{{ event.email }}</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div 
                    class="empty-time-slot"
                    :class="{ 'bloqueado-slot': estaHorarioBloqueado(currentDateStr, hour) }"
                  >
                    <i 
                      class="slot-status-icon"
                      :class="estaHorarioBloqueado(currentDateStr, hour) ? 
                      'fa-solid fa-lock' : 'fa-solid fa-calendar-plus'"
                    ></i>
                    <span class="slot-status-text">
                      {{ estaHorarioBloqueado(currentDateStr, hour) ? 'Bloqueado' : 'Disponible' }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Move Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card class="calendar_confirm-dialog">
        <q-card-section class="calendar_dialog-header">
          <div class="calendar_dialog-icon-container warning">
            <i class="fa-solid fa-clock-rotate-left calendar_dialog-icon"></i>
          </div>
          <h3 class="calendar_dialog-title">Confirmar Cambio de Hora</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="calendar_dialog-text">
            ¿Está seguro que desea reprogramar <strong>{{ confirmEvent?.title }}</strong>?
          </p>
          <div class="calendar_dialog-details">
            <div class="calendar_detail-item">
              <i class="fa-solid fa-arrow-right-arrow-left"></i>
              <span>
                De: {{ draggedFromHour }} → A: {{ confirmToHour }}
              </span>
            </div>
            <div class="calendar_detail-item">
              <i class="fa-solid fa-calendar-day"></i>
              <span>Fecha: {{ formatDate(currentDateStr) }}</span>
            </div>
            <div class="calendar_detail-item">
              <i class="fa-solid fa-tag"></i>
              <span>Tipo: {{ confirmEvent?.type === 'cita' ? 'Cita Médica' : 'Reserva' }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="calendar_dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="calendar_dialog-btn"
          />
          <q-btn 
            unelevated
            label="Confirmar Cambio" 
            color="primary" 
            @click="confirmMoveEvent"
            v-close-popup 
            no-caps
            class="calendar_dialog-btn calendar_dialog-confirm-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Detail Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card class="calendar_detail-dialog">
        <q-card-section class="calendar_dialog-header">
          <div class="calendar_dialog-icon-container" :class="detailEvent?.type">
            <i :class="detailEvent?.type === 'cita' ? 'fa-solid fa-user-doctor' : 'fa-solid fa-calendar-check'"></i>
          </div>
          <h3 class="calendar_dialog-title">
            {{ detailEvent?.type === 'cita' ? 'Detalle de Cita' : 'Detalle de Reserva' }}
          </h3>
        </q-card-section>

        <q-card-section class="calendar_detail-content">
          <div v-if="detailEvent" class="detail-grid">
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="detail-info">
                <div class="detail-label">Fecha</div>
                <div class="detail-value">{{ formatDate(currentDateStr) }}</div>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="detail-info">
                <div class="detail-label">Hora</div>
                <div class="detail-value">{{ detailEvent.hour }}</div>
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

        <q-card-actions class="calendar_dialog-actions">
          <q-btn 
            unelevated
            label="Cerrar" 
            color="primary" 
            v-close-popup 
            no-caps
            class="calendar_dialog-btn"
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
  name: 'CalendarDayPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore()
    
    const today = new Date()
    const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    const view = ref('day')
    const draggedEvent = ref(null)
    const draggedFromHour = ref(null)
    const showConfirmDialog = ref(false)
    const confirmEvent = ref(null)
    const confirmToHour = ref('')
    const showDetailDialog = ref(false)
    const detailEvent = ref(null)

    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    const currentDateStr = computed(() => currentDate.value.toISOString().slice(0, 10))

    const dayName = computed(() => {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      return days[currentDate.value.getDay()]
    })

    const dayTitle = computed(() => {
      return `${currentDate.value.getDate()} de ${currentDate.value.toLocaleString('es-ES', { month: 'long' })} de ${currentDate.value.getFullYear()}`
    })

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    function getEvents(hour) {
      const dateStr = currentDateStr.value
      const events = []
      
      citasData.citas.forEach(cita => {
        if (cita.fecha === dateStr && cita.hora === hour) {
          events.push({
            id: `cita-${cita.id}`,
            type: 'cita',
            title: getPacienteName(cita.pacienteId),
            hour: cita.hora,
            pacienteId: cita.pacienteId
          })
        }
      })
      
      reservasCompletas.value.forEach(reserva => {
        if (reserva.fechaReserva === dateStr && reserva.horaReserva === hour) {
          events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            title: reserva.nombreCompleto,
            hour: reserva.horaReserva,
            email: reserva.gmail,
            servicio: reserva.servicio,
            sucursal: reserva.sucursal,
            dependiente: reserva.dependiente
          })
        }
      })
      
      return events
    }

    const isCurrentHour = (hour) => {
      const now = new Date()
      const currentHour = now.getHours().toString().padStart(2, '0') + ':00'
      const isToday = currentDate.value.toDateString() === now.toDateString()
      return isToday && hour === currentHour
    }

    const isMadrugada = (hour) => {
      const hourNum = parseInt(hour.split(':')[0])
      return hourNum >= 0 && hourNum < 6
    }

    const isManana = (hour) => {
      const hourNum = parseInt(hour.split(':')[0])
      return hourNum >= 6 && hourNum < 12
    }

    const isTarde = (hour) => {
      const hourNum = parseInt(hour.split(':')[0])
      return hourNum >= 12 && hourNum < 18
    }

    const isNoche = (hour) => {
      const hourNum = parseInt(hour.split(':')[0])
      return hourNum >= 18 && hourNum < 24
    }

    const showTimePeriod = (hour) => {
      return hour === '00:00' || hour === '06:00' || hour === '12:00' || hour === '18:00'
    }

    const getTimePeriod = (hour) => {
      if (hour === '00:00') return 'Madrugada'
      if (hour === '06:00') return 'Mañana'
      if (hour === '12:00') return 'Tarde'
      if (hour === '18:00') return 'Noche'
      return ''
    }

    const prevDay = () => {
      currentDate.value.setDate(currentDate.value.getDate() - 1)
      currentDate.value = new Date(currentDate.value)
    }
    
    const nextDay = () => {
      currentDate.value.setDate(currentDate.value.getDate() + 1)
      currentDate.value = new Date(currentDate.value)
    }

    const goToToday = () => {
      currentDate.value = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    }
    
    const salir = () => {
      router.push({ name: 'home' })
    }

    const goToDay = () => router.push('/Calendar-Day')
    const goToWeek = () => router.push('/Calendar-Week')
    const goToMonth = () => router.push('/Calendar-Month')

    const onDragStart = (event, fromHour) => {
      draggedEvent.value = event
      draggedFromHour.value = fromHour
    }
    
    const onDrop = (toHour) => {
      if (!draggedEvent.value) return
      if (draggedFromHour.value === toHour) return
      confirmEvent.value = draggedEvent.value
      confirmToHour.value = toHour
      showConfirmDialog.value = true
    }
    
    const confirmMoveEvent = () => {
      if (!confirmEvent.value) return
      const dateStr = currentDateStr.value
      
      if (confirmEvent.value.type === 'cita') {
        const cita = citasData.citas.find(c => `cita-${c.id}` === confirmEvent.value.id)
        if (cita) {
          cita.fecha = dateStr
          cita.hora = confirmToHour.value
        }
      } else if (confirmEvent.value.type === 'reserva') {
        const reserva = reserveStore.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
        if (reserva) {
          reserva.fechaReserva = dateStr
          reserva.horaReserva = confirmToHour.value
        }
      }
      
      draggedEvent.value = null
      draggedFromHour.value = null
      confirmEvent.value = null
      confirmToHour.value = ''
    }

    const showDetail = (event) => {
      detailEvent.value = event
      showDetailDialog.value = true
    }

    const handleCellClick = (hour) => {
      const events = getEvents(hour)
      if (events.length > 0) return

      const dateStr = currentDateStr.value
      const estaBloqueado = reserveStore.estaHorarioBloqueado(dateStr, hour)

      if (estaBloqueado) {
        reserveStore.desbloquearHorario(dateStr, hour)
      } else {
        reserveStore.bloquearHorario(dateStr, hour)
      }
    }

    const estaHorarioBloqueado = (fecha, hora) => {
      return reserveStore.estaHorarioBloqueado(fecha, hora)
    }

    const getTodayEventsCount = () => {
      let count = 0
      hours.forEach(hour => {
        count += getEvents(hour).length
      })
      return count
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
      console.log('📅 Calendario Diario cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      hours,
      dayName,
      dayTitle,
      currentDate,
      currentDateStr,
      prevDay,
      nextDay,
      goToToday,
      view,
      salir,
      getEvents,
      getTodayEventsCount,
      isCurrentHour,
      isMadrugada,
      isManana,
      isTarde,
      isNoche,
      showTimePeriod,
      getTimePeriod,
      onDragStart,
      onDrop,
      showConfirmDialog,
      confirmEvent,
      confirmToHour,
      confirmMoveEvent,
      showDetailDialog,
      detailEvent,
      showDetail,
      formatDate,
      getPacienteName,
      goToDay,
      goToWeek,
      goToMonth,
      reservasCompletas,
      handleCellClick,
      estaHorarioBloqueado
    }
  }
}
</script>

