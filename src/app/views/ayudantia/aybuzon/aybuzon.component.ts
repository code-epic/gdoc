
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';



@Component({
  selector: 'app-aybuzon',
  templateUrl: './aybuzon.component.html',
  styleUrls: ['./aybuzon.component.scss']
})
export class AybuzonComponent implements OnInit {

  public estadoActual = 5
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

  public placement = 'bottom'

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }
  public clasificacion = false

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
        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon(this.bzRecibido)
        break
      case 1:
        this.cargarAcciones(1)
        this.xAPI.funcion = 'WKF_CSubDocumento'
        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon(this.bzProcesados)
        break
      case 2:
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
        this.lstEstados = data.Cuerpo.filter(e => {return e.esta == 1 });
      },
      (error) => {

      }
    )
  }

  async listarBuzon(bz: any) {
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
         data.Cuerpo.forEach(e => {

          e.existe = e.anom == '' ? true : false
          e.privado = e.priv == 1 ? true : false
          e.cuenta = e.cuenta != undefined ? e.cuenta : ''
          e.resumen = e.resumen != undefined ? e.resumen : ''
          e.detalle = e.detalle != undefined ? e.detalle : ''
          e.completed = false
          e.color = 'warn'
          bz.push(e)

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


  async cargarAcciones(posicion) {
    this.lstAcciones = []
    this.lstAcciones = this.cmbAcciones.filter(e => {return e.visible == posicion});
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
