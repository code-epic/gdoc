import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento, IWKFCuenta, IWKFDependencia } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SubDocumento } from '../ministerial/ministerial.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface Isbusqueda {
  bnrocontrol?: string,
  bfrecepcion?: string,
  bestatus?: string,
  bclasificacion?: string,
  bdecision?: string,
  bremitente?: string,
  bcomando?: string,
  bunidad?: string
  baccion?: string,
  basunto?: string
}


@Component({
  selector: 'app-sbuscador',
  templateUrl: './sbuscador.component.html',
  styleUrls: ['./sbuscador.component.scss']
})
export class SbuscadorComponent implements OnInit {

  public asunto : string = ""

  public Doc: IDocumento = {
    ncontrol: '',
    wfdocumento: 0,
    fcreacion: '',
    forigen: '',
    norigen: '',
    salida: '',
    tipo: '',
    remitente: '',
    unidad: '',
    comando: '',
    contenido: '',
    instrucciones: '',
    codigo: '',
    nexpediente: '',
    creador: '',
    archivo: '',
    privacidad: 0,
    subdocumento: '',
    dependencias: '',
    puntodecuenta: '',
  }

  public SubDocumento: SubDocumento = {
      subdocumento: 0,
      cuenta: '',
      estatus: '0',
      decision: '',
      accion: '',
      comentario: '',
      historico: '',
      archivo: '',
      nombre_archivo: '',
      fecha: '',
      usuario: ''
  } 

  public parametrosBusqueda: Isbusqueda = {
    bnrocontrol: this.SubDocumento.cuenta,
    bfrecepcion: this.SubDocumento.fecha,
    bestatus: this.SubDocumento.estatus,
    bclasificacion: this.Doc.tipo,
    bdecision: this.SubDocumento.decision,
    bremitente: this.Doc.remitente,
    bcomando: this.Doc.comando,
    bunidad: this.Doc.unidad,
    baccion: this.SubDocumento.accion,
    basunto: this.asunto
  }

  public fechaInicio: any
  public fechaFin: any

  public unidad = ''
  public comando = ''

  public opttodos: string = '0';

  estadoInicial = 'inicial'; // Define el estado inicial

  // Función para cambiar el estado inicial
  cambiarEstadoInicial() {
    this.estadoInicial = 'nuevoEstado'; // Cambia al nuevo estado según requerido
  }

  public mostrarCampos: boolean = false

  public verMasCampos() {
    this.mostrarCampos = !this.mostrarCampos
  }

  public bzBusqueda = []

  public bzSeguimientoO = []
  public bzSeguimiento = []

  public fplazo: any
  public id_alerta = ''

  public buscar = ''
  public buscar1 = ''
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
  public lstDatos = []

  public actual: number = 1
  public tipoDocumento: number = 0;
  public vistacontenido: boolean = false;
  public contenidoDocumento = "";
  public cargador: boolean = true;
  public optfecha: string = '0';

  public desde: any;
  public hasta: any;

  fechaRango: FormGroup;



  public xlstAcciones = [
    { 'valor': '5', 'texto': 'ESPERA DE OPINION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '6', 'texto': 'CONSULTORIA JURIDICA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '7', 'texto': 'AREA DE RESOLUCIONES', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '8', 'texto': 'SUB-DIRECCION', 'visible': '1' },
    { 'valor': '9', 'texto': 'DIRECCION GENERAL', 'visible': '1' },
    { 'valor': '10', 'texto': 'DESPACHO DEL MPPD', 'visible': '1' },  //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '11', 'texto': 'ARCHIVO', 'visible': '1' },
    { 'valor': '0', 'texto': 'EN PROCESO', 'visible': '1' },
    { 'valor': '1', 'texto': 'ANALISTA', 'visible': '1' },
    { 'valor': '2', 'texto': 'JEFE DE AREA', 'visible': '1' },
    { 'valor': '3', 'texto': 'BANDEJA DE ESPERA', 'visible': '1' },
    { 'valor': '4', 'texto': 'PRESIDENCIAL', 'visible': '1' },
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
  public frecepcion: NgbDate | null


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
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private dialog: MatDialog) {
  }

  async ngOnInit() {
    await this.ConsultarSeguimiento()
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

    this.close()
  }

