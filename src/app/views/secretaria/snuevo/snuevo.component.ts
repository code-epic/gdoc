import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento, IWKFCuenta, IWKFDependencia } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'

import { FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { RsconsultaSessionService } from 'src/app/services/resoluciones/rsconsulta-session.service';
import { environment } from 'src/environments/environment';
import { toNamespacedPath } from 'path';



@Component({
  selector: 'app-snuevo',
  templateUrl: './snuevo.component.html',
  styleUrls: ['./snuevo.component.scss']
})

export class SnuevoComponent implements OnInit {

  public estadoActual = 4
  public estadoOrigen = 4
  public estatusOrigen = 6

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

  public bPDF = false

  closeResult = '';


  title = 'Documentos';
  placement = 'bottom-start';

  lineCountCache: number = 0;
  PosicionCuenta: number = -1;

  public fcreacion: any
  public forigen: any
  public fcuenta: any
  public fplazo: any

  public fcreacionDate: NgbDate | null
  public forigenDate: NgbDate | null
  public fcuentaDate: NgbDate | null
  public fplazoDate: NgbDate | null

  public subfechaDate: NgbDate | null

  public editar: boolean = false
  public puntocuenta: boolean = false
  public salidavisible: boolean = true
  public resolucion: boolean = false
  public activarMensaje = false

  public detalle: string = ''

  public cuenta: string = ''
  public resumen: string = ''
  public subfecha: string = ''
  public cedula: string = ''
  public cargo: string = ''
  public nmilitar: string = ''
  public salida: string = 'Nro. de Salida'
  public booPuntoCuenta: boolean = false

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
    cedula: '',
    cargo: '',
    nmilitar: '',
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
    comando: '0',
    contenido: '',
    instrucciones: '',
    codigo: '0',
    nexpediente: '',
    creador: '',
    archivo: '',
    privacidad: 0,
    subdocumento: '',
    dependencias: '',
    puntodecuenta: '',
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

  public WKDependencia: IWKFDependencia = {
    documento: 0,
    nombre: '',
    observacion: ''
  }

  public DocSalida: IDocumento = {
    ncontrol: '',
    wfdocumento: 0,
    fcreacion: '',
    forigen: '',
    norigen: '',
    salida: '',
    tipo: '0',
    remitente: '0',
    unidad: '0',
    comando: '0',
    contenido: '',
    instrucciones: '',
    codigo: '0',
    nexpediente: '',
    creador: '',
    archivo: '',
    privacidad: 0,
    subdocumento: '',
    dependencias: '',
  }

  public booDependencia = false

  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstU = [] //Objeto Unidad
  public lstC = [] //Objeto Comando
  public lstCA = [] //Objeto Comando
  public lstCuenta = [] //Objeto Unidad

  public lstHzAdjunto = [] //Historico de documentos adjuntos
  public lstTraza = []
  public lstHistorial = []
  public lstImg = []
  public lstDependencias = []
  public titulo = 'Documento'
  public nasociacion = ''

  public download: any

  public bHist = false

  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public Configuracion: any
  public serializar: string = ""
  public Configurar: boolean = false

  public activarTipo = false // activar tipo de documento
  public xAPI: IAPICore = {
    funcion: '',
    valores: '',
    parametros: ''
  };

  toppings = new FormControl('');
  toppingsaux = new FormControl('');

  lstPC: string[] = []; // Auxiliar para mappear las cuentas de toppings 
  lstPuntosCuentas: string[] = [];
  lstPuntosCuentasAux: []
  public SubMenu = []

  public isPunto: boolean = true
  public sCedula: string = 'Cédula'
  public sGrado: string = 'Grado / Jerarquía'
  public sNombre: string = 'Nombres y Apellidos'

  public NUMERO_CONTROL: string = '' //Este codigo controlara el semillero para los codigos nuevos
  public bControl  : boolean = false


  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private rsconsultaSessionService: RsconsultaSessionService,
    private ruta: Router) {


  }

  async ngOnInit() {


    this.SubMenu = await this.loginService.obtenerSubMenu("/secretaria")


    // Usar el servicio para cargar los datos desde sessionStorage
    const datos = this.rsconsultaSessionService.cargarDatosDesdeSession(environment);
    this.Componentes = datos.Componentes;
    this.Grados = datos.Grados;
    this.Categorias = datos.Categorias;
    this.Clasificaciones = datos.Clasificaciones;
    this.Configuracion = datos.Configuracion;

    this.listarConfiguracion()



    this.fplazoDate = NgbDate.from(this.formatter.parse(this.utilService.FechaActual(5)))
    this.Doc.nexpediente = 'PRESIDENCIAL'
    this.Doc.tipo = 'PUNTO DE CUENTA'
    this.Doc.remitente = 'PRESIDENCIAL'
    this.Doc.codigo = 'SEC'
    this.Doc.privacidad = 0
    this.selTipoDocumento()
  }

  setDescripcionPunto() {
    this.sCedula = 'Cédula'
    this.sGrado = 'Grado / Jerarquía'
    this.sNombre = 'Nombres y Apellidos'
  }

  setDescripcionContratos() {
    this.sCedula = '# Contrato'
    this.sGrado = 'Rif / Razón Social'
    this.sNombre = 'Monto Total'
  }


  SalidaTipo() {
    this.titulo = 'Salida'
    this.booDependencia = true
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
  }

  validarTipoDoc(): boolean {
    return  this.Doc.tipo.toLowerCase() == 'punto de cuenta'
  }

  listarConfiguracion() {
    // console.log(this.Configuracion)
    this.Configuracion.forEach(e => {
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
        case "4":
          this.lstC.push(e)
          break
        case "5":
          this.lstCA.push(e)
          break

      }
    })

  }

  limpiarDoc() {
    var dia = this.utilService.FechaActual()

    this.forigen = ''
    this.Doc.ncontrol = ''
    this.fplazo = NgbDate.from(this.formatter.parse(this.utilService.FechaActual(5)))
    this.Doc.norigen = ''
    this.Doc.contenido = ''
    this.Doc.instrucciones = ''
    this.Doc.nexpediente = ''
    this.Doc.codigo = '0'
    this.Doc.salida = ''
    this.Doc.tipo = '0'
    this.Doc.remitente = '0'
    this.Doc.unidad = '0'
    this.Doc.creador = ''
    this.fcreacionDate = NgbDate.from(this.formatter.parse(dia))
    this.fcreacion = dia
    this.nasociacion = ''
  }
  

  // 1. Función auxiliar para parsear datos JSON
