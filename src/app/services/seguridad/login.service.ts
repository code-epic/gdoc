import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



export interface ILogin{
  nombre : string,
  clave : string
}

export interface IToken{
  token : string,
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlGet = '';
  constructor(private http: HttpClient) { 
    this.urlGet = environment.Url;

  }


  conectar( login : ILogin) : Observable<IToken>{
    var url = this.urlGet + 'wusuario/login';
    return this.http.post<IToken>(url, login)
  }


}