  buscarDocumento(): void {
    this.vistacontenido = true;
    this.cargador = false

    this.consultarDocument(undefined)
    
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = 'WKF_CSeguimientoSecretaria'
    this.xAPI.parametros = 'PUNTO DE CUENTA,' + this.SubDocumento.estatus
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstDatos = data.Cuerpo
        //onsole.log( JSON.parse( this.lstDatos[0].subdocumento ) )
        // console.log(this.lstDatos)
        this.ngxService.stopLoader("loader-aceptar")
        
        this.cargador = true
      },
      (error) => {
        console.error("No existe la funcion ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )
    

  }

  getFecha(e) : string {
    let fecha = ''
    let d =  JSON.parse( e ) 
    
    if (d!=null){
      fecha = d[0].fecha 
    }else{
      fecha = '2000-01-01'
    }
    return fecha
  }


  realizarBusquedaFecha(fecha: Date): void {
    this.bzBusqueda = this.bzSeguimientoO.filter((e) => {
      const fechaEvento = new Date(e.fecha);
      return fechaEvento.toDateString() === fecha.toDateString(); // Comparar solo la parte de fecha sin la hora
    });
    this.actualizarResultados();
  }

  realizarBusqueda(campo: string, valor: string): void {
    this.bzBusqueda = this.bzSeguimientoO.filter((e) => new RegExp(valor).test(e[campo]));
    console.log(this.bzBusqueda);
    
    this.actualizarResultados();
    this.limpiarCamposBusqueda();
  }

  actualizarResultados(): void {
    this.longitud = this.bzBusqueda.length;
    this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize);
    this.max_paginador = this.bzBusqueda.length / 10;
    this.cantidad = this.bzBusqueda.length;
    this.MostrarPaginador();
    this.close();
  }

  limpiarCamposBusqueda(): void {
    // Limpiar los campos de búsqueda después de realizar la búsqueda
    this.Doc.ncontrol = '';
    this.Doc.forigen = null;
    this.SubDocumento.estatus = '';
    // Limpiar el resto de campos de búsqueda según sea necesario
  }

  consultarDocument(event: any) {
    if (event == undefined || event.charCode == 13) {
      this.vistacontenido = true;
      this.ConsultarSeguimiento()
    }
  }

  async ConsultarSeguimiento() {
    let desde = ''
    let hasta = ''
    this.xAPI = {} as IAPICore
    this.xAPI.funcion = "WKF_CSeguimiento";

    if (this.contenidoDocumento != "") {
      desde = this.desde == undefined ? '2024-01-01' : this.desde
      hasta = this.hasta == undefined ? '2024-12-31' : this.hasta
      this.xAPI.parametros = this.contenidoDocumento + ',' + desde + ',' + hasta + ',' + this.buscar + ',' + this.tipoDocumento
      console.log(this.xAPI.parametros)
    } else {
      return false
    }


    this.cargador = false;
    this.ngxService.startLoader("loader-aceptar");
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
      },
      (error) => {
        console.log("Error en la carga");
      }
    );
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
    this.blBuscar = true;
    this.lstPaginas = [];
    this.antes = false;

    if (this.max_paginador >= 10) {
      this.max_paginador = 10;
      this.despues = true;
    } else {
      this.despues = false;
    }
    for (var i = 0; i < this.max_paginador; i++) {
      var color = "";

      if (this.de > 0) {
        color = this.de / 10 == i ? "bg-info text-white" : "";
        this.antes = true;
      }
      if (this.de == 0 && i == 0) color = "bg-info text-white";
      this.lstPaginas.push({
        id: i + 1,
        color: color,
      });
    }
  }

  /**
 * Establecer la posicion del sistema en el buscador
 */
  posicion(pos: number) {
    if (pos != this.actual) {
      this.actual = pos;
      this.de = 10 * (pos - 1);
      this.para = this.de - 1 + 10;
      this.bzSeguimiento = this.bzBusqueda.slice(this.de, this.para);
      this.MostrarPaginador();
      //this.consultarAPIBuscar()
    }
  }


  buscarYCerrarModal() {

    this.desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
    this.hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);
    this.vistacontenido = true;
    this.ConsultarSeguimiento();
    this.modalService.dismissAll();
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


  async consultarDocumento(numBase64: string) {
    const base = atob(numBase64)

    this.xAPI = {} as IAPICore
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
    this.xAPI = {} as IAPICore
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
    this.xAPI = {} as IAPICore
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
}