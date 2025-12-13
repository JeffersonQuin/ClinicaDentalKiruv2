/**
 * src/types/odontograma.ts
 * Definiciones de tipos para el odontograma
 */

// ============================================
// TIPOS BÁSICOS
// ============================================

// Caras del diente
export type CaraDiente = 'Oclusal' | 'Vestibular' | 'Palatino' | 'Mesial' | 'Distal'

// Tipo de dentición
export type TipoDenticion = 'permanente' | 'temporal' | 'mixta'

// ============================================
// NOMENCLATURA Y SÍMBOLOS CLÍNICOS
// ============================================

// Patologías y estados dentales (ROJO por defecto si hay problema)
export type PatologiaDental = 
  | 'patologia'          // Rojo: Patología o lesión pendiente
  | 'caries_radiografica' // Verde: Caries radiográficas
  | 'ausencia_natural'   // Negro: Ausencias naturales
  | 'resto_radicular'    // RR en Rojo

// Restauraciones (AZUL)
export type RestauracionDental =
  | 'obturacion'         // Relleno azul
  | 'endodoncia'         // E + Relleno azul
  | 'corona'             // Corona azul
  | 'protesis_fija'      // Línea conecta dos dientes

// Tratamientos en curso (ROJO)
export type TratamientoDental =
  | 'exodoncia'          // Cruz azul, roja si falla
  | 'implante'           | 'ortodoncia_fija'      // Cuadrado + Cruz
  | 'ortodoncia_removible' // Línea zig-zag

// Estados de extrusión/intrusión
export type MovimientoDental =
  | 'extruido'           // Flecha hacia afuera
  | 'intruido'           // Flecha hacia adentro
  | 'normal'

// Estado de sello
export type SelloDental =
  | 'sellado'            // Amarillo: Sellado de fosas y fisuras
  | 'sin_sellar'

// Edentulismo
export type EdentulismoDental =
  | 'presente'
  | 'edentulo'           // Línea recta
  | 'protesis_removible' // Dos líneas
  | 'protesis_completa'  // Dos líneas

// ============================================
// INFORMACIÓN DE CARA DENTAL
// ============================================

export interface CaraDienteInfo {
  cara: CaraDiente
  color: string              // Código hex del color
  simbologia: SimbologiaCara // Qué se representa
  descripcion?: string
  fechaRegistro?: string
  notas?: string
}

export interface SimbologiaCara {
  tipo: 'patologia' | 'restauracion' | 'tratamiento' | 'movimiento' | 'sello' | 'edentulismo'
  valor: PatologiaDental | RestauracionDental | TratamientoDental | MovimientoDental | SelloDental | EdentulismoDental
  estado?: 'activo' | 'fallido'  // Si está en mal estado será rojo
  material?: string              // Para restauraciones: "Amalgama", "Resina", "Oro", etc.
  simbolo?: string              // Representación: "Cruz", "Relleno", "IMP", etc.
}

// ============================================
// PIEZA DENTAL COMPLETA
// ============================================

export interface PiezaDental {
  numero: number
  posicion: 'superior' | 'inferior'
  lado: 'derecha' | 'izquierda'
  tipo: 'incisivo' | 'canino' | 'premolar' | 'molar'
  denticion: TipoDenticion
  caras: CaraDienteInfo[]
  
  // Estado general de la pieza
  estadoGeneral: 'sano' | 'enfermo' | 'tratado' | 'ausente'
  
  // Información clínica
  diagnostico?: string
  notas?: string
  fechaUltimaVisita?: string
  
  // Diseño personalizado con Fabric.js
  disenoPersonalizado?: DisenoFabricJs
}

// ============================================
// DISEÑO PERSONALIZADO CON FABRIC.JS
// ============================================

export interface DisenoFabricJs {
  id: string
  nombre: string
  version: number
  
  // Datos serializados de Fabric.js
  fabricJson: FabricJsonFormat
  
  // Metadatos del diseño
  creadoPor: string         
  fechaCreacion: string
  fechaModificacion: string
  
  // Historial de cambios
  historialVersiones?: DisenoVersion[]
}

export interface DisenoVersion {
  version: number
  cambios: string
  fabricJson: FabricJsonFormat
  fecha: string
}

// Formato JSON de Fabric.js
export interface FabricJsonFormat {
  version: string
  objects: Array<{
    type: string
    left: number
    top: number
    width: number
    height: number
    fill: string
    stroke?: string
    [key: string]: any
  }>
  background?: string
  [key: string]: any
}

// ============================================
// ODONTOGRAMA COMPLETO
// ============================================

export interface Odontograma {
  id: string
  pacienteId: number
  fechaCreacion: string
  fechaUltimaModificacion: string
  
  // Tipo de dentición del paciente
  tipoDenticion: TipoDenticion
  
  // Todas las piezas (32 permanentes o 20 temporales)
  piezas: PiezaDental[]
  
  // Observaciones generales
  diagnosticoGeneral?: string
  planTratamiento?: string
  notas?: string
  
  // Historial
  historialModificaciones?: ModificacionOdontograma[]
  
  // Imágenes adjuntas
  imagenesAdjuntas?: ImagenOdontograma[]
}

export interface ModificacionOdontograma {
  fecha: string
  usuario: string
  cambios: string
  pieza?: number
  cara?: CaraDiente
}

export interface ImagenOdontograma {
  id: string
  url: string
  tipo: 'radiografia' | 'fotografia' | 'clinica'
  fecha: string
  descripcion?: string
}

// ============================================
// MAPA DE COLORES CLÍNICOS
// ============================================

export const COLORES_CLINICOS: Record<string, string> = {
  // Colores principales por patología
  rojo: '#EF5350',           // Patología, lesión, tratamiento fallido
  azul: '#42A5F5',           // Restauración, tratamiento activo
  verde: '#66BB6A',          // Caries radiográficas
  amarillo: '#FDD835',       // Sellado de fosas y fisuras
  negro: '#424242',          // Ausencias naturales
  gris: '#BDBDBD',           // Símbolos secundarios (ej: Implante)
  blanco: '#FFFFFF'          // Fondo, normal
}

// ============================================
// ESTRUCTURA DE GUARDADO
// ============================================

export interface GuardadoOdontograma {
  odontograma: Odontograma
  disenosPersonalizados: DisenoFabricJs[]
  metadatos: {
    version: string
    fechaExportacion: string
    paciente: {
      id: number
      nombre: string
      ci: string
    }
  }
}