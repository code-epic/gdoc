import { Component, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';

import {ThemePalette} from '@angular/material/core';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

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
  };

  selNav = 0
  oficinas = []
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  editor: Editor = new Editor;

  public estilocheck  = 'none'
  public estiloclasificar = 'none'

  public bzRegistrados = []
  public bzNotaEntregas = []

  allComplete: boolean = false;

  
  constructor(private apiService: ApiService, config: NgbModalConfig, private modalService: NgbModal) { 

     // customize default values of modals used by this component tree
     config.backdrop = 'static';
     config.keyboard = false;
  }


  ngOnInit(): void {
    this.editor = new Editor();
   
    
    this.listarEstados()
    this.listarBuzon(0)
    
  }

  updateAllComplete() {
    this.allComplete = this.bzRegistrados != null && this.bzRegistrados.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.bzRegistrados == null) {
      return false;
    }
    return this.bzRegistrados.filter(t => t.completed).length > 0 && !this.allComplete;
    
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.bzRegistrados == null) {
      return;
    }
    
    this.bzRegistrados.forEach(t => (t.completed = completed));
    if ( completed == false) {
      this.estiloclasificar = 'none'
    }else{
      this.estiloclasificar = ''
    }
  }


  open(content) {
    this.modalService.open(content);
    
  }

  
  

  listarEstados(){
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '' 
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
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
          var existe  = e.anom != ''?true:false
          this.bzRegistrados.push(
            { 
              id : e.id,
              numc : e.numc, 
              completed : false, 
              color: 'warn',
              tdoc : e.tdoc,
              fcre : e.fcre,
              remi : e.remi,
              anom : e.anom,
              existe : existe
            }
          ) 
          
        })//Registros recorridos como elementos
        console.info(this.bzRegistrados)
        
        this.lengthOfi = data.Cuerpo.length
        if (this.lengthOfi > 0) {
          this.estilocheck = ''
          this.recorrerElementos(1, this.bzRegistrados)
        }

      },
      (error) => {

      }
    )
  }

  
  pageChangeEvent(e){
    this.recorrerElementos(e.pageIndex+1, this.lst)
  }


  seleccionNavegacion(){
    console.log(this.selNav)
    switch (this.selNav) {
      case 0:
        this.xAPI.funcion = 'WKF_CDocumentos'
        this.xAPI.parametros = '1,1' 
        this.xAPI.valores = ''
        break;
      case 1:
        this.xAPI.funcion = 'WKF_CDocumentos'
        this.xAPI.parametros = '1,2' 
        this.xAPI.valores = ''
        break;
      default:
        break;
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(posicion : number, lista : any){
    if (posicion > 1) posicion = posicion * 10
    this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)
    
  }

  //editar
  editar(id: string){

  }
  
  //adjuntar
  adjuntar(id: string){

  }

  //eliminar
  eliminar(id: string){

  }

  obtenerClasificacion(){
    this.bzRegistrados.forEach(e => {
      // console.log( `Contenido, ${e.id}, estatus: ${e.completed}`)
      if (e.completed == true){
        
      }
    });
  }

  imprimir(id : string){

  }

}

