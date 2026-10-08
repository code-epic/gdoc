import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbModal,
  NgbDateStruct,
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import Swal from "sweetalert2";

import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import {
  IWKFAlerta,
  IDocumento,
  IWKFDocumento,
  IWKFCuenta,
  IWKFDependencia,
} from "src/app/services/control/documentos.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";

import { Location } from "@angular/common";
import { FormControl } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-documento",
  templateUrl: "./documento.component.html",
  styleUrls: ["./documento.component.scss"],
})
export class DocumentoComponent implements OnInit, OnDestroy {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    showToolbar: false,
    placeholder: "",
  };

  public estadoActual = 1;
  public estadoOrigen = 1;

  public ncontrolv = true; // visibilidad del input numero de control
  public ncontrolt = "Número de Control";
  public remitentet = "Remitente";
  public origenvisible: boolean = true; // Visibilidad del Input Numero de Origen
  public fsalida = "Fecha de Creación (*)";
  public forigenv = true; // Visibilidad de Input Fecha Origen

  public camposalida = 2;
  public camposfechasalida = 3;
  public camponumsalida = 2;

  masterSelected: boolean;
  checklist: any;
  checkedList: any;

  public bPDF = false;

  closeResult = "";

  title = "Documentos";
  placement = "bottom-start";

  lineCountCache: number = 0;
  PosicionCuenta: number = -1;

  // editor: Editor = new Editor;
  // xeditor: Editor = new Editor;

  public fcreacion: any;
  public forigen: any;
  public fcuenta: any;
  public fplazo: any;

  public forigenDate: NgbDate | null;
  public fcuentaDate: NgbDate | null;

  public subfechaDate: NgbDate | null;

  public editar: boolean = false;
  public puntocuenta: boolean = false;
  public salidavisible: boolean = true;
  public resolucion: boolean = false;
  public activarMensaje = false;

  public detalle: string = "";

  public cuenta: string = "";
  public resumen: string = "";
  public subfecha: string = "";
  public cedula: string = "";
  public cargo: string = "";
  public nmilitar: string = "";
  public salida: string = "Nro. de Salida";
  public booPuntoCuenta: boolean = false;

  public WkDoc: IWKFDocumento = {
    nombre: "",
    estado: 0,
    estatus: 0,
    workflow: 0,
    observacion: "",
    usuario: "",
  };

  public WkCuenta: IWKFCuenta = {
    documento: 0,
    cuenta: "",
    estado: 0,
    estatus: 0,
    detalle: "",
    resumen: "",
    cedula: "",
    cargo: "",
    nmilitar: "",
    fecha: "",
    usuario: "",
    activo: 0,
  };

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

  public WKDependencia: IWKFDependencia = {
    documento: 0,
    nombre: "",
    observacion: "",
  };

  public DocSalida: IDocumento = {
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
  };

  // --- Actividades en el exterior y Actividades Varias ---
  public esActividadExterior: boolean = false;
  public esActividadVarias: boolean = false;
  public paises: string[] = [
    "Afganistán",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Antigua y Barbuda",
    "Arabia Saudita",
    "Argelia",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaiyán",
    "Bahamas",
    "Bangladés",
    "Barbados",
    "Baréin",
    "Bélgica",
    "Belice",
    "Benín",
    "Bielorrusia",
    "Birmania",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botsuana",
    "Brasil",
    "Brunéi",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Bután",
    "Cabo Verde",
    "Camboya",
    "Camerún",
    "Canadá",
    "Catar",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Ciudad del Vaticano",
    "Colombia",
    "Comoras",
    "Corea del Norte",
    "Corea del Sur",
    "Costa de Marfil",
    "Costa Rica",
    "Croacia",
    "Cuba",
    "Dinamarca",
    "Dominica",
    "Ecuador",
    "Egipto",
    "El Salvador",
    "Emiratos Árabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Estados Unidos",
    "Estonia",
    "Etiopía",
    "Filipinas",
    "Finlandia",
    "Fiyi",
    "Francia",
    "Gabón",
    "Gambia",
    "Georgia",
    "Ghana",
    "Granada",
    "Grecia",
    "Guatemala",
    "Guyana",
    "Guinea",
    "Guinea ecuatorial",
    "Guinea-Bisáu",
    "Haití",
    "Honduras",
    "Hungría",
    "India",
    "Indonesia",
    "Irak",
    "Irán",
    "Irlanda",
    "Islandia",
    "Islas Marshall",
    "Islas Salomón",
    "Israel",
    "Italia",
    "Jamaica",
    "Japón",
    "Jordania",
    "Kazajistán",
    "Kenia",
    "Kirguistán",
    "Kiribati",
    "Kuwait",
    "Laos",
    "Lesoto",
    "Letonia",
    "Líbano",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Macedonia del Norte",
    "Madagascar",
    "Malasia",
    "Malaui",
    "Maldivas",
    "Malí",
    "Malta",
    "Marruecos",
    "Mauricio",
    "Mauritania",
    "México",
    "Micronesia",
    "Moldavia",
    "Mónaco",
    "Mongolia",
    "Montenegro",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Nicaragua",
    "Níger",
    "Nigeria",
    "Noruega",
    "Nueva Zelanda",
    "Omán",
    "Países Bajos",
    "Pakistán",
    "Palaos",
    "Panamá",
    "Papúa Nueva Guinea",
    "Paraguay",
    "Perú",
    "Polonia",
    "Portugal",
    "Reino Unido",
    "República Centroafricana",
    "República Checa",
    "República del Congo",
    "República Democrática del Congo",
    "República Dominicana",
    "Ruanda",
    "Rumanía",
    "Rusia",
    "Samoa",
    "San Cristóbal y Nieves",
    "San Marino",
    "San Vicente y las Granadinas",
    "Santa Lucía",
    "Santo Tomé y Príncipe",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Siria",
    "Somalia",
    "Sri Lanka",
    "Suazilandia",
    "Sudáfrica",
    "Sudán",
    "Sudán del Sur",
    "Suecia",
    "Suiza",
    "Surinam",
    "Tailandia",
    "Tanzania",
    "Tayikistán",
    "Timor Oriental",
    "Togo",
    "Tonga",
    "Trinidad y Tobago",
    "Túnez",
    "Turkmenistán",
    "Turquía",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistán",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Yibuti",
    "Zambia",
    "Zimbabue",
  ];
  public actividadesExt: any = {
    pais: "",
    motivo: "",
    dirigido: "",
    personas: "",
    fechaInicio: null,
    fechaFin: null,
    fechaConfirmacion: null,
    gastos: {
      boletos: "",
      alimentacion: "",
      alojamiento: "",
      transporte: "",
    },
  };

  public actividadesVarias: any = {
    tipo: "ACTIVIDADES VARIAS",
    solicitud: "",
    motivo: "",
    dirigido: "",
    personas: "",
    fechaInicio: null,
    fechaFin: null,
    fechaLimiteRespuesta: null,
    fechaConfirmacion: null,
    opinionDe: "",
    opinion: "",
    recomendacion: "",
  };

  public booDependencia = false;

  public lstT: any[] = []; //Objeto Tipo documento
  public lstR: any[] = []; //Objeto Remitente
  public lstU: any[] = []; //Objeto Unidad
  public lstC: any[] = []; //Objeto Comando
  public lstCA: any[] = []; //Objeto Comando
  public lstCuenta: any[] = []; //Objeto Unidad

  public lstHzAdjunto: any[] = []; //Historico de documentos adjuntos
  public lstTraza: any[] = [];
  public lstHistorial: any[] = [];
  public lstImg: any[] = [];
  public lstDependencias: any[] = [];
  public titulo = "Documento";
  public nasociacion = "";

  public download: any;

  public bHist = false;

  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public Configuracion: any;
  public serializar: string = "";
  public Configurar: boolean = false;

  public activarTipo = false; // activar tipo de documento
  public xAPI: IAPICore = {
    funcion: "",
  };

  public xApi: IAPICore = {
    funcion: "",
    parametros: "",
  };
  routerDoc: { numc: string };

  toppings = new FormControl("");
  toppingsaux = new FormControl("");

  lstPC: string[] = []; // Auxiliar para mappear las cuentas de toppings
  lstPuntosCuentas: string[] = [];
  lstPuntosCuentasAux: any[] = [];
  public SubMenu: any[] = [];

  public isPunto: boolean = true;
  public sCedula: string = "Cédula";
  public sGrado: string = "Grado / Jerarquía";
  public sNombre: string = "Nombres y Apellidos";

  public NUMERO_CONTROL: string = ""; //Este codigo controlara el semillero para los codigos nuevos
  public bControl: boolean = false;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private location: Location,
    private ruta: Router,
  ) {}

  async ngOnInit() {
    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id;
      if (id == "salida") {
        this.SalidaTipo();
        if (this.rutaActiva.snapshot.params.numc != undefined) {
          var numc = this.rutaActiva.snapshot.params.numc;
          this.ncontrolt = "Nro de Control";
          this.ncontrolv = true;
          this.salidavisible = true;
          this.camponumsalida = 4;
          this.consultarDocumento(numc);
          this.bControl = false;
        }
      } else {
        if (this.rutaActiva.snapshot.params.numc != undefined) {
          var numc = this.rutaActiva.snapshot.params.numc;
          if (numc == "salida") this.SalidaTipo();
        }
        this.consultarDocumento(id);
      }
    } else {
      this.limpiarDoc();
    }
    this.SubMenu = await this.loginService.obtenerSubMenu("/control");
    let prv = this.loginService.obtenerPrivilegiosMenu(
      "/control",
      this.ruta.url,
    );
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

  SalidaTipo() {
    this.titulo = "Salida";
    this.booDependencia = true;
    this.estadoActual = 9;
    this.estadoOrigen = 2;
    this.ncontrolv = false;
    this.salidavisible = false;
    this.origenvisible = false;
    this.forigenv = false;
    this.ncontrolt = "Nro de Salida";
    this.remitentet = "Destinatario";
    this.fsalida = "Fecha de Salida (*)";
    this.camposalida = 4;
    this.camposfechasalida = 4;
    let fechaActual = new Date().toISOString().substring(0, 10);
    this.fcreacion = NgbDate.from(this.formatter.parse(fechaActual));
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

    const tieneActividadesVarias = this.lstT.some(
      (e) =>
        e.nomb &&
        (e.nomb.trim().toUpperCase() === "ACTIVIDADES VARIAS" ||
          e.nomb.trim().toUpperCase() === "ACTIVIDAD VARIA" ||
          e.nomb.trim().toUpperCase().includes("VARIA")),
    );
    if (!tieneActividadesVarias) {
      this.lstT.push({ nomb: "ACTIVIDADES VARIAS", tipo: "1" });
      this.lstT.push({ nomb: "ACTIVIDAD VARIA", tipo: "1" });
    }
  }

  limpiarDoc() {
    var dia = this.utilService.FechaActual();

    this.forigen = "";
    this.fplazo = "";
    this.Doc.ncontrol = "";
    this.Doc.norigen = "";
    this.Doc.contenido = "";
    this.Doc.instrucciones = "";
    this.Doc.nexpediente = "";
    this.Doc.codigo = "0";
    this.Doc.salida = "";
    this.Doc.tipo = "0";
    this.Doc.remitente = "0";
    this.Doc.unidad = "0";
    this.Doc.creador = "";
    let fechaActual = new Date().toISOString().substring(0, 10);
    this.fcreacion = NgbDate.from(this.formatter.parse(fechaActual));

    this.nasociacion = "";
    this.esActividadExterior = false;
    this.esActividadVarias = false;
    this.actividadesVarias = {
      tipo: "ACTIVIDADES VARIAS",
      solicitud: "",
      motivo: "",
      dirigido: "",
      personas: "",
      fechaInicio: null,
      fechaFin: null,
      fechaLimiteRespuesta: null,
      fechaConfirmacion: null,
      opinionDe: "",
      opinion: "",
      recomendacion: "",
    };
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
        let actividadesCargadas = false;
        data.Cuerpo.forEach((e) => {
          this.Doc = e;
          this.fcreacion = NgbDate.from(
            this.formatter.parse(this.Doc.fcreacion.substring(0, 10)),
          );
          this.forigenDate = NgbDate.from(
            this.formatter.parse(this.Doc.forigen.substring(0, 10)),
          );
          if (e.alerta != null) {
            this.fplazo = NgbDate.from(
              this.formatter.parse(e.alerta.substring(0, 10)),
            );
            this.WAlerta.activo = 1;
            this.WAlerta.documento = this.Doc.wfdocumento;
            this.WAlerta.estado = this.estadoActual;
            this.WAlerta.estatus = this.estadoOrigen;
            this.WAlerta.usuario = this.loginService.Usuario.id;
          }

          if (this.extraerYAsignarActividades(e)) {
            actividadesCargadas = true;
          }
        });

        this.selTipoDocumento();

        // Fallback: Solo si NO se encontró ninguna actividad en ningún registro de Cuerpo
        const docId = this.Doc.wfdocumento || (this.Doc as any).idd || this.Doc.id;
        const tipoActual = (this.Doc.tipo || "").toLowerCase();
        const esAct = tipoActual.includes("actividad") || tipoActual.includes("exterior");
        if (esAct && !actividadesCargadas && docId) {
          const xAPIDetalle: IAPICore = {
            funcion: "WKF_CDocumentoDetalle",
            parametros: `1,1,${docId}`,
            valores: "",
          };
          this.apiService.Ejecutar(xAPIDetalle).subscribe((detData) => {
            if (detData && detData.Cuerpo && detData.Cuerpo.length > 0) {
              this.extraerYAsignarActividades(detData.Cuerpo[0]);
              this.selTipoDocumento();
            }
          });
        }

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
          btoa("D" + this.Doc.ncontrol) + "/" + this.Doc.archivo,
        );

        this.activarTipo = this.validarTipoDoc();
        console.log(this.Doc);
        // this.serializar =  btoa( JSON.stringify(this.Doc.norigen))
        // console.log( this.serializar)
      },
      (error) => {
        console.error(error);
      },
    );
  }

  dwUrl(ncontrol?: string, archivo?: string): string {
    const nc = ncontrol || "";
    const arc = archivo || "";
    return this.apiService.Dws(btoa("D" + nc) + "/" + arc);
  }

  open(content) {
    this.modalService.open(content);
  }

  //obtenerWorkFlow Permite generar los primeros valores de la red del documento
  obtenerWorkFlow() {
    this.WkDoc = {
      nombre: "Control de Gestion",
      workflow: 2,
      estado: this.estadoActual,
      estatus: this.estadoOrigen,
      observacion: "Creando " + this.titulo,
      usuario: this.loginService.Usuario.id,
    };
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumento";
    this.xAPI.valores = JSON.stringify(this.WkDoc);
  }

  activarHistorial() {
    this.bHist = !this.bHist;
  }

  validarCamposObligatorios(): boolean {
    if (this.esActividadVarias) {
      if (this.actividadesVarias.solicitud) {
        this.actividadesVarias.solicitud = this.actividadesVarias.solicitud.toUpperCase();
        if (!this.Doc.contenido) {
          this.Doc.contenido = this.actividadesVarias.solicitud;
        }
      }
      if (this.actividadesVarias.fechaLimiteRespuesta && !this.fplazo) {
        this.fplazo = this.actividadesVarias.fechaLimiteRespuesta;
      }
    }

    // Validar campos comunes
    if (
      this.fcreacion == "" ||
      this.fcreacion == undefined ||
      this.Doc.contenido == "" ||
      this.fplazo == ""
    ) {
      return true;
    }

    // Validar Número de Origen solo si es entrada (no salida y el campo está visible)
    if (
      this.origenvisible &&
      this.titulo !== "Salida" &&
      (!this.Doc.norigen || this.Doc.norigen.trim() === "")
    ) {
      this.toastrService.error(
        "GDoc MPPD debe ingresar un Número de Origen",
        "Campo requerido",
      );
      return true;
    }
    const tipoDoc = this.Doc.tipo.toLowerCase();

    // Para PUNTO DE CUENTA simple (cuando el formulario está visible)
    // Solo validar si los campos de cuenta están visibles
    if (this.puntocuenta) {
      if (!this.cuenta?.trim()) {
        this.toastrService.error(
          "Número de Cuenta es requerido",
          "Campo requerido",
        );
        return true;
      }
      if (!this.resumen?.trim()) {
        this.toastrService.error(
          "Asunto de la Cuenta es requerido",
          "Campo requerido",
        );
        return true;
      }
      if (!this.subfecha) {
        this.toastrService.error(
          "Fecha de Cuenta es requerida",
          "Campo requerido",
        );
        return true;
      }
    }

    // Para otros tipos que muestran la tabla de resoluciones (RESOLUCIÓN, COMISIÓN, etc.)
    const tiposConTabla = [
      "resolucion",
      "comision de servicio",
      "tramitacion por organo regular",
      "contratos/punto de cuenta",
      "destitucion/punto de cuenta",
    ];

    if (tiposConTabla.includes(tipoDoc)) {
      // Solo validar que haya registros en la tabla, NO los campos del formulario
      if (!this.lstCuenta || this.lstCuenta.length === 0) {
        this.toastrService.error(
          "Debe agregar al menos un registro",
          "Campo requerido",
        );
        return true;
      }
    }
    return false;
  }

  registrar() {
    this.ngxService.startLoader("loader-aceptar");
    this.obtenerWorkFlow(); //Obtener valores de una API

    if (this.rutaActiva.snapshot.params.numc != undefined) {
      this.actualizarDocumentos();
      return;
    } else if (
      this.rutaActiva.snapshot.params.id != undefined &&
      this.rutaActiva.snapshot.params.id != "salida"
    ) {
      this.actualizarDocumentos();
      return;
    } else if (this.validarCamposObligatorios()) {
      this.toastrService.info(
        "Debe ingresar los campos marcados con (*) ya que son requeridos",
        `GDoc Wkf.Documentos`,
      );
      this.ngxService.stopLoader("loader-aceptar");
      return;
    }

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data);
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (xdata) => {
            // Evaluar si el tipodocumento es actividades en el exterior o actividades varias / actividad varia
            const tdoc = this.Doc.tipo ? this.Doc.tipo.trim().toLowerCase() : "";
            if (tdoc === "actividades en el exterior" || (tdoc.indexOf("exterior") >= 0 && tdoc.indexOf("actividad") >= 0)) {
              this.guardarActividadesExterior(this.Doc.wfdocumento);
            } else if (
              tdoc === "actividades varias" ||
              tdoc === "actividad varia" ||
              tdoc.indexOf("actividades varias") >= 0 ||
              tdoc.indexOf("actividad varia") >= 0 ||
              (tdoc.indexOf("varia") >= 0 && tdoc.indexOf("exterior") < 0)
            ) {
              this.guardarActividadesVarias(this.Doc.wfdocumento);
            }

            if (this.fplazo.year != undefined) {
              this.obtenerAlertaWorkFlow(xdata);
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (ydata) => {
                  this.ngxService.stopLoader("loader-aceptar");
                },
                (errot) => {
                  this.toastrService.error(data.msj, `GDoc Wkf.Alerta`);
                  this.ngxService.stopLoader("loader-aceptar");
                },
              );
            }
            const cant = this.lstCuenta.length;

            if (cant > 0) {
              this.salvarCuentas(this.Doc.wfdocumento);
            } else {
              this.aceptar(this.Doc.ncontrol);
              this.limpiarDoc();
              this.ngxService.stopLoader("loader-aceptar");
            }
            const cantdep = this.lstDependencias.length;
            const mpuntocuenta = this.toppings.value.length;

            if (cantdep > 0) {
              this.salvarDependencias(this.Doc.wfdocumento);
              if (mpuntocuenta > 0) {
                this.lstPC = this.toppings.value;
                this.salvarPuntoCuenta(this.Doc.wfdocumento);
              }
            } else {
              this.aceptar(this.Doc.ncontrol);
              this.limpiarDoc();
              this.ngxService.stopLoader("loader-aceptar");
            }
          },
          (errot) => {
            this.toastrService.error(data.msj, `GDoc Wkf.Documento.Detalle`);
            this.ngxService.stopLoader("loader-aceptar");
          },
        );
      }, //En caso de fallar Wkf
      (errot) => {
        var mensaje = errot + " - " + this.xAPI.funcion;
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
        this.ngxService.stopLoader("loader-aceptar");
      },
    );
  }
  guardarActividadesExterior(wfdocumento: number) {
    let viaje = {
      idd: wfdocumento,
      observacion: this.actividadesExt,
      estatus: 1,
    };

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumentoViajes";
    this.xAPI.valores = JSON.stringify(viaje);

    console.log(this.xAPI);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (ydata) => {
        console.log(ydata);
      },
      (errot) => {
        this.toastrService.error(`GDoc Wkf.Documento.Viajes al Exterior`);
      },
    );
  }

  guardarActividadesVarias(wfdocumento: number) {
    if (
      this.actividadesVarias.fechaLimiteRespuesta &&
      !this.actividadesVarias.fechaConfirmacion
    ) {
      this.actividadesVarias.fechaConfirmacion =
        this.actividadesVarias.fechaLimiteRespuesta;
    }

    // Asegurar que las propiedades queden guardadas limpias de fragmentos JSON y en mayúsculas
    this.actividadesVarias.solicitud = this.limpiarValorFragmento(this.actividadesVarias.solicitud);
    this.actividadesVarias.motivo = this.limpiarValorFragmento(this.actividadesVarias.motivo);
    this.actividadesVarias.dirigido = this.limpiarValorFragmento(this.actividadesVarias.dirigido);
    this.actividadesVarias.opinionDe = this.limpiarValorFragmento(this.actividadesVarias.opinionDe);
    this.actividadesVarias.opinion = this.limpiarValorFragmento(this.actividadesVarias.opinion);
    this.actividadesVarias.recomendacion = this.limpiarValorFragmento(this.actividadesVarias.recomendacion);

    const payload = {
      tipo: "ACTIVIDADES VARIAS",
      solicitud: this.actividadesVarias.solicitud || "",
      motivo: this.actividadesVarias.motivo || this.actividadesVarias.solicitud || "",
      dirigido: this.actividadesVarias.dirigido || "",
      personas: Number(this.actividadesVarias.personas) || 0,
      fechaInicio: this.actividadesVarias.fechaInicio || null,
      fechaFin: this.actividadesVarias.fechaFin || null,
      fechaLimiteRespuesta: this.actividadesVarias.fechaLimiteRespuesta || null,
      fechaConfirmacion:
        this.actividadesVarias.fechaConfirmacion ||
        this.actividadesVarias.fechaLimiteRespuesta ||
        null,
      opinionDe: this.actividadesVarias.opinionDe || "",
      opinion: this.actividadesVarias.opinion || "",
      recomendacion: this.actividadesVarias.recomendacion || "",
    };

    let viaje = {
      idd: wfdocumento,
      observacion: payload,
      estatus: 1,
    };

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumentoViajes";
    this.xAPI.valores = JSON.stringify(viaje);

    console.log("Guardando Actividades Varias:", this.xAPI);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (ydata) => {
        console.log("Actividades Varias registradas:", ydata);
      },
      (errot) => {
        this.toastrService.error(`GDoc Wkf.Documento.Actividades Varias`);
      },
    );
  }

  onFechaLimiteRespuestaChange(fecha: any) {
    if (fecha) {
      this.fplazo = fecha;
      this.actividadesVarias.fechaConfirmacion = fecha;
    }
  }

  decodeHtmlEntities(text: string): string {
    if (!text || typeof text !== "string") return text || "";
    let str = text;
    str = str.replace(/<br\s*[\/]?>/gi, "\n");
    str = str.replace(/<\/p>/gi, "\n");
    str = str.replace(/<[^>]*>/g, "");

    // Entidades numéricas &#123; y &#xABC;
    str = str.replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCharCode(parseInt(dec, 10));
      } catch {
        return _;
      }
    });
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return _;
      }
    });

    const entities: { [key: string]: string } = {
      "&aacute;": "á", "&Aacute;": "Á",
      "&eacute;": "é", "&Eacute;": "É",
      "&iacute;": "í", "&Iacute;": "Í",
      "&oacute;": "ó", "&Oacute;": "Ó",
      "&uacute;": "ú", "&Uacute;": "Ú",
      "&ntilde;": "ñ", "&Ntilde;": "Ñ",
      "&uuml;": "ü",   "&Uuml;": "Ü",
      "&quot;": '"',   "&apos;": "'",
      "&amp;": "&",    "&lt;": "<",
      "&gt;": ">",     "&nbsp;": " ",
      "&#160;": " "
    };

    for (const key in entities) {
      if (str.includes(key)) {
        str = str.split(key).join(entities[key]);
      }
    }

    return str.trim();
  }

  robustJsonParse(raw: any): any {
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    if (typeof raw !== "string") return null;

    let str = raw.trim();
    if (!str) return null;

    // Si viene envuelto entre comillas externas
    if (str.startsWith('"') && str.endsWith('"') && str.length > 2) {
      if (str.includes('""')) {
        str = str.substring(1, str.length - 1);
      }
    }

    // Si viene escapado estilo CSV con comillas dobles {""key"":""val""}
    if (str.includes('{\\"\\"\\"') || str.includes('{\\"\\"') || str.includes('{\\"') || str.includes('{\\""') || str.includes('{\\"') || str.includes('""')) {
      if (str.includes('{\\"') || str.includes('""')) {
        // normalizar
      }
    }
    if (str.includes('{\\""') || str.includes('{\\"') || str.includes('""')) {
      if (str.includes('{\\"') || str.includes('""')) {
        // normalizar
      }
    }
    if (str.includes('{\\"') || str.includes('""')) {
      if (str.includes('{\\"') || str.includes('""')) {
        // ok
      }
    }
    if (str.includes('{\\"') || str.includes('""')) {
      // Si tiene formato de comillas duplicadas de CSV
      if (str.includes('{\\"\\"\\"') || str.includes('{\\"\\"') || str.includes('{\\""') || str.includes('{\\"') || str.includes('""')) {
        if (str.includes('{\\""') || str.includes('{\\"') || str.includes('""')) {
          if (str.includes('""')) {
            if (str.includes('{\"\"') || str.includes('\"\":') || str.includes(':\"\"')) {
              str = str.replace(/""/g, '"');
            }
          }
        }
      }
    }

    // Estrategia 1: Parse directo estándar
    try {
      const res = JSON.parse(str);
      if (typeof res === "string") return this.robustJsonParse(res);
      return res;
    } catch (e1) {}

    // Estrategia 2: Limpieza de saltos de línea literales en cadenas
    try {
      const sanitized = str.replace(/[\r\n\t]+/g, " ");
      const res = JSON.parse(sanitized);
      if (typeof res === "string") return this.robustJsonParse(res);
      return res;
    } catch (e2) {}

    // Estrategia 3: Comillas internas duplicadas
    try {
      const fixedQuotes = str
        .replace(/([^\\])""/g, '$1\\"')
        .replace(/[\r\n\t]+/g, " ");
      const res = JSON.parse(fixedQuotes);
      if (typeof res === "string") return this.robustJsonParse(res);
      return res;
    } catch (e3) {}

    // Estrategia 4: Extracción manual de propiedades vía Regex
    try {
      const extracted: any = {};
      const strFields = [
        "tipo", "solicitud", "motivo", "dirigido", "pais",
        "opinionDe", "opinion_de", "opinion", "opinionTexto",
        "recomendacion", "recomendacionDireccion"
      ];
      for (const field of strFields) {
        const reg = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*"[a-zA-Z0-9_]+"\\s*:|\\s*})`, "i");
        const match = reg.exec(str);
        if (match && match[1] !== undefined) {
          let val = match[1].replace(/""/g, '"').trim();
          if (val.startsWith('"') && val.endsWith('"') && val.length > 1) {
            val = val.substring(1, val.length - 1);
          }
          extracted[field] = val;
        }
      }
      const numFields = ["personas", "id", "idd", "estatus"];
      for (const field of numFields) {
        const reg = new RegExp(`"${field}"\\s*:\\s*(\\d+)`, "i");
        const match = reg.exec(str);
        if (match && match[1] !== undefined) {
          extracted[field] = parseInt(match[1], 10);
        }
      }
      const objFields = ["fechaInicio", "fechaFin", "fechaLimiteRespuesta", "fechaConfirmacion", "gastos"];
      for (const field of objFields) {
        const reg = new RegExp(`"${field}"\\s*:\\s*({[\\s\\S]*?})(?=\\s*,\\s*"|\\s*})`, "i");
        const match = reg.exec(str);
        if (match && match[1] !== undefined) {
          try {
            extracted[field] = JSON.parse(match[1]);
          } catch {
            extracted[field] = match[1];
          }
        }
      }
      if (Object.keys(extracted).length > 0) return extracted;
    } catch (e4) {}

    return null;
  }

  parseDateToNgb(val: any): NgbDate | null {
    if (!val) return null;
    if (typeof val === "object") {
      if (val.year && val.month && val.day) {
        return new NgbDate(Number(val.year), Number(val.month), Number(val.day));
      }
    }
    if (typeof val === "string") {
      const clean = val.trim().substring(0, 10);
      const parts = clean.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new NgbDate(y, m, d);
        }
      }
      const parsed = this.formatter.parse(clean);
      return parsed ? NgbDate.from(parsed) : null;
    }
    return null;
  }

  limpiarValorFragmento(val: any): string {
    if (!val || typeof val !== "string") return "";
    let s = this.decodeHtmlEntities(val).trim();
    // Si contiene fragmentos de sintaxis JSON residuales provocados por parseo o serialización previa:
    // Ej: ,"OPINIONDE":"MIA o ,"SOLICITUD":"RETIRO INDEBIDO... o fragmentos con comas iniciales
    if (/^,?\s*"?[A-Za-z0-9_]+"?\s*:/i.test(s)) {
      return "";
    }
    if (s.startsWith('","') || s.startsWith(',"') || s.startsWith('",')) {
      return "";
    }
    return s.toUpperCase();
  }

  extraerYAsignarActividades(e: any): boolean {
    if (!e) return false;

    let raw: any =
      e.viajes_descripcion ||
      e.viaje ||
      e.viajes ||
      e.actividadesExt ||
      e.actividades ||
      e.actividadesVarias ||
      e.detallejson ||
      e.detallefinaljson;

    if (!raw) {
      const candidates = [
        e.observacion,
        e.sub_observacion,
        e.detalle,
        e.subdocumento,
        e.cont,
      ];
      for (const cand of candidates) {
        if (
          typeof cand === "string" &&
          (cand.includes('"solicitud"') ||
            cand.includes('"opinion"') ||
            cand.includes('"recomendacion"') ||
            cand.includes('"fechaLimiteRespuesta"') ||
            cand.includes('"pais"') ||
            cand.includes('"motivo"') ||
            cand.includes('"gastos"') ||
            cand.includes('"fechaInicio"') ||
            cand.includes("ACTIVIDADES VARIAS") ||
            cand.includes("actividades varias"))
        ) {
          raw = cand;
          break;
        }
      }
    }

    if (!raw && typeof e.observacion === "object") {
      raw = e.observacion;
    }

    if (raw) {
      try {
        let data = this.robustJsonParse(raw);
        if (Array.isArray(data) && data.length > 0) {
          data = data[0];
        }
        if (data && typeof data === "object") {
          if (data.observacion) {
            let obs = this.robustJsonParse(data.observacion);
            if (obs && typeof obs === "object") {
              data = obs;
            }
          }

          // Asignar Actividades en el Exterior
          this.actividadesExt = {
            pais: this.limpiarValorFragmento(data.pais || ""),
            motivo: this.limpiarValorFragmento(data.motivo || ""),
            dirigido: this.limpiarValorFragmento(data.dirigido || ""),
            personas: data.personas !== undefined && data.personas !== null ? data.personas : "",
            fechaInicio: this.parseDateToNgb(data.fechaInicio),
            fechaFin: this.parseDateToNgb(data.fechaFin),
            fechaConfirmacion: this.parseDateToNgb(data.fechaConfirmacion),
            gastos: data.gastos || {
              boletos: "",
              alimentacion: "",
              alojamiento: "",
              transporte: "",
            },
          };

          // Asignar Actividades Varias limpiando fragmentos JSON corruptos
          this.actividadesVarias = {
            tipo: data.tipo || "ACTIVIDADES VARIAS",
            solicitud: this.limpiarValorFragmento(data.solicitud || data.motivo || ""),
            motivo: this.limpiarValorFragmento(data.motivo || data.solicitud || ""),
            dirigido: this.limpiarValorFragmento(data.dirigido || ""),
            personas: data.personas !== undefined && data.personas !== null ? data.personas : 0,
            fechaInicio: this.parseDateToNgb(data.fechaInicio),
            fechaFin: this.parseDateToNgb(data.fechaFin),
            fechaLimiteRespuesta: this.parseDateToNgb(
              data.fechaLimiteRespuesta || data.fechaConfirmacion || e.alerta,
            ),
            fechaConfirmacion: this.parseDateToNgb(
              data.fechaConfirmacion || data.fechaLimiteRespuesta || e.alerta,
            ),
            opinionDe: this.limpiarValorFragmento(data.opinionDe || data.opinion_de || ""),
            opinion: this.limpiarValorFragmento(data.opinion || data.opinionTexto || ""),
            recomendacion: this.limpiarValorFragmento(
              data.recomendacion || data.recomendacionDireccion || "",
            ),
          };

          if (this.actividadesVarias.fechaLimiteRespuesta && !this.fplazo) {
            this.fplazo = this.actividadesVarias.fechaLimiteRespuesta;
          }

          // Si el tipo no estaba asignado, inferir del contenido parseado
          const t = (this.Doc.tipo || "").toLowerCase();
          if (
            (data.tipo === "ACTIVIDADES VARIAS" ||
              data.tipo === "ACTIVIDAD VARIA" ||
              (data.tipo && data.tipo.toUpperCase().includes("VARIA")) ||
              this.actividadesVarias.solicitud ||
              this.actividadesVarias.opinionDe ||
              this.actividadesVarias.opinion ||
              this.actividadesVarias.recomendacion) &&
            t !== "actividades en el exterior"
          ) {
            if (!this.Doc.tipo || this.Doc.tipo === "0") {
              this.Doc.tipo = data.tipo || "ACTIVIDADES VARIAS";
            }
          }
          return true;
        }
      } catch (err) {
        console.error("Error extrayendo actividades:", err);
      }
    }
    return false;
  }

  //Obtener los dados de Documento
  obtenerDatos(data: any) {
    if (data.tipo == 0) {
      var mensaje = data.msj + " - " + this.xAPI.funcion;
      this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
      return false;
    }
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumentoDetalle";
    if (this.estadoActual != 9) {
      this.Doc.ncontrol =
        this.NUMERO_CONTROL != ""
          ? this.NUMERO_CONTROL
          : this.utilService.Semillero(data.msj).toUpperCase();
    } else {
      this.Doc.salida = this.Doc.ncontrol.toUpperCase();
      this.Doc.ncontrol = this.Doc.ncontrol.toUpperCase();
    }
    this.Doc.wfdocumento = parseInt(data.msj);
    this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion);
    this.Doc.forigen =
      this.forigen != undefined
        ? this.utilService.ConvertirFecha(this.forigen)
        : this.utilService.ConvertirFecha(this.fcreacion);

    this.Doc.contenido = this.Doc.contenido.toUpperCase();
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase();

    this.Doc.creador = this.loginService.Usuario.id;

    this.xAPI.valores = JSON.stringify(this.Doc);
  }

  //Obtener alerta del Documento
  obtenerAlertaWorkFlow(data: any) {
    if (data.tipo == 0) {
      this.toastrService.error(data.msj, `GDoc Wkf.Alerta`);
      return false;
    }
    this.WAlerta.activo = 1;
    this.WAlerta.documento = this.Doc.wfdocumento;
    this.WAlerta.estado = this.WkDoc.estado;
    this.WAlerta.estatus = this.WkDoc.estatus;
    this.WAlerta.usuario = this.WkDoc.usuario;
    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo);
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IAlerta";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
  }

  protected aceptar(msj: string) {
    if (this.activarMensaje) return false;
    this.activarMensaje = true;
    Swal.fire({
      title: "El Documento Registrado es # " + msj,
      text: "¿Desea registrar otro documento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5eaaa8",
      cancelButtonColor: "#ef9a9a",
      confirmButtonText: "Si",
      cancelButtonText: "No",
      allowEscapeKey: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        if (this.estadoActual == 9) {
          this.ruta.navigate(["/salidas"]);
          return;
        }

        this.ruta.navigate(["/registrar"]);
      }
    });
  }

  async actualizarDocumentos() {
    if (this.Doc.contenido == "") {
      this.toastrService.info(
        "Debe ingresar los campos marcados con (*) ya que son requeridos",
        `GDoc Wkf.Agregar Cuentas`,
      );
      return;
    }
    let wfd = this.Doc.wfdocumento;

    this.Doc.fcreacion =
      typeof this.fcreacion === "object"
        ? this.utilService.ConvertirFecha(this.fcreacion)
        : this.Doc.fcreacion.substring(0, 10);
    this.Doc.forigen =
      typeof this.forigen === "object"
        ? this.utilService.ConvertirFecha(this.forigen)
        : this.Doc.forigen.substring(0, 10);
    this.Doc.creador = this.loginService.Usuario.id;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_ADocumentoDetalle";
    this.xAPI.parametros = "";

    this.Doc.contenido = this.Doc.contenido.toUpperCase();
    this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase();

    this.xAPI.valores = JSON.stringify(this.Doc);

    if (this.WAlerta.documento != 0)
      this.WAlerta.fecha =
        typeof this.fplazo === "object"
          ? this.utilService.ConvertirFecha(this.fplazo)
          : this.fplazo.substring(0, 10);

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (this.titulo == "Salida") {
          this.insertarObservacion();
          this.salvarDependencias(wfd);
          this.lstPC = this.toppings.value;

          this.salvarPuntoCuenta(wfd);

          this.ruta.navigate(["/salidas"]);
        } else {
          console.log(this.Doc);
          const tdoc = this.Doc.tipo ? this.Doc.tipo.trim().toLowerCase() : "";
          if (tdoc === "actividades en el exterior" || (tdoc.indexOf("exterior") >= 0 && tdoc.indexOf("actividad") >= 0)) {
            this.guardarActividadesExterior(wfd);
          } else if (
            tdoc === "actividades varias" ||
            tdoc === "actividad varia" ||
            tdoc.indexOf("actividades varias") >= 0 ||
            tdoc.indexOf("actividad varia") >= 0 ||
            (tdoc.indexOf("varia") >= 0 && tdoc.indexOf("exterior") < 0)
          ) {
            this.guardarActividadesVarias(wfd);
          }

          const cant = this.lstCuenta.length;

          if (cant > 0) {
            let fnx = {
              funcion: "WKF_ESubDocumentoPuntoCuenta",
              parametros: this.Doc.wfdocumento.toString(),
              valores: "",
            };
            // console.log(fnx)

            this.apiService.Ejecutar(fnx).subscribe(
              async (data) => {
                // console.log(data)
                await this.salvarCuentas(this.Doc.wfdocumento);
              },
              (err) => {
                this.ruta.navigate(["/registrar"]);
              },
            );
          } else {
            this.ruta.navigate(["/registrar"]);
          }
        }

        this.toastrService.success(
          "El documento ha sido actualizado",
          `GDoc Wkf.Actualizar Documentos`,
        );
        this.ngxService.stopLoader("loader-aceptar");
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.Actualizar Documentos`);
        this.ngxService.stopLoader("loader-aceptar");
      },
    );
  }

  insertarObservacion() {
    const usuario = this.loginService.Usuario.id;
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_IDocumentoObservacion";
    this.xAPI.valores = JSON.stringify({
      documento: this.Doc.wfdocumento,
      estado: this.estadoActual, //Estado que ocupa
      estatus: this.estadoOrigen,
      observacion: "DOCUMENTO EDITADO EN SALIDA",
      accion: "20",
      usuario: usuario,
    });

    this.xAPI.parametros = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        await this.guardarAlerta(1);
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      },
    ); //
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number) {
    this.WAlerta.documento = this.Doc.wfdocumento;

    this.WAlerta.activo = activo;
    this.WAlerta.estado = this.estadoActual;
    this.WAlerta.estatus = this.estadoOrigen;
    this.WAlerta.usuario = this.loginService.Usuario.id;
    this.WAlerta.observacion = "DOCUMENTO EDITADO EN SALIDA";

    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo);
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_AAlertas";
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.WAlerta);
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (alerData) => {
        console.log(alerData);
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      },
    ); //
  }

  agregarDependencia(): IWKFDependencia {
    let validar = false;

    const dependencia: IWKFDependencia = {
      documento: 0,
      nombre:
        this.Doc.unidad.toUpperCase() + " / " + this.Doc.comando.toUpperCase(),
    };

    this.lstDependencias.push(dependencia);

    return dependencia;
  }

  eliminarDependencia(pos: number, id: string) {
    if (id == undefined || id == "") {
      this.lstDependencias.splice(pos, 1);
      return false;
    }
    this.ngxService.startLoader("loader-aceptar");
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_EDocumentoDependencia";
    this.xAPI.parametros = id.toString();
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstDependencias.splice(pos, 1);
        this.ngxService.stopLoader("loader-aceptar");
      },
      (error) => {
        this.toastrService.error(
          "Fallo eliminar dependencia",
          `WKF_EDocumentoDependencia`,
        );
        this.ngxService.stopLoader("loader-aceptar");
        console.error("Fallo consultando los datos de Configuraciones", error);
      },
    );
  }

  async salvarPuntoCuenta(numc: number) {
    const cant = this.lstPC.length;
    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar");
      return;
    } else {
      const cuenta = this.lstPC[0];
      const p_cuenta = cuenta.split("|");
      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_IPuntoCuentaMultiple";
      this.xAPI.valores = "";
      this.xAPI.parametros =
        numc + "," + p_cuenta[0].trim() + "," + p_cuenta[1].trim() + ",1";
      // console.log('insertando puntoscuenta ', this.xAPI)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstPC.splice(0, 1);
          const c = this.lstPC.length;
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar");
          } else {
            this.salvarPuntoCuenta(numc);
          }
        },
        (errot) => {
          this.toastrService.error(errot, `GDoc Wkf.IDocumentoPuntoCuenta`);
          this.ngxService.stopLoader("loader-aceptar");
        },
      );
    }
  }

  async salvarDependencias(numc: number) {
    const cant = this.lstDependencias.length;

    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar");
      return;
    } else {
      this.xAPI = {} as IAPICore;

      this.xAPI.funcion = "WKF_IDocumentoDependencia";
      this.xAPI.valores = "";
      this.xAPI.parametros = numc + "," + this.lstDependencias[0].nombre;
      // console.log('insertando dependicia ', this.xAPI)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstDependencias.splice(0, 1);
          const c = this.lstDependencias.length;
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar");
            //this.aceptar(this.Doc.ncontrol)
            this.limpiarDoc();
          } else {
            this.salvarDependencias(numc);
          }
        },
        (errot) => {
          this.toastrService.error(errot, `GDoc Wkf.SubDocumentos`);
          this.ngxService.stopLoader("loader-aceptar");
        },
      );
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
        fecha:
          typeof this.subfecha === "object"
            ? this.utilService.ConvertirFecha(this.subfecha)
            : this.utilService.ConvertirFecha(this.subfechaDate),
        resumen: this.resumen.toUpperCase(),
        usuario: this.loginService.Usuario.id,
        activo: 0,
      };

      this.lstCuenta[this.PosicionCuenta] = wkcuenta;
      this.cuenta = "";
      this.resumen = "";
      this.subfecha = "";
      this.subfechaDate = null;
      this.cedula = "";
      this.cargo = "";
      this.nmilitar = "";
      this.PosicionCuenta = -1;
      this.editar = !this.editar;
    }
  }

  agregarCuenta(tipo: number): IWKFCuenta {
    let validar = false;

    switch (this.Doc.tipo.toLowerCase()) {
      case "punto de cuenta":
        if (this.cuenta == "" || this.resumen == "" || this.subfecha == "")
          validar = true;
        break;

      default:
        if (this.cedula == "" || this.cargo == "" || this.nmilitar == "")
          validar = true;
        break;
    }

    if (validar) {
      this.toastrService.info(
        "Todos los campos son requeridos",
        `GDoc Wkf.Agregar Cuentas`,
      );
      return;
    }
    const wkcuenta: IWKFCuenta = {
      documento: 0,
      cuenta: this.cuenta.toUpperCase(),
      estado: 1,
      estatus: 1,
      cedula: this.cedula,
      cargo: this.cargo,
      nmilitar: this.nmilitar,
      fecha:
        typeof this.subfecha === "object"
          ? this.utilService.ConvertirFecha(this.subfecha)
          : this.utilService.FechaActual(),
      resumen: this.resumen.toUpperCase(),
      usuario: this.loginService.Usuario.id,
      activo: 0,
    };

    this.lstCuenta.push(wkcuenta);

    if (tipo == 1) {
      this.cuenta = "";
      this.resumen = "";
      this.subfecha = "";
    }
    this.cedula = "";
    this.cargo = "";
    this.nmilitar = "";

    return wkcuenta;
  }

  selEditarCuenta(pos: number) {
    const wkcuenta = this.lstCuenta[pos];

    this.cuenta = wkcuenta.cuenta;
    this.resumen = wkcuenta.resumen;

    this.subfechaDate = NgbDate.from(
      this.formatter.parse(wkcuenta.fecha.substring(0, 10)),
    );

    this.cedula = wkcuenta.cedula;
    this.cargo = wkcuenta.cargo;
    this.nmilitar = wkcuenta.nmilitar;

    this.PosicionCuenta = pos;
    this.editar = !this.editar;
  }

  eliminarCuenta(pos: number) {
    this.lstCuenta.splice(pos, 1);
    this.cuenta = "";
    this.resumen = "";
    this.subfecha = "";
    this.cedula = "";
    this.cargo = "";
    this.nmilitar = "";
    this.editar = false;
  }

  async salvarCuentas(numc: number) {
    const cant = this.lstCuenta.length;
    // console.log('entrando en confianza... ', cant)
    // console.log('entrando en confianza... ', this.lstCuenta)
    if (cant == 0) {
      this.ngxService.stopLoader("loader-aceptar");
      return;
    } else {
      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_ISubDocumento";
      this.xAPI.parametros = "";
      this.lstCuenta[0].documento = numc;
      this.xAPI.valores = JSON.stringify(this.lstCuenta[0]);
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstCuenta.splice(0, 1);
          const c = this.lstCuenta.length;
          if (c == 0) {
            this.ngxService.stopLoader("loader-aceptar");
            this.aceptar(this.Doc.ncontrol);
            this.limpiarDoc();
          } else {
            this.salvarCuentas(numc);
          }
        },
        (errot) => {
          this.aceptar(this.Doc.ncontrol);
          this.limpiarDoc();
          this.toastrService.error(errot, `GDoc Wkf.SubDocumentos`);
          this.ngxService.stopLoader("loader-aceptar");
        },
      );
    }
  }

  selTipoDocumento() {
    const tipo = (this.Doc.tipo || "").toLowerCase().trim();
    this.puntocuenta = false;
    this.resolucion = false;
    this.booPuntoCuenta = false;
    this.esActividadExterior =
      tipo === "actividades en el exterior" ||
      tipo.indexOf("actividades en el exterior") >= 0;
    this.esActividadVarias =
      tipo === "actividades varias" ||
      tipo === "actividad varia" ||
      tipo === "actividades varia" ||
      tipo === "actividad varias" ||
      tipo.indexOf("actividades varias") >= 0 ||
      tipo.indexOf("actividad varias") >= 0 ||
      tipo.indexOf("actividades varia") >= 0 ||
      tipo.indexOf("actividad varia") >= 0 ||
      (tipo.indexOf("varia") >= 0 && tipo.indexOf("exterior") < 0) ||
      (this.actividadesVarias &&
        (this.actividadesVarias.tipo === "ACTIVIDADES VARIAS" ||
          this.actividadesVarias.tipo === "ACTIVIDAD VARIA" ||
          (this.actividadesVarias.tipo && this.actividadesVarias.tipo.toUpperCase().includes("VARIA"))) &&
        !this.esActividadExterior &&
        !!(this.actividadesVarias.solicitud || this.actividadesVarias.dirigido || this.actividadesVarias.opinionDe || this.actividadesVarias.recomendacion));

    if (this.esActividadVarias) {
      if (!this.actividadesVarias.fechaLimiteRespuesta && this.fplazo) {
        this.actividadesVarias.fechaLimiteRespuesta = this.parseDateToNgb(this.fplazo);
      }
      if (this.actividadesVarias.fechaLimiteRespuesta && !this.fplazo) {
        this.fplazo = this.actividadesVarias.fechaLimiteRespuesta;
      }
    }

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
          console.log("entrando");
          this.cargarPuntosdeCuenta();
          return true;
        }
        this.toastrService.warning(
          "Debe dirigirse al modulo de salida para usar esta opcion",
          `GDoc Salida`,
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
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CPuntoCuentaSalida";
    this.xAPI.parametros = "5";
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map((e) => {
          this.lstPuntosCuentas.push(
            e.cuen + " | " + e.udep + " " + e.fori.substring(0, 10),
          );
        });
        this.ngxService.stopLoader("loader-aceptar");
        this.booPuntoCuenta = true;
      },
      (error) => {
        console.error("No existe la funcion ", error);
        this.ngxService.stopLoader("loader-aceptar");
      },
    );
  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    // this.lstImg.push({ a: 1 })
    this.modalService.open(content, { size: "lg" });
  }

  /**
   * Consultar datos generales del militar
   */
  consultarCedula() {
    if (this.cedula == "") return false;
    this.isPunto = true;
    if (
      this.Doc.tipo.toLowerCase() == "destitucion/punto de cuenta" ||
      this.Doc.tipo.toLowerCase() == "contratos/punto de cuenta"
    ) {
      this.isPunto = false;
    } else {
      this.ngxService.startLoader("loader-aceptar");
      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "MPPD_CDatosBasicos";
      this.xAPI.parametros = this.cedula;
      this.xAPI.valores = "";
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          const militar = data.Cuerpo.map((e) => {
            e.resoluciones = JSON.parse(e.resoluciones);
            e.entradas = JSON.parse(e.entradas);
            e.componente = this.Componentes.filter((el) => {
              return el.cod_componente == e.componente;
            })[0].nombre_componente;
            e.categoria = this.Categorias.filter((el) => {
              return el.cod_categoria == e.categoria;
            })[0].nombre_categoria;
            e.clasificacion = this.Clasificaciones.filter((el) => {
              return el.cod_clasificacion == e.clasificacion;
            })[0].des_clasificacion;
            e.grado = this.Grados.filter((el) => {
              return el.cod_grado == e.grado;
            })[0].nombres_grado;
            return e;
          })[0];

          if (data.Cuerpo.length > 0) {
            this.nmilitar = militar.nombres;
            this.cargo = militar.grado + " " + militar.componente;
          } else {
            this.cedula = "";
            this.nmilitar = "";
            this.cargo = "";
            this.toastrService.info(
              "Debe dirigirse al departamento de resoluciones",
              `GDoc Resoluciones`,
            );
          }

          this.ngxService.stopLoader("loader-aceptar");
        },
        (error) => {
          console.error("Error de conexion a los datos ", error);
        },
      );
    }
  }

  /**
   * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
   * @param numBase64  : base64
   */
  async consultarDocumentoSalida() {
    if (this.titulo == "Salida") return false;
    if (this.Doc.salida == "") return false;
    let dwf = "";
    if (this.Doc.norigen != "") dwf = this.Doc.norigen;
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_CDocumentoDetalleSalida";
    this.xAPI.parametros = "9,1," + this.Doc.salida;
    this.xAPI.valores = "";
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        data.Cuerpo.forEach((e) => {
          this.Doc = e;
          this.fcreacion = NgbDate.from(
            this.formatter.parse(this.Doc.fcreacion.substring(0, 10)),
          );
          this.forigenDate = NgbDate.from(
            this.formatter.parse(this.Doc.forigen.substring(0, 10)),
          );
          if (e.alerta != null) {
            this.fplazo = NgbDate.from(
              this.formatter.parse(e.alerta.substring(0, 10)),
            );
            this.WAlerta.activo = 1;
            this.WAlerta.documento = this.Doc.wfdocumento;
            this.WAlerta.estado = this.estadoActual;
            this.WAlerta.estatus = this.estadoOrigen;
            this.WAlerta.usuario = this.loginService.Usuario.id;
          }
          this.nasociacion = this.Doc.ncontrol;
          this.Doc.ncontrol = "";

          this.extraerYAsignarActividades(e);
        });

        this.Doc.norigen = dwf;
        this.selTipoDocumento();
        const punto_cuenta =
          this.Doc.subdocumento != null
            ? JSON.parse(this.Doc.subdocumento)
            : [];
        this.lstCuenta = punto_cuenta.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });
        // console.log(this.lstCuenta)

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

        const dependencias =
          this.Doc.dependencias != null
            ? JSON.parse(this.Doc.dependencias)
            : [];
        this.lstDependencias = dependencias.map((e) => {
          return typeof e == "object" ? e : JSON.parse(e);
        });

        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false;
        this.download = this.apiService.Dws(
          btoa("D" + this.Doc.ncontrol) + "/" + this.Doc.archivo,
        );

        this.activarTipo = this.validarTipoDoc();
      },
      (error) => {
        console.error(error);
      },
    );
  }

  mensajeAgregarCuenta() {
    if (this.Doc.tipo.toLowerCase().indexOf("punto de cuenta") >= 0) {
      Swal.fire({
        title: "Alerta",
        text: "¿Desea mantener los datos de la cuenta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5eaaa8",
        confirmButtonText: "Sí, estoy seguro",
      }).then((result) => {
        if (result.isConfirmed) {
          this.agregarCuenta(0);
        } else {
          this.agregarCuenta(1);
        }
      });
    } else {
      this.agregarCuenta(1);
    }
  }

  confirmarSalir() {
    Swal.fire({
      title: "¿Está seguro que desea salir?",
      text: "Se perderán los cambios no guardados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5eaaa8",
      cancelButtonColor: "#ef9a9a",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.back();
      }
    });
  }

  ngOnDestroy(): void {
    // this.editor.destroy()
    // this.xeditor.destroy()
  }

  generarNumeroSerie() {
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.NUMERO_DE_CONTROL;
    this.xAPI.parametros = environment.coleciones.CONTADORES;
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data !== undefined) {
          if (data.valor_actual !== undefined) {
            this.NUMERO_CONTROL = this.utilService.NuevoSemillero(
              data.valor_actual,
            );
            this.registrar();
          }
        } else {
          this.toastrService.info(
            "Falla en la generación del número de serie",
            "Campo requerido",
          );
        }
      },
      (error) => {
        console.error("No existe la funcion ", error);
      },
    );
  }
}
