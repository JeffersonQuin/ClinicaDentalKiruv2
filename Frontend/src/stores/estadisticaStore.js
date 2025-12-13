import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Importar datos reales desde los archivos JSON
import dentistasData from '../data/dentistas.json'
import pacientesData from '../data/pacientes.json'
import citasData from '../data/citas.json'
import reservasData from '../data/reservas.json'
import odontogramaData from '../data/odontograma.json'

// Extraer datos de los archivos importados
const dentistas = dentistasData.dentistas || []
const pacientes = pacientesData.pacientes || []
const citas = citasData.citas || []
const reservas = reservasData.reservas || []
const piezas = odontogramaData.piezas || []

export const useEstadisticasStore = defineStore('estadisticas', () => {
  const filtroTiempo = ref('mes')
  const fechaSeleccionada = ref(new Date())

  const dentistasActivos = computed(() => 
    dentistas.filter(d => d.state === 'active')
  )

  const pacientesActivos = computed(() => 
    pacientes.filter(p => p.state === 'active')
  )

  const totalDentistas = computed(() => dentistasActivos.value.length)
  const totalPacientes = computed(() => pacientesActivos.value.length)
  const totalCitas = computed(() => citas.length)
  const totalReservas = computed(() => reservas.length)

  const ingresosTotales = computed(() => {
    return piezas.reduce((total, pieza) => total + pieza.precio, 0)
  })

  const citasPorMes = computed(() => {
    const meses = {}
    citas.forEach(cita => {
      const mes = new Date(cita.fecha).getMonth()
      meses[mes] = (meses[mes] || 0) + 1
    })
    return meses
  })

  const citasPorDia = computed(() => {
    const dias = {}
    citas.forEach(cita => {
      dias[cita.fecha] = (dias[cita.fecha] || 0) + 1
    })
    return dias
  })

  const pacientesPorCiudad = computed(() => {
    const ciudades = {}
    pacientes.forEach(paciente => {
      if (paciente.state === 'active') {
        ciudades[paciente.ciudad] = (ciudades[paciente.ciudad] || 0) + 1
      }
    })
    return ciudades
  })

  const serviciosMasComunes = computed(() => {
    const servicios = {}
    reservas.forEach(reserva => {
      servicios[reserva.servicio] = (servicios[reserva.servicio] || 0) + 1
    })
    return servicios
  })

  const dentistaMasOcupado = computed(() => {
    const dentistaCitas = {}
    citas.forEach(cita => {
      dentistaCitas[cita.dentistaId] = (dentistaCitas[cita.dentistaId] || 0) + 1
    })
    const maxCitas = Math.max(...Object.values(dentistaCitas))
    const dentistaId = Object.keys(dentistaCitas).find(key => dentistaCitas[key] === maxCitas)
    const dentista = dentistas.find(d => d.id == dentistaId)
    return { dentista, citas: maxCitas }
  })

  const tratamientosPorEstado = computed(() => {
    const estados = {}
    piezas.forEach(pieza => {
      estados[pieza.estado_general] = (estados[pieza.estado_general] || 0) + 1
    })
    return estados
  })

  const edadPromediosPacientes = computed(() => {
    const edades = pacientes
      .filter(p => p.state === 'active')
      .map(p => new Date().getFullYear() - new Date(p.fechaNacimiento).getFullYear())
    return edades.reduce((sum, edad) => sum + edad, 0) / edades.length
  })

  const motivosConsultaMasComunes = computed(() => {
    const motivos = {}
    pacientes.forEach(paciente => {
      if (paciente.state === 'active') {
        motivos[paciente.motivoConsulta] = (motivos[paciente.motivoConsulta] || 0) + 1
      }
    })
    return motivos
  })

  return {
    filtroTiempo,
    fechaSeleccionada,
    totalDentistas,
    totalPacientes,
    totalCitas,
    totalReservas,
    ingresosTotales,
    citasPorMes,
    citasPorDia,
    pacientesPorCiudad,
    serviciosMasComunes,
    dentistaMasOcupado,
    tratamientosPorEstado,
    edadPromediosPacientes,
    motivosConsultaMasComunes,
    dentistasActivos,
    pacientesActivos
  }
})