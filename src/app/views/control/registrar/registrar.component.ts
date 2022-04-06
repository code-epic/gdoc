import { Component, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  @ViewChild('fileUpload1')
  
  private fileUpload1:  AngularFileUploaderComponent;

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
  
  public cmbDestino = 0

  public htmlContenido = ''

  public bzRegistrados = []
  
  public bzNotaEntregas = []

  public archivos = []

  public numControl : string = ''

  allComplete: boolean = false;

  afuConfig = {
    
  };
  public strRuta : string = ''
  
  constructor(private apiService: ApiService, 
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService, 
    private loginService : LoginService,
    private modalService: NgbModal) { 
    
     // customize default values of modals used by this component tree
     config.backdrop = 'static';
     config.keyboard = false;
     this.strRuta = environment.Url + environment.API
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


  open(content, id) {
    this.numControl = id
    this.modalService.open(content);

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
          console.log (e)
          var existe  = e.anom == ''?true:false
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

   
  clasificarBuzon(){
      var lstBz = this.bzRegistrados
      var usuario = `'Sistema'`
      var llave = `''`
      var i = 0
      var estatus = 2 //NOTA DE ENTREGA
      this.xAPI.funcion = 'WKF_AUbicacion'
      this.xAPI.valores = ''
      
      if(this.cmbDestino == 0) {
        this.toastrService.error('Debe seleccionar un concepto',`GDoc Wkf.Ubicacion`);
        return
      }
      lstBz.forEach(e => {
        i++
        if (e.completed == true){
          this.xAPI.parametros = `${this.cmbDestino},${estatus},${llave},${usuario},${e.id}` 
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (data)=>{
             
              this.actualizarBzRegistrados(e.numc, 0)
            },
            (errot)=>{
              this.toastrService.error(errot,`GDoc Wkf.Estatus`);
            }) //
          
        }
      });
  }

  actualizarBzRegistrados(codigo, tipo){
    var posicion = 0
    var i = 0
    this.bzRegistrados.forEach(e => {
      if (e.numc == codigo){
        posicion = i
        return
      }
      i++
    })
    if (tipo == 0){
      this.bzRegistrados.splice(posicion, 1)
    }else{
      this.bzRegistrados[posicion].existe = false
    }
  }


  

  ConsultarCtrl(id: string){
    
    this.xAPI.funcion = 'WKF_CClasificados'
    this.xAPI.valores = ''
    this.xAPI.parametros = id

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data)=>{        
        var i = 0
        var htmlContenido = `<table class="table" style="width:100%">
          <thead class="thead-light">
            <th>#</th>
            <th>N-Control</th>
            <th>N-Origen</th>
            <th>Fecha</th>
            <th>Remitente</th>
          </thead><tbody>`     
        data.Cuerpo.forEach(e => {
          var remitente = e.remi + e.udep 
          htmlContenido += `<tr>
          <td>${++i}</td>
          <td>${e.numc }</td>
          <td>${e.nori }</td>
          <td>${e.fcre.substring(0,10) }</td>
          <td>${ remitente.toUpperCase() }</td>
          </tr>`
        })
        htmlContenido += `</tbody></table>`
        this.htmlContenido = htmlContenido

      },
      (errot)=>{
        this.toastrService.error(errot,`GDoc Wkf.Estatus`);
      }) //

  }
  
  imprimir(id : string){

  }


  fileSelected(e){
    this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e){
    
    var frm = new FormData( document.forms.namedItem("forma") )
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
          this.xAPI.parametros = this.archivos[0].name + ',' + this.loginService.Usuario.id+ ','  + this.numControl  
          this.xAPI.valores = ''
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              console.log(xdata)
              if (xdata.tipo == 1){
                this.toastrService.success(
                  'Tu archivo ha sido cargado con exito ',
                  `GDoc Registro`
                );
                this.actualizarBzRegistrados(this.numControl, 1)
              }else{
                this.toastrService.error(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
              }
            },
            (error) => {
              this.toastrService.error(error,`GDoc Wkf.Documento.Adjunto`);
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
    }

  }

}
