import { HttpClient, HttpHeaders, HttpEventType, HttpEvent, HttpResponse  } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';


import { map, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';



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
export class FileService {


httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) {

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
      return this.http.post<any>(environment.API + 'subirarchivos', frm, httpOptions as { // <--- Cast del objeto options
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
  


  
}
