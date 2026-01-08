import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss']
})
export class ArchivoComponent implements OnInit {



  public estadoActual = 11
  public estadoOrigen = 1
  public estatusAcutal = 1
  fecha_desde = '-09-01'
  fecha_hasta = '-09-30'
  xyear = '2024'
  public lstMeses = []
  public lstYear = []
  public xmeses = ''

  public clasificacion = false

  public vplazo = false

  public nexpediente = ''

  public codigo = ''

  public cmbDestino = ''

  public lstAcciones = []

  public cmbAcciones = [
    { 'valor': '1', 'texto': 'CERRAR DOCUMENTO', 'visible': '0' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION (REACTIVAR)', 'visible': '0' },
    { 'valor': '2', 'texto': 'REDISTRIBUCION (REACTIVAR)', 'visible': '1' }

  ]

  public paginador = 50
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }
  lst = []
  public lstEstados = [] //Listar Estados

  lengthOfi = 0;
  pageSizeOfi = 50;
  pageSizeOptions: number[] = [1, 50, 100, 150, 200, 250];

  // MatPaginator Output
  pageEvent: PageEvent;

  selNav = 0

  public bzRecibido = []
  public bzRecibidoOpinion = []
  public bzProcesados = []
  public bzPendientes = []
  public bzCerrados = []

  public estilocheck = 'none'
  public extender_plazo: any
  public estiloclasificar = 'none'

  public allComplete: boolean = false
  public bzOriginal = [] //Listado Original
  public buzon = []

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

  public lstFecha = [
    { id: '2023-12-01,2023-12-31,2023-11-30', value: 'DICIEMBRE' },
    { id: '2024-01-01,2024-01-31,2023-12-31', value: 'ENERO' },
    { id: '2024-02-01,2024-02-28,2024-01-31', value: 'FEBRERO' },
    { id: '2024-03-01,2024-03-31,2024-02-28', value: 'MARZO' },
    { id: '2024-04-01,2024-04-30,2024-03-31', value: 'ABRIL' },
    { id: '2024-05-01,2024-05-31,2024-04-30', value: 'MAYO' },
    { id: '2024-06-01,2024-06-30,2024-05-31', value: 'JUNIO' },
    { id: '2024-07-01,2024-07-31,2024-06-30', value: 'JULIO' },
    { id: '2024-08-01,2024-08-31,2024-07-31', value: 'AGOSTO' },
    { id: '2024-09-01,2024-09-30,2024-08-31', value: 'SEPTIEMBRE' },
    { id: '2024-10-01,2024-10-31,2024-09-30', value: '0CTUBRE' },
    { id: '2024-11-01,2024-11-30,2024-10-31', value: 'NOVIEMBRE' },
    { id: '2024-12-01,2024-12-31,2024-11-30', value: 'DICIEMBRE' },
  ]

  longitud = 0;
  pageSize = 10;
  

  constructor(
    private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private utilService: UtilService,
    private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.lstMeses = this.apiService.Xmeses
    this.lstYear = this.apiService.Xyear

  }

  ngOnInit(): void {
    this.xmeses = new Date().getMonth().toString()
    this.xyear = new Date().getFullYear().toString()
    this.listarEstados()
    this.seleccionNavegacion(0)

  }


  open(content, id) {
    this.numControl = id
    this.modalService.open(content);

  }



  listarEstados() {
    this.xAPI = {} as IAPICore
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



  seleccionNavegacion(e) {
    this.buzon = []
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_CDocumentosGestion'
    this.xAPI.valores = ''
    this.selNav = e
    this.fecha_desde = this.xyear + '-' + this.lstMeses[this.xmeses].desde
    this.fecha_hasta = this.xyear + '-' + this.lstMeses[this.xmeses].hasta
   
    console.log(e)
    this.cargarAcciones(e)
    switch (e) {
      case 0:
        
        this.clasificacion = false

        this.xAPI.parametros =  `${this.estadoActual},${this.estatusAcutal},${this.fecha_desde},${this.fecha_hasta}` 
        this.listarBuzon()
        break
      case 1:
        
        this.clasificacion = false
        this.xAPI.parametros = `${this.estadoActual},2,${this.fecha_desde},${this.fecha_hasta}`
        this.listarBuzon()
        break

      default:
        break
    }

  }



  async listarBuzon(): Promise<void> {
    // console.log('Entrando en listado')
    this.ngxService.startLoader("loader-aceptar")
    try {
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          this.buzon = data.Cuerpo.map((e) => {
            e.existe = e.anom == '' ? true : false;
            e.privado = e.priv == 1 ? true : false;
            //  e.nombre_accion = e.accion != null ? this.cmbAcciones[e.accion].texto : ''
            e.color = 'green'
            switch (e.tdoc.toLowerCase()) {
              case 'punto de cuenta':
                e.simbolo = "-P"
                e.color = 'green'
                break;
              case 'tramitacion por organo regular':
                e.simbolo = "-T"
                e.color = 'brown'
                break;
              case 'resolucion':
                e.simbolo = "-R"
                e.color = 'orange'
                break;
              default:
                e.simbolo = ''
                break;
            }

            e.completed = false;

            return e;
          });
          this.longitud = this.buzon.length;
          if (this.longitud > 0) {
            this.estilocheck = '';
            this.bzOriginal = this.buzon;
            this.pageSize = 10;
            this.recorrerElementos(0);
          }
          this.ngxService.stopLoader("loader-aceptar")
        },
        (error) => {
          this.ngxService.stopLoader("loader-aceptar")
        }
      )
    } catch (error) {
      console.error(error)
      this.ngxService.stopLoader("loader-aceptar")
    }
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
  
  // pageChangeEvent(e) {
  //   this.recorrerElementos(e.pageIndex + 1, this.lst)
  // }

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
  // recorrerElementos(posicion: number, lista: any) {
  //   if (posicion > 1) posicion = posicion * 50
  //   this.lst = lista.slice(posicion, posicion + this.pageSizeOfi)

  // }


  //editar
  editar(id: string) {
    const estado = this.estadoActual
    const estatus = this.selNav + 1
    const base = btoa(estado + ',' + estatus + ',' + id)
    this.ruta.navigate(['/documento', base])
  }


  insertarObservacion() {
    var usuario = this.loginService.Usuario.id
    this.xAPI = {} as IAPICore
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
          case "0"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break;
          case "1"://Rechazar en el estado inicial
            this.promoverBuzon(0, this.utilService.FechaActual())
            break;
          case "2"://Rechazar en el estado inicial
            this.redistribuir(0)
            break
          case "6":// Enviar a otras areas
            this.redistribuir(0)
            break
          default:


            break;
        }



      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }

  async rechazarBuzon() {
    this.xAPI = {} as IAPICore
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
    this.xAPI = {} as IAPICore
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
    this.xAPI = {} as IAPICore

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

    this.xAPI = {} as IAPICore
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
    this.cmbAcciones.forEach(e => {
      if (e.visible == posicion) {
        this.lstAcciones.push(e)
      }

    });
  }

  selAccion() {
    this.clasificacion = false
    switch (this.AccionTexto) {
      case '6':
        this.clasificacion = true
        this.vplazo = true
        break;
      case '2':
        this.clasificacion = true
        this.vplazo = true
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

}
