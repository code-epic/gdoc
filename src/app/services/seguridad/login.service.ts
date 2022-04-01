import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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
 
  URL =  environment.API

  constructor(private router: Router, private http : HttpClient) {
   
    
    
  }

  getLogin(user: string, clave : string) : Observable<IToken>{
    var usuario = {
      "nombre" : user,
      "clave" : clave,
    }
    var url = this.URL + 'wusuario/login'
    console.log(url)
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

  getUserDecrypt(){
    var e = sessionStorage.getItem("token");
    var s = e.split(".");
    return JSON.parse(atob(s[1]));
  }
}
