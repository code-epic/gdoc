import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  //
  constructor() { }

  //retorna fecha en formato Dia/Mes/Anio
  ConvertirFecha(fecha : any) : string {
      return fecha.day + '-' + fecha.month + '-' + fecha.year
  }

}
