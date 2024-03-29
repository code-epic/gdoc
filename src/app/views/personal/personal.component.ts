import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';



@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  
  public estadoActual = 8
  public estadoOrigen = 1

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores : ''
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

  public placement = 'top'

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
  public vplazo = false
  public cmbDestino = ''
  public lstAcciones = []
  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'OPINION JURIDICA', 'visible': '1' },
    { 'valor': '5', 'texto': 'ATURORIZADO', 'visible': '2' },
    { 'valor': '6', 'texto': 'ARCHIVAR', 'visible': '2' },
    { 'valor': '7', 'texto': 'SALIDA', 'visible': '2' },
    { 'valor': '8', 'texto': 'REDISTRIBUCION', 'visible': '2' }]
  public extender_plazo: any


  public bzBusqueda = []
  public bzAlertasO = []
  public bzAlertas = []
  public buscar = ''
  public posicionPagina = 0

  longitud = 0;
  pageSize = 10;

  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private utilService: UtilService,
    private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

  }

  ngOnInit(): void {
    this.listarEstados()
    this.seleccionNavegacion(0)
    this.ConsultarAlertas()

  }


  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;
    const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
    if (event.charCode == 13) {
      this.longitud = this.bzBusqueda.length
      if (this.posicionPagina == 3) {
        this.bzBusqueda = this.bzAlertasO.filter((e) => {
          return patron.test(this.utilService.ConvertirCadena(e.busqueda))
        })
        this.bzAlertas = this.bzBusqueda.slice(0, this.pageSize)
      }
      this.buscar = ''
    }
  }





  async ConsultarAlertas() {
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '2,2'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzAlertasO = data.Cuerpo.map((e) => {
          e.color = e.contador >= 0 ? 'text-red' : 'text-yellow'
          e.texto = e.contador >= 0 ? `Tiene ${e.contador} Dias vencido` : `Faltan ${e.contador * -1} Dia para vencer`
          e.texto = e.contador == 0 ? 'Se vence hoy' : e.texto
          e.busqueda = this.utilService.ConvertirCadena(
            e.ncontrol + e.remitente + e.plazo + e.texto
          )
          return e
        }
        )
        this.bzBusqueda = this.bzAlertasO
        this.longitud = this.bzBusqueda.length
        this.bzAlertas = this.bzBusqueda.slice(0, this.pageSize)
      },
      (error) => {

      }
    )
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
    this.vplazo = true
    switch (e) {
      case 0:
        this.vplazo = false
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
        this.cargarAcciones(2)
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

  async listarBuzon(bz: any) {
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
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
      async data => {
        switch (this.AccionTexto) {
          case "0"://Aceptar y promover el documento
            this.promoverBuzon(0, this.utilService.FechaActual())
            break;
          case "1"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break;
          case "2"://Oficio por opinión
            this.promoverBuzon(1, '')
            break;
          case "5":// Enviar a otras areas redistribuir
            this.promoverBuzon(1, '')
            break;
          case "6":// Enviar  a Archivo
            this.redistribuir(11)
            break;
          case "7"://Enviar a salida con bifurcacion
            this.redistribuir(9)
            break;
          case "5":// Enviar a otras areas redistribuir
            this.redistribuir(0)
            break;
        }
        this.seleccionNavegacion(this.selNav)

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
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }

    )
  }

  async promoverBuzon(activo: number, sfecha: string) {
    const fecha = sfecha == '' ? this.utilService.ConvertirFecha(this.extender_plazo) : sfecha

    var usuario = this.loginService.Usuario.id
    var i = 0
    var estatus = 1 //NOTA DE ENTREGA
    this.xAPI.funcion = 'WKF_APromoverEstatus'
    this.xAPI.valores = ''

    this.xAPI.parametros = `${estatus},${usuario},${this.numControl}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        await this.guardarAlerta(activo, fecha)
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

  async redistribuir(destino: number = 0) {
    var dst = destino != 0 ? destino : this.cmbDestino

    this.xAPI.funcion = "WKF_ARedistribuir"
    this.xAPI.valores = ''
    this.xAPI.parametros = dst + ',' + dst + ',1,' + this.loginService.Usuario.id + ',' + this.numControl
    console.log(this.xAPI.parametros)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.guardarAlerta(1, this.utilService.ConvertirFecha(this.extender_plazo))
        this.toastrService.success(
          'El documento ha sido redistribuido segun su selección',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  selAccion() {
    this.clasificacion = false
    this.vplazo = true
    switch (this.AccionTexto) {
      case '0':
        this.vplazo = false
        break;
      case '1':
        this.vplazo = false
        break;

      case '8':
        this.clasificacion = true
        break;
      default:
        break;
    }
  }


  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo
    this.WAlerta.documento = parseInt(this.numControl)
    this.WAlerta.estado = this.estadoActual
    this.WAlerta.estatus = this.selNav + 1
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = this.Observacion.toUpperCase()
    this.WAlerta.fecha = fecha

    this.xAPI.funcion = 'WKF_AAlertas'
    this.xAPI.parametros = ''
    console.log(this.WAlerta);
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }

  async cargarAcciones(posicion) {
    this.lstAcciones = []
    this.lstAcciones = this.cmbAcciones.filter(e => { return e.visible == posicion });
  }



}
