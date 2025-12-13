/**
 * stores/odontogramas.ts
 * Store de Pinia para gestión de odontogramas
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  CaraDiente,
  TipoDenticion,
  PatologiaDental,
  RestauracionDental,
  TratamientoDental,
  MovimientoDental,
  SelloDental,
  EdentulismoDental,
  CaraDienteInfo,
  SimbologiaCara,
  PiezaDental
} from 'src/types/odontograma'
import { COLORES_CLINICOS } from 'src/types/odontograma'
import { extraerInfoDiente } from 'src/utils/diente'

// ============================================
// INTERFACES LOCALES (BD)
// ============================================

interface OdontogramaBD {
  id: number
  paciente_ci: string
  fecha_creacion: string
  fecha_ultima_modificacion: string
  tipo_denticion: TipoDenticion
  diagnostico_general?: string
  plan_tratamiento?: string
  notas?: string
}

interface PiezaBD {
  id: number
  id_odontograma: number
  numero: number
  denticion: TipoDenticion
  estado_general: 'sano' | 'enfermo' | 'tratado' | 'ausente'
  diagnostico?: string
  fecha_ultima_modificacion: string
}

interface CaraBD {
  id: number
  id_pieza: number
  cara: CaraDiente
  color: string
  tipo_simbologia: string
  valor_simbologia: string
  estado?: 'activo' | 'fallido'
  material?: string
  simbolo?: string
  notas?: string
  fecha_registro: string
}

export const useOdontogramasStore = defineStore('odontogramas', () => {
  // ============================================
  // STATE
  // ============================================

  const odontogramaActual = ref<OdontogramaBD | null>(null)
  const piezasActuales = ref<PiezaBD[]>([])
  const carasActuales = ref<CaraBD[]>([])
  const piezaSeleccionada = ref<number | null>(null)
  const caraSeleccionada = ref<CaraDiente | null>(null)

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Obtiene toda la información enriquecida de las piezas
   * Combina datos de pieza + caras + info FDI extraída del número
   */
  const piezasConDetalles = computed(() => {
    return piezasActuales.value.map(pieza => {
      const caras = carasActuales.value.filter(c => c.id_pieza === pieza.id)
      const info = extraerInfoDiente(pieza.numero)

      return {
        numero: pieza.numero,
        posicion: info.posicion,
        lado: info.lado,
        tipo: info.tipo,
        denticion: pieza.denticion,
        caras: completarCaras(caras),
        estadoGeneral: pieza.estado_general,
        diagnostico: pieza.diagnostico,
        notas: pieza.diagnostico
      } as PiezaDental
    })
  })

  /**
   * Filtra piezas por cuadrante
   */
  const piezasPorCuadrante = computed(() => {
    const cuadrantes: Record<string, PiezaDental[]> = {
      'superior_derecha': [],
      'superior_izquierda': [],
      'inferior_izquierda': [],
      'inferior_derecha': []
    }

    piezasConDetalles.value.forEach(pieza => {
      const key = `${pieza.posicion}_${pieza.lado}`
      if (cuadrantes[key]) {
        cuadrantes[key].push(pieza)
      }
    })

    return cuadrantes
  })

  /**
   * Obtiene la pieza seleccionada con toda su información
   */
  const piezaActual = computed(() => {
    if (!piezaSeleccionada.value) return null
    return piezasConDetalles.value.find(p => p.numero === piezaSeleccionada.value)
  })

  /**
   * Obtiene la cara seleccionada de la pieza actual
   */
  const caraActual = computed(() => {
    if (!piezaActual.value || !caraSeleccionada.value) return null
    return piezaActual.value.caras.find(c => c.cara === caraSeleccionada.value)
  })

  // ============================================
  // ACTIONS - Cargar/Crear
  // ============================================

  /**
   * Carga un odontograma existente desde BD
   */
  const cargarOdontograma = (
    odontograma: OdontogramaBD,
    piezas: PiezaBD[],
    caras: CaraBD[]
  ) => {
    odontogramaActual.value = odontograma
    piezasActuales.value = piezas
    carasActuales.value = caras
  }

  /**
   * Crea un nuevo odontograma vacío
   */
  const crearOdontograma = (
    id: number,
    paciente_ci: string,
    tipo_denticion: TipoDenticion = 'permanente'
  ) => {
    const ahora = new Date().toISOString()

    odontogramaActual.value = {
      id,
      paciente_ci,
      fecha_creacion: ahora,
      fecha_ultima_modificacion: ahora,
      tipo_denticion
    }

    piezasActuales.value = []
    carasActuales.value = []
  }

  // ============================================
  // ACTIONS - Actualizar Caras
  // ============================================

  /**
   * Actualiza una cara de una pieza
   * Recibe el estado/valor de la simbología completa
   */
  const actualizarCara = (
    numeroPieza: number,
    cara: CaraDiente,
    simbologia: SimbologiaCara
  ) => {
    if (!odontogramaActual.value) return false

    // Buscar o crear la pieza
    let pieza = piezasActuales.value.find(p => p.numero === numeroPieza)

    if (!pieza) {
      const nuevoId = Math.max(0, ...piezasActuales.value.map(p => p.id)) + 1
      const info = extraerInfoDiente(numeroPieza)

      pieza = {
        id: nuevoId,
        id_odontograma: odontogramaActual.value.id,
        numero: numeroPieza,
        denticion: info.denticion,
        estado_general: 'enfermo',
        fecha_ultima_modificacion: new Date().toISOString()
      }

      piezasActuales.value.push(pieza)
    }

    // Buscar o crear la cara
    let caraExistente = carasActuales.value.find(
      c => c.id_pieza === pieza!.id && c.cara === cara
    )

    const ahora = new Date().toISOString()
    const color = obtenerColorPorSimbologia(simbologia)

    if (caraExistente) {
      // Actualizar cara existente
      caraExistente.color = color
      caraExistente.tipo_simbologia = simbologia.tipo
      caraExistente.valor_simbologia = simbologia.valor
      caraExistente.estado = simbologia.estado
      caraExistente.material = simbologia.material
      caraExistente.simbolo = simbologia.simbolo
      caraExistente.fecha_registro = ahora
    } else {
      // Crear nueva cara
      const nuevoIdCara = Math.max(0, ...carasActuales.value.map(c => c.id)) + 1

      carasActuales.value.push({
        id: nuevoIdCara,
        id_pieza: pieza.id,
        cara,
        color,
        tipo_simbologia: simbologia.tipo,
        valor_simbologia: simbologia.valor,
        estado: simbologia.estado,
        material: simbologia.material,
        simbolo: simbologia.simbolo,
        fecha_registro: ahora
      })
    }

    // Actualizar fechas
    pieza.fecha_ultima_modificacion = ahora
    odontogramaActual.value.fecha_ultima_modificacion = ahora

    return true
  }

  // ============================================
  // ACTIONS - Selecciones
  // ============================================

  /**
   * Selecciona una pieza por número
   */
  const seleccionarPieza = (numero: number) => {
    piezaSeleccionada.value = numero
    caraSeleccionada.value = null
  }

  /**
   * Selecciona una cara
   */
  const seleccionarCara = (cara: CaraDiente) => {
    caraSeleccionada.value = cara
  }

  /**
   * Limpia la selección
   */
  const limpiarSeleccion = () => {
    piezaSeleccionada.value = null
    caraSeleccionada.value = null
  }

  // ============================================
  // ACTIONS - Consultas
  // ============================================

  /**
   * Obtiene una pieza específica con todas sus caras
   */
  const obtenerPieza = (numero: number): PiezaDental | undefined => {
    return piezasConDetalles.value.find(p => p.numero === numero)
  }

  /**
   * Obtiene todas las caras de una pieza
   */
  const obtenerCarasPieza = (numeroPieza: number): CaraDienteInfo[] => {
    const pieza = piezasActuales.value.find(p => p.numero === numeroPieza)
    if (!pieza) return []

    const caras = carasActuales.value.filter(c => c.id_pieza === pieza.id)
    return completarCaras(caras)
  }

  /**
   * Resetea una pieza (elimina todas sus caras, vuelve a normal)
   */
  const resetearPieza = (numeroPieza: number): boolean => {
    const pieza = piezasActuales.value.find(p => p.numero === numeroPieza)
    if (!pieza) return false

    // Eliminar todas sus caras
    carasActuales.value = carasActuales.value.filter(c => c.id_pieza !== pieza.id)

    // Eliminar la pieza
    piezasActuales.value = piezasActuales.value.filter(p => p.id !== pieza.id)

    return true
  }

  // ============================================
  // FUNCIONES AUXILIARES (privadas)
  // ============================================

  /**
   * Completa las 5 caras de un diente
   * Si no existen en BD, las crea con estado normal
   */
  function completarCaras(caras: CaraBD[]): CaraDienteInfo[] {
    const carasCompletas: CaraDiente[] = ['Oclusal', 'Vestibular', 'Palatino', 'Mesial', 'Distal']
    const carasMap = new Map(caras.map(c => [c.cara, c]))

    return carasCompletas.map(cara => {
      const caraExistente = carasMap.get(cara)

      if (caraExistente) {
        return {
          cara,
          color: caraExistente.color,
          simbologia: {
            tipo: caraExistente.tipo_simbologia as any,
            valor: caraExistente.valor_simbologia as any,
            estado: caraExistente.estado as any,
            material: caraExistente.material,
            simbolo: caraExistente.simbolo
          },
          notas: caraExistente.notas
        }
      }

      // Estado normal (no guardado en BD)
      return {
        cara,
        color: COLORES_CLINICOS.blanco,
        simbologia: {
          tipo: 'movimiento',
          valor: 'normal'
        }
      }
    })
  }

  /**
   * Obtiene el color según la simbología
   */
  function obtenerColorPorSimbologia(simbologia: SimbologiaCara): string {
    // Si está fallido, siempre rojo
    if (simbologia.estado === 'fallido') {
      return COLORES_CLINICOS.rojo
    }

    // Mapear por tipo de simbología
    switch (simbologia.tipo) {
      case 'patologia':
        return COLORES_CLINICOS.rojo
      case 'restauracion':
        return COLORES_CLINICOS.azul
      case 'tratamiento':
        return simbologia.valor === 'exodoncia' ? COLORES_CLINICOS.azul : COLORES_CLINICOS.rojo
      case 'movimiento':
        return COLORES_CLINICOS.blanco
      case 'sello':
        return COLORES_CLINICOS.amarillo
      case 'edentulismo':
        return COLORES_CLINICOS.negro
      default:
        return COLORES_CLINICOS.blanco
    }
  }

  return {
    // State (readonly públicamente)
    odontogramaActual,
    piezasActuales,
    carasActuales,
    piezaSeleccionada,
    caraSeleccionada,

    // Getters
    piezasConDetalles,
    piezasPorCuadrante,
    piezaActual,
    caraActual,

    // Actions
    cargarOdontograma,
    crearOdontograma,
    actualizarCara,
    seleccionarPieza,
    seleccionarCara,
    limpiarSeleccion,
    obtenerPieza,
    obtenerCarasPieza,
    resetearPieza
  }
})