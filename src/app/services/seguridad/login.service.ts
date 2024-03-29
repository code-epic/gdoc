import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

export interface IUsuario{
  nombre : string,
  cedula : string,
  tipo : string,
  componente : string,
  clave : string,
  correo : string,
}

export interface IToken{
  token : string,
}

export interface UClave{
  login: string,
  clave : string,
  nueva: string,
  repetir: string,
  correo : string,
}

@Injectable({
  providedIn: 'root'
})



export class LoginService {
 
  public URL : string =  environment.API
  
  public Id : string = ''
  
  public SToken : any

  public Token : any

  public Usuario : any

  public Aplicacion : any

  constructor(private router: Router, private http : HttpClient) {
    this.Id = environment.ID
    if (sessionStorage.getItem("token") != undefined ) this.SToken = sessionStorage.getItem("token");
  }

  async Iniciar() {
    await this.getUserDecrypt()
    this.obenterAplicacion()
    
  }
  getLogin(user: string, clave : string) : Observable<IToken>{
    var usuario = {
      "nombre" : user,
      "clave" : clave,
    }
    var url = this.URL + 'wusuario/login'
    return this.http.post<IToken>(url, usuario )
  }
  
  makeUser(user: IUsuario): Observable<any>{    
    var url = this.URL + 'identicacion'   
    return this.http.post<any>( url, user )
  }

  logout(){
    this.router.navigate(['login']);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
  }

  protected getUserDecrypt() : any {    
    var token = sessionStorage.getItem("token");
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.Token = decodedToken
    this.Usuario = this.Token.Usuario
    
    return this.Token
  }
  
  //ObenterAplicacion 
  protected obenterAplicacion(){
    var Aplicacion = this.Token.Usuario.Aplicacion
    Aplicacion.forEach(e => {
      if(e.id == this.Id ){
        this.Aplicacion = e;
      }
    });
  }
  
  obtenerMenu() : any {
    return this.Aplicacion.Rol.Menu
  }

  obtenerPrivilegiosMenu(idUrl : string) : any {
    var App = this.Aplicacion
    var Menu: any
    App.Rol.Menu.forEach(e => {if (e.url == idUrl) Menu = e});
    return Menu
    
  }

  obtenerSubMenu(idUrl : string) : any{   
    var App = this.Aplicacion
    var SubMenu = [] 
    App.Rol.Menu.forEach(e => {if (e.url == idUrl) SubMenu = e.SubMenu});
    return SubMenu
  }

}
