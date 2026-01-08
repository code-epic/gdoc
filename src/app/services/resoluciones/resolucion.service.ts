import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from '../apicore/api.service';
import { environment } from 'src/environments/environment';

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
  archivo: string
}

export interface IEntradas {
  id : string
  cedula : string
  asunto : string
  acto : number
  carpeta : number
  componente : number
  tipo_entrada : number 
  cuenta : string
  digital : string
  ecomponente: number
  egrado : number
  estatus : number
  archivo : string
  formato : string
  llave: string
  numero_carpeta : string
  numero_resol : string
  observacion : string
  registrado : string
  modificado: string
  responsable : string
  fecha_entrada : string
  fecha_resolucion : string
  detalle : string
  accion : number
}


// export interface IDatosBasicos {
//   area: string
//   cedula: string 
//   categoria: number
//   clasificacion: number
//   componente: number
//   grado: number
//   profesion: string
//   profesionx: string
//   reserva: number
//   solicitud: number
//   tipo: number
//   condicion: number
//   especialidad: string
//   estudios: string
//   nacimiento: string
//   promocion: string
//   fecha_resuelto: string
//   ncomponente: number
//   ngrado: number
//   nombre: string
//   observacion: string
//   sexo: string
// }
export interface IDatosBasicos {
  cedula: string
  nombres: string
  categoria: number
  grado: number
  componente: number
  clasificacion: number
  resolucion: number
  solicitud: number
  reserva: number
  fecha: string
  promocion: string
  sexo: string
  profesion: string
  profesionx: string
  nacimiento: string
  orden: number
  n_grado: number
  n_componente: number
  especialidad: string
  area: string
  estudios: string
  motivo: string
  observacion: string
  condicion: number
  anio: number
  mes: number
  dia: number
  ultimo_ascenso: string
  situacion: string
  telefono: string
  correo: string
  ubicacion: string
  cargo: string
  estadomayor: string
  merito : string
  direccion: string
  estatura: string
  estado_civil: string

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
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.COMPONENTE_CONSULTAR
        break
      case 2:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.GRADO_CONSULTAR
        break
      case 3:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.TIPO_RESOLUCION_CONSULTAR
        break
      case 4:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.CATEGORIAS_CONSULTAR
        break
      case 5:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.CLASIFICACION_CONSULTAR
        break
      case 6:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.ESTADO_RESOLUCION_CONSULTAR
        break
      case 7:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.ORDEN_ENTRADA_CONSULTAR
        break
      case 8:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.CARPETA_ENTRADA_CONSULTAR
        break
      case 9:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = 'CEP_CUsuario'
        break
      case 10:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = 'MD_CConfiguracion'
        this.xAPI.parametros = '%'
        break
      case 11:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.GRADO_IPSFA_CONSULTAR
        break
      case 12:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.CARPETAS_CONSULTAR
        break
      case 13: 
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.CARPETA_ENTRADA_CONSULTAR
        break
      default:
        this.xAPI = {} as IAPICore
        this.xAPI.funcion = environment.funcion.TIPO_ENTRADA_CONSULTAR
        break
    }

    const funcion = this.xAPI.funcion
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (sessionStorage.getItem(funcion) == undefined) sessionStorage.setItem(funcion, btoa(JSON.stringify(data.Cuerpo)))

      }


    )
  }
}




