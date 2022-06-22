
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'



@Component({
  selector: 'app-timonel',
  templateUrl: './timonel.component.html',
  styleUrls: ['./timonel.component.scss']
})



export class TimonelComponent implements OnInit {



  public estadoActual = 6
  public estadoOrigen = 1

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: ''
  }
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

  public bzOriginal = [] //Listado Original
  public buzon = []
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
    this.bzCerrados = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e

    switch (e) {
      case 0:
        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon()
        break
      case 1:
        this.xAPI.funcion = 'WKF_CSubDocumento'
        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon()
        break
      case 2:
        this.xAPI.parametros = this.estadoActual + ',' + 3
        this.listarBuzon()
        break
      case 4:
        this.xAPI.parametros = this.estadoActual + ',' + 4
        this.listarBuzon()
        break
      default:
        break
    }

  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = ''
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

  async listarBuzon() {
    var bz = []
    this.ngxService.startLoader("loader-progress")
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        data.Cuerpo.forEach(e => {

          var existe = e.anom == '' ? true : false
          var privado = e.priv == 1 ? true : false
          const cuenta = e.cuenta != undefined ? e.cuenta : ''
          const resumen = e.resumen != undefined ? e.resumen : ''
          const detalle = e.detalle != undefined ? e.detalle : ''

          bz.push({
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
              cuenta: cuenta,
              resumen: resumen,
              detalle: detalle,
              existe: existe
          })

        })//Registros recorridos como elementos

        this.lengthOfi = data.Cuerpo.length
        if (this.lengthOfi > 0) {
          this.estilocheck = ''
          this.bzOriginal = bz
          this.recorrerElementos(0)
        }
        this.ngxService.stopLoader("loader-progress")
      },
      (error) => {
        this.ngxService.stopLoader("loader-progress")
      }
    )
  }



  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }

  updateAllComplete() {
    this.allComplete = this.buzon != null && this.buzon.every(t => t.completed);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.buzon == null) {
      return;
    }

    this.buzon.forEach(t => (t.completed = completed));
    if (completed == false) {
      this.estiloclasificar = 'none'
    } else {
      this.estiloclasificar = ''
    }
  }

  someComplete(): boolean {
    if (this.buzon == null) return false;
    return this.buzon.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.buzon = this.bzOriginal.slice(pag, pag + this.pageSize)

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
        this.seleccionNavegacion(this.selNav)
        this.Observacion = ''
        this.numControl = '0'
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
      }) //

  }


}
