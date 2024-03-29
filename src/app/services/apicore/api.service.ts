import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



export interface IAPICore{
  id            ?:  string
  concurrencia  ?:  boolean
  ruta          ?:  string
  funcion       ?:  string
  parametros    ?:  string
  protocolo     ?:  string
  retorna       ?:  boolean
  migrar        ?:  false
  modulo        ?:  string
  relacional    ?:  boolean
  valores       ?:  any
  coleccion     ?:  string
  version       ?:  string
  http          ?:  number
  https         ?:  number
  consumidores  ?:  string
  puertohttp    ?:  number
  puertohttps   ?:  number
  driver        ?:  string
  query         ?:  string
  metodo        ?:  string
  tipo          ?:  string
  prioridad     ?:  string
  logs          ?:  boolean
  descripcion   ?:  string
  entorno       ?:  string
  cache         ?:  number
  estatus       ?:  boolean
}


export interface ceDocumento {
  id ?: string //Id del documento
  nomb ?: string //Nombre
  obse ?: string
  tipo ?: string
  esta ?: string
  usua ?: string
}


export interface DocumentoAdjunto {
	archivo	 ?:	string //CodeEncrypt
	usuario	 ?:	string
	documento	 ?:	string
}


export interface WTipoArchivo {
  ruta	 ?:	string
	archivo	 ?:	string //CodeEncrypt
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
   //Dirección Get para servicios en la página WEB
   URL =  environment.API

   hash = environment.Hash

   httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionStorage.getItem('token') })
  };

  constructor( private http : HttpClient) {
    
  }

  
  //Ejecutar Api generales
  Ejecutar(xAPI : IAPICore) : Observable<any>{
    // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
    var url = this.URL + "crud" + this.hash
    //console.info( JSON.stringify(xAPI ))
    return this.http.post<any>(url, xAPI, this.httpOptions);
  }

   //EnviarArchivos generales
   EnviarArchivos(frm : FormData ) : Observable<any>{
    var httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('token') 
      })
    };
    return this.http.post<any>(this.URL + "subirarchivos", frm, httpOptions);
  }

  Dws( peticion : string ) : string {
    return this.URL + 'dw/' + peticion
  }

  DwsResol(peticion : string){
    let ruta = this.URL + 'dws/' + peticion
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


  DwsCdn(peticion : string){
    let ruta = this.URL + 'dwscdn/' + peticion
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


  getDwsCdn(tpf : WTipoArchivo) : Observable<any> {
    let ruta = this.URL + 'dwscdn'

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }),
      responseType: 'blob' as 'json'
    };
    
    return this.http.post<any>(ruta,  tpf, httpOptions)
  }


    //Ejecutar Api generales
    EjecutarProceso(xInterface) : Observable<any>{
      // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
      var url = this.URL + "pascensos"
      //console.info( JSON.stringify(xAPI ))
      return this.http.post<any>(url, xInterface, this.httpOptions);
    }
    //Ejecutar Api generales
    EjecutarIngreso(xInterface) : Observable<any>{
      // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
      var url = this.URL + "pingresos"
      //console.info( JSON.stringify(xAPI ))
      return this.http.post<any>(url, xInterface, this.httpOptions);
    }

    EjecutarLotes(xInterface) : Observable<any>{
      // return this.http.post<any>(this.URL + "crud" + this.hash, xAPI, this.httpOptions);
      var url = this.URL + "plotes"
      //console.info( JSON.stringify(xAPI ))
      return this.http.post<any>(url, xInterface, this.httpOptions);
    }
}
