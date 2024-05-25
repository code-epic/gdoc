import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento, IWKFCuenta, IWKFDependencia } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.scss']
})
export class PendientesComponent implements OnInit {


  mostrarCamposAdicionales: boolean = false;
  mostrarBotonOcultar: boolean = false;
  
  activarCamposAdicionales() {
      this.mostrarCamposAdicionales = !this.mostrarCamposAdicionales; 
      this.mostrarBotonOcultar = !this.mostrarBotonOcultar; 
  }


  // cerrarDialogo(): void {
  //     this.dialogRef.close();
  //   }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(BusquedaAvanzadaComponent, {
  //     panelClass: 'custom-dialog-container',
  //     height: '400px',
  //     maxWidth: '90vw',
  //     width: '900px',

  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('El diálogo fue cerrado');
  //   });
  // }


  
  fechaRango: FormGroup;

  public bzBusqueda = []

  public bzSeguimientoO = []
  public bzSeguimiento = []

  public fplazo: any
  public id_alerta = ''

  public buscar = ''
  public contenidoDocumento = ''
  public antes: boolean = false
  public despues: boolean = true
  public paginador: number = 10
  public de: number = 0
  public para: number = 9
  public posicionPagina = 0
  public cantidad = 0
  public blBuscar = false
  public max_paginador: number = 0
  public lstPaginas = []
  public actual: number = 1

  public lstAcciones = [
    { 'valor': '0', 'texto': 'EN PROCESO', 'visible': '1' },
    { 'valor': '1', 'texto': 'ANALISTA', 'visible': '1' },
    { 'valor': '2', 'texto': 'JEFE DE AREA', 'visible': '1' },
    { 'valor': '3', 'texto': 'BANDEJA DE ESPERA', 'visible': '1' },
    { 'valor': '4', 'texto': 'PRESIDENCIAL', 'visible': '1' },
    { 'valor': '5', 'texto': 'ESPERA DE OPINION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '6', 'texto': 'CONSULTORIA JURIDICA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '7', 'texto': 'AREA DE RESOLUCIONES', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '8', 'texto': 'SUB-DIRECCION', 'visible': '1' },
    { 'valor': '9', 'texto': 'DIRECCION GENERAL', 'visible': '1' },
    { 'valor': '10', 'texto': 'DESPACHO DEL MPPD', 'visible': '1' },  //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '11', 'texto': 'ARCHIVO', 'visible': '1' }
  ]

