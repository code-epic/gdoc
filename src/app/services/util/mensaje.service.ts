import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  contenido$ = new EventEmitter<any>();
  contenido : []
  estatusText$ = new EventEmitter<string>();
  estatusText: string = ''

  producto$ = new EventEmitter<any>();
  producto : []

  buzon$ = new EventEmitter<any>();
  buzon : string = ''
  
  progreso$ = new EventEmitter<any>();
  progreso: any = ''

  finalizacion$ = new EventEmitter<any>();
  finalizacion: any = ''

  
  constructor() { }
}
