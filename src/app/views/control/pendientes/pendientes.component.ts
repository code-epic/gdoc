import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import {NgbModal,NgbDate,NgbDateParserFormatter,} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import {IWKFAlerta,IDocumento,} from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from "@angular/forms";
import { PendientesService } from "src/app/core/service/control/pendientes.service";

@Component({
  selector: "app-pendientes",
  templateUrl: "./pendientes.component.html",
  styleUrls: ["./pendientes.component.scss"],
})

export class PendientesComponent implements OnInit {

  mostrarCamposAdicionales: boolean = false;
  mostrarBotonOcultar: boolean = false;
  fechaRango: FormGroup;

  public bzBusqueda = [];
  public numeroPlaceholder: string = "NÚMERO";
  public bzSeguimientoO = [];
  public bzSeguimiento = [];

  // public fplazo: any;
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
  public tipoDocumento: string = "0";
  public optfecha: string = "0";
  public opttodos: string = "0";

  public desde: any;
  public hasta: any;

  public estadoActual = 1;
  public estadoOrigen = 1;
  public bPDF = false;
  public fcreacion: any;
  public forigen: any;
  public fcuenta: any;
  public puntocuenta: boolean = false;
  public resolucion: boolean = false;
  public vistacontenido: boolean = false;
  public salida: string = "Nro. de Salida";
  public booPuntoCuenta: boolean = false;

  public Doc: IDocumento = {};

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
  
  public titulo = "Documento";

  public download: any;
  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public Configuracion: any;
  public Configurar: boolean = false;

  public xApi: IAPICore = {
    funcion: "",
    parametros: "",
  };

  toppings = new FormControl("");
  toppingsaux = new FormControl("");

  lstPuntosCuentas: string[] = [];
  lstPuntosCuentasAux: [];
  public SubMenu = [];

  public isPunto: boolean = true;
  public sCedula: string = "Cédula";
  public sGrado: string = "Grado / Jerarquía";
  public sNombre: string = "Nombres y Apellidos";

  public lstAcciones = [];

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  longitud = 0;
  pageSize = 10;
  pageEvent: PageEvent;

