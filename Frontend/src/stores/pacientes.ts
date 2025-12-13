import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Paciente } from '../types/pacientes'
import pacientesData from 'src/data/pacientes.json'

export const usePacientesStore = defineStore('pacientes', () => {
  // ============================================
  // STATE
  // ============================================
  
  const pacientes = ref<Paciente[]>([])
  const searchTerm = ref<string>('')
  const pacienteSeleccionado = ref<Paciente | null>(null)

  // ============================================
  // GETTERS
  // ============================================
  
  /**
   * Obtiene todos los pacientes activos
   */
  const pacientesActivos = computed(() =>
    pacientes.value.filter(p => p.state === 1)
  )

  /**
   * Obtiene sugerencias para el datalist
   * Filtra solo pacientes activos con CI que coincida
   * Retorna max 5 resultados
   */
  const sugerenciasPacientes = computed(() => {
    if (!searchTerm.value.trim()) {
      return []
    }

    const needle = searchTerm.value.toLowerCase().trim()

    return pacientesActivos.value
      .filter(paciente =>
        paciente.ci.toLowerCase().includes(needle) ||
        paciente.nombre.toLowerCase().includes(needle)
      )
      .map(p => ({
        id: p.id,
        ci: p.ci,
        nombre: p.nombre,
        apellidoPaterno: p.apellidoPaterno
      }))
      .slice(0, 5) // Solo 5 sugerencias
  })

  /**
   * Busca un paciente por CI exacto
   * Retorna el paciente completo si existe
   */
  const buscarPorCI = (ci: string): Paciente | undefined => {
    return pacientesActivos.value.find(p => p.ci === ci.trim())
  }

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Carga los pacientes desde el JSON
   * Se ejecuta al inicializar la aplicación
   */
  const cargarPacientes = () => {
    pacientes.value = (pacientesData as any).pacientes.map(p => ({
      ...p,
      state: p.state || 'active'
    }))
    console.log('Pacientes cargados:', pacientes.value.length)
  }

  /**
   * Actualiza el término de búsqueda
   */
  const actualizarBusqueda = (termino: string) => {
    searchTerm.value = termino
  }

  /**
   * Selecciona un paciente por CI
   * Se usa cuando el usuario selecciona una sugerencia
   */
  const seleccionarPacientePorCI = (ci: string): boolean => {
    const paciente = buscarPorCI(ci)
    if (paciente) {
      pacienteSeleccionado.value = paciente
      return true
    }
    return false
  }

  /**
   * Limpia la selección actual
   */
  const limpiarSeleccion = () => {
    pacienteSeleccionado.value = null
    searchTerm.value = ''
  }

  return {
    // State
    pacientes,
    searchTerm,
    pacienteSeleccionado,

    // Getters
    pacientesActivos,
    sugerenciasPacientes,

    // Actions
    cargarPacientes,
    actualizarBusqueda,
    seleccionarPacientePorCI,
    limpiarSeleccion,
    buscarPorCI
  }
})