import { Injectable } from '@angular/core';



export interface Proyecto {
  nombre?: string
  tipo?: string
  sistema_armas?: string
  estatus?: string
  jefeproyecto?: string
  tlf_jefe?: string
  contratante?: string
  empresa?: string
  pais?: string
  fuente?: string
  otros?: string
  usuario_final?: string
  sistema?: string
  desde?: string
  hasta?: string
  ncontrato ?: string
  objeto?: string
  observacion?: string
  lapso?: string
  moneda?: string
  monto_total?: number
  monto_pagado?: number
  adeuda?: number
  usuario?: string


}

export interface Avance {
  lapso : string
  ejecucion : string
  monto : string
  observacion?: string
}

@Injectable({
  providedIn: 'root'
})

export class ProyectoService {

  constructor() { }
}