  form:FormGroup;
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter, 
    public pendienteSrv : PendientesService,
    private fb:FormBuilder
  ) {

    this.lstAcciones = this.pendienteSrv.getAction();
    this.Componentes = this.pendienteSrv.getComponent();
    this.Grados = this.pendienteSrv.getDegrees();
    this.Categorias = this.pendienteSrv.getCategories();
    this.Clasificaciones = this.pendienteSrv.getClassifications();
    this.Configuracion = this.pendienteSrv.getSetting();
    this.listarConfiguracion();
    this.getDate();
  }

  async ngOnInit() {
    await this.loginService.Iniciar();
    this.SubMenu = await this.loginService.obtenerSubMenu("/control");
    let prv = this.loginService.obtenerPrivilegiosMenu("/control");
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach((e) => {
        if (e.nombre == "configurar") this.Configurar = true;
      });
    } 

    // ESTE BETA SIEMPRE DEBE ESTAR EN EL NGONINIT 
    // NO PUEDE ESTAR EN EL CONSTRUCTOR RECORDEMOS QUE EL CONSTRUCTOR VA SIEMPRE ANTES QUE LAS LIBRERIAS DE ANGULAR 
    this.form = this.fb.group({
      tipoDocumento: new FormControl("valor por defecto", [Validators.required]),
      var3: new FormControl("222", [Validators.required]),
      var2: new FormControl("333", [Validators.required]),
    });

    console.log("************************************************");
    console.log("ESTE ES EL JSON QUE VA PARA EL BACKEND DE EJEMPL");
    console.log(this.form.getRawValue());
    console.log("************************************************");

  

  }

  async ConsultarSeguimiento(funcion: string) {
    let desdeLocal = "";
    let hastaLocal = "";
    this.xAPI.funcion = funcion;
    this.sinDatos = false;
    

    desdeLocal = this.desde == undefined || this.desde == "1900-01-01" ? new Date().getFullYear() - 5 + "-01-01" : this.desde;
    hastaLocal = this.hasta == undefined || this.hasta == "1900-01-01" ? new Date().toISOString().slice(0, 10) : this.hasta;

    if (this.xAPI.funcion == "WKF_CSeguimiento") {
      if (this.tipoDocumento == "1" || this.tipoDocumento == "5") {
        this.xAPI.funcion = "WKF_CSeguimiento_Cedula";
        this.xAPI.parametros = this.buscar + "," + this.tipoDocumento;
        // console.log(this.xAPI.parametros);

      } else {
        this.xAPI.parametros = this.contenidoDocumento + "," +
        desdeLocal + "," + hastaLocal + "," + this.buscar +  "," + this.tipoDocumento + "," + this.opttodos;
        // console.log(this.xAPI.parametros);
      }
    } else {
      this.xAPI.parametros = this.contenidoDocumento + "," + desdeLocal + "," + hastaLocal + "," + this.Doc.contenido.trim() +
        "," + this.Doc.tipo + "," + this.Doc.remitente + "," + this.Doc.unidad + "," + this.Doc.comando +"," + this.Doc.instrucciones +
        "," + this.optfecha;
      // console.log(this.xAPI.parametros)
    }

    this.cargador = false;
    this.ngxService.startLoader("loader-aceptar");
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzSeguimientoO = data.Cuerpo.map((e) => {
          e.busqueda = this.utilService.ConvertirCadena( e.norigen + " " + e.ncontrol + " " + e.contenido + e.estatus_nombre + " " +  
          e.remitente + " " + e.nombre + " " + e.creado + " " + e.salida + " " + e.unidad + " " + e.subdocumento
          );
         
          e.numc = e.ncontrol;
          e.existe = e.anom == "" ? true : false;
          e.privado = e.priv == 1 ? true : false;
          e.color = "green";
          e.s_texto = "";

          if (e.s_estatus > 0 || e.s_estatus < 10) {
            e.s_texto = e.s_estatus != null ? " - " + this.lstAcciones[e.s_estatus].texto : "";
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
        this.clear();
        this.ngxService.stopLoader("loader-aceptar");
        
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

    this.consultarDocument(undefined);

    // const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar));
    // this.bzBusqueda = this.bzSeguimientoO.filter((e) => patron.test(e.busqueda));
    // this.longitud = this.bzBusqueda.length;
    // this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize);
    // this.max_paginador = this.bzBusqueda.length / 10;
    // this.cantidad = this.bzBusqueda.length;
    // this.MostrarPaginador();
    // this.buscar = '';
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
  }

  selTipoDocumento() {
    const tipo = this.Doc.tipo.toLowerCase();
    this.puntocuenta = false;
    this.resolucion = false;
    this.booPuntoCuenta = false;
    // this.lstCuenta = [];

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

  searchAndCloseModal() {
    this.desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
    this.hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);

    this.vistacontenido = true;
    this.ConsultarSeguimiento("WKF_CSeguimiento_Detalle");
    this.modalService.dismissAll();

  }

  consultarDocument(event: any) {
    if (event == undefined || event.charCode == 13) {
      this.desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
      this.hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);
      this.vistacontenido = true;
      this.ConsultarSeguimiento("WKF_CSeguimiento");
    }
  }

  consultarDocumentDetalle(event: any) {
    if (event == undefined || event.charCode == 13) {
      this.vistacontenido = true;
      this.ConsultarSeguimiento("WKF_CSeguimiento_Detalle");
      this.modalService.dismissAll();
    }
  }

  onTipoDocumentoChange(event) {
    this.numeroPlaceholder = this.pendienteSrv.getPlaceholderByTipoDocumento(event.value);
  }
  
  getDate() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const fechaInicial = new Date(year - 5, month, 1);
    this.fechaRango = new FormGroup({
      start: new FormControl(fechaInicial),
      end: new FormControl(today),
    });
  }


  activarCamposAdicionales() {
    this.mostrarCamposAdicionales = !this.mostrarCamposAdicionales;
    this.mostrarBotonOcultar = !this.mostrarBotonOcultar;
  }

  clear(){
        this.contenidoDocumento = "";
        this.buscar = "";
        this.tipoDocumento = "0";
        this.Doc.contenido = "";
        this.Doc.tipo = "";
        this.cargador = true;
        this.Doc.remitente = "";
        this.Doc.unidad = "";
        this.Doc.comando = "";
        this.Doc.instrucciones = "";
        this.mostrarCamposAdicionales = false;
        this.mostrarBotonOcultar = false;
        this.desde = undefined;
        this.hasta = undefined;
        this.fechaRango.value.start = undefined;
        this.fechaRango.value.end = undefined;
        this.opttodos = "0";
  }
  
}
