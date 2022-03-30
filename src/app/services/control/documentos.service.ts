import { Injectable } from '@angular/core';



//Exportar documentos Detalles
export interface IDocumento{
  id ?: string
  wfdocumento ?: number
  ncontrol ?: string
  fcreacion ?: string
  salida ?: string
  forigen ?: string
  norigen ?: string
  tipo ?: string
  remitente ?: string
  unidad ?: string
  contenido ?: string
  instrucciones ?: string
  observaciones ?: []
  codigo ?: string
  nexpediente ?: string
  asociacion ?: []
  creador ?: string 
  archivo ?: string 
  historico ?: []

}



//documento del WorkFlow
export interface IWKFDocumento {
  nombre : string
  estado : number
  estatus : number
  observacion : string
  usuario : string
}

//Alerta de documentos
export interface IWKFAlerta{
  documento ?: number
  estado ?: number
  estatus ?: number
  activo ?: number
  fecha ?: string
  observacion ?: string
  usuario ?: string
}


@Injectable({
  providedIn: 'root'
})


export class DocumentosService {

  constructor() { }
}
