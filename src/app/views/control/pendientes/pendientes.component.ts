import {Component,OnInit} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import {NgbModal,NgbDate,NgbDateParserFormatter,} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import {IWKFAlerta,IDocumento} from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-pendientes",
  templateUrl: "./pendientes.component.html",
  styleUrls: ["./pendientes.component.scss"],

})

export class PendientesComponent implements OnInit {
  mostrarCamposAdicionales: boolean = false;
  mostrarBotonOcultar: boolean = false;

  activarCamposAdicionales() {
    this.mostrarCamposAdicionales = !this.mostrarCamposAdicionales;
    this.mostrarBotonOcultar = !this.mostrarBotonOcultar;
  }

  fechaRango: FormGroup;

  public bzBusqueda = [];

  public bzSeguimientoO = [];
  public bzSeguimiento = [];

  public fplazo: any;
  public cargador: boolean = true;
  public sinDatos: boolean = false;
  public buscar = "";
  public contenidoDocumento = "";
  public antes: boolean = false;
  public despues: boolean = true;
  public paginador: number = 10;
  public de: number = 0;
  public para: number = 9;
  public posicionPagina = 0;
  public cantidad = 0;
  public blBuscar = false;
  public max_paginador: number = 0;
  public lstPaginas = [];
  public actual: number = 1;
  public radio: number = 0;
  public tipoDocumento: number = 0;
  public optfecha: string = '0';
  public opttodos: string = '0';

  public desde: any;
  public hasta: any;

  public estadoActual = 1;
  public estadoOrigen = 1;
  public bPDF = false;
  public fcreacion: any;
  public forigen: any;
  public fcuenta: any;

  public fcreacionDate: NgbDate | null;
  public forigenDate: NgbDate | null;
  public fcuentaDate: NgbDate | null;

  public subfechaDate: NgbDate | null;

  public editar: boolean = false;
  public puntocuenta: boolean = false;
  public salidavisible: boolean = true;
  public resolucion: boolean = false;
  public activarMensaje = false;
  public vistacontenido: boolean = false;
  public detalle: string = "";

  public cuenta: string = "";
  public resumen: string = "";
  public subfecha: string = "";
  public cedula: string = "";
  public cargo: string = "";
  public nmilitar: string = "";
  public salida: string = "Nro. de Salida";
  public booPuntoCuenta: boolean = false;

