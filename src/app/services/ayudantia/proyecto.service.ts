import { Injectable } from '@angular/core';



export interface Proyecto {
  ncontrato ?: string
  nombre?: string
  tipo?: string
  contratante?: string
  empresa?: string
  fuente?: string
  usuario_final?: string
  objeto?: string
  observacion?: string
  moneda?: string
  lapso?: string
  monto_total?: number
  monto_pagado?: number
  adeuda?: number
  usuario?: string
  estatus?: string
  jefeproyecto?: string
  desdehasta ?: string
  sistema?: string

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
