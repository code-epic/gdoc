import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { LoginService } from "src/app/services/seguridad/login.service";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private _login: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string = sessionStorage.getItem("token")

    if (sessionStorage.getItem("recovery") != undefined)
      token = sessionStorage.getItem("recovery")

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(err);
        if (token) {
          switch (err.status) {
            case 401:
              this.cerrar('Credenciales Invalidas')
              break;
            case 403: // Evaluacion de ha expirado
             // this.cerrar('Su sesión ha expirado')
              break;
            case 404: // Evaluacion de ha expirado
              this.cerrar('Sandra server no se encuentra disponible')
              break;
            case 504:
              this.cerrar('Sandra Server no responde, verifique su conexión')
            default:
              break;
          }
        }
        return throwError(() => err);
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
