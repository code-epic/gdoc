import { ClassGetter, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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



  public estadoActual = 2
  public estadoOrigen = 1

  public clasificacion = false

  public vrecibido = true

  public vprocesados = false

  public vpendientes = false

  public cmbDestino = ''

  public lstAcciones = []

  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'ELABORAR OFICIO DE OPINION', 'visible': '1' },
    { 'valor': '3', 'texto': 'EN MANOS DEL DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '4', 'texto': 'EN MANOS DEL SUB DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '5', 'texto': 'ARCHIVAR', 'visible': '1' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '1' },
    { 'valor': '7', 'texto': 'SALIDA', 'visible': '2' }]

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
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

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
    console.log(e);
    this.bzRecibido = []
    this.bzProcesados = []
    this.bzPendientes = []
    this.bzCerrados = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e

    switch (e) {
      case 0:
        this.cargarAcciones(0)
        this.clasificacion = false

        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon(this.bzRecibido)
        break
      case 1:
        this.cargarAcciones(1)
        this.clasificacion = false
        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon(this.bzProcesados)
        break
      case 2:
        this.cargarAcciones(2)
        this.clasificacion = false
        this.xAPI.parametros = this.estadoActual + ',' + 3
        this.listarBuzon(this.bzPendientes)
        break
      case 4:
        this.xAPI.parametros = this.estadoActual + ',' + 4
        this.listarBuzon(this.bzCerrados)
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

  async listarBuzon(bz: any) {
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        console.log(data)

        data.Cuerpo.forEach(e => {

          var existe = e.anom == '' ? true : false
          var privado = e.priv == 1 ? true : false
          console.log(e)
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
              existe: existe,
              xaccion: e.accion
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


  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex + 1, this.lst)
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
  recorrerElementos(posicion: number, lista: any) {
    if (posicion > 1) posicion = posicion * 10
    this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)

  }


  //editar
  editar(id: string) {
    this.ruta.navigate(['/documento', id])
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
        console.info(this.AccionTexto)
        switch (this.AccionTexto) {
          case "1"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break;

          case "2"://Oficio por opinión
            this.promoverBuzon()
            break;

          case "6":// Enviar a otras areas
            this.redistribuir()
            break;


          default:

            this.promoverBuzon()
            break;
        }



      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }

  async rechazarBuzon() {
    this.xAPI.funcion = "WKF_AUbicacionRechazo"
    this.xAPI.valores = ''
    this.xAPI.parametros = '1,1,1,,' + this.loginService.Usuario.id + ',' + this.numControl
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'El documento ha sido enviado al origen',
          `GDoc Wkf.DocumentoObservacion`
        )
        console.log(data)
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }

    )
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
        this.toastrService.success(
          'Se ha promovido el documento',
          `GDoc Wkf.DocumentoObservacion`
        )
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.PromoverDocumento`);
      }) //

  }

  async redistribuir() {
    this.xAPI.funcion = "WKF_ARedistribuir"
    this.xAPI.valores = ''
    this.xAPI.parametros = this.cmbDestino + ',' + this.cmbDestino + ',1,' + this.loginService.Usuario.id + ',' + this.numControl
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'El documento ha sido redistribuido segun su selección',
          `GDoc Wkf.DocumentoObservacion`
        )
        console.log(data)
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }

    )


  }

  async cargarAcciones(posicion){
    this.lstAcciones = []
    this.cmbAcciones.forEach(e => {
      if(e.visible==posicion){
        this.lstAcciones.push(e)
      }
      
    });
  }

  selAccion() {
    this.clasificacion = false
    switch (this.AccionTexto) {
      case '6':
        this.clasificacion = true
        break;

      default:
        break;
    }
  }

}


