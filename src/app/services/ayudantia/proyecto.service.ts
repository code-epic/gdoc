import { Injectable } from '@angular/core';



export interface IProyecto {
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
}

@Injectable({
  providedIn: 'root'
})

export class ProyectoService {

  constructor() { }
}
