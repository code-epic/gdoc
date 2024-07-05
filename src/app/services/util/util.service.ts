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
  
  //
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
    let row = "#num,";

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