private parseJsonData<T>(data: string | null, defaultValue: T[] = []): T[] {
  if (!data) return defaultValue;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) 
      ? parsed.map(item => typeof item === 'string' ? JSON.parse(item) : item)
      : [parsed];
  } catch (e) {
    console.error('Error parsing JSON data:', e);
    return defaultValue;
  }
}

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  async consultarDocumento(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = base
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        // console.log(data)
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

        this.lstCuenta = this.parseJsonData(this.Doc.subdocumento);
        this.lstTraza = this.parseJsonData(this.Doc.traza);
        this.lstHistorial = this.parseJsonData(this.Doc.historial);
        this.lstHzAdjunto = this.parseJsonData(this.Doc.hz_adjunto);
        this.lstDependencias = this.parseJsonData(this.Doc.dependencias);
    

        const cuentasaux = this.Doc.puntodecuenta != null ? JSON.parse(this.Doc.puntodecuenta) : []
        this.lstPuntosCuentasAux = cuentasaux.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        this.toppingsaux.setValue('1')
        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false
        this.download = this.apiService.Dws(btoa("D" + this.Doc.ncontrol) + '/' + this.Doc.archivo)

        this.activarTipo = this.validarTipoDoc()
        console.log(this.Doc)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
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
      "estatus": this.estatusOrigen,
      "observacion": "Creando Presidencial",
      "usuario": this.loginService.Usuario.id
    }
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_IDocumento'
    this.xAPI.valores = JSON.stringify(this.WkDoc)
  }

  activarHistorial() {
    this.bHist = !this.bHist
  }


  validarCamposObligatorios(): boolean {
    if (this.titulo == 'Documento') {
      return this.fcreacion == '' || this.fcreacion == undefined || this.forigen == '' || this.Doc.contenido == ''
    } else {
      return this.fcreacion == '' || this.fcreacion == undefined || this.Doc.contenido == ''
    }
  }


  //registrar Un documento pasando por el WorkFlow
  registrar() {
    
    if(this.lstCuenta.length == 0 ){
      this.toastrService.info('Debe ingresar detalles de la cuenta', `GDoc Wkf.Documentos`)
      this.ngxService.stopLoader("loader-aceptar")
      return
    }
    this.ngxService.startLoader("loader-aceptar")
    this.obtenerWorkFlow() //Obtener valores de una API
    if (this.rutaActiva.snapshot.params.numc != undefined) {
      this.actualizarDocumentos()
      return
    } else if (this.rutaActiva.snapshot.params.id != undefined && this.rutaActiva.snapshot.params.id != 'salida') {
      this.actualizarDocumentos()
      return
    } else if (this.validarCamposObligatorios()) {
      this.toastrService.info('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc Wkf.Documentos`)
      this.ngxService.stopLoader("loader-aceptar")
      return
    }
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (xdata) => {
            if (this.fplazoDate.year != undefined) {
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
            const cantdep = this.lstDependencias.length
            const mpuntocuenta = this.toppings.value.length

            if (cantdep > 0) {
              this.salvarDependencias(this.Doc.wfdocumento)
              if (mpuntocuenta > 0) {
                this.lstPC = this.toppings.value
                this.salvarPuntoCuenta(this.Doc.wfdocumento)
              }
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
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_IDocumentoDetalle'
    this.Doc.ncontrol = this.NUMERO_CONTROL!=''? this.NUMERO_CONTROL: this.utilService.Semillero(data.msj).toUpperCase()
    // this.utilService.Semillero(data.msj).toUpperCase()
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
    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazoDate)

    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_IAlerta'
    this.xAPI.valores = JSON.stringify(this.WAlerta)
  }

  protected aceptar(msj: string) {
    if (this.activarMensaje) return false
    this.activarMensaje = true
    Swal.fire({
      title: 'El Documento Registrado es # ' + msj,
      text: "¿Desea registrar otro documento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowEscapeKey: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.ruta.navigate(['/spresidencial']);
      }
    })
  }


  async actualizarDocumentos() {

    if (this.Doc.contenido == '') {
      this.toastrService.info('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return
    }
    let wfd = this.Doc.wfdocumento

    this.Doc.fcreacion = typeof this.fcreacion === 'object' ? this.utilService.ConvertirFecha(this.fcreacion) : this.Doc.fcreacion.substring(0, 10)
    this.Doc.forigen = typeof this.forigen === 'object' ? this.utilService.ConvertirFecha(this.forigen) : this.Doc.forigen.substring(0, 10)
    this.Doc.creador = this.loginService.Usuario.id

    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_ADocumentoDetalle'
    this.xAPI.parametros = ''

    this.Doc.contenido = this.Doc.contenido.toUpperCase()
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase()

    this.xAPI.valores = JSON.stringify(this.Doc)

    if (this.WAlerta.documento != 0) this.WAlerta.fecha = typeof this.fplazoDate === 'object' ? this.utilService.ConvertirFecha(this.fplazoDate) : this.fplazoDate




    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
          console.log(this.Doc)
          const cant = this.lstCuenta.length

          if (cant > 0) {
            let fnx = {
              'funcion': 'WKF_ESubDocumentoPuntoCuenta',
              'parametros': this.Doc.wfdocumento.toString(),
              'valores': ''
            }
            this.apiService.Ejecutar(fnx).subscribe(
              async data => {
                await this.salvarCuentas(this.Doc.wfdocumento)
              },
              err => {
                this.ruta.navigate(['/registrar']);
              }
            )

          } else {
            this.ruta.navigate(['/registrar']);
          }


        this.toastrService.success('El documento ha sido actualizado', `GDoc Wkf.Actualizar Documentos`)
        this.ngxService.stopLoader("loader-aceptar")


      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.Actualizar Documentos`)
        this.ngxService.stopLoader("loader-aceptar")
      }
    )



  }

  insertarObservacion() {
    const usuario = this.loginService.Usuario.id

    this.xAPI = {} as IAPICore
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
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number) {
    this.WAlerta.documento = this.Doc.wfdocumento

    this.WAlerta.activo = activo
    this.WAlerta.estado = this.estadoActual
    this.WAlerta.estatus = this.estadoOrigen
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = 'DOCUMENTO EDITADO EN SALIDA'

    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazoDate)

    this.xAPI = {} as IAPICore
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



  agregarDependencia(): IWKFDependencia {
    const dependencia: IWKFDependencia = {
      documento: 0,
      nombre: this.Doc.unidad.toUpperCase() + ' / ' + this.Doc.comando.toUpperCase(),
    }
    this.lstDependencias.push(dependencia)
    return dependencia
  }


  eliminarDependencia(pos: number, id: string) {

    if (id == undefined || id == '') {
      this.lstDependencias.splice(pos, 1)
      return false
    }
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = "WKF_EDocumentoDependencia"
    this.xAPI.parametros = id.toString()
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstDependencias.splice(pos, 1)
        this.ngxService.stopLoader("loader-aceptar")
      },
      error => {
        this.toastrService.error(
          'Fallo eliminar dependencia',
          `WKF_EDocumentoDependencia`
        );
        this.ngxService.stopLoader("loader-aceptar")
        console.error('Fallo consultando los datos de Configuraciones', error)
      }
    )

  }

  async salvarPuntoCuenta(numc: number) {

    const cant = this.lstPC.length
    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar")
      return
    } else {
      const cuenta = this.lstPC[0]
      const p_cuenta = cuenta.split('|')
      this.xAPI = {} as IAPICore
      this.xAPI.funcion = 'WKF_IPuntoCuentaMultiple'
      this.xAPI.valores = ''
      this.xAPI.parametros = numc + ',' + p_cuenta[0].trim() + ',' + p_cuenta[1].trim() + ',1'
      // console.log('insertando puntoscuenta ', this.xAPI)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstPC.splice(0, 1)
          const c = this.lstPC.length
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar")
          } else {
            this.salvarPuntoCuenta(numc)
          }
        },
        (errot) => {
          this.toastrService.error(errot, `GDoc Wkf.IDocumentoPuntoCuenta`)
          this.ngxService.stopLoader("loader-aceptar")
        }
      )
    }
  }


  async salvarDependencias(numc: number) {

    const cant = this.lstDependencias.length

    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar")
      return
    } else {
      this.xAPI = {} as IAPICore
      this.xAPI.funcion = 'WKF_IDocumentoDependencia'
      this.xAPI.valores = ''
      this.xAPI.parametros = numc + ',' + this.lstDependencias[0].nombre
      // console.log('insertando dependicia ', this.xAPI)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstDependencias.splice(0, 1)
          const c = this.lstDependencias.length
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar")
            //this.aceptar(this.Doc.ncontrol)
            this.limpiarDoc()
          } else {
            this.salvarDependencias(numc)
          }
        },
        (errot) => {
          this.toastrService.error(errot, `GDoc Wkf.SubDocumentos`)
          this.ngxService.stopLoader("loader-aceptar")
        }
      )
    }
  }

  editarCuenta() {

    if (this.PosicionCuenta != -1) {
      const wkcuenta: IWKFCuenta = {
        documento: 0,
        cuenta: this.cuenta.toUpperCase(),
        estado: 1,
        estatus: 1,
        cedula: this.cedula,
        cargo: this.cargo,
        nmilitar: this.nmilitar,
        fecha: typeof this.subfecha === 'object' ? this.utilService.ConvertirFecha(this.subfecha) : this.utilService.ConvertirFecha(this.subfechaDate),
        resumen: this.resumen.toUpperCase(),
        usuario: this.loginService.Usuario.id,
        activo: 0
      }

      this.lstCuenta[this.PosicionCuenta] = wkcuenta
      this.cuenta = ''
      this.resumen = ''
      this.subfecha = ''
      this.subfechaDate = null
      this.cedula = ''
      this.cargo = ''
      this.nmilitar = ''
      this.PosicionCuenta = -1
      this.editar = !this.editar
    }

  }

  agregarCuenta(tipo: number): IWKFCuenta {
    let validar = false

    switch (this.Doc.tipo.toLowerCase()) {
      case "punto de cuenta":
        if (this.cuenta == '' || this.resumen == '' || this.subfecha == '') validar = true
        break;

      default:
        if (this.cedula == '' || this.cargo == '' || this.nmilitar == '') validar = true
        break;
    }

    if (validar) {
      this.toastrService.info('Todos los campos son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return
    }
    const wkcuenta: IWKFCuenta = {
      documento: 0,
      cuenta: this.cuenta.toUpperCase(),
      estado: 1,
      estatus: 1,
      cedula: this.cedula,
      cargo: this.cargo,
      nmilitar: this.nmilitar,
      fecha: typeof this.subfecha === 'object' ? this.utilService.ConvertirFecha(this.subfecha) : this.utilService.FechaActual(),
      resumen: this.resumen.toUpperCase(),
      usuario: this.loginService.Usuario.id,
      activo: 0
    }

    this.lstCuenta.push(wkcuenta)

    if (tipo == 1) {
      this.cuenta = ''
      this.resumen = ''
      this.subfecha = ''
    }
    this.cedula = ''
    this.cargo = ''
    this.nmilitar = ''


    return wkcuenta
  }

  selEditarCuenta(pos: number) {
    const wkcuenta = this.lstCuenta[pos]

    this.cuenta = wkcuenta.cuenta
    this.resumen = wkcuenta.resumen

    this.subfechaDate = NgbDate.from(this.formatter.parse(wkcuenta.fecha.substring(0, 10)))

    this.cedula = wkcuenta.cedula
    this.cargo = wkcuenta.cargo
    this.nmilitar = wkcuenta.nmilitar

    this.PosicionCuenta = pos
    this.editar = !this.editar
  }

  eliminarCuenta(pos: number) {

    this.lstCuenta.splice(pos, 1)
    this.cuenta = ''
    this.resumen = ''
    this.subfecha = ''
    this.cedula = ''
    this.cargo = ''
    this.nmilitar = ''
    this.editar = false
  }


  async salvarCuentas(numc: number) {
    const cant = this.lstCuenta.length
    // console.log('entrando en confianza... ', cant)
    // console.log('entrando en confianza... ', this.lstCuenta)
    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar")
      return
    } else {
      this.xAPI = {} as IAPICore
      this.xAPI.funcion = 'WKF_ISubDocumento'
      this.xAPI.parametros = ''
      this.lstCuenta[0].documento = numc
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
    const tipo = this.Doc.tipo.toLowerCase()
    this.puntocuenta = false
    this.resolucion = false
    this.booPuntoCuenta = false
    this.lstCuenta = []


    this.setDescripcionPunto()
    this.puntocuenta = true
    this.resolucion = true

    if (tipo.indexOf('contratos') >= 0) {
      this.setDescripcionContratos()
    }

    if (tipo.indexOf('multiple') >= 0) {
      this.puntocuenta = false
      this.resolucion = false
      if (this.titulo == 'Salida') {
        // console.log('entrando')
        this.cargarPuntosdeCuenta()
        return true
      }

      this.toastrService.warning("Debe dirigirse al modulo de salida para usar esta opcion", `GDoc Salida`)



    }

    if (this.titulo == 'Salida') {
      this.puntocuenta = false
      this.resolucion = false
    }


  }


  cargarPuntosdeCuenta() {

    this.ngxService.startLoader("loader-aceptar")
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_CPuntoCuentaSalida'
    this.xAPI.parametros = '5'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        data.Cuerpo.map(e => {
          this.lstPuntosCuentas.push(e.cuen + ' | ' + e.udep + ' ' + e.fori.substring(0, 10))
        })
        this.ngxService.stopLoader("loader-aceptar")
        this.booPuntoCuenta = true
      },
      (error) => {
        console.error("No existe la funcion ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )
  }


  //Listar los archivos asociados al documento
  verArchivos(content) {
    // this.lstImg.push({ a: 1 })
    this.modalService.open(content, { size: 'lg' })

  }

  /**
   * Consultar datos generales del militar 
   */
  consultarCedula() {
    if (this.cedula == '') return false
    this.isPunto = true
    if (this.Doc.tipo.toLowerCase() == 'destitucion/punto de cuenta' || this.Doc.tipo.toLowerCase() == 'contratos/punto de cuenta') {
      this.isPunto = false
    } else {
      this.ngxService.startLoader("loader-aceptar")
      this.xAPI = {} as IAPICore
      this.xAPI.funcion = 'MPPD_CDatosBasicos'
      this.xAPI.parametros = this.cedula
      this.xAPI.valores = ''
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {

          const militar = data.Cuerpo.map(e => {
            e.resoluciones = JSON.parse(e.resoluciones)
            e.entradas = JSON.parse(e.entradas)
            e.componente = this.Componentes.filter(el => { return el.cod_componente == e.componente })[0].nombre_componente
            e.categoria = this.Categorias.filter(el => { return el.cod_categoria == e.categoria })[0].nombre_categoria
            e.clasificacion = this.Clasificaciones.filter(el => { return el.cod_clasificacion == e.clasificacion })[0].des_clasificacion
            e.grado = this.Grados.filter(el => { return el.cod_grado == e.grado })[0].nombres_grado
            return e
          })[0]

          if (data.Cuerpo.length > 0) {
            this.nmilitar = militar.nombres
            this.cargo = militar.grado + " " + militar.componente

          } else {
            this.cedula = ""
            this.nmilitar = ""
            this.cargo = ""
            this.toastrService.info("Debe dirigirse al departamento de resoluciones", `GDoc Resoluciones`)
          }

          this.ngxService.stopLoader("loader-aceptar")
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
        }

      )
    }
  }



  mensajeAgregarCuenta() {
    if (this.Doc.tipo.toLowerCase().indexOf('punto de cuenta') >= 0) {
      Swal.fire({
        title: 'Alerta',
        text: '¿Desea mantener los datos de la cuenta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Sí, estoy seguro'
      }).then((result) => {
        if (result.isConfirmed) {
          this.agregarCuenta(0)
        } else {
          this.agregarCuenta(1)
        }
      })
    } else {
      this.agregarCuenta(1)
    }
  }

  confirmarSalir() {
    Swal.fire({
      title: '¿Está seguro que desea salir?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.back();
      }
    });
  }


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    showToolbar: false,
    placeholder: '',
  };


  generarNumeroSerie() {
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = environment.funcion.NUMERO_DE_CONTROL
    this.xAPI.parametros = environment.coleciones.CONTADORES
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data !== undefined) {
          if (data.valor_actual !== undefined) {
            this.NUMERO_CONTROL = this.utilService.NuevoSemillero(data.valor_actual)
            this.registrar()
          }
        } else {
           this.toastrService.info('Falla en la generación del número de serie', 'Campo requerido')
        }

      },
      (error) => {
        console.error("No existe la funcion ", error)
      }
    )

  }


}