  public Doc: IDocumento = {
    ncontrol: "",
    wfdocumento: 0,
    fcreacion: "",
    forigen: "",
    norigen: "",
    salida: "",
    tipo: "0",
    remitente: "0",
    unidad: "0",
    comando: "0",
    contenido: "",
    instrucciones: "",
    codigo: "0",
    nexpediente: "",
    creador: "",
    archivo: "",
    privacidad: 0,
    subdocumento: "",
    dependencias: "",
    puntodecuenta: "",
  };

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: "",
    usuario: "",
    observacion: "",
  };

  public lstT = []; //Objeto Tipo documento
  public lstR = []; //Objeto Remitente
  public lstU = []; //Objeto Unidad
  public lstC = []; //Objeto Comando
  public lstCA = []; //Objeto Comando
  public lstCuenta = []; //Objeto Unidad

  public lstHzAdjunto = []; //Historico de documentos adjuntos
  public lstTraza = [];
  public lstHistorial = [];
  // public lstImg = [];
  public lstDependencias = [];
  public titulo = "Documento";
  // public nasociacion = "";

  public download: any;

  // public bHist = false;

  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public Configuracion: any;
  // public serializar: string = "";
  public Configurar: boolean = false;

  public activarTipo = false; // activar tipo de documento

  public xApi: IAPICore = {
    funcion: "",
    parametros: "",
  };
  // routerDoc: { numc: string };

  toppings = new FormControl("");
  toppingsaux = new FormControl("");

  // lstPC: string[] = []; // Auxiliar para mappear las cuentas de toppings
  lstPuntosCuentas: string[] = [];
  lstPuntosCuentasAux: [];
  public SubMenu = [];

  public isPunto: boolean = true;
  public sCedula: string = "Cédula";
  public sGrado: string = "Grado / Jerarquía";
  public sNombre: string = "Nombres y Apellidos";

  public lstAcciones = [
    { valor: "0", texto: "EN PROCESO", visible: "1" },
    { valor: "1", texto: "ANALISTA", visible: "1" },
    { valor: "2", texto: "JEFE DE AREA", visible: "1" },
    { valor: "3", texto: "BANDEJA DE ESPERA", visible: "1" },
    { valor: "4", texto: "PRESIDENCIAL", visible: "1" },
    { valor: "5", texto: "ESPERA DE OPINION", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "6", texto: "CONSULTORIA JURIDICA", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "7", texto: "AREA DE RESOLUCIONES", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "8", texto: "SUB-DIRECCION", visible: "1" },
    { valor: "9", texto: "DIRECCION GENERAL", visible: "1" },
    { valor: "10", texto: "DESPACHO DEL MPPD", visible: "1" }, //7/5/3 Asociado a los plazos en las alertas
    { valor: "11", texto: "ARCHIVO", visible: "1" },
  ];

  // public focus = true;

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter
  ) { }

  async ngOnInit() {

    await this.loginService.Iniciar();
    this.SubMenu = await this.loginService.obtenerSubMenu("/control");
    let prv = this.loginService.obtenerPrivilegiosMenu("/control");
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach((e) => {
        if (e.nombre == "configurar") this.Configurar = true;
      });
    }
    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : [];
    this.Grados =
      sessionStorage.getItem("MPPD_CGrado") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado")))
        : [];
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : [];
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : [];

    this.Configuracion =
      sessionStorage.getItem("MD_CConfiguracion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion")))
        : [];
    this.listarConfiguracion();
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.fechaRango = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
  }

  async ConsultarSeguimiento(funcion: string) {
    let desde = ''
    let hasta = ''
    this.xAPI.funcion = funcion;
    this.sinDatos = false


    desde = this.desde == undefined ? new Date().getFullYear() - 5 + '-01-01' : this.desde
    hasta = this.hasta == undefined ? new Date().toISOString().slice(0, 10) : this.hasta
 
    if(this.xAPI.funcion == "WKF_CSeguimiento"){
      if(this.tipoDocumento  == 1){
        this.xAPI.funcion = "WKF_CSeguimiento_Cedula"
        this.xAPI.parametros = this.buscar;
        // console.log(this.xAPI.parametros)
      }else{
        this.xAPI.parametros = this.contenidoDocumento + ',' + desde + ',' + hasta + ',' + this.buscar + ',' 
        + this.tipoDocumento + ',' + this.opttodos;
        // console.log(this.xAPI.parametros)
      }
    }else{
        this.xAPI.parametros = this.contenidoDocumento + ',' + desde + ',' + hasta + ',' + this.Doc.contenido.trim() + ',' 
        + this.Doc.tipo + ',' + this.Doc.remitente + "," + this.Doc.unidad + "," + this.Doc.comando + "," + this.Doc.instrucciones
        + ',' + this.optfecha
        // console.log(this.xAPI.parametros)
      
    }
    


    this.cargador = false;
    this.ngxService.startLoader("loader-aceptar");
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo.length);
        this.bzSeguimientoO = data.Cuerpo.map((e) => {
          e.busqueda = this.utilService.ConvertirCadena(
            e.norigen +
            " " +
            e.ncontrol +
            " " +
            e.contenido +
            e.estatus_nombre +
            " " +
            e.remitente +
            " " +
            e.nombre +
            " " +
            e.creado +
            " " +
            e.salida +
            " " +
            e.unidad +
            " " +
            e.subdocumento
          );
          e.numc = e.ncontrol;
          e.existe = e.anom == "" ? true : false;
          e.privado = e.priv == 1 ? true : false;
          e.color = "green";
          e.s_texto = "";
          if (e.s_estatus > 0 || e.s_estatus < 10) {
            e.s_texto =
              e.s_estatus != null
                ? " - " + this.lstAcciones[e.s_estatus].texto
                : "";
          }

          switch (e.tdoc.toLowerCase()) {
            case "punto de cuenta":
              e.simbolo = "-P";
              e.color = "green";
              break;
            case "tramitacion por organo regular":
              e.simbolo = "-T";
              e.color = "brown";
              break;
            case "resolucion":
              e.simbolo = "-R";
              e.color = "orange";
              break;
            default:
              e.simbolo = "";
              break;
          }
          e.resumenl = e.contenido.substring(0, 200);
          e.completed = false;
          return e;
        });

        this.bzBusqueda = this.bzSeguimientoO;
        this.longitud = this.bzBusqueda.length;
        this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize);
        this.cantidad = this.longitud;
        this.max_paginador = this.cantidad / 10;
        this.blBuscar = true;
        this.MostrarPaginador();
       
        this.ngxService.stopLoader("loader-aceptar");
        this.contenidoDocumento = ""
        this.buscar = ""
        this.tipoDocumento = 0
        this.Doc.contenido = '' 
        this.Doc.tipo = ''
        this.cargador = true;
        this.Doc.remitente = ''  
        this.Doc.unidad = ''
        this.Doc.comando = ''
        this.Doc.instrucciones = ''
        this.mostrarCamposAdicionales= false;
        this.mostrarBotonOcultar= false; 
        this.desde == undefined;
        this.hasta == undefined;
        this.opttodos = "0";
        if (data.Cuerpo.length === 0) {
          this.sinDatos = true;
         } else {
           this.sinDatos = false;
         }
      },
      (error) => {
        console.log("Error en la carga");
      }
    );
  }

  pageChangeEvent(e) {
    this.pageSize = e.pageSize;
    this.recorrerElementos(e.pageIndex);
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina;
    this.bzSeguimiento = this.bzBusqueda.slice(pag, pag + this.pageSize);
  }

  //Consultar un enlace
  constancia(id: string) {
    const estado = 1;
    const estatus = 1;
    return btoa(estado + "," + estatus + "," + id);
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



  setDescripcionPunto() {
    this.sCedula = "Cédula";
    this.sGrado = "Grado / Jerarquía";
    this.sNombre = "Nombres y Apellidos";
  }

  setDescripcionContratos() {
    this.sCedula = "# Contrato";
    this.sGrado = "Rif / Razón Social";
    this.sNombre = "Monto Total";
  }

  validarTipoDoc(): boolean {
    return (
      this.Doc.tipo.toLowerCase() == "resolucion" ||
      this.Doc.tipo.toLowerCase() == "tramitacion por organo regular" ||
      this.Doc.tipo.toLowerCase() == "punto de cuenta"
    );
  }

  listarConfiguracion() {
    this.Configuracion.forEach((e) => {
      switch (e.tipo) {
        case "1":
          this.lstT.push(e);
          break;
        case "2":
          this.lstR.push(e);
          break;
        case "3":
          this.lstU.push(e);
          break;
        case "4":
          this.lstC.push(e);
          break;
        case "5":
          this.lstCA.push(e);
          break;
      }
    });
  }

  buscarDocumento(): void {
    this.vistacontenido = true;

    this.consultarDocument(undefined)
    
    // const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar));
    // this.bzBusqueda = this.bzSeguimientoO.filter((e) => patron.test(e.busqueda));
    // this.longitud = this.bzBusqueda.length;
    // this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize);
    // this.max_paginador = this.bzBusqueda.length / 10;
    // this.cantidad = this.bzBusqueda.length;
    // this.MostrarPaginador();
    // this.buscar = '';
    
  }

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  async consultarDocumento(numBase64: string) {
    const base = atob(numBase64);
    this.xAPI.funcion = "WKF_CDocumentoDetalle";
    this.xAPI.parametros = base;
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        data.Cuerpo.forEach((e) => {
          this.Doc = e;
          this.fcreacionDate = NgbDate.from(
            this.formatter.parse(this.Doc.fcreacion.substring(0, 10))
          );
          this.forigenDate = NgbDate.from(
            this.formatter.parse(this.Doc.forigen.substring(0, 10))
          );
          if (e.alerta != null) {
            this.fplazo = NgbDate.from(
              this.formatter.parse(e.alerta.substring(0, 10))
            );
            this.WAlerta.activo = 1;
            this.WAlerta.documento = this.Doc.wfdocumento;
            this.WAlerta.estado = this.estadoActual;
            this.WAlerta.estatus = this.estadoOrigen;
            this.WAlerta.usuario = this.loginService.Usuario.id;
          }
        });

        this.selTipoDocumento();
        const punto_cuenta =
          this.Doc.subdocumento != null
            ? JSON.parse(this.Doc.subdocumento)
            : [];
        this.lstCuenta = punto_cuenta.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : [];
        this.lstTraza = traza.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        const historial =
          this.Doc.historial != null ? JSON.parse(this.Doc.historial) : [];
        this.lstHistorial = historial.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        const hz_adjunto =
          this.Doc.hz_adjunto != null ? JSON.parse(this.Doc.hz_adjunto) : [];
        this.lstHzAdjunto = hz_adjunto.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        const dependencia =
          this.Doc.dependencias != null
            ? JSON.parse(this.Doc.dependencias)
            : [];
        this.lstDependencias = dependencia.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        const cuentasaux =
          this.Doc.puntodecuenta != null
            ? JSON.parse(this.Doc.puntodecuenta)
            : [];
        this.lstPuntosCuentasAux = cuentasaux.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        this.toppingsaux.setValue("1");

        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false;
        this.download = this.apiService.Dws(
          btoa("D" + this.Doc.ncontrol) + "/" + this.Doc.archivo
        );

        this.activarTipo = this.validarTipoDoc();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }

  open(content) {
    const modalRef = this.modalService.open(content, {
      centered: true,
      windowClass: "my-custom-modal-class",
      size: "lg",
      backdrop: false,
    });
    modalRef["_windowCmptRef"].location.nativeElement.style.zIndex = "900";
  }

  close() {
    this.modalService.dismissAll();
    // this.desde = undefined;
    // this.hasta = undefined;
  }

  selTipoDocumento() {
    const tipo = this.Doc.tipo.toLowerCase();
    this.puntocuenta = false;
    this.resolucion = false;
    this.booPuntoCuenta = false;
    this.lstCuenta = [];

    if (tipo.indexOf("punto") >= 0) {
      this.setDescripcionPunto();
      this.puntocuenta = true;
      this.resolucion = true;

      if (tipo.indexOf("contratos") >= 0) {
        this.setDescripcionContratos();
      }

      if (tipo.indexOf("multiple") >= 0) {
        this.puntocuenta = false;
        this.resolucion = false;
        if (this.titulo == "Salida") {
          this.cargarPuntosdeCuenta();
          return true;
        }
        this.toastrService.warning(
          "Debe dirigirse al modulo de salida para usar esta opcion",
          `GDoc Salida`
        );
      }

      if (this.titulo == "Salida") {
        this.puntocuenta = false;
        this.resolucion = false;
      }
    } else if (
      tipo == "resolucion" ||
      tipo == "tramitacion por organo regular" ||
      tipo == "comision de servicio"
    ) {
      this.resolucion = true;
    }
  }

  cargarPuntosdeCuenta() {
    this.ngxService.startLoader("loader-aceptar");
    this.xAPI.funcion = "WKF_CPuntoCuentaSalida";
    this.xAPI.parametros = "5";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map((e) => {
          this.lstPuntosCuentas.push(
            e.cuen + " | " + e.udep + " " + e.fori.substring(0, 10)
          );
        });
        this.ngxService.stopLoader("loader-aceptar");
        this.booPuntoCuenta = true;
      },
      (error) => {
        console.error("No existe la funcion ", error);
        this.ngxService.stopLoader("loader-aceptar");
      }
    );
  }

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  buscarYCerrarModal() {

     this.desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
     this.hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);
    this.vistacontenido = true;
    
    this.ConsultarSeguimiento("WKF_CSeguimiento_Detalle");
    this.modalService.dismissAll();
  }

  consultarDocument(event: any) {
    //  this.desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
    //  this.hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);

    if (event == undefined || event.charCode == 13) {
      this.vistacontenido = true;
      this.ConsultarSeguimiento("WKF_CSeguimiento")
    }
  }

  consultarDocumentDetalle(event: any) {
    if (event == undefined || event.charCode == 13) {
      this.vistacontenido = true;
      this.ConsultarSeguimiento("WKF_CSeguimiento_Detalle")
      this.modalService.dismissAll();
    }
   
  }
}
