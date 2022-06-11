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
	documento	 ?:	number
	estado	 ?:	number
	estatus	 ?:	number
	activo	 ?:	number
	resumen	 ?:	string
	detalle	 ?:	string
	archivo	 ?:	string
	privado	 ?:	number
	fecha	 ?:	string
	cuenta	 ?:	string
	usuario	 ?:	string
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


@Injectable({
  providedIn: 'root'
})


export class DocumentosService {

  constructor() { }
}
