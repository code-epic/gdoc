import { Injectable } from '@angular/core';


export interface Cotizaciones {
  identificador ?: number  
  nombre: string
  fecha: string
  vigencia: string
  objeto: string
  total: number
  pagado: number
  deuda: number
  garantia: string
  moneda: string
  lapso: string
  modalidad: string
  forma_pago: string //forma de pago
  responsable: string
  cargo_responsable: string
  usuario: string
  obseravacion: string
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  constructor() { }
}
