import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { Md5 } from 'md5-typescript';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  public token
  public helper = new JwtHelperService();


  constructor(private router: Router) {

    this.token = this.helper.decodeToken(sessionStorage.getItem('token'))
  }


  sessionError() {
    sessionStorage.clear();
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    try {
      const IDAPP = this.token.Usuario.Aplicacion[0].id
      if (this.token !== undefined && IDAPP == environment.ID) {
        let menu = JSON.parse(sessionStorage.getItem('menu'))
        let texto = Md5.init(menu)
        let validar = sessionStorage.getItem('crypt')
        if (texto == validar) {
          let valor = false
          const whitelistedUrls = ['/principal', '/dashboard', '/Principal', '/options/upgrade'];
          if (whitelistedUrls.includes(state.url)) {
            return true;
          }
          menu.forEach(e => {
            e.SubMenu.forEach(xe => {
              if (state.url.indexOf(xe.url) == 0 && xe.url != '') return valor = true
            });
            if (state.url.indexOf(e.url) == 0 && e.url != '') return valor = true
          })
          if (!valor) {
            this.router.navigate(["/error"])
          }
          return valor
        } else {
          return false
        }
      } else {
        this.router.navigate(["/error"])
        return false;
      }
    } catch (error) {
      this.sessionError();
      return false;
    }




  }


  msj() {
    Swal.fire({
      title: 'Área restringida',
      text: 'No poseé autorización',
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
      allowEscapeKey: true,
    }).then((result) => {
      //
    })
  }



}