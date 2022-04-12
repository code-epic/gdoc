import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  //
  constructor() { }


  //Retorna la fecha actual del sistema en formato YYYY-MM-DD
  FechaActual() : string {
    let date = new Date()

    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return output
  }
  //retorna fecha en formato Dia/Mes/Anio
  ConvertirFecha(fecha : any) : string {
      return fecha.year + '-' + + fecha.month + '-'  + fecha.day
  }


  Semillero(id:string) : string {
    var f = new Date()
    var anio = f.getFullYear().toString().substring(2,4)
    var mes = this.zfill((f.getMonth() + 1).toString(),2)
    var dia = this.zfill(f.getDate().toString(), 2)
    return anio+ mes + dia + '-' + this.zfill(id, 5)
  }

  protected zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}

}
