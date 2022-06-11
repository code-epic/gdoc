import { ClassGetter, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent implements OnInit {



  public estadoActual = 9
  public estadoOrigen = 1

  public clasificacion = false

  public archivar = false

  public vrecibido = true

  public vprocesados = false

  public vpendientes = false

  public vplazo = false

  public cmbDestino = '0'

  public extender_plazo: any


  public lstAcciones = []

  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'PROCESAR SALIDA', 'visible': '1' },
    { 'valor': '3', 'texto': 'ARCHIVAR', 'visible': '2' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '2' }]

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

  public bzBusqueda = []
  public bzAlertasO = []
  public bzAlertas = []
  public buscar = ''
  public longitud = 0;
  public pageSize = 10;
  public xtender_plazo = ''

  public posicionPagina = 0

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }

  

  public placement = 'bottom'

  public URLDESTINO = '/documento/salida'
  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private loginService: LoginService,
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
    if (event.charCode == 13) {
      this.longitud = 0;
      this.pageSize = 10;
      const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
      this.longitud = this.bzBusqueda.length
      if (this.posicionPagina == 3) {
        this.bzBusqueda = this.bzAlertasO.filter((e) => { return patron.test(e.busqueda) })
        this.bzAlertas = this.bzBusqueda.slice(0, this.pageSize)
      }
      this.buscar = ''
    }
  }





  async ConsultarAlertas() {
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '9,2'
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
        })
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

    switch (e) {
      case 0:


        this.xAPI.parametros = this.estadoActual + ',' + this.estadoOrigen
        this.listarBuzon(this.bzRecibido)
        this.clasificacion = false
        this.cargarAcciones(0)

        break
      case 1:

        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon(this.bzProcesados)
        this.clasificacion = false
        this.cargarAcciones(1)

        break
      case 2:

        this.xAPI.parametros = this.estadoActual + ',' + 3
        this.listarBuzon(this.bzPendientes)
        this.clasificacion = false
        this.cargarAcciones(2)

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
        this.lstEstados = data.Cuerpo.filter(e => {
          return e.esta == 1 && e.id != 9
        });
      },
      (error) => {

      }
    )
  }

  async listarBuzon(bz: any) {
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        console.log(data.Cuerpo)
        data.Cuerpo.forEach(e => {
          e.completed = false
          e.color = 'warn'
          e.salida = e.saso != ""? true : false
          e.priv = e.priv == 1 ? true : false
          e.existe = e.anom == '' ? true : false
          const valor = this.cmbAcciones[e.accion] == undefined ? 'NUEVO DOCUMENTO' : this.cmbAcciones[e.accion].texto
          e.nombre_accion = e.accion != null ? valor : 'NUEVO DOCUMENTO'
          e.url = e.numc != e.saso ? '/documento/salida' : '/documento'
          e.xaccion = e.accion
          bz.push(e)
        })//Registros recorridos como elementos
        
        await this.listarSubDocumentos()
        
      
      },
      (error) => {

      }
    )
  }

  async listarSubDocumentos() {

    this.xAPI.funcion = 'WKF_CSubDocumento'
    this.xAPI.parametros = '4,2,9'
    
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data.Cuerpo)
        data.Cuerpo.forEach(e => {
          e.completed = false
          e.color = 'warn'
          e.nori = e.cuenta
          e.cuentas = e.cuenta == ''? '': e.cuenta
          e.priv = e.priv == 1 ? true : false
          e.existe = e.anom == '' ? true : false
          e.xaccion = e.accion
          this.bzRecibido.push(e)
        }) //Registros recorridos como elementos
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


  //recorrerElementos para paginar listados
  recorrerElementos(posicion: number, lista: any) {
    if (posicion > 1) posicion = posicion * 10
    this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)

  }


  //editar
  editar(id: string, url: string) {


    const estado = this.estadoActual
    const estatus = this.selNav + 1
    const base = btoa(estado + ',' + estatus + ',' + id)
    if (url == '/documento') {
      this.ruta.navigate([url, base, 'salida'])
    } else {
      this.ruta.navigate([url, base])
    }



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
        switch (this.AccionTexto) {
          case "0"://Aceptar y promover el documento
            this.promoverBuzon(0, this.utilService.FechaActual())
            break;
          case "1"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break;
          case "2"://Oficio por opinión
            this.promoverBuzon(0, this.utilService.FechaActual())
            break;
          case "3"://Oficio por opinión
            this.promoverBuzon(1, '')
            break;
          case "6":// Enviar a otras areas
            this.redistribuir(0)
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
        this.seleccionNavegacion(this.selNav)
      },
      (error) => {
        console.error(error)
      }

    )
  }




  async promoverBuzon(activo: number, sfecha: string) {
    var fecha = ''
    if (sfecha == '') {
      console.log(this.extender_plazo)
      if (this.extender_plazo == undefined) {
        this.toastrService.warning(
          'Debe seleccionar una fecha ',
          `GDoc Wkf.DocumentoObservacion`
        )
        return false
      } else {
        fecha = this.utilService.ConvertirFecha(this.extender_plazo)
      }
    } else {
      fecha = sfecha
    }

    sfecha == '' ? this.utilService.ConvertirFecha(this.extender_plazo) : sfecha

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
    this.lstAcciones = await this.cmbAcciones.filter(e => {
      return e.visible == posicion

    });
    this.AccionTexto = posicion == 2 ? '3' : '0'
    this.selAccion()
  }

  selAccion() {
    this.clasificacion = false
    this.vplazo = false
    this.archivar = false
    switch (this.AccionTexto) {
      case '6':
        this.vplazo = true
        this.clasificacion = true
        break;
      case '3':
        this.archivar = true
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

}