  public focus = true

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  seleccionLista(event) {
    this.longitud = 0;

    if (event.charCode == 13) {
      const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
      this.longitud = this.bzBusqueda.length
      this.bzBusqueda = this.bzSeguimientoO.filter((e) => { return patron.test(e.busqueda) })

      this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)
      this.max_paginador = this.bzBusqueda.length / 10
      this.cantidad = this.bzBusqueda.length
      this.MostrarPaginador()
      this.buscar = ''
    }
  }

  async ConsultarSeguimiento() {
    this.xAPI.funcion = 'WKF_CSeguimiento'
    this.xAPI.parametros = this.contenidoDocumento
    console.log("llego ConsultarSeguimiento")
    console.log(this.contenidoDocumento)
    console.log(this.xAPI)
    console.log("despues ConsultarSeguimiento")
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.bzSeguimientoO = data.Cuerpo.map((e) => {
          e.busqueda = this.utilService.ConvertirCadena(e.norigen + ' ' +
            e.ncontrol + ' ' + e.contenido + e.estatus_nombre + ' ' + e.remitente + ' ' + e.nombre
            + ' ' + e.creado + ' ' + e.salida + ' ' + e.unidad + ' ' + e.subdocumento
          )
          e.numc = e.ncontrol
          e.existe = e.anom == '' ? true : false;
          e.privado = e.priv == 1 ? true : false;
          e.color = 'green'
          e.s_texto = ''
          if (e.s_estatus > 0 || e.s_estatus < 10) {
            e.s_texto = e.s_estatus != null ? ' - ' + this.lstAcciones[e.s_estatus].texto : ''
          }

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
          e.resumenl = e.contenido.substring(0, 200)
          e.completed = false;
          return e
        })

        this.bzBusqueda = this.bzSeguimientoO
        this.longitud = this.bzBusqueda.length
        this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)
        console.log("llego")
        console.log(this.bzSeguimiento)
        this.cantidad = this.longitud
        this.max_paginador = this.cantidad / 10
        this.blBuscar = true
        this.MostrarPaginador()

      },
      (error) => {
        console.log('Error en la carga')
      }
    )
  }

  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.bzSeguimiento = this.bzBusqueda.slice(pag, pag + this.pageSize)
  }

  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }

  MostrarPaginador() {
    this.blBuscar = true
    this.lstPaginas = []
    this.antes = false

    if (this.max_paginador > 10) {
      this.max_paginador = 10
      this.despues = true
    } else {
      this.despues = false
    }
    for (var i = 0; i < this.max_paginador; i++) {
      var color = ''

      if (this.de > 0) {
        color = this.de / 10 == i ? 'bg-info text-white' : ''
        this.antes = true
      }
      if (this.de == 0 && i == 0) color = 'bg-info text-white'
      this.lstPaginas.push({
        "id": i + 1,
        "color": color
      })
    }
  }

  /**
 * Establecer la posicion del sistema en el buscador
 */
  posicion(pos: number) {
    console.log(pos);
    if (pos != this.actual) {
      this.actual = pos
      this.de = 10 * (pos - 1)
      this.para = (this.de - 1) + 10
      this.bzSeguimiento = this.bzBusqueda.slice(this.de, this.para)
      //this.consultarAPIBuscar()
    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    showToolbar: false,
    placeholder: '',
  };

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

  public bPDF = false

  closeResult = '';

  title = 'Documentos';
  placement = 'bottom-start';

  lineCountCache: number = 0;
  PosicionCuenta: number = -1;

  public fcreacion: any
  public forigen: any
  public fcuenta: any

  public fcreacionDate: NgbDate | null
  public forigenDate: NgbDate | null
  public fcuentaDate: NgbDate | null

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

  public xApi: IAPICore = {
    funcion: '',
    parametros: ''
  }
  routerDoc: { numc: string }

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

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef) {
  }

  async ngOnInit() {
    // this.ConsultarSeguimiento()
    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
      if (id == 'salida') {
        this.SalidaTipo()
        if (this.rutaActiva.snapshot.params.numc != undefined) {
          var numc = this.rutaActiva.snapshot.params.numc
          this.ncontrolt = 'Nro de Control'
          this.ncontrolv = true
          this.salidavisible = true
          this.camponumsalida = 4
          this.consultarDocumento(numc)
        }
      } else {
        if (this.rutaActiva.snapshot.params.numc != undefined) {
          var numc = this.rutaActiva.snapshot.params.numc
          if (numc == 'salida') this.SalidaTipo()
        }
        this.consultarDocumento(id)
      }
    } else {
      this.limpiarDoc()
    }
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu("/control")
    let prv = this.loginService.obtenerPrivilegiosMenu("/control")
    // console.log(prv)
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach(e => {
        if (e.nombre == "configurar") this.Configurar = true
      });
    }
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : []
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : []
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : []

    this.Configuracion = sessionStorage.getItem("MD_CConfiguracion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion"))) : []
    this.listarConfiguracion()
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.fechaRango = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
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
    return this.Doc.tipo.toLowerCase() == 'resolucion' || this.Doc.tipo.toLowerCase() == 'tramitacion por organo regular' || this.Doc.tipo.toLowerCase() == 'punto de cuenta'
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

  buscarDocumento(): void {
    console.log('llego buscar')
    this.ConsultarSeguimiento()
    const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar));
    this.bzBusqueda = this.bzSeguimientoO.filter((e) => patron.test(e.busqueda));
    this.longitud = this.bzBusqueda.length;
    this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize);
    this.max_paginador = this.bzBusqueda.length / 10;
    this.cantidad = this.bzBusqueda.length;
    this.MostrarPaginador();
    this.buscar = '';
  }

  limpiarDoc() {
    var dia = this.utilService.FechaActual()
    this.forigen = ''
    this.fplazo = ''
    this.Doc.ncontrol = ''
    this.Doc.norigen = ''
    this.Doc.nexpediente = ''
    this.Doc.codigo = '0'
    this.Doc.salida = ''
    this.Doc.tipo = ''
    this.Doc.remitente = ''
    this.Doc.unidad = ''
    this.Doc.comando = ''
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
    // console.log(this.estadoActual)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        console.log(data)
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
        this.lstCuenta = punto_cuenta.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : []
        this.lstTraza = traza.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const historial = this.Doc.historial != null ? JSON.parse(this.Doc.historial) : []
        this.lstHistorial = historial.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const hz_adjunto = this.Doc.hz_adjunto != null ? JSON.parse(this.Doc.hz_adjunto) : []
        this.lstHzAdjunto = hz_adjunto.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const dependencia = this.Doc.dependencias != null ? JSON.parse(this.Doc.dependencias) : []
        this.lstDependencias = dependencia.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const cuentasaux = this.Doc.puntodecuenta != null ? JSON.parse(this.Doc.puntodecuenta) : []
        this.lstPuntosCuentasAux = cuentasaux.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        this.toppingsaux.setValue('1')

        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false
        this.download = this.apiService.Dws(btoa("D" + this.Doc.ncontrol) + '/' + this.Doc.archivo)

        this.activarTipo = this.validarTipoDoc()
        console.log(this.Doc)
        // this.serializar =  btoa( JSON.stringify(this.Doc.norigen))
        // console.log( this.serializar)
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
    const modalRef = this.modalService.open(content, {
      centered: true,
      windowClass: 'my-custom-modal-class',
      size: 'lg',
      backdrop: false
    });
    modalRef['_windowCmptRef'].location.nativeElement.style.zIndex = '900';
  }
  
  close() {
    this.modalService.dismissAll();
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

  activarHistorial() {
    this.bHist = !this.bHist
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
    if (this.activarMensaje) return false
    this.activarMensaje = true
    Swal.fire({
      title: 'El Documento Registrado es # ' + msj,
      text: "¿Desea registar otro documento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowEscapeKey: true,
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

    if (this.Doc.contenido == '') {
      this.toastrService.info('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc Wkf.Agregar Cuentas`)
      return
    }
    let wfd = this.Doc.wfdocumento

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

        if (this.titulo == 'Salida') {
          this.insertarObservacion()
          this.salvarDependencias(wfd)
          this.lstPC = this.toppings.value

          this.salvarPuntoCuenta(wfd)
          this.ruta.navigate(['/salidas']);

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
    this.xAPI.valores = JSON.stringify({
      "documento": this.Doc.wfdocumento,
      "estado": this.estadoActual, //Estado que ocupa
      "estatus": this.estadoOrigen,
      "observacion": 'DOCUMENTO EDITADO EN SALIDA',
      "accion": '20',
      "usuario": usuario
    })

    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        await this.guardarAlerta(1)
        //this.ruta.navigate(['/salidas']);
        //this.location.back()
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
      }
    )
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
      this.xAPI.funcion = 'WKF_IDocumentoDependencia'
      this.xAPI.valores = ''
      this.xAPI.parametros = numc + ',' + this.lstDependencias[0].nombre
      console.log('insertando dependicia ', this.xAPI)
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
    console.log('entrando en confianza... ', cant)
    console.log('entrando en confianza... ', this.lstCuenta)
    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar")
      return
    } else {
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

    if (tipo.indexOf('punto') >= 0) {
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
          console.log('entrando')
          this.cargarPuntosdeCuenta()
          return true
        }
        this.toastrService.warning("Debe dirigirse al modulo de salida para usar esta opcion", `GDoc Salida`)
      }

      if (this.titulo == 'Salida') {
        this.puntocuenta = false
        this.resolucion = false
      }

    } else if (tipo == 'resolucion' ||
      tipo == 'tramitacion por organo regular' ||
      tipo == 'comision de servicio') {
      this.resolucion = true
    }
  }

  cargarPuntosdeCuenta() {

    this.ngxService.startLoader("loader-aceptar")
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

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  async consultarDocumentoSalida() {
    if (this.titulo == 'Salida') return false
    if (this.Doc.salida == '') return false
    let dwf = ''
    if (this.Doc.norigen != '') dwf = this.Doc.norigen
    this.xAPI.funcion = 'WKF_CDocumentoDetalleSalida'
    this.xAPI.parametros = '9,1,' + this.Doc.salida
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
          this.nasociacion = this.Doc.ncontrol
          this.Doc.ncontrol = ''
        });

        this.Doc.norigen = dwf
        this.selTipoDocumento()
        const punto_cuenta = this.Doc.subdocumento != null ? JSON.parse(this.Doc.subdocumento) : []
        this.lstCuenta = punto_cuenta.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })
        console.log(this.lstCuenta)

        const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : []
        this.lstTraza = traza.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const historial = this.Doc.historial != null ? JSON.parse(this.Doc.historial) : []
        this.lstHistorial = historial.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const hz_adjunto = this.Doc.hz_adjunto != null ? JSON.parse(this.Doc.hz_adjunto) : []
        this.lstHzAdjunto = hz_adjunto.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const dependencias = this.Doc.dependencias != null ? JSON.parse(this.Doc.dependencias) : []
        this.lstDependencias = dependencias.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false
        this.download = this.apiService.Dws(btoa("D" + this.Doc.ncontrol) + '/' + this.Doc.archivo)

        this.activarTipo = this.validarTipoDoc()
        // this.serializar =  btoa( JSON.stringify(this.Doc.norigen))
        // console.log( this.serializar)
      },
      (error) => {
        console.error(error)
      }
    )
  }
  buscarYCerrarModal() {
    this.modalService.dismissAll();
  }

  cerrarModal() {
    this.modalService.dismissAll();
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
}
