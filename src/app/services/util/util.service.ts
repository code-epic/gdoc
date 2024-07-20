import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilService {

  pagina$ = new EventEmitter<any>();
  pagina : string = 'Principal'

  contenido$ = new EventEmitter<any>();
  contenido : []
  
  estatusText$ = new EventEmitter<string>();
  estatusText: string = ''

  titulo$ = new EventEmitter<any>();
  titulo : string = ''
  
  imgNoDisponible = "data:image/jpeg;base64,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";
  //;
  constructor() {}

  /**
   * Fecha Actual del sistema desde la application
   * @param dias sumar dias a la fecha actual
   * @returns retorna la fecha actual del sistema en formato YYYY-MM-DD
   */
  FechaActual(dias: number = 0): string {
    let date = new Date();

    if (dias > 0) date.setDate(date.getDate() + dias);

    let output =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");
    return output;
  }
  //retorna fecha en formato Dia/Mes/Anio
  ConvertirFecha(fecha: any): string {
    return fecha.year + "-" + +fecha.month + "-" + fecha.day;
  }

  Semillero(id: string): string {
    var f = new Date();
    var anio = f.getFullYear().toString().substring(2, 4);
    var mes = this.zfill((f.getMonth() + 1).toString(), 2);
    var dia = this.zfill(f.getDate().toString(), 2);
    return anio + mes + dia + "-" + this.zfill(id, 5);
  }

  public zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return "-" + numberOutput.toString();
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return "-" + zero.repeat(width - length) + numberOutput.toString();
      } else {
        return zero.repeat(width - length) + numberOutput.toString();
      }
    }
  }

  //convertir cadena a minuscula y sin carateres especiales
  ConvertirCadena(cadena: string): string {
    return cadena
      .toLowerCase()
      .replace(/á/g, "a")
      .replace(/ê/g, "i")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u");
  }

  //Recibe  Fecha Formato: AAAA-MM-DD 00:00:00
  //Retorna Fecha Formato: DD/MM/AAAA
  ConvertirFechaHumana(f) {
    var ISODate = new Date(f).toISOString();
    var fe = ISODate.substr(0, 10);
    var fa = fe.split("-");
    if (fa[0] != "0001") {
      return fa[2] + "/" + fa[1] + "/" + fa[0];
    } else {
      return "1900-01-01";
    }
    //return fa[2] + "/" + fa[1] + "/" + fa[0];
  }

  //Recibe  Fecha Formato: DD/MM/AAAA
  //Retorna Fecha Formato: AAAA-MM-DD
  ConvertirFechaDia(f: any) : string {
    var faux = ''
    if (typeof f != "object") {
      faux = "1900-01-01"
      if (f != undefined && f != "") {
        var fx = f.split("-");
        faux = fx[2] + "-" + fx[1] + "-" + fx[0];
      }
      return faux;
    }else{
      var ISODate = new Date(f).toISOString();
      var fe = ISODate.substr(0, 10);
      var fa = fe.split("-");
      if (fa[0] != "0001") {
        return fa[0] + "-" + fa[1] + "-" + fa[2];
      } else {
        return "1900-01-01";
      }
    }


    
  }

  SumarAnios(f: any, cant : number) : string {
    if (f == "") return ""
    var fx = f.split("-");
    let num = parseInt(fx[2]) + cant;

   
    let cadena = fx[0] + "-" + fx[1] + "-" + num.toString()
    return cadena
  
  }

  //Recibe  Fecha Formato: DD/MM/AAAA
  //Retorna Fecha Formato: AAAA-MM-DD
  ConvertirFechaHora() {
    var ISODate = new Date().toISOString();
    return ISODate.substr(0, 10) + " " + ISODate.substr(11, 8);
  }

  ConvertirCategoria(abreviatura: string): string {
    let categoria = "";
    switch (abreviatura) {
      case "EFE":
        categoria = "EFECTIVO";
        break;
      case "ASI":
        categoria = "ASIMILADO";
        break;
      case "RES":
        categoria = "RESERVA";
        break;
      case "TRP":
        categoria = "TROPA";
        break;
      case "HNO":
        categoria = "HONORARIOS";
        break;
      case "MIL":
        categoria = "MILICIA";
        break;

      default:
        break;
    }

    return categoria;
  }

  ConvertirClasificacion(abreviatura: string): string {
    let clasificacion = "";
    switch (abreviatura) {
      case "OFI":
        clasificacion = "OFICIAL DE COMANDO";
        break;
      case "OFIT":
        clasificacion = "OFICIAL TECNICO";
        break;
      case "OFITR":
        clasificacion = "OFICIAL DE TROPA";
        break;
      case "TPROF":
        clasificacion = "TROPA PROFESIONAL";
        break;
      case "TPROA":
        clasificacion = "TROPA ALISTADA";
        break;
      case "ASI":
        clasificacion = "ASIMILADO";
        break;
      case "ASIT":
        clasificacion = "ASIMILADO TECNICO";
        break;
      case "ASI":
        clasificacion = "ASIMILADO";
        break;
      case "HNO":
        clasificacion = "HONORARIOS";
        break;
      case "MIL":
        clasificacion = "MILICIA";
        break;
      default:
        break;
    }

    return clasificacion;
  }

  ConvertirSituacion(sit): string {
    let situacion = "";
    switch (sit) {
      case "ACT":
        situacion = "ACTIVO";
        break;
      case "RCP":
        situacion = "RETIRADO CON PENSION";
        break;
      case "RSP":
        situacion = "RETIRADO SIN PENSION";
        break;
      case "INV":
        situacion = "INVALIDEZ";
        break;
    }
    return situacion;
  }

  /**
   * Generar Unico ID
   * @returns string
   */
  GenerarUnicId(): string {
    return Math.random().toString(36).substr(2, 18);
  }


  downloadFile(head, data, filename = "data", delimitador) {

    let csvData = this.ConvertToCSV(data, head, delimitador);
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList, delimitador) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "#num" + delimitador;

    for (let index in headerList) {
      // console.log(index, headerList);
      row += headerList[index] + delimitador;
    }
    // console.log(row);
    row = row.slice(0, -1);
    str += row + "\r\n";

    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerList) {
        let head = headerList[index];
        let texto = array[i][head] + ""
        line += delimitador + texto.replace(/[\r\n]+/gm, "").toUpperCase();
      }
      str += line + "\r\n";
    }
    return str;
  }
}
