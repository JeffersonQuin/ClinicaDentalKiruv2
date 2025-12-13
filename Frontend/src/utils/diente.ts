/**
 * utils/diente.ts
 * Funciones helper para trabajar con numeración FDI de dientes
 */

/**
 * Extrae el cuadrante del número FDI
 * @param numero - Número FDI (11-48 permanentes, 51-85 temporales)
 * @returns Cuadrante (1-4)
 */
export function obtenerCuadrante(numero: number): 1 | 2 | 3 | 4 {
  return Math.floor(numero / 10) as 1 | 2 | 3 | 4
}

/**
 * Extrae la posición del diente (superior/inferior)
 * @param numero - Número FDI
 * @returns 'superior' | 'inferior'
 */
export function obtenerPosicion(numero: number): 'superior' | 'inferior' {
  const cuadrante = obtenerCuadrante(numero)
  return [1, 2].includes(cuadrante) ? 'superior' : 'inferior'
}

/**
 * Extrae el lado del diente (derecha/izquierda)
 * @param numero - Número FDI
 * @returns 'derecha' | 'izquierda'
 */
export function obtenerLado(numero: number): 'derecha' | 'izquierda' {
  const cuadrante = obtenerCuadrante(numero)
  return [1, 4].includes(cuadrante) ? 'derecha' : 'izquierda'
}

/**
 * Extrae el tipo de diente según su posición en el cuadrante
 * @param numero - Número FDI
 * @returns 'incisivo' | 'canino' | 'premolar' | 'molar'
 */
export function obtenerTipoDiente(numero: number): 'incisivo' | 'canino' | 'premolar' | 'molar' {
  const posicion = numero % 10

  if (posicion >= 1 && posicion <= 3) return 'incisivo'
  if (posicion === 4) return 'canino'
  if (posicion >= 5 && posicion <= 6) return 'premolar'
  if (posicion >= 7 && posicion <= 8) return 'molar'

  throw new Error(`Número FDI inválido: ${numero}`)
}

/**
 * Extrae el tipo de dentición (permanente/temporal/mixta)
 * @param numero - Número FDI
 * @returns 'permanente' | 'temporal'
 */
export function obtenerTipoDenticion(numero: number): 'permanente' | 'temporal' {
  const primerDigito = Math.floor(numero / 10)
  return [1, 2, 3, 4].includes(primerDigito) ? 'permanente' : 'temporal'
}

/**
 * Obtiene toda la información del diente de un solo número FDI
 * @param numero - Número FDI
 * @returns Objeto con posición, lado, tipo, dentición
 */
export function extraerInfoDiente(numero: number) {
  return {
    numero,
    posicion: obtenerPosicion(numero),
    lado: obtenerLado(numero),
    tipo: obtenerTipoDiente(numero),
    denticion: obtenerTipoDenticion(numero),
    cuadrante: obtenerCuadrante(numero)
  }
}

/**
 * Valida si un número FDI es válido
 * @param numero - Número a validar
 * @returns true si es válido, false si no
 */
export function esNumeroFdiValido(numero: number): boolean {
  // Permanentes: 11-48
  const esPermanente = numero >= 11 && numero <= 48 && numero % 10 <= 8
  // Temporales: 51-85
  const esTemporeal = numero >= 51 && numero <= 85 && numero % 10 <= 5

  return esPermanente || esTemporeal
}

/**
 * Obtiene el nombre descriptivo del diente
 * @param numero - Número FDI
 * @returns String descriptivo (ej: "Premolar superior derecho")
 */
export function obtenerNombreDiente(numero: number): string {
  if (!esNumeroFdiValido(numero)) {
    return 'Diente inválido'
  }

  const info = extraerInfoDiente(numero)
  const posicion = info.posicion.charAt(0).toUpperCase() + info.posicion.slice(1)
  const lado = info.lado.charAt(0).toUpperCase() + info.lado.slice(1)
  const tipo = info.tipo.charAt(0).toUpperCase() + info.tipo.slice(1)

  return `${tipo} ${posicion} ${lado} (${numero})`
}

/**
 * Genera todos los números FDI para un tipo de dentición
 * @param tipoDenticion - 'permanente' | 'temporal'
 * @returns Array de números FDI válidos
 */
export function generarNumerosFdi(tipoDenticion: 'permanente' | 'temporal'): number[] {
  const numeros: number[] = []

  if (tipoDenticion === 'permanente') {
    // Cuadrantes 1-4, posiciones 1-8
    for (let cuadrante = 1; cuadrante <= 4; cuadrante++) {
      for (let posicion = 1; posicion <= 8; posicion++) {
        numeros.push(cuadrante * 10 + posicion)
      }
    }
  } else {
    // Cuadrantes 5-8, posiciones 1-5
    for (let cuadrante = 5; cuadrante <= 8; cuadrante++) {
      for (let posicion = 1; posicion <= 5; posicion++) {
        numeros.push(cuadrante * 10 + posicion)
      }
    }
  }

  return numeros
}

/**
 * Ejemplo de uso:
 * 
 * const info = extraerInfoDiente(16)
 * console.log(info)
 * // {
 * //   numero: 16,
 * //   posicion: 'superior',
 * //   lado: 'derecha',
 * //   tipo: 'premolar',
 * //   denticion: 'permanente',
 * //   cuadrante: 1
 * // }
 * 
 * const nombre = obtenerNombreDiente(26)
 * console.log(nombre) // "Premolar Superior Izquierdo (26)"
 * 
 * const dientes = generarNumerosFdi('permanente')
 * console.log(dientes.length) // 32
 */