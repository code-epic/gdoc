import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'

@Component({
  selector: 'app-sministerial',
  templateUrl: './sministerial.component.html',
  styleUrls: ['./sministerial.component.scss']
})

export class SministerialComponent implements OnInit {



  public estadoActual = 4
  public estadoOrigen = 2

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }

  lst = []
  public lstEstados = [] //Listar Estados

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50,  100];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

  public buzon = []
  public bzOriginal = []

  public estilocheck = 'none'

  public estiloclasificar = 'none'

  public allComplete: boolean = false

  public numControl = ''

  public Observacion = ''

  public AccionTexto: string = '0'


  public clasificacion = false
  public vplazo = false
  public vministerial = false
  public tministerial = '12'

  public cmbDestino = ''

  public lstAcciones = []

  public cmbAcciones = [
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '0' },]



  public bzBusqueda = []
  public bzAlertasO = []
  public bzAlertas = []
  public buscar = ''

  public extender_plazo: any

  public posicionPagina = 0
  public placement = 'bottom'


  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private ngxService: NgxUiLoaderService,
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
    this.xAPI.parametros = '4,2'
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
    if (this.selNav == 1) {
      this.modalService.open(content, { size: 'lg' })
    } else {
      this.modalService.open(content)
    }
  }

  seleccionNavegacion(e) {
    this.buzon = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e
    this.vministerial = true
    this.tministerial = '4'
    this.cargarAcciones(e)
    switch (e) {
      case 0:
        this.clasificacion = false
        this.vministerial = false
        this.tministerial = '12'
        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon()
        break
      case 3:
        this.ConsultarAlertas()
        break
    }

  }


  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter(e => { return e.esta == 1 });
      },
      (error) => {

      }
    )
  }

  async listarBuzon() {
    var bz = []
    this.ngxService.startLoader("loader-aceptar")
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        data.Cuerpo.forEach(e => {

          e.edit = e.tdoc.toLowerCase() == 'punto de cuenta' ? true : false
          e.existe = e.anom != '' ? true : false
          e.privado = e.priv == 1 ? true : false
          e.completed = false
          e.nombre_accion = e.accion != null ? this.cmbAcciones[e.accion].texto : ''
          e.color = 'warn'
          bz.push(e)
        })//Registros recorridos como elementos

        this.longitud = bz.length
        if (this.longitud > 0) {
          this.estilocheck = ''
          this.bzOriginal = bz
          this.recorrerElementos(0)
        }
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
        this.ngxService.stopLoader("loader-aceptar")
      }
    )
  }



  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }

  //recorrerElementos para paginar listados
  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.buzon = this.bzOriginal.slice(pag, pag + this.pageSize)

  }

  //editar
  editar(e) {
    
    const base = btoa( JSON.stringify(e))
    this.ruta.navigate(['/ministerial', base])
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
          case "6":// Enviar a otras areas
            this.redistribuir(0)
            break;
        }
        //this.promoverBuzon()
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



  async promoverBuzon(activo: number, sfecha: string) {
    const fecha = sfecha == '' ? this.utilService.ConvertirFecha(this.extender_plazo) : sfecha

    var usuario = this.loginService.Usuario.id
    var i = 0
    var estatus = 1 //NOTA DE ENTREGA
    //Buscar en Wk de acuerdo al usuario y la app activa
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

  async cargarAcciones(posicion) {
    this.lstAcciones = []
    this.lstAcciones = this.cmbAcciones.filter(e => { return e.visible == posicion });
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

      case '6':
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


  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }
}
