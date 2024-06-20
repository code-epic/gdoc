
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, DocumentoAdjunto, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-buzon',
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent implements OnInit {

  public estadoActual = 2
  public estatusAcutal = 1

  public extender_plazo: any

  public clasificacion = false
  public vplazo = false

  public vrecibido = true

  public vprocesados = false

  public vpendientes = false

  public cmbDestino = 'S'

 

  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'ELABORAR OFICIO', 'visible': '1' },
    { 'valor': '3', 'texto': 'EN MANOS DEL DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '4', 'texto': 'EN MANOS DEL SUB DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '5', 'texto': 'ARCHIVAR', 'visible': '1' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '1' },
    { 'valor': '7', 'texto': 'SALIDA', 'visible': '2' },
    { 'valor': '8', 'texto': 'ELABORAR CUADRO DECISORIO', 'visible': '1' },
    { 'valor': '9', 'texto': 'TIMONEL', 'visible': '2' },]

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores : ''
  }
  public lst = []
  public lstEstados = [] //Listar Estados
  public selNav = 0
  public lstAcciones = []

  public bzOriginal = [] //Listado Original
  public buzon = []


  public bzBusqueda = []
  public bzAlertasO = []
  public bzAlertas = []
  public buscar = ''

  public estilocheck = 'none'
  public estiloclasificar = 'none'
  public numControl = ''
  public Observacion = ''
  public AccionTexto: string = '0'

  public hashcontrol = ''

  public archivos = []


  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];


  // MatPaginator Output
  pageEvent: PageEvent;


  public posicionPagina = 0
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

  public DocAdjunto : DocumentoAdjunto = {
    documento : '',
    archivo : '',
    usuario : ''
  }

  constructor(
    private apiService: ApiService,
    private ruta: Router,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private loginService: LoginService,
    private modalService: NgbModal) {
      
  }

  ngOnInit(): void {
    this.listarEstados()
    this.seleccionNavegacion(0)
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


  async ConsultarAlertas(): Promise<void> {
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '2,2'
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzAlertas = data.Cuerpo.map((e) => {
          e.color = e.contador >= 0 ? 'text-red' : 'text-yellow';
          e.texto = e.contador >= 0 ? `Tiene ${e.contador} Dias vencido` : `Faltan ${e.contador * -1} Dia para vencer`;
          e.texto = e.contador == 0 ? 'Se vence hoy' : e.texto;
          e.busqueda = this.utilService.ConvertirCadena(
            e.ncontrol + e.remitente + e.plazo + e.texto
          );

          return e;

        }
        );
        this.longitud = this.bzAlertas.length;
        this.bzOriginal = this.bzAlertas;
        this.pageSize = 10;
        this.ngxService.stopLoader("loader-aceptar")
        this.recorrerElementos(0);
      },
      (error) => {
      }
    )
  }



  open(content, id) {
    this.numControl = id
    this.hashcontrol = btoa( "D" + this.numControl) //Cifrar documentos
    this.modalService.open(content);

  }


  seleccionNavegacion(e) {
    this.buzon = []
    this.xAPI.funcion = 'WKF_CDocumentos'
    this.xAPI.valores = ''
    this.selNav = e

    this.clasificacion = false
    this.cargarAcciones(e)

    switch (e) {
      case 0:
        this.xAPI.parametros = this.estadoActual + ',' + this.estatusAcutal
        this.listarBuzon()
        break
      case 1:
        this.xAPI.parametros = this.estadoActual + ',' + 2
        this.listarBuzon()
        break
      case 2:
        this.xAPI.parametros = this.estadoActual + ',' + 3
        this.listarBuzon()
        break
      case 3:
        this.ConsultarAlertas()
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
        this.lstEstados = data.Cuerpo.filter(e => {
          return e.esta == 1 && e.id != 9
        });
      },
      (error) => {

      }
    )
  }

  async listarBuzon(): Promise<void> {
    // console.log('Entrando en listado')
    this.ngxService.startLoader("loader-aceptar")
    try {
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          // console.log(data)
          this.buzon = data.Cuerpo.map((e) => {
            e.existe = e.anom == '' ? true : false;
            e.privado = e.priv == 1 ? true : false;
            e.nombre_accion = e.accion != null ? this.cmbAcciones[e.accion].texto : ''
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

  // async listarBuzon() {
  //   var bz = []

  //   await this.apiService.Ejecutar(this.xAPI).subscribe(
  //     (data) => {
  //       data.Cuerpo.forEach(e => {
  //         e.existe = e.anom == '' ? true : false
  //         e.privado = e.priv == 1 ? true : false
  //         e.completed = false
  //         e.nombre_accion = e.accion != null ? this.cmbAcciones[e.accion].texto : ''
  //         e.color = 'warn'
  //         bz.push(e)
  //       })//Registros recorridos como elementos

  //       this.longitud = bz.length
  //       if (this.longitud > 0) {
  //         this.estilocheck = ''
  //         this.bzOriginal = bz
  //         this.recorrerElementos(0)
  //       }

  //     },
  //     (error) => {

  //     }
  //   )
  // }

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
          case "0"://Aceptar y promover el documento

            this.promoverBuzon(0, this.utilService.FechaActual())
            break;
          case "1"://Rechazar en el estado inicial
            this.rechazarBuzon()
            break;
          case "2"://Oficio por opinión
            this.promoverBuzon(1, '')
            break;
          case "3"://Oficio por opinión
            this.promoverBuzon(1, '')
            break;
          case "4"://Oficio por opinión
            this.promoverBuzon(1, '')
            break;
          case "5":// Enviar a Archivo
            this.redistribuir(11)
            break;
          case "6":// Enviar a otras areas
            this.redistribuir(0)
            break;
          case "7"://Enviar a salida con bifurcacion
            this.redistribuir(9)
            break;
          case "8"://Elaborar cuadro decisorio
            this.promoverBuzon(1, '')
            break;
          case "9"://Enviar a Timonel
            this.redistribuir(6)
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






  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'WKF_ADocumentoAdjunto'
          this.xAPI.parametros =  '' 
          this.DocAdjunto.archivo = this.archivos[0].name
          this.DocAdjunto.usuario = this.loginService.Usuario.id
          this.DocAdjunto.documento = this.numControl
          this.xAPI.valores = JSON.stringify(this.DocAdjunto)

          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                this.toastrService.success(
                  'Tu archivo ha sido cargado con exito ',
                  `GDoc Registro`
                );
               
              } else {
                this.toastrService.info(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
              }
            },
            (error) => {
              this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
    }

  }


}


