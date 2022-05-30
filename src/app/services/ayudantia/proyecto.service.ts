import { Injectable } from '@angular/core';



export interface Proyecto {
  nombre: string
  tipo: string
  sistema_armas: string
  estatus: string
  jefe_proyecto: string
  telefono_jefe: string
  ente: string
  empresa: string
  pais: string
  fuente: string
  otros: string
  usuario_final: string
  sistema: string
  fecha_desde: string
  fecha_hasta: string
  numero_contrato: string
  objeto: string
  observacion: string
  fecha_origen: string
  moneda: string
  monto_total: number
  monto_pagado: number
  monto_deuda: number
  usuario: string

}

export interface Avance {
  proyecto : number
  fecha: string
  archivo : string
  ejecucion: string
  monto: string
  observacion?: string
}

@Injectable({
  providedIn: 'root'
})

export class ProyectoService {

  constructor() { }
}
