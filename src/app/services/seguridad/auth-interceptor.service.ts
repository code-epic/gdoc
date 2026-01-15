import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { from, Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import Swal from "sweetalert2";
import { LoginService } from "src/app/services/seguridad/login.service";
import { Sha256Service } from "../util/sha256";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {

  private SECRET_KEY = environment.Hash


  constructor(private _login: LoginService, private sha256: Sha256Service) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.has('X-Skip-Interceptor')) {
      const cleanReq = req.clone({
        headers: req.headers.delete('X-Skip-Interceptor')
      });
      return next.handle(cleanReq); 
    }
    

    if (!req.body || req.method === 'GET') {
      return this.procesarPeticion(req, next);
    }
    let token: string = sessionStorage.getItem("token")

    if (sessionStorage.getItem("recovery") != undefined)
      token = sessionStorage.getItem("recovery")

    const timestamp = new Date().getTime().toString();
    const payload = JSON.stringify(req.body) + timestamp;
    return from(this.sha256.hmac(payload, this.SECRET_KEY)).pipe(
      switchMap(signature => {
        const secureReq = req.clone({
          setHeaders: {
            'authorization': `Bearer ${token}`,
            'Web-API-key': this.SECRET_KEY,
            'X-Signature': signature,
            'X-Timestamp': timestamp
          }
        });

        return this.procesarPeticion(secureReq, next);
      })
    );

  }




  // Factorizamos el manejo de errores para mantener el código limpio
  private procesarPeticion(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 401:
            this.cerrar(err.error.msj || 'Sesión expirada');
            break;
          case 402:
            // this.cerrar('Pago requerido');
            break;
          case 403:
            if (!err.error.msj) {
              this.cerrar('Acceso denegado');
            } else {
              console.error('Error 403:', err);
            }

            break;
          case 504:
            this.cerrar('Error de conexión con el servidor');
            break;
        }
        return throwError(err);
      })
    );
  }





  cerrar(msj: string) {
    Swal.fire({
      title: "Alerta",
      text: msj,
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Gracias por su tiempo",
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this._login.logout();
      }
    });
  }
}



// let token: string = sessionStorage.getItem("token")

// if (sessionStorage.getItem("recovery") != undefined)
//   token = sessionStorage.getItem("recovery")

// let request = req;

// if (token) {
//   request = req.clone({
//     setHeaders: {
//       authorization: `Bearer ${token}`,
//     },
//   });
// }

// return next.handle(request).pipe(
//   catchError((err: HttpErrorResponse) => {
//     // console.log(err);
//     if (token) {
//       switch (err.status) {
//         case 401:
//           this.cerrar('Credenciales Invalidas')
//           break;
//         case 403: // Evaluacion de ha expirado
//          // this.cerrar('Su sesión ha expirado')
//           break;
//         case 404: // Evaluacion de ha expirado
//           this.cerrar('Sandra server no se encuentra disponible')
//           break;
//         case 504:
//           this.cerrar('Sandra Server no responde, verifique su conexión')
//         default:
//           break;
//       }
//     }
//     return throwError(() => err);
//   })
// );