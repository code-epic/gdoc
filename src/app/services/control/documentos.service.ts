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

//IWKFDependencia del WorkFlow
export interface IWKFDependencia {
  documento?: number
  nombre?: string
  observacion?: string
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
  tipo: string
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
}


@Injectable({
  providedIn: 'root'
})


export class DocumentosService {

  constructor() { }
}
