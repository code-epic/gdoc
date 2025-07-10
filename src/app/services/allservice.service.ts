import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AllService {
  constructor() { }

  /**
   * Devuelve el texto descriptivo para un estado de detalle.
   * @param e string en formato "algo|codigo"
   */
  getDetalleX(e: string): string {
    let text = 'PROCESAR';
    let cont = e.split('|');
    if (cont.length > 0) {
      switch (cont[1]) {
        case 'PR':
          text = 'PROCESAR';
          break;
        case 'NP':
          text = 'NO PROCESAR';
          break;
        case 'NPPIDD':
          text = 'NP POR INT. DEL DIRECTOR';
          break;
        case 'NPPIDJ':
          text = 'NP POR INT. DEL JEFE DE AREA';
          break;
        case 'CR':
          text = 'CODIGO ROJO';
          break;
      }
    }
    return text;
  }
}
