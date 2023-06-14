
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { UtilService } from 'src/app/services/util/util.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';



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




  public extender_plazo: any
  public cmbAcciones = [
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '0' }]
  public lstAcciones = []
  public vplazo = false
  public clasificacion = false
  public cmbDestino = 'S'
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

  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private utilService: UtilService,
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
    this.clasificacion = false
    this.cargarAcciones(e)

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

  async listarBuzon() {
    var bz = []
    this.ngxService.startLoader("loader-progress")
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        data.Cuerpo.forEach(e => {
          e.existe = e.anom == '' ? true : false
          e.privado = e.priv == 1 ? true : false
          e.completed = false
          //e.nombre_accion = e.accion != null ? this.cmbAcciones[e.accion].texto : ''
          e.color = 'warn'
          bz.push(e)
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

  async listarSubDocumentos() {

    this.xAPI.funcion = 'WKF_CSubDocumento'
    this.xAPI.parametros = '4,2,9'

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          e.completed = false
          e.color = 'warn'
          e.nori = e.cuenta
          e.cuentas = e.cuenta == '' ? '' : e.cuenta
          e.priv = e.priv == 1 ? true : false
          e.existe = e.anom == '' ? true : false
          e.xaccion = e.accion
          this.bzOriginal.push(e)
        }) //Registros recorridos como elementos
        this.lengthOfi = data.Cuerpo.length
        if (this.lengthOfi > 0) {
          this.estilocheck = ''
          this.recorrerElementos(0)
        }
      },
      (error) => {

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


    if (this.AccionTexto == "S") {
      this.toastrService.warning(
        'Debe seleccionar una accion ',
        `GDoc Wkf.DocumentoObservacion`
      )
      return false
    }
    const usuario = this.loginService.Usuario.id
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

          case "6":// Enviar a otras areas
            this.redistribuir(0)
            break
          case "7"://Enviar a salida con bifurcacion
            this.redistribuir(9)
            break
          default:
            this.toastrService.warning(
              'Debe seleccionar una accion ',
              `GDoc Wkf.DocumentoObservacion`
            )
            break
        }
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
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


}
