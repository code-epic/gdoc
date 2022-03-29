import { Injectable } from '@angular/core';



//Exportar documentos
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
  historico ?: []

}

@Injectable({
  providedIn: 'root'
})


export class DocumentosService {

  constructor() { }
}
