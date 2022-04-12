import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';


@Component({
  selector: 'app-buzon',
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent implements OnInit {

  public paginador = 10
  public focus;
  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia : false,
    protocolo: '',
    ruta : '',
    version: '',
    retorna : false,
    migrar : false,
    http : 0,
    https : 0,
    consumidores : '',
    puertohttp : 0,
    puertohttps : 0,
    driver : '',
    query : '',
    metodo : '',
    tipo : '',
    prioridad : '',
    entorno: '',
    logs : false,
    cache: 0,
    estatus: false
  }
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

  public bzRecibido = []

  public estilocheck  = 'none'
  
  public estiloclasificar = 'none'

  public allComplete: boolean = false

  constructor(
    private apiService: ApiService, 
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService, 
    private loginService : LoginService,
    private modalService: NgbModal){
     // customize default values of modals used by this component tree
     config.backdrop = 'static';
     config.keyboard = false;

  }

  ngOnInit(): void {
    this.listarEstados()
    this.listarBuzon(0)
  
  }


  open(content) {
    this.modalService.open(content);
    
  }


  seleccionNavegacion(){
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    
    switch (this.selNav) {
      case 0:
        this.xAPI.parametros = '2,1' 
        break
      case 1:
        this.xAPI.parametros = '2,2' 
        break
      case 2:
        this.xAPI.parametros = '2,3' 
        break
      case 4:
        this.xAPI.parametros = '2,2' 
        break
      default:
        break
    }
  }

  listarEstados(){
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '' 
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          if (e.esta == 1)this.lstEstados.push(e)
        });
      },
      (error) => {

      }
    )
  }

  listarBuzon(e){
    this.selNav = e
    this.seleccionNavegacion()
   
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
        data.Cuerpo.forEach(e => {
          
          var existe  = e.anom == ''?true:false
          var privado  = e.priv == 1?true:false
          console.log(privado)
          this.bzRecibido.push(
            { 
              id : e.id,
              numc : e.numc, 
              completed : false, 
              color: 'warn',
              nori : e.nori,
              tdoc : e.tdoc,
              fcre : e.fcre,
              remi : e.remi,
              udep : e.udep,
              anom : e.anom,
              priv : privado,
              existe : existe
            }
          ) 
          
        })//Registros recorridos como elementos
        
        this.lengthOfi = data.Cuerpo.length
        if (this.lengthOfi > 0) {
          this.estilocheck = ''
          this.recorrerElementos(1, this.bzRecibido)
        }

      },
      (error) => {

      }
    )
  }

  
  pageChangeEvent(e){
    this.recorrerElementos(e.pageIndex+1, this.lst)
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.bzRecibido == null) {
      return;
    }
    
    this.bzRecibido.forEach(t => (t.completed = completed));
    if ( completed == false) {
      this.estiloclasificar = 'none'
    }else{
      this.estiloclasificar = ''
    }
  }

  someComplete(): boolean {
    if (this.bzRecibido == null) return false;
    return this.bzRecibido.filter(t => t.completed).length > 0 && !this.allComplete;
  }

 
  //recorrerElementos para paginar listados
  recorrerElementos(posicion : number, lista : any){
    if (posicion > 1) posicion = posicion * 10
    this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)
    
  }
  

}


