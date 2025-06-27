import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-acami',
  templateUrl: './acami.component.html',
  styleUrls: ['./acami.component.scss']
})
export class AcamiComponent implements OnInit {

  
  public estadoActual = 7
  public estadoOrigen = 1

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia: false,
    protocolo: '',
    ruta: '',
    version: '',
    retorna: false,
    migrar: false,
    http: 0,
    https: 0,
    consumidores: '',
    puertohttp: 0,
    puertohttps: 0,
    driver: '',
    query: '',
    metodo: '',
    tipo: '',
    prioridad: '',
    entorno: '',
    logs: false,
    cache: 0,
    estatus: false
  }
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

  public bzOriginal = [] //Listado Original
  public bzRecibido = []
  public bzProcesados = []
  public bzPendientes = []
  public bzCerrados = []

  public estilocheck = 'none'

  public estiloclasificar = 'none'

  public allComplete: boolean = false

  public numControl = ''

  public Observacion = ''

  public AccionTexto: string = '0'

  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit(): void {
    this.listarEstados()
    this.seleccionNavegacion(0)

  }


  open(content, id) {
    this.numControl = id
    this.modalService.open(content);

  }


  seleccionNavegacion(e) {
    this.bzRecibido = []
    this.bzProcesados = []
    this.bzPendientes = []
    this.bzCerrados = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e
    this.pageSize = 10;

    switch (e) {
      case 0:
        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon(this.selNav)
        break
      case 1:
        this.xAPI.parametros =  this.estadoActual + ',' + 2
        this.listarBuzon(this.selNav)
        break
      case 2:
        this.xAPI.parametros =  this.estadoActual + ',' + 3
        this.listarBuzon(this.selNav)
        break
      case 4:
        this.xAPI.parametros =  this.estadoActual + ',' + 4
        this.listarBuzon(this.selNav)
        break
      default:
        break
    }

  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '%'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          if (e.esta == 1) this.lstEstados.push(e)
        });
      },
      (error) => {

      }
    )
  }

  async listarBuzon(lst: number) {
   var bz=[]
    this.ngxService.startLoader("loader-aceptar")
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        data.Cuerpo.forEach(e => {

          var existe = e.anom == '' ? true : false
          var privado = e.priv == 1 ? true : false
          console.log(privado)
          bz.push(
            {
              id: e.id,
              idd: e.idd,
              numc: e.numc,
              completed: false,
              color: 'warn',
              nori: e.nori,
              tdoc: e.tdoc,
              fcre: e.fcre,
              remi: e.remi,
              udep: e.udep,
              anom: e.anom,
              priv: privado,
              existe: existe
            }
          )

        })//Registros recorridos como elementos

        this.lengthOfi = data.Cuerpo.length
        if (this.lengthOfi > 0) {
          this.estilocheck = ''
          this.bzOriginal = bz
          this.recorrerElementos(0,lst)
        }
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {

      }
    )
  }


  pageChangeEvent(e,sel) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex,sel)
  }

  updateAllComplete() {
    this.allComplete = this.bzRecibido != null && this.bzRecibido.every(t => t.completed);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.bzRecibido == null) {
      return;
    }

    this.bzRecibido.forEach(t => (t.completed = completed));
    if (completed == false) {
      this.estiloclasificar = 'none'
    } else {
      this.estiloclasificar = ''
    }
  }

  someComplete(): boolean {
    if (this.bzRecibido == null) return false;
    return this.bzRecibido.filter(t => t.completed).length > 0 && !this.allComplete;
  }


  //recorrerElementos para paginar listados
  recorrerElementos(posicion: number,sel: number) {
    let pag = this.pageSize * posicion
    switch (sel) {
      case 0:
        this.bzRecibido= this.bzOriginal.slice(pag, pag + this.pageSize)
        break
      case 1:
        this.bzProcesados= this.bzOriginal.slice(pag, pag + this.pageSize)
        break
      case 2:
        this.bzPendientes= this.bzOriginal.slice(pag, pag + this.pageSize)
        break
      default:
        break
    }  
  }


  //editar
  editar(id: string) {
    const estado = this.estadoActual
    const estatus = this.selNav + 1 
    const base = btoa(estado + ',' + estatus + ',' + id)
    this.ruta.navigate(['/documento', base])
  }

  insertarObservacion() {
    var usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_IDocumentoObservacion'
    this.xAPI.valores = JSON.stringify(
      {
        "documento": this.numControl,
        "estado": this.estadoActual, //Estado que ocupa
        "estatus": this.selNav + 1,
        "observacion": this.Observacion.toUpperCase(),
        "accion": this.AccionTexto,
        "usuario": usuario
      }
    )
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'Se ha promovido el documento',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.promoverBuzon()


      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }

  async promoverBuzon() {

    var usuario = this.loginService.Usuario.id

    var i = 0
    var estatus = 1 //NOTA DE ENTREGA
    //Buscar en Wk de acuerdo al usuario y la app activa
    this.xAPI.funcion = 'WKF_APromoverEstatus'
    this.xAPI.valores = ''

    this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log('', data)
        this.seleccionNavegacion(this.selNav)
        this.Observacion = ''
        this.numControl = '0'
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
      }) //

  }


}
