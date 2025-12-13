/**
 * types/paciente.ts
 * Define las interfaces y tipos para pacientes
 */

export interface Paciente {
  id: number
  fechaRegistro: string
  gmail: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  ci: string
  fechaNacimiento: string
  ciudad: string
  profesion: string
  estadoCivil: string
  domicilio: string
  telefono: string
  rol: string
  motivoConsulta: string
  ultimaVisitaOdontologo: string
  descripcion: string
  antecedentesSalud: string
  alertasClinicas: string
  state: number | string
}

export interface PacientesResponse {
  pacientes: Paciente[]
}

export interface PacienteFiltrado {
  id: number
  ci: string
  nombre: string
  apellidoPaterno: string
}