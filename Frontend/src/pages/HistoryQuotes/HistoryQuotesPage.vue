<template>
  <div class="historyquotes-page-container">
    <!-- Header Section -->
    <div class="historyquotes-page-header">
      <div class="historyquotes-header-background">
        <div class="historyquotes-header-shape historyquotes-header-shape-1"></div>
        <div class="historyquotes-header-shape historyquotes-header-shape-2"></div>
      </div>
      <div class="historyquotes-header-content">
        <div class="historyquotes-title-section">
          <div class="historyquotes-icon-wrapper">
            <i class="fa-solid fa-calendar-days historyquotes-header-icon"></i>
          </div>
          <div>
            <h1 class="historyquotes-page-title">Historial de Citas</h1>
            <p class="historyquotes-page-subtitle">Consulta las citas y reservas en el rango de fechas seleccionado</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="historyquotes-filter-section">
      <div class="historyquotes-filter-card">
        <div class="historyquotes-filter-header">
          <h3 class="historyquotes-filter-title">
            <i class="fa-solid fa-filter"></i>
            Filtrar por Fecha
          </h3>
        </div>
        <div class="historyquotes-filter-content">
          <div class="historyquotes-filter-row">
            <div class="historyquotes-filter-group">
              <label class="historyquotes-filter-label">
                <i class="fa-solid fa-calendar-plus"></i>
                Fecha de Inicio
              </label>
              <q-input
                v-model="fechaInicio"
                type="date"
                outlined
                dense
                class="historyquotes-filter-input"
                :max="fechaFinal"
              />
            </div>
            
            <div class="historyquotes-filter-group">
              <label class="historyquotes-filter-label">
                <i class="fa-solid fa-calendar-minus"></i>
                Fecha Final
              </label>
              <q-input
                v-model="fechaFinal"
                type="date"
                outlined
                dense
                class="historyquotes-filter-input"
                :min="fechaInicio"
              />
            </div>
            
            <q-btn
              class="historyquotes-search-btn"
              label="Buscar Historial"
              icon="fa-solid fa-magnifying-glass"
              @click="filtrarHistorial"
              unelevated
              no-caps
              size="md"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Results Sections -->
    <div class="historyquotes-results-container">
      <!-- Citas Section -->
      <div class="historyquotes-section">
        <div class="historyquotes-section-header">
          <div class="historyquotes-section-title-container">
            <h2 class="historyquotes-section-title">
              <i class="fa-solid fa-calendar-check"></i>
              Citas Programadas
            </h2>
            <div class="historyquotes-section-underline"></div>
          </div>
          <div class="historyquotes-results-count">
            <span class="historyquotes-count-badge">
              <i class="fa-solid fa-list"></i>
              {{ citasFiltradas.length }} cita{{ citasFiltradas.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="historyquotes-cards-grid">
          <template v-if="citasFiltradas.length">
            <div
              v-for="cita in citasFiltradas"
              :key="cita.id"
              class="historyquotes-card"
            >
              <div class="historyquotes-card-header">
                <div class="historyquotes-card-icon-container">
                  <i class="fa-solid fa-calendar-check historyquotes-card-icon"></i>
                </div>
                <div class="historyquotes-card-title-section">
                  <h4 class="historyquotes-card-title">{{ cita.asunto }}</h4>
                  <div class="historyquotes-card-badge appointment">Cita</div>
                </div>
              </div>
              
              <div class="historyquotes-card-content">
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-user-md historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Dentista:</span>
                    <span class="historyquotes-info-value">{{ getDentistaName(cita.dentistaId) }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-user historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Paciente:</span>
                    <span class="historyquotes-info-value">{{ getPacienteName(cita.pacienteId) }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-calendar historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Fecha:</span>
                    <span class="historyquotes-info-value">{{ formatFecha(cita.fecha) }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-clock historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Hora:</span>
                    <span class="historyquotes-info-value">{{ cita.hora }}</span>
                  </div>
                </div>
              </div>
              
              <div class="historyquotes-card-footer">
                <div class="historyquotes-card-date">
                  <i class="fa-solid fa-calendar-day"></i>
                  {{ formatFechaCompleta(cita.fecha) }}
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="historyquotes-empty-state">
              <div class="historyquotes-empty-illustration">
                <i class="fa-solid fa-calendar-xmark historyquotes-empty-icon"></i>
                <div class="historyquotes-empty-circle historyquotes-empty-circle-1"></div>
                <div class="historyquotes-empty-circle historyquotes-empty-circle-2"></div>
              </div>
              <h3 class="historyquotes-empty-title">No hay citas encontradas</h3>
              <p class="historyquotes-empty-description">
                No se encontraron citas en el rango de fechas seleccionado
              </p>
            </div>
          </template>
        </div>
      </div>

      <!-- Reservas Section -->
      <div class="historyquotes-section">
        <div class="historyquotes-section-header">
          <div class="historyquotes-section-title-container">
            <h2 class="historyquotes-section-title">
              <i class="fa-solid fa-calendar-day"></i>
              Reservas Realizadas
            </h2>
            <div class="historyquotes-section-underline"></div>
          </div>
          <div class="historyquotes-results-count">
            <span class="historyquotes-count-badge">
              <i class="fa-solid fa-list"></i>
              {{ reservasFiltradas.length }} reserva{{ reservasFiltradas.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="historyquotes-cards-grid">
          <template v-if="reservasFiltradas.length">
            <div
              v-for="reserva in reservasFiltradas"
              :key="reserva.id"
              class="historyquotes-card"
            >
              <div class="historyquotes-card-header">
                <div class="historyquotes-card-icon-container reservation">
                  <i class="fa-solid fa-calendar-day historyquotes-card-icon"></i>
                </div>
                <div class="historyquotes-card-title-section">
                  <h4 class="historyquotes-card-title">Reserva de {{ reserva.nombreCompleto }}</h4>
                  <div class="historyquotes-card-badge reservation">Reserva</div>
                </div>
              </div>
              
              <div class="historyquotes-card-content">
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-user historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Solicitante:</span>
                    <span class="historyquotes-info-value">{{ reserva.nombreCompleto }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-envelope historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Email:</span>
                    <span class="historyquotes-info-value">{{ reserva.gmail }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-calendar historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Fecha Reserva:</span>
                    <span class="historyquotes-info-value">{{ formatFecha(reserva.fechaReserva) }}</span>
                  </div>
                </div>
                
                <div class="historyquotes-info-item">
                  <i class="fa-solid fa-clock historyquotes-info-icon"></i>
                  <div class="historyquotes-info-content">
                    <span class="historyquotes-info-label">Hora Reserva:</span>
                    <span class="historyquotes-info-value">{{ reserva.horaReserva }}</span>
                  </div>
                </div>
                
                <div v-if="reserva.dependiente" class="historyquotes-dependiente-section">
                  <div class="historyquotes-dependiente-header">
                    <i class="fa-solid fa-users historyquotes-info-icon"></i>
                    <span class="historyquotes-dependiente-title">Información del Dependiente</span>
                  </div>
                  <div class="historyquotes-dependiente-content">
                    <div class="historyquotes-info-item compact">
                      <span class="historyquotes-info-label">Nombre:</span>
                      <span class="historyquotes-info-value">{{ reserva.dependiente.nombreCompleto }}</span>
                    </div>
                    <div class="historyquotes-info-item compact">
                      <span class="historyquotes-info-label">Género:</span>
                      <span class="historyquotes-info-value">{{ reserva.dependiente.genero }}</span>
                    </div>
                    <div class="historyquotes-info-item compact">
                      <span class="historyquotes-info-label">Parentesco:</span>
                      <span class="historyquotes-info-value">{{ reserva.dependiente.parentesco }}</span>
                    </div>
                    <div class="historyquotes-info-item compact">
                      <span class="historyquotes-info-label">Teléfono:</span>
                      <span class="historyquotes-info-value">{{ reserva.dependiente.telefono }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="historyquotes-card-footer">
                <div class="historyquotes-card-date">
                  <i class="fa-solid fa-calendar-day"></i>
                  {{ formatFechaCompleta(reserva.fechaReserva) }}
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="historyquotes-empty-state">
              <div class="historyquotes-empty-illustration">
                <i class="fa-solid fa-calendar-plus historyquotes-empty-icon"></i>
                <div class="historyquotes-empty-circle historyquotes-empty-circle-1"></div>
                <div class="historyquotes-empty-circle historyquotes-empty-circle-2"></div>
              </div>
              <h3 class="historyquotes-empty-title">No hay reservas encontradas</h3>
              <p class="historyquotes-empty-description">
                No se encontraron reservas en el rango de fechas seleccionado
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import citasData from 'src/data/citas.json'
import reservasData from 'src/data/reservas.json'
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'

export default {
  name: 'HistoryQuotesPage',
  setup() {
    const fechaInicio = ref('')
    const fechaFinal = ref('')
    const citasFiltradas = ref([])
    const reservasFiltradas = ref([])

    // Utilidades para mostrar nombres
    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }
    
    const getDentistaName = (id) => {
      const dentista = dentistas.dentistas.find(d => Number(d.id) === Number(id))
      return dentista ? `${dentista.nombre} ${dentista.apellidoPaterno}` : 'No encontrado'
    }

    // Formatear fechas
    const formatFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const formatFechaCompleta = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-BO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const filtrarHistorial = () => {
      // Filtrar citas
      citasFiltradas.value = citasData.citas.filter(cita => {
        if (!fechaInicio.value || !fechaFinal.value) return false
        const fechaCita = new Date(cita.fecha)
        const inicio = new Date(fechaInicio.value)
        const fin = new Date(fechaFinal.value)
        return fechaCita >= inicio && fechaCita <= fin
      })

      // Filtrar reservas
      reservasFiltradas.value = reservasData.reservas.filter(reserva => {
        if (!fechaInicio.value || !fechaFinal.value) return false
        const fechaReserva = new Date(reserva.fechaReserva)
        const inicio = new Date(fechaInicio.value)
        const fin = new Date(fechaFinal.value)
        return fechaReserva >= inicio && fechaReserva <= fin
      })
    }

    return {
      fechaInicio,
      fechaFinal,
      citasFiltradas,
      reservasFiltradas,
      filtrarHistorial,
      getPacienteName,
      getDentistaName,
      formatFecha,
      formatFechaCompleta
    }
  }
}
</script>

