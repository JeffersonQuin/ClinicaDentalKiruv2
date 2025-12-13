import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { pacienteService } from 'src/services/pacienteService'

const FUSE_OPTIONS = {
  keys: [
    'nombre',
    'apellido_paterno',
    'apellido_materno',
    'ci',
    'gmail',
    'ciudad',
    'profesion',
    'motivo_consulta',
    'domicilio',
    'estado_civil'
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
}

export const usePacienteStore = defineStore('paciente', () => {

  // State
  const pacientes = ref([])
  const searchQuery = ref('')
  const cityFilter = ref(null)
  const alertFilter = ref(null)
  const selectedPatient = ref(null)
  const loading = ref(false)
  let fuse = null

  // Getters Computed
  const pacientesFiltrados = computed(() => {
    let result = pacientes.value.filter(p => p.state === 1)

    if (cityFilter.value) {
      result = result.filter(p => p.ciudad === cityFilter.value)
    }

    if (alertFilter.value === 'with') {
      result = result.filter(p => p.alertas_clinicas && p.alertas_clinicas.trim() !== '')
    }

    if (alertFilter.value === 'without') {
      result = result.filter(p => !p.alertas_clinicas || p.alertas_clinicas.trim() === '')
    }

    if (searchQuery.value.trim()) {
      const fuseResults = fuse.search(searchQuery.value)
      const matched = fuseResults.map(r => r.item.id)
      result = result.filter(p => matched.includes(p.id))
    }

    return result
  })

  const totalPacientes = computed(() => pacientesFiltrados.value.length)

  const pacientesConAlertas = computed(() => {
    return pacientes.value.filter(p => 
      p.state === 1 && p.alertas_clinicas && p.alertas_clinicas.trim() !== ''
    ).length
  })

  const ciudadesUnicas = computed(() => {
    const ciudades = Array.from(
      new Set(
        pacientes.value.filter(p => p.state === 1).map(p => p.ciudad)
      )
    ).filter(Boolean).sort()
    return ciudades.length
  })

  const opcionesCiudad = computed(() => {
    return Array.from(
      new Set(
        pacientes.value.filter(p => p.state === 1).map(p => p.ciudad)
      )
    ).filter(Boolean).sort()
  })

  const opcionesAlerta = computed(() => [
    { label: 'Con alertas', value: 'with' },
    { label: 'Sin alertas', value: 'without' }
  ])

  // Inicializar Fuse
  const inicializarFuse = () => {
    fuse = new Fuse(
      pacientes.value.filter(p => p.state === 1),
      FUSE_OPTIONS
    )
  }

  const actualizarFuse = () => inicializarFuse()

  // CRUD Operations
  const cargarPacientes = async () => {
    loading.value = true
    try {
      const { data } = await pacienteService.getAll()
      pacientes.value = data.data || []
      inicializarFuse()
    } catch (error) {
      console.error('Error cargando pacientes:', error)
      pacientes.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  const agregarPaciente = async (nuevoPaciente) => {
    loading.value = true
    try {
      const { data } = await pacienteService.create(nuevoPaciente)
      pacientes.value.push(data.data)
      actualizarFuse()
      return data.data
    } catch (error) {
      console.error('Error agregando paciente:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const actualizarPaciente = async (paciente) => {
    loading.value = true
    try {
      const { data } = await pacienteService.update(paciente.id, paciente)
      
      const index = pacientes.value.findIndex(p => p.id === paciente.id)
      if (index > -1) {
        pacientes.value[index] = data.data
      }

      actualizarFuse()
      return data.data
    } catch (error) {
      console.error('Error actualizando paciente:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const eliminarPaciente = async (pacienteId) => {
    loading.value = true
    try {
      await pacienteService.delete(pacienteId)

      const index = pacientes.value.findIndex(p => p.id === pacienteId)
      if (index > -1) {
        pacientes.value[index].state = 0
      }

      actualizarFuse()
    } catch (error) {
      console.error('Error eliminando paciente:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const buscarPorCI = async (ci) => {
    try {
      const { data } = await pacienteService.getByCi(ci)
      return data.data
    } catch (error) {
      console.error('Error buscando por CI:', error)
      return null
    }
  }

  const buscarPorEmail = async (gmail) => {
    try {
      const { data } = await pacienteService.getByEmail(gmail)
      return data.data
    } catch (error) {
      console.error('Error buscando por email:', error)
      return []
    }
  }

  // Selección y filtros
  const seleccionarPaciente = (p) => {
    selectedPatient.value = { ...p }
  }

  const limpiarPacienteSeleccionado = () => {
    selectedPatient.value = null
  }

  const establecerBusqueda = (q) => {
    searchQuery.value = q
  }

  const establecerFiltroCiudad = (c) => {
    cityFilter.value = c
  }

  const establecerFiltroAlerta = (a) => {
    alertFilter.value = a
  }

  const limpiarFiltros = () => {
    searchQuery.value = ''
    cityFilter.value = null
    alertFilter.value = null
  }

  // Helpers
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '--'

    const birth = new Date(fechaNacimiento)
    const today = new Date()

    let edad = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      edad--
    }

    return edad
  }

  const formatearFecha = (d) => {
    if (!d) return 'Nunca'
    try {
      return new Date(d).toLocaleDateString('es-ES')
    } catch {
      return 'Inválida'
    }
  }

  const getNombreCompleto = (paciente) => {
    if (!paciente) return ''
    const parts = [
      paciente.nombre,
      paciente.apellido_paterno,
      paciente.apellido_materno
    ].filter(Boolean)
    return parts.join(' ')
  }

  return {
    pacientes,
    pacientesFiltrados,
    totalPacientes,
    pacientesConAlertas,
    ciudadesUnicas,
    opcionesCiudad,
    opcionesAlerta,
    searchQuery,
    cityFilter,
    alertFilter,
    selectedPatient,
    loading,

    cargarPacientes,
    agregarPaciente,
    actualizarPaciente,
    eliminarPaciente,
    buscarPorCI,
    buscarPorEmail,

    seleccionarPaciente,
    limpiarPacienteSeleccionado,

    establecerBusqueda,
    establecerFiltroCiudad,
    establecerFiltroAlerta,
    limpiarFiltros,

    calcularEdad,
    formatearFecha,
    getNombreCompleto
  }
})