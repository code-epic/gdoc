import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { Editor } from 'ngx-editor'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento, IWKFCuenta } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'


@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})

export class DocumentoComponent implements OnInit, OnDestroy {

  public estadoActual = 1
  public estadoOrigen = 1

  public ncontrolv = true // visibilidad del input numero de control
  public ncontrolt = 'Nro. Control'
  public remitentet = 'Remitente'
  public origenvisible: boolean = true // Visibilidad del Input Numero de Origen
  public fsalida = 'Fecha de Creación (*)'
  public forigenv = true // Visibilidad de Input Fecha Origen

  public camposalida = 2
  public camposfechasalida = 3
  public camponumsalida = 2


  masterSelected: boolean;
  checklist: any;
  checkedList: any;

  closeResult = '';


  title = 'Documentos';
  placement = 'bottom-start';

  lineCountCache: number = 0;
  PosicionCuenta: number = -1;

  editor: Editor = new Editor;
  xeditor: Editor = new Editor;

  public fcreacion: any
  public forigen: any

  public fcreacionDate: NgbDate | null
  public forigenDate: NgbDate | null

  public fplazo: any

  public editar: boolean = false
  public puntocuenta: boolean = false
  public salidavisible: boolean = true

  public detalle: string = ''
  public cuenta: string = ''
  public resumen: string = ''
  public salida: string = 'Nro. de Salida'


  public WkDoc: IWKFDocumento = {
    nombre: '',
    estado: 0,
    estatus: 0,
    workflow: 0,
    observacion: '',
    usuario: ''
  }

  public WkCuenta: IWKFCuenta = {
    documento: 0,
    cuenta: '',
    estado: 0,
    estatus: 0,
    detalle: '',
    resumen: '',
    fecha: '',
    usuario: '',
    activo: 0
  }


  public Doc: IDocumento = {
    ncontrol: '',
    wfdocumento: 0,
    fcreacion: '',
    forigen: '',
    norigen: '',
    salida: '',
    tipo: '0',
    remitente: '0',
    unidad: '0',
    contenido: '',
    instrucciones: '',
    codigo: '',
    nexpediente: '',
    creador: '',
    archivo: '',
    privacidad: 0,
    subdocumento: ''
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

  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstU = [] //Objeto Unidad
  public lstCuenta = [] //Objeto Unidad

  public lstTraza = []
  public lstHistorial = []
  public lstImg = []
  public titulo = 'Documento'

<<<<<<< HEAD
=======
  public download: any
>>>>>>> c13764331bb3ccaaed018fb5e334e789a96c4d80

  public xAPI: IAPICore = {
    funcion: ''

  };
  routerDoc: { numc: string }

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router) {


  }

