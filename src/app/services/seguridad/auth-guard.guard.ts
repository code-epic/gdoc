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
  state: RouterStateSnapshot
): boolean {
  try {
    const usuario = this.token.Usuario;
    const IDAPP = usuario?.Aplicacion[0]?.id;

    // 1. Validación de Seguridad Básica
    if (!usuario || IDAPP !== environment.ID) {
      this.router.navigate(["/error"]);
      return false;
    }

    // 2. Validación de Integridad (MD5)
    const menuRaw = sessionStorage.getItem('menu');
    const hashValidar = sessionStorage.getItem('crypt');
    
    if (!menuRaw || Md5.init(menuRaw) !== hashValidar) {
      this.sessionError();
      return false;
    }

    const menu = JSON.parse(menuRaw);
    const currentUrl = state.url;

    // 3. Definición de Lista Blanca (Hardcoded + Patrones dinámicos)
    const staticWhitelist = ['/mreportes','/pendientes', '/configuracion', '/graedicion', '/ctrlalertas','/datosbasicos', '/principal', '/dashboard', '/options/upgrade', '/error', '/constancia', '/documento', '/ministerial', '/notaentrega'];
    
    // Verificamos si la ruta actual coincide exactamente o empieza con un patrón permitido
    const isWhitelisted = staticWhitelist.some(path => currentUrl.startsWith(path));
    if (isWhitelisted) return true;

    // 4. Extracción y validación contra el Menú dinámico
    const allowedUrls = this.extractUrlsFromMenu(menu);

    // Validación: ¿La URL actual está en las permitidas o es hija de una permitida?
    const hasAccess = allowedUrls.has(currentUrl) || 
                      Array.from(allowedUrls).some(url => url !== '' && currentUrl.startsWith(url));

    if (!hasAccess) {
      this.router.navigate(["/error"]);
      return false;
    }

    return true;

  } catch (error) {
    this.sessionError();
    return false;
  }
}

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  //   try {
  //     const IDAPP = this.token.Usuario.Aplicacion[0].id
  //     if (this.token !== undefined && IDAPP == environment.ID) {
  //       let menu = JSON.parse(sessionStorage.getItem('menu'))
  //       let texto = Md5.init(menu)
  //       let validar = sessionStorage.getItem('crypt')
  //       if (texto == validar) {
  //         let valor = false
  //         const whitelistedUrls = ['/principal', '/dashboard', '/Principal', '/options/upgrade'];
  //         if (whitelistedUrls.includes(state.url)) {
  //           return true;
  //         }
  //         menu.forEach(e => {
  //           e.SubMenu.forEach(xe => {
  //             if (state.url.indexOf(xe.url) == 0 && xe.url != '') return valor = true
  //           });
  //           if (state.url.indexOf(e.url) == 0 && e.url != '') return valor = true
  //         })
  //         if (!valor) {
  //           this.router.navigate(["/error"])
  //         }
  //         return valor
  //       } else {
  //         return false
  //       }
  //     } else {
  //       this.router.navigate(["/error"])
  //       return false;
  //     }
  //   } catch (error) {
  //     this.sessionError();
  //     return false;
  //   }




  // }


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



  /**
 * Aplana el menú y submenús en un Set para búsquedas rápidas
 */
  private extractUrlsFromMenu(menu: any[]): Set<string> {
    const urls = new Set<string>();

    menu.forEach(item => {
      if (item.url) urls.add(item.url);

      if (item.SubMenu && item.SubMenu.length > 0) {
        item.SubMenu.forEach(sub => {
          if (sub.url) urls.add(sub.url);
        });
      }
    });

    return urls;
  }


}