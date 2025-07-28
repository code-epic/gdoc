import { HttpClient, HttpHeaders, HttpEventType, HttpEvent, HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


import { map, tap } from 'rxjs/operators'



export interface IAPICore {
  id?: string
  concurrencia?: boolean
  ruta?: string
  funcion?: string
  parametros?: string
  protocolo?: string
  retorna?: boolean
  migrar?: false
  modulo?: string
  relacional?: boolean
  valores?: any
  coleccion?: string
  version?: string
  http?: number
  https?: number
  consumidores?: string
  puertohttp?: number
  puertohttps?: number
  driver?: string
  query?: string
  metodo?: string
  tipo?: string
  prioridad?: string
  logs?: boolean
  descripcion?: string
  entorno?: string
  cache?: number
  estatus?: boolean
}


export interface ceDocumento {
  id?: string // Id del documento
  nomb?: string // Nombre
  obse?: string
  tipo?: string
  esta?: string
  usua?: string
}


export interface DocumentoAdjunto {
  archivo?: string // CodeEncrypt
  usuario?: string
  documento?: string
}

export interface WTipoArchivo {
  ruta?: string
  archivo?: string // CodeEncrypt
}

export interface DocumentoAdjunto {
  archivo?: string // CodeEncrypt
  usuario?: string
  documento?: string
}

export interface ProcessID {
  id: string,
  estatus: boolean,
  contenido?: string,
  mensaje?: string,
  segundos: string,
  rs?: any
}


// Define una interfaz para el tipo de datos que tu Observable de progreso devolverá
interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress: number;
  state: 'LOADING' | 'DONE' | 'IDLE'; // Estados posibles
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Dirección Get para servicios en la página WEB
  URL = environment.API

  // hash = environment.Hash

  public pID: ProcessID = {
    id: '',
    estatus: false,
    mensaje: '',
    segundos: '',
    contenido: ''
  }

  public Xmeses = [
    {'id': 0, 'mes' : 'ENERO', 'desde':'01-01 00:00:00', 'hasta': '01-31 23:59:59'},
    {'id': 1, 'mes' : 'FEBRERO', 'desde':'02-01 00:00:00', 'hasta': '02-28 23:59:59'},
    {'id': 2, 'mes' : 'MARZO', 'desde':'03-01 00:00:00', 'hasta': '03-31 23:59:59'},
    {'id': 3, 'mes' : 'ABRIL', 'desde':'04-01 00:00:00', 'hasta': '04-30 23:59:59'},
    {'id': 4, 'mes' : 'MAYO', 'desde':'05-01 00:00:00', 'hasta': '05-31 23:59:59'},
    {'id': 5, 'mes' : 'JUNIO', 'desde':'06-01 00:00:00', 'hasta': '06-30 23:59:59'},
    {'id': 6, 'mes' : 'JULIO', 'desde':'07-01 00:00:00', 'hasta': '07-31 23:59:59'},
    {'id': 7, 'mes' : 'AGOSTO', 'desde':'08-01 00:00:00', 'hasta': '08-31 23:59:59'},
    {'id': 8, 'mes' : 'SEPTIEMBRE', 'desde':'09-01 00:00:00', 'hasta': '10-01 23:59:59'},
    {'id': 9, 'mes' : 'OCTUBRE', 'desde':'10-01 00:00:00', 'hasta': '11-01 23:59:59'},
    {'id': 10, 'mes' : 'NOVIEMBRE', 'desde':'11-01 00:00:00', 'hasta': '12-01 23:59:59'},
    {'id': 11, 'mes' : 'DICIEMBRE', 'desde':'12-01 00:00:00', 'hasta': '12-31 23:59:59'},
  ]

  public Xyear = [
    {'id': 2024, 'year' : '2024'},
    {'id': 2025, 'year' : '2025'},
    {'id': 2026, 'year' : '2026'},
    {'id': 2027, 'year' : '2027'},
    {'id': 2028, 'year' : '2028'},
  ]

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) {

  }


  // Ejecutar Api generales
  Ejecutar(xAPI: IAPICore): Observable<any> {
    // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
    const url = this.URL + 'crud:' + environment.Hash
    // console.info( JSON.stringify(xAPI ))
    return this.http.post<any>(url, xAPI, this.httpOptions);
  }
  // Ejecutar Api generales
  ExecFnx(fnx: any): any {
    const url = this.URL + 'fnx';
    return this.http.post<any>(url, fnx, this.httpOptions);
  }

  //  Consulta el PID de una funcion
  GetFnxId(id: string): any {
    const url = this.URL + `fnx:${id}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  // EnviarArchivos generales
  EnviarArchivos(frm: FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      })
    };
    return this.http.post<any>(this.URL + 'subirarchivos', frm, httpOptions);
  }

  // EnviarArchivos generales
  EnviarArchivosProgress(frm: FormData):  Observable<{loaded: number, total: number, progress : number, state :  string}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      reportProgress: true, // ¡Importante! Habilita el reporte de progreso
      observe: 'events' // Observa todos los eventos, no solo la respuesta final
    };
    // return this.http.post<any>(this.URL + "subirarchivos", frm, httpOptions);
    return this.http.post<any>(this.URL + 'subirarchivos', frm, httpOptions as { // <--- Cast del objeto options
        headers?: HttpHeaders;
        observe: 'events'; // Necesitas esta línea para asegurarte que la sobrecarga con 'events' sea elegida
        reportProgress: boolean; // Y esta para la sobrecarga de progreso
      }).pipe(
      map((event: HttpEvent<any>): UploadProgressEvent => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * (event.loaded / event.total));
            return { loaded: event.loaded, total: event.total, progress: progress, state: 'LOADING' };

          case HttpEventType.Response:
            const httpResponse = event as HttpResponse<any>;
            return {
              loaded: httpResponse.body ? httpResponse.body.byteLength : 0, // Si quieres el tamaño del cuerpo de la respuesta
              total: httpResponse.body ? httpResponse.body.byteLength : 0, // Similar para el total de la respuesta
              progress: 100,
              state: 'DONE'
            };

          default:
            return { loaded: 0, total: 0, progress: 0, state: 'IDLE' };
        }
      }),
      tap(message => {

        // console.log(message)
      }
      ) // Puedes quitar esto en producción
    );
  }

    // EnviarArchivos dinamicos
    EnviarArchivosDinamicos(frm: FormData): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        })
      };
      return this.http.post<any>(this.URL + 'subirarchivos', frm, httpOptions);
    }

  //  Consulta el PID de una funcion
  ExecFnxId(id: string): any {
    const url = this.URL + `fnx:${id}`
    return this.http.get<any>(url, this.httpOptions)
  }

  // Consulta el Pid recursivamente
  ConsultarPidRecursivo(id: string, paquete: any, uuid: string) {

    this.ExecFnxId(id).subscribe(
      (data) => {
        setTimeout(() => {

          if (data.documento == 'PROCESADO') {
            console.log(data)
            this.pID.id = id
            this.pID.estatus = false
            this.pID.contenido = paquete
            this.pID.mensaje = uuid
            // this.ws.contenido$.emit(this.pID)

          } else {
            this.ConsultarPidRecursivo(id, paquete, uuid)
          }
        }, 10000)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  Dws(peticion: string): string {
    return this.URL + 'dw/' + peticion
  }

  DwsImg(peticion: string) {
    const ruta = this.URL + 'dwsimg/' + peticion
    // console.log(ruta)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };

    this.http.get(ruta, httpOptions).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  DwsImgSource(peticion: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const ruta = this.URL + 'dwsimg/' + peticion;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }),
            responseType: 'blob' as 'json'
        };

        this.http.get(ruta, httpOptions).subscribe(
            (response: any) => {
              const blob = new Blob([response], { type: 'image/png' });
              const url = window.URL.createObjectURL(blob);
              resolve(url); // Resolvemos la promesa con la URL de la imagen
            },
            (error) => {
              reject(error);
            }
        );
    });
  }

  DwsResol(peticion: string) {
    const ruta = this.URL + 'dws/' + peticion
    // console.log(ruta)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };

    this.http.get(ruta, httpOptions).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  DwsResolDigital(peticion: string) {
    const ruta = this.URL + 'dws/' + peticion
    console.log(ruta)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };

    this.http.get(ruta, httpOptions).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }


  DwsCdn(peticion: string) {
    const ruta = this.URL + 'dwscdn/' + peticion
    console.log(ruta)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };

    this.http.get(ruta, httpOptions).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }




  getDwsCdn(tpf: WTipoArchivo): Observable<any> {
    const ruta = this.URL + 'dwscdn'

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };

    return this.http.post<any>(ruta, tpf, httpOptions)
  }


  // Ejecutar Api generales
  EjecutarProceso(xInterface): Observable<any> {
    // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
    const url = this.URL + 'pascensos'
    // console.info( JSON.stringify(xAPI ))
    return this.http.post<any>(url, xInterface, this.httpOptions);
  }
  // Ejecutar Api generales
  EjecutarIngreso(xInterface): Observable<any> {
    // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
    const url = this.URL + 'pingresos'
    // console.info( JSON.stringify(xAPI ))
    return this.http.post<any>(url, xInterface, this.httpOptions);
  }

  EjecutarLotes(xInterface, accion : string = ''): Observable<any> {
    // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
    const url = this.URL + accion
    // console.info( JSON.stringify(xAPI ))
    return this.http.post<any>(url, xInterface, this.httpOptions);
  }


}