  ngOnInit(): void {

    this.editor = new Editor()
    this.xeditor = new Editor()
    this.listarConfiguracion()

    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
      if (id == 'salida') {
        this.titulo = 'Salida'
        this.estadoActual = 9
        this.estadoOrigen = 2
        this.ncontrolv = false
        this.salidavisible = false
        this.origenvisible = false
        this.forigenv = false
        this.ncontrolt = 'Nro de Salida'
        this.remitentet = 'Destinatario'
        this.fsalida = 'Fecha de Salida'
        this.camposalida = 4
        this.camposfechasalida = 4


        if (this.rutaActiva.snapshot.params.numc != undefined) {
          var numc = this.rutaActiva.snapshot.params.numc
          this.ncontrolt = 'Nro de Control'
          this.ncontrolv = true
          this.salidavisible = true
          this.camponumsalida = 4

          this.consultarDocumento(numc)
        }

      } else {
        this.consultarDocumento(id)
      }

    } else {
      this.limpiarDoc()

    }



  }


  listarConfiguracion() {
    this.xAPI.funcion = 'MD_CConfiguracion'
    this.xAPI.parametros = '%'
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {

        data.Cuerpo.forEach(e => {
          switch (e.tipo) {
            case "1":
              this.lstT.push(e)
              break
            case "2":
              this.lstR.push(e)
              break
            case "3":
              this.lstU.push(e)
              break
          }
        });
      },
      error => {
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
  }




  limpiarDoc() {
    var dia = this.utilService.FechaActual()

    this.forigen = ''
    this.fplazo = ''
    this.Doc.ncontrol = ''
    this.Doc.norigen = ''
    this.Doc.contenido = ''
    this.Doc.instrucciones = ''
    this.Doc.nexpediente = ''
    this.Doc.codigo = ''
    this.Doc.salida = ''
    this.Doc.tipo = '0'
    this.Doc.remitente = '0'
    this.Doc.unidad = '0'
    this.Doc.creador = ''
    this.fcreacionDate = NgbDate.from(this.formatter.parse(dia))
    this.fcreacion = dia
  }

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  async consultarDocumento(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = base
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        data.Cuerpo.forEach(e => {
          this.Doc = e
          this.fcreacionDate = NgbDate.from(this.formatter.parse(this.Doc.fcreacion.substring(0, 10)))
          this.forigenDate = NgbDate.from(this.formatter.parse(this.Doc.forigen.substring(0, 10)))
          if (e.alerta != null) {
            this.fplazo = NgbDate.from(this.formatter.parse(e.alerta.substring(0, 10)))
            this.WAlerta.activo = 1
            this.WAlerta.documento = this.Doc.wfdocumento
            this.WAlerta.estado = this.estadoActual
            this.WAlerta.estatus = this.estadoOrigen
            this.WAlerta.usuario = this.loginService.Usuario.id
          }

        });

        this.selTipoDocumento()
        const punto_cuenta = this.Doc.subdocumento != null ? JSON.parse(this.Doc.subdocumento) : []
        this.lstCuenta = punto_cuenta.map(e => {
          return typeof e == 'object' ? e : JSON.parse(e)
        })
        const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : []
        this.lstTraza = traza.map(e => {
          return typeof e == 'object' ? e : JSON.parse(e)
        })
        const historial = this.Doc.historial != null ? JSON.parse(this.Doc.historial) : []
        this.lstHistorial = historial.map(e => {
          return typeof e == 'object' ? e : JSON.parse(e)
        })

<<<<<<< HEAD
=======
        //Carga de Documentos
        this.download = this.apiService.Dws(this.Doc.ncontrol + '/' + this.Doc.archivo)

>>>>>>> c13764331bb3ccaaed018fb5e334e789a96c4d80

      },
      (error) => {
        console.error(error)
      }
    )
  }

  open(content) {
    this.modalService.open(content);
  }

  //obtenerWorkFlow Permite generar los primeros valores de la red del documento
  obtenerWorkFlow() {

    this.WkDoc = {
      "nombre": "Control de Gestion",
      "workflow": 2,
      "estado": this.estadoActual,
      "estatus": this.estadoOrigen,
      "observacion": "Creando " + this.titulo,
      "usuario": this.loginService.Usuario.id
    }
    this.xAPI.funcion = 'WKF_IDocumento'
    this.xAPI.valores = JSON.stringify(this.WkDoc)
  }


  //registrar Un documento pasando por el WorkFlow
  registrar() {

<<<<<<< HEAD
    if (this.Doc.contenido == '' || this.fcreacion == undefined || this.fplazo == undefined) {
      this.toastrService.info('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return

    }
    this.ngxService.startLoader("loader-aceptar")
    this.obtenerWorkFlow() //Obtener valores de una API

    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
      if (id != 'salida') {
        this.actualizarDocumentos()
        return
      } else if (this.rutaActiva.snapshot.params.numc != undefined) {
        var numc = this.rutaActiva.snapshot.params.numc
        this.actualizarDocumentos()
        return
      }

=======

    this.ngxService.startLoader("loader-aceptar")


    if (this.rutaActiva.snapshot.params.id != undefined) {
      this.obtenerWorkFlow() //Obtener valores de una API
      this.actualizarDocumentos()
      return
>>>>>>> c13764331bb3ccaaed018fb5e334e789a96c4d80
    }

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (xdata) => {
            if (this.fplazo.year != undefined) {
              this.obtenerAlertaWorkFlow(xdata)
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (ydata) => {

                  this.ngxService.stopLoader("loader-aceptar")
                },
                (errot) => {

                  this.toastrService.error(data.msj, `GDoc Wkf.Alerta`)
                  this.ngxService.stopLoader("loader-aceptar")
                }
              )
            }
            const cant = this.lstCuenta.length

            if (cant > 0) {
              this.salvarCuentas(this.Doc.wfdocumento)
            } else {
              this.aceptar(this.Doc.ncontrol)
              this.limpiarDoc()
              this.ngxService.stopLoader("loader-aceptar")
            }


          },
          (errot) => {
            this.toastrService.error(data.msj, `GDoc Wkf.Documento.Detalle`)
            this.ngxService.stopLoader("loader-aceptar")
          }
        )

      }, //En caso de fallar Wkf
      (errot) => {
        var mensaje = errot + ' - ' + this.xAPI.funcion
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`)
        this.ngxService.stopLoader("loader-aceptar")


      }
    )



  }

  //Obtener los dados de Documento
  obtenerDatos(data: any) {
    if (data.tipo == 0) {
      var mensaje = data.msj + ' - ' + this.xAPI.funcion
      this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
      return false
    }
    this.xAPI.funcion = 'WKF_IDocumentoDetalle'
    if (this.estadoActual != 9) {
      this.Doc.ncontrol = this.utilService.Semillero(data.msj).toUpperCase()

    } else {
      this.Doc.salida = this.Doc.ncontrol.toUpperCase()
      this.Doc.ncontrol = this.Doc.ncontrol.toUpperCase()

    }
    this.Doc.wfdocumento = parseInt(data.msj)
    this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion)
    this.Doc.forigen = this.forigen != undefined ? this.utilService.ConvertirFecha(this.forigen) : this.utilService.ConvertirFecha(this.fcreacion)


    this.Doc.contenido = this.Doc.contenido.toUpperCase()
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase()

    this.Doc.creador = this.loginService.Usuario.id

    this.xAPI.valores = JSON.stringify(this.Doc)
  }

  //Obtener alerta del Documento
  obtenerAlertaWorkFlow(data: any) {
    if (data.tipo == 0) {
      this.toastrService.error(data.msj, `GDoc Wkf.Alerta`);
      return false
    }
    this.WAlerta.activo = 1
    this.WAlerta.documento = this.Doc.wfdocumento
    this.WAlerta.estado = this.WkDoc.estado
    this.WAlerta.estatus = this.WkDoc.estatus
    this.WAlerta.usuario = this.WkDoc.usuario
    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo)
    this.xAPI.funcion = 'WKF_IAlerta'
    this.xAPI.valores = JSON.stringify(this.WAlerta)
  }

  protected aceptar(msj: string) {
    Swal.fire({
      title: 'El Documento Registrado es # ' + msj,
      text: "¿Desea registar otro documento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) {
        if (this.estadoActual == 9) {
          this.ruta.navigate(['/salidas']);
          return
        }

        this.ruta.navigate(['/registrar']);
      }



    })
  }


  async actualizarDocumentos() {

<<<<<<< HEAD
=======
    if (this.Doc.contenido == '') {
      this.toastrService.info('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return
    }

>>>>>>> c13764331bb3ccaaed018fb5e334e789a96c4d80
    this.Doc.fcreacion = typeof this.fcreacion === 'object' ? this.utilService.ConvertirFecha(this.fcreacion) : this.Doc.fcreacion.substring(0, 10)
    this.Doc.forigen = typeof this.forigen === 'object' ? this.utilService.ConvertirFecha(this.forigen) : this.Doc.forigen.substring(0, 10)
    this.Doc.creador = this.loginService.Usuario.id

    this.xAPI.funcion = 'WKF_ADocumentoDetalle'
    this.xAPI.parametros = ''
    
    this.Doc.contenido = this.Doc.contenido.toUpperCase()
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase()

    this.xAPI.valores = JSON.stringify(this.Doc)

    if (this.WAlerta.documento != 0) this.WAlerta.fecha = typeof this.fplazo === 'object' ? this.utilService.ConvertirFecha(this.fplazo) : this.fplazo.substring(0, 10)

  


    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.toastrService.success('El documento ha sido actualizado', `GDoc Wkf.Actualizar Documentos`)
        this.ngxService.stopLoader("loader-aceptar")

        if (this.rutaActiva.snapshot.params.id != undefined && this.rutaActiva.snapshot.params.id == 'salida') {
          this.insertarObservacion()

        } else {
          this.ruta.navigate(['/registrar']);
        }



      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.Actualizar Documentos`)
        this.ngxService.stopLoader("loader-aceptar")
      }
    )



  }

  insertarObservacion() {
    const usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_IDocumentoObservacion'
    this.xAPI.valores = JSON.stringify(
      {
        "documento": this.Doc.wfdocumento,
        "estado": this.estadoActual, //Estado que ocupa
        "estatus": this.estadoOrigen,
        "observacion": 'DOCUMENTO EDITADO EN SALIDA',
        "accion": '20',
        "usuario": usuario
      }
    )

    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {


        await this.guardarAlerta(1)
        //this.ruta.navigate(['/salidas']);

      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number) {

    this.WAlerta.activo = activo
    this.WAlerta.documento = this.Doc.wfdocumento
    this.WAlerta.estado = this.estadoActual
    this.WAlerta.estatus = this.estadoOrigen
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = 'DOCUMENTO EDITADO EN SALIDA'

    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo)

    this.xAPI.funcion = 'WKF_AAlertas'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }
  agregarCuenta(): IWKFCuenta {
    if (this.cuenta == '' ||
      this.resumen == '' ||
      this.detalle == '') {
      this.toastrService.info('Todos los campos son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return
    }

    const wkcuenta: IWKFCuenta = {
      documento: 0,
      cuenta: this.cuenta.toUpperCase(),
      estado: 1,
      estatus: 1,
      detalle: this.detalle.toUpperCase(),
      resumen: this.resumen.toUpperCase(),
      fecha: '',
      usuario: this.loginService.Usuario.id,
      activo: 0
    }

    this.lstCuenta.push(wkcuenta)


    this.cuenta = ''
    this.resumen = ''
    this.detalle = ''
    return wkcuenta
  }

  selEditarCuenta(pos: number) {
    const wkcuenta = this.lstCuenta[pos]

    this.cuenta = wkcuenta.cuenta
    this.resumen = wkcuenta.resumen
    this.detalle = wkcuenta.detalle

    this.PosicionCuenta = pos
    this.editar = !this.editar
  }

  eliminarCuenta(pos: number) {

    this.lstCuenta.splice(pos, 1)
    this.cuenta = ''
    this.resumen = ''
    this.detalle = ''
    this.editar = false
  }

  editarCuenta() {

    if (this.PosicionCuenta != -1) {
      const wkcuenta: IWKFCuenta = {
        documento: 0,
        cuenta: this.cuenta.toUpperCase(),
        estado: 1,
        estatus: 1,
        detalle: this.detalle.toUpperCase(),
        resumen: this.resumen.toUpperCase(),
        fecha: '',
        usuario: this.loginService.Usuario.id,
        activo: 0
      }

      this.lstCuenta[this.PosicionCuenta] = wkcuenta


      this.cuenta = ''
      this.resumen = ''
      this.detalle = ''
      this.PosicionCuenta = -1
      this.editar = !this.editar
    }

  }


  async salvarCuentas(numc: number) {

    const cant = this.lstCuenta.length

    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar")
      return
    } else {
      this.xAPI.funcion = 'WKF_ISubDocumento'
      this.xAPI.parametros = ''
      this.lstCuenta[0].documento = numc
      this.lstCuenta[0].fecha = this.Doc.fcreacion
      this.xAPI.valores = JSON.stringify(this.lstCuenta[0])
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstCuenta.splice(0, 1)
          const c = this.lstCuenta.length
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar")
            this.aceptar(this.Doc.ncontrol)
            this.limpiarDoc()
          } else {
            this.salvarCuentas(numc)
          }
        },
        (errot) => {
          this.aceptar(this.Doc.ncontrol)
          this.limpiarDoc()
          this.toastrService.error(errot, `GDoc Wkf.SubDocumentos`)
          this.ngxService.stopLoader("loader-aceptar")
        }
      )
    }
  }




  selTipoDocumento() {
    this.puntocuenta = false
    this.lstCuenta = []
    if (this.Doc.tipo.toLowerCase() == 'punto de cuenta') this.puntocuenta = true
  }



  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.lstImg.push({ a: 1 })
    this.lstImg.push({ a: 1 })
    this.lstImg.push({ a: 1 })
    this.modalService.open(content, { size: 'lg' })

  }

  ngOnDestroy(): void {
    this.editor.destroy()
    this.xeditor.destroy()
  }
}

