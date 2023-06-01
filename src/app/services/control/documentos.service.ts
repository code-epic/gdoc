import { Injectable } from '@angular/core';



//Exportar documentos Detalles
export interface IDocumento {
  id?: string
  wfdocumento?: number
  ncontrol?: string
  fcreacion?: string
  salida?: string
  forigen?: string
  norigen?: string
  tipo?: string
  remitente?: string
  unidad?: string
  comando?: string
  contenido?: string
  instrucciones?: string
  observaciones?: []
  codigo?: string
  nexpediente?: string
  asociacion?: []
  privacidad?: number
  creador?: string
  archivo?: string
  historial?: string
  traza?: string
  subdocumento?: string
  hz_adjunto?: string
  dependencias?: string
  puntodecuenta?: string
}



//documento del WorkFlow
export interface IWKFDocumento {
  nombre: string
  estado: number
  workflow: number
  estatus: number
  observacion: string
  usuario: string
}


//IWKFCuenta del WorkFlow
export interface IWKFCuenta {
  documento?: number
  estado?: number
  estatus?: number
  activo?: number
  resumen?: string
  detalle?: string
  archivo?: string
  privado?: number
  cedula?: string
  cargo?: string
  nmilitar?: string
  fecha?: string
  cuenta?: string
  usuario?: string
}


//Alerta de documentos
export interface IWKFAlerta {
  documento?: number
  estado?: number
  estatus?: number
  activo?: number
  fecha?: string
  observacion?: string
  usuario?: string
}

//Exportar documentos Detalles
export interface Resolucion {
  id: string
  cuenta: string
  numero: string
  unidad: string
  fecha_doc: string
  tipo: any
  situacion: string
  cedula: string
  nombres_apellidos: string
  fecha_nacimiento: string
  sexo: string
  componente: string
  categoria: string
  clasificacion: string
  grado: string
  carpeta: string
  estatus: string
  entrada: string
  asunto: string
  observacion: string
  responsable: string
  cargo_responsable: string
  gran_comando: string
  unidad_comando: string
  instrucciones: string

}


export interface IResoluciones {
  cedula: string
  tipo: number
  numero: string
  fecha: string
  asunto: string
  pais: number
  destino: string
  observacion: string
  solicitud: number
  reserva: number
  fecha_fin: string
  termino: number
  autor: string
  modificado: string
  fecha_modificado: string
  comando: string
  instrucciones: string
  cod_unidad: string
  unidad: string
  distribucion: string
  estatus: number
  creador: string
  causa: string,
  motivo: string,
  detalle: string,
  falta: string
}



//IWKFDependencia del WorkFlow
export interface IWKFDependencia {
  documento?: number
  nombre?: string
  observacion?: string
}

@Injectable({
  providedIn: 'root'
})


export class DocumentosService {

  constructor() { }
}
