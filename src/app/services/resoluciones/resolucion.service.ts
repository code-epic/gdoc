import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from '../apicore/api.service';

export interface Objetos {
  id: string;
  nombre: string;
  observacion: string;
  abreviatura: string;
}


export interface IResoluciones {
  grado: number
  anio: number
  asunto: string
  cedula: string
  pais: number
  reserva: number
  solicitud: number
  tipo: number
  unidad: number
  comando: string
  comision_fin: string
  comision_inicio: string
  creador: string
  destino: string
  dia: number
  distribucion: string
  estatus: number
  modificado: string
  fecha_termino: string
  falta: string
  registro: string
  fecha_resolucion: string
  formato: string
  ultimo_ascenso: string
  instrucciones: string
  mes: number
  autor_modificar: string
  motivo: string
  numero: string
  observacion: string
  orden_merito: number
  otro_resuelto: string
  autor_registro: string
  termino: number
  documento: number
  causa: number
  unidad_texto: string
}


export interface IDatosBasicos {
  area: string
  cedula: string
  categoria: number
  clasificacion: number
  componente: number
  grado: number
  profesion: string
  profesionx: string
  reserva: number
  solicitud: number
  tipo: number
  condicion: number
  especialidad: number
  estudios: string
  nacimiento: string
  promocion: string
  fecha_resuelto: string
  ncomponente: number
  ngrado: number
  nombre: string
  observacion: string
  sexo: string
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
        break
      case 2:
        this.xAPI.funcion = 'MPPD_CGrado'
        break
      case 3:
        this.xAPI.funcion = 'MPPD_CTipoResolucion'
        break
      case 4:
        this.xAPI.funcion = 'MPPD_CCategorias'
        break
      case 5:
        this.xAPI.funcion = 'MPPD_CClasificacion'
        break
      case 6:
        this.xAPI.funcion = 'MPPD_CEstadoResolucion'
        break
      case 7:
        this.xAPI.funcion = 'MPPD_COrdenEntrada'
        break
      case 8:
        this.xAPI.funcion = 'MPPD_CCarpetaEntrada'
        break
      case 9:
        this.xAPI.funcion = 'CEP_CUsuario'
        break
      case 10:
        this.xAPI.funcion = 'MD_CConfiguracion'
        this.xAPI.parametros = '%'
        break
      case 11:
        this.xAPI.funcion = 'MPPD_CGradoIPSFA'
        break
      default:
        this.xAPI.funcion = 'MPPD_CTipoEntrada'
        break
    }

    const funcion = this.xAPI.funcion
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (tipo == 9) {
          if (sessionStorage.getItem(funcion) == undefined) sessionStorage.setItem(funcion, btoa(JSON.stringify(data)))
          return
        }
        if (sessionStorage.getItem(funcion) == undefined) sessionStorage.setItem(funcion, btoa(JSON.stringify(data.Cuerpo)))

      }


    )
  }
}




