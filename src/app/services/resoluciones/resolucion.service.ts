import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from '../apicore/api.service';

export interface Objetos {
  id: string;
  nombre: string;
  observacion: string;
  abreviatura: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResolucionService {

  public Componentes: Array<Objetos>
  public Grado: Array<Objetos>
  public Tipo: []
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''

  }
  constructor(private apiService: ApiService) { }


  /**
   * Listar datos del ministerio con carga general
   * @param tipo number 1: componente 2 grado 3 tipo
   */
  Listar(tipo: number) {
    switch (tipo) {
      case 1:
        this.xAPI.funcion = 'MPPD_CComponente'
        break;
      case 2:
        this.xAPI.funcion = 'MPPD_CGrado'
        break;
      case 3:
        this.xAPI.funcion = 'MPPD_CTipoResolucion'
        break;
      case 4:
        this.xAPI.funcion = 'MPPD_CCategorias'
        break;
      case 5:
        this.xAPI.funcion = 'MPPD_CClasificacion'
        break;
      case 6:
        this.xAPI.funcion = 'MPPD_CEstadoResolucion'
        break;
      case 7:
        this.xAPI.funcion = 'MPPD_COrdenEntrada'
        break;
      case 8:
        this.xAPI.funcion = 'MPPD_CCarpetaEntrada'
        console.log('entrada');
        break;
      default:
        this.xAPI.funcion = 'MPPD_CTipoEntrada'
        break;
    }

    const funcion = this.xAPI.funcion
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (sessionStorage.getItem(funcion) == undefined) sessionStorage.setItem(funcion, btoa(JSON.stringify(data.Cuerpo)))
      }


    )
  }
}



