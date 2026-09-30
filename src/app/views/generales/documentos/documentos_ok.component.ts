import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { Router } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { FileService } from "src/app/services/apicore/file.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { IWKFAlerta } from "src/app/services/control/documentos.service";
import { toBase64String } from "@angular/compiler/src/output/source_map";
import { EncriptarSDC } from "src/app/services/seguridad/encriptar-sdc.service";
import jsPDF from "jspdf";
import { HttpEventType } from "@angular/common/http";
import { Md5 } from "md5-typescript";
import { firstValueFrom } from "rxjs";
import { UtilService } from "src/app/services/util/util.service";

// ─── Interface para Agrupación de Etiquetas WKF ────────────────────────────────
export interface IWKFEtiqueta {
  autor: string;
  contenido: string;
  num_control: string;
  wf_documento: number;
}

// ─── Tipos de perfil para este módulo ────────────────────────────────────────
export type DocumentosProfile = "JefeSecretaria" | "Direccion" | "Ministro";

// ─── Definición de carpetas estáticas ─────────────────────────────────────────
export interface CarpetaDocumento {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  disponible: boolean;
  // Configuración API
  funcion?: string;
  estadoActual?: number;
  estadoOrigen?: number;
  filtro?: number;
}

@Component({
  selector: "app-documentos-ok",
  templateUrl: "./documentos_ok.component.html",
  styleUrls: ["./documentos_ok.component.scss"],
})
export class DocumentosOkComponent implements OnInit, OnDestroy {
  // ─── Keyboard shortcuts ──────────────────────────────────────────────────────
  @HostListener("window:keydown", ["$event"])
  onWindowKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" || event.code === "Escape") {
      if (this.isDetailOpen) {
        this.closeDetail();
        return;
      }
      if (this.selectedCarpeta) {
        this.selectedCarpeta = null;
        this.buzon = [];
        this.bzOriginal = [];
        this.longitud = 0;
      }
      return;
    }

    // Flechas de navegación para desplazarse entre casos del agrupado
    if (
      this.isDetailOpen &&
      this.currentTagGroupFolder &&
      this.groupCases.length > 1
    ) {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (event.key === "ArrowRight" || event.code === "ArrowRight") {
        this.nextGroupCase();
      } else if (event.key === "ArrowLeft" || event.code === "ArrowLeft") {
        this.prevGroupCase();
      }
    }
  }

  public estadoActual = 4;
  public estadoOrigen = 2;
  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: "",
    usuario: "",
    observacion: "",
  };

  // ─── Etiquetas y Agrupación de Puntos ──────────────────────────────────────────
  public WEtiqueta: IWKFEtiqueta = {
    autor: "",
    contenido: "",
    num_control: "",
    wf_documento: 0,
  };
  public rawBuzonFolders: any[] = [];
  public documentTags: {
    [keyGroup: string]: { tag: string; autor?: string; fecha?: string };
  } = {};
  public existingTags: string[] = [
    "PRIORITARIO",
    "EN REVISIÓN",
    "URGENTE",
    "EJERCITO BOLIVARIANO",
    "ARMADA BOLIVARIANA",
    "AVIACION MILITAR BOLIVARIANA",
    "GUARDIA NACIONAL BOLIVARIANA",
    "MILICIA BOLIVARIANA",
    "COMANDO ESTRATEGICO OPERACIONAL",
    "UNIVERSIDAD MILITAR BOLIVARIANA",
    "SISTEMA DE JUSTICIA MILITAR",
  ];
  public etiquetaFiltro: string = "";
  public selectAllDocs: boolean = false;

  // ─── Estado del módulo ───────────────────────────────────────────────────────
  public selectedCarpeta: CarpetaDocumento | null = null;
  public buzon: any[] = [];
  public bzOriginal: any[] = [];
  public longitud = 0;
  public loadingExplorer = false;
  public loadingBuzon = false;

  // ─── Panel de Detalle Inmersivo ───────────────────────────────────────────────
  public isDetailOpen = false;
  public activeDoc: any = null;
  public observacion = "";
  public loadingAction = false;
  public pdfUrl: string | null = null;
  public showPdf = false;
  public currentTagGroupFolder: any = null;
  public groupCases: any[] = [];
  public currentGroupCaseIndex = 0;

  // ─── Fotos de Cédula / Afiliados ──────────────────────────────────────────────
  public fotosCasos: { [cedula: string]: SafeUrl } = {};
  public loadingFotos: { [cedula: string]: boolean } = {};
  public rawUrlsMap: { [cedula: string]: string } = {};

  // ─── Paginación ───────────────────────────────────────────────────────────────
  public pageSize = 25;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public currentPage = 0;

  // ─── Búsqueda ─────────────────────────────────────────────────────────────────
  public buscarQuery = "";

  // ─── Fechas (enero - diciembre del año en curso) ──────────────────────────────
  public xyear: string = new Date().getFullYear().toString();
  public fecha_desde: string;
  public fecha_hasta: string;

  // ─── Perfil de usuario ────────────────────────────────────────────────────────
  public currentProfile: DocumentosProfile = "JefeSecretaria";
  public jwtData: {
    userId: string;
    userName: string;
    userRole: string;
    perfil: string;
    userCedula: string;
    userCargo: string;
  } = {
    userId: "",
    userName: "",
    userRole: "",
    userCedula: "",
    perfil: "",
    userCargo: "",
  };

  // ─── API ──────────────────────────────────────────────────────────────────────
  public xAPI: IAPICore = { funcion: "", parametros: "", valores: "" };

  // ─── Carpetas estáticas ───────────────────────────────────────────────────────
  public carpetas: CarpetaDocumento[] = [
    {
      id: "TRAMITE_ORGANO_REGULAR",
      nombre: "TRAMITE POR ORGANO REGULAR",
      icono: "fas fa-exchange-alt",
      color: "#5e72e4",
      disponible: true,
      funcion: "WKF_CDocumentosSecretariaTOR",
      estadoActual: 4,
      estadoOrigen: 4,
      filtro: 1,
    },
    {
      id: "PUNTO_DE_CUENTA",
      nombre: "PUNTO DE CUENTA",
      icono: "fas fa-file-alt",
      color: "#2dce89",
      disponible: true,
      funcion: "WKF_CDocumentosSecretariaPunto",
      estadoActual: 4,
      estadoOrigen: 2,
      filtro: 1,
    },
    {
      id: "RECLAMOS",
      nombre: "RECLAMOS",
      icono: "fas fa-comments",
      color: "#f5365c",
      disponible: true,
      funcion: "WKF_CDocumentosSecretariaReclamos",
      estadoActual: 16,
      estadoOrigen: 2,
      filtro: 1,
    },
    {
      id: "PRESIDENCIALES",
      nombre: "PRESIDENCIALES",
      icono: "fas fa-file-alt",
      color: "#2dce89",
      disponible: true,
      funcion: "WKF_CDocumentosSecretariaPuntoPresidencial",
      estadoActual: 4,
      estadoOrigen: 3,
      filtro: 1,
    },
    {
      id: "CUADRO_DECISORIO",
      nombre: "CUADRO DECISORIO",
      icono: "fas fa-file-alt",
      color: "#652dceff",
      disponible: true,
      funcion: "WKF_CDocumentosSecretariaCuadro",
      estadoActual: 17,
      estadoOrigen: 2,
      filtro: 1,
    },
    {
      id: "ACTIVIDADES_EN_EL_EXTERIOR",
      nombre: "ACTIVIDADES EN EL EXTERIOR",
      icono: "fas fa-envelope",
      color: "#fb6340",
      disponible: true,
      funcion: "WKF_CDocumentosGestionViajes",
      estadoActual: 2,
      estadoOrigen: 2,
      filtro: 1,
    },
    {
      id: "RADIOGRAMAS",
      nombre: "RADIOGRAMAS",
      icono: "fas fa-broadcast-tower",
      color: "#11cdef",
      disponible: false,
    },
    {
      id: "OFICIOS",
      nombre: "OFICIOS",
      icono: "fas fa-envelope",
      color: "#fb6340",
      disponible: false,
    },
    {
      id: "DIPLOMAS",
      nombre: "DIPLOMAS",
      icono: "fas fa-certificate",
      color: "#ffd600",
      disponible: false,
    },
  ];

  // ─── Acciones del buzón ───────────────────────────────────────────────────────
  private cmbAcciones = [
    { valor: "0", texto: "MINISTERIAL" },
    { valor: "1", texto: "OTROS DOCUMENTOS" },
    { valor: "2", texto: "PRESIDENCIAL" },
    { valor: "3", texto: "TRAMITACION POR ORDEN REGULAR" },
    { valor: "4", texto: "OTROS DOCUMENTOS" },
    { valor: "5", texto: "OTROS DOCUMENTOS" },
    { valor: "6", texto: "REDISTRIBUCION" },
  ];

  public Componentes: any;
  public Grados: any;
  public Categorias: any;
  public Clasificaciones: any;
  public TipoEntradas: any;
  public TipoResoluciones: any;
  public Estados: any;
  public Carpetas: any;
  public OrdenNumero: any;

  public toastrService: {
    success: (msg?: string, title?: string, opt?: any) => any;
    error: (msg?: string, title?: string, opt?: any) => any;
    info: (msg?: string, title?: string, opt?: any) => any;
    warning: (msg?: string, title?: string, opt?: any) => any;
    clear: (id?: number) => void;
    remove: (id: number) => boolean;
  };

  constructor(
    private apiService: ApiService,
    private fileService: FileService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private rawToastr: ToastrService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private encriptarService: EncriptarSDC,
    private utilService: UtilService,
  ) {
    const toastDefaults = {
      positionClass: "toast-bottom-center",
      toastClass: "ngx-toastr toast-glass-doc",
      timeOut: 4500,
      progressBar: true,
      closeButton: false,
    };

    this.toastrService = {
      success: (msg?: string, title?: string, opt?: any) =>
        this.rawToastr.success(msg, title, { ...toastDefaults, ...opt }),
      error: (msg?: string, title?: string, opt?: any) =>
        this.rawToastr.error(msg, title, {
          ...toastDefaults,
          timeOut: 5500,
          ...opt,
        }),
      info: (msg?: string, title?: string, opt?: any) =>
        this.rawToastr.info(msg, title, { ...toastDefaults, ...opt }),
      warning: (msg?: string, title?: string, opt?: any) =>
        this.rawToastr.warning(msg, title, { ...toastDefaults, ...opt }),
      clear: (id?: number) => this.rawToastr.clear(id),
      remove: (id: number) => this.rawToastr.remove(id),
    };

    // Fechas fijas: agosto → diciembre del año en curso
    this.fecha_desde = this.xyear + "-06-01";
    this.fecha_hasta = this.xyear + "-12-31";
  }

  ngOnInit(): void {
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
    this.TipoEntradas =
      sessionStorage.getItem("MPPD_CTipoEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada")))
        : [];
    this.TipoResoluciones =
      sessionStorage.getItem("MPPD_CTipoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion")))
        : [];
    this.Estados =
      sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion")))
        : [];
    this.Carpetas =
      sessionStorage.getItem("MPPD_CCarpetaEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetaEntrada")))
        : [];
    this.OrdenNumero =
      sessionStorage.getItem("MPPD_COrdenEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_COrdenEntrada")))
        : [];

    // Clase inmersiva para ocultar sidebar y navbar
    document.body.classList.add("immersive-active");
    document.documentElement.classList.add("immersive-active");

    this.decodeUserToken();
    this.updateEstadosFromProfile();
    this.loadDocumentTagsFromStorage();

    const disponible = this.carpetas.find((c) => c.disponible);
    if (disponible) {
      this.onCarpetaClick(disponible);
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove("immersive-active");
    document.documentElement.classList.remove("immersive-active");

    // Revocar URLs blob de fotos
    Object.keys(this.rawUrlsMap).forEach((key) => {
      const url = this.rawUrlsMap[key];
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
    this.rawUrlsMap = {};
    this.fotosCasos = {};
    this.loadingFotos = {};
  }

  // ─── Salir del módulo ─────────────────────────────────────────────────────────
  public exitComponent(): void {
    this.router.navigate(["/dashboard"]);
  }

  // ─── Navegar a vista Ministerial ─────────────────────────────────────────────
  public irAMinisterial(doc: any): void {
    if (!doc) return;
    const obj = { tipo: "MINISTERIAL", objeto: doc };
    const base = btoa(JSON.stringify(obj));
    this.router.navigate(["/ministerial", base]);
  }

  // ─── Obtener código de estado según perfil (JefeSecretaria=4, Direccion=5, Ministro=6) ───
  public getEstadoFromProfile(
    profile: DocumentosProfile = this.currentProfile,
  ): number {
    switch (profile) {
      case "JefeSecretaria":
        return 4;
      case "Direccion":
        return 5;
      case "Ministro":
        return 6;
      default:
        return 4;
    }
  }

  public selectedEstadoBuzon: "por_procesar" | "firmados" = "por_procesar";

  // ─── Sincronizar estadoOrigen con el perfil actual o modo firmados (estadoActual fijo en 4) ──────────
  public updateEstadosFromProfile(): void {
    this.estadoActual = 4;
    if (this.selectedEstadoBuzon === "firmados") {
      this.estadoOrigen = 7;
    } else {
      this.estadoOrigen = this.getEstadoFromProfile(this.currentProfile);
    }

    this.carpetas.forEach((c) => {
      if (c.disponible) {
        c.estadoActual =
          c.id === "RECLAMOS"
            ? c.estadoActual || 6
            : c.id === "ACTIVIDADES_EN_EL_EXTERIOR"
              ? 2
              : c.id === "CUADRO_DECISORIO"
                ? 17
                : 4;
        if (this.selectedEstadoBuzon === "firmados") {
          c.estadoOrigen = 7;
        } else if (this.currentProfile === "Direccion") {
          c.estadoOrigen = 5;
        } else if (this.currentProfile === "Ministro") {
          c.estadoOrigen = 6;
        } else {
          // Perfil inicial / JefeSecretaria: respeta estadoOrigen inicial propio del objeto
          c.estadoOrigen =
            c.id === "PUNTO_DE_CUENTA" ||
            c.id === "RECLAMOS" ||
            c.id === "ACTIVIDADES_EN_EL_EXTERIOR" ||
            c.id === "CUADRO_DECISORIO"
              ? 2
              : c.id === "PRESIDENCIALES"
                ? 3
                : 4;
        }
      }
    });
  }

  // ─── Decodificar JWT y mapear perfil ─────────────────────────────────────────
  private decodeUserToken(): void {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const helper = new JwtHelperService();
        const decoded = helper.decodeToken(token);
        if (decoded && decoded.Usuario) {
          this.jwtData = {
            userId: decoded.Usuario.usuario || "",
            userName: decoded.Usuario.nombre || decoded.Usuario.usuario || "",
            userRole: decoded.Usuario.tipo || "Usuario",
            userCedula: this.loginService.Usuario?.cedula || "",
            perfil:
              sessionStorage.getItem("perfil") ||
              decoded.Usuario.descripcion ||
              "",
            userCargo: decoded.Usuario.cargo || "",
          };
        }
      }
      if (!this.jwtData.userId && this.loginService.Usuario) {
        this.jwtData = {
          userId: this.loginService.Usuario.usuario || "",
          userName: this.loginService.Usuario.nombre || "",
          userCedula: this.loginService.Usuario.cedula || "",
          userRole: this.loginService.Usuario.tipo || "",
          perfil:
            sessionStorage.getItem("perfil") ||
            this.loginService.Usuario.descripcion ||
            "",
          userCargo: this.loginService.Usuario.cargo || "",
        };
      }

      const perfilStr = (
        sessionStorage.getItem("perfil") ||
        this.jwtData.perfil ||
        ""
      ).toUpperCase();
      const roleStr = (this.jwtData.userRole || "").toUpperCase();

      if (perfilStr) {
        this.mapProfile(perfilStr);
      } else if (roleStr) {
        this.mapProfile(roleStr);
      } else {
        // Fallback asíncrono
        const t = sessionStorage.getItem("token");
        if (t) {
          const helper = new JwtHelperService();
          const decoded = helper.decodeToken(t);
          if (decoded && decoded.Usuario) {
            const cedula = decoded.Usuario.cedula || "";
            const sistema = decoded.Usuario.sistema || environment.ID || "";
            const correo = decoded.Usuario.correo || "";
            const userApi: IAPICore = {
              funcion: environment.funcion.CONSULTAR_USUARIO_PERFIL,
              parametros: `${cedula},${sistema},${correo}`,
              valores: "",
            };
            this.apiService.Ejecutar(userApi).subscribe((res: any) => {
              try {
                if (
                  res &&
                  res.length > 0 &&
                  res[0].Aplicacion &&
                  res[0].Aplicacion.length > 0 &&
                  res[0].Aplicacion[0].Rol
                ) {
                  const rolDesc =
                    res[0].Aplicacion[0].Rol.descripcion ||
                    res[0].Aplicacion[0].Rol.nombre ||
                    "";
                  sessionStorage.setItem("perfil", rolDesc);
                  this.jwtData.perfil = rolDesc;
                  this.mapProfile(rolDesc);
                  this.changeDetector.detectChanges();
                }
              } catch (e) {
                console.error(
                  "[DocumentosOk] Error procesando perfil de DB:",
                  e,
                );
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("[DocumentosOk] Error al decodificar JWT:", e);
    }
  }

  // ─── Mapeo de perfiles ────────────────────────────────────────────────────────
  private mapProfile(perfilVal: string): void {
    const p = (perfilVal || "").toUpperCase();
    const r = (this.jwtData.userRole || "").toUpperCase();

    if (
      p.includes("MINISTRO") ||
      p.includes("APROB") ||
      r.includes("MIN") ||
      r.includes("FIRMAN")
    ) {
      this.currentProfile = "Ministro";
    } else if (p.includes("DIRECCION") || r.includes("DIR")) {
      this.currentProfile = "Direccion";
    } else {
      // Jefe de Secretaría como perfil base
      this.currentProfile = "JefeSecretaria";
    }
    this.updateEstadosFromProfile();
  }

  public isAdmin(): boolean {
    const role = (this.jwtData.userRole || "").toUpperCase();
    const perfil = (
      this.jwtData.perfil ||
      sessionStorage.getItem("perfil") ||
      ""
    ).toUpperCase();
    return role.includes("ADMIN") || perfil.includes("ADMIN");
  }

  public onProfileChange(): void {
    this.updateEstadosFromProfile();
    const carpetaToLoad =
      (this.selectedCarpeta &&
        this.carpetas.find(
          (c) => c.id === this.selectedCarpeta?.id && c.disponible,
        )) ||
      this.carpetas.find((c) => c.disponible);

    this.buzon = [];
    this.bzOriginal = [];
    this.longitud = 0;
    this.buscarQuery = "";

    if (carpetaToLoad) {
      this.onCarpetaClick(carpetaToLoad);
    }
  }

  public onEstadoBuzonChange(): void {
    this.updateEstadosFromProfile();
    const carpetaToLoad =
      (this.selectedCarpeta &&
        this.carpetas.find(
          (c) => c.id === this.selectedCarpeta?.id && c.disponible,
        )) ||
      this.carpetas.find((c) => c.disponible);

    this.buzon = [];
    this.bzOriginal = [];
    this.longitud = 0;
    this.buscarQuery = "";

    if (carpetaToLoad) {
      this.onCarpetaClick(carpetaToLoad);
    }
  }

  // ─── Selección de carpeta ─────────────────────────────────────────────────────
  public onCarpetaClick(carpeta: CarpetaDocumento): void {
    if (!carpeta.disponible) {
      this.toastrService.info(
        "Esta sección estará disponible próximamente.",
        carpeta.nombre,
      );
      return;
    }
    this.selectedCarpeta = carpeta;
    this.buzon = [];
    this.bzOriginal = [];
    this.buscarQuery = "";
    this.currentPage = 0;
    this.longitud = 0;
    this.cargarBuzon(carpeta);
  }

  // ─── Carga del buzón via API ──────────────────────────────────────────────────
  public async cargarBuzon(carpeta: CarpetaDocumento): Promise<void> {
    if (!carpeta.funcion) return;

    this.updateEstadosFromProfile();
    this.estadoActual =
      carpeta.estadoActual ||
      (carpeta.id === "RECLAMOS"
        ? 6
        : carpeta.id === "ACTIVIDADES_EN_EL_EXTERIOR"
          ? 2
          : 4);
    this.estadoOrigen =
      carpeta.estadoOrigen ||
      (carpeta.id === "PUNTO_DE_CUENTA" ||
      carpeta.id === "RECLAMOS" ||
      carpeta.id === "ACTIVIDADES_EN_EL_EXTERIOR"
        ? 2
        : carpeta.id === "PRESIDENCIALES"
          ? 3
          : 4);

    this.loadingBuzon = true;
    this.ngxService.startLoader("loader-documentos");

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = carpeta.funcion;
    this.xAPI.valores = "";
    this.xAPI.parametros = `${carpeta.estadoActual},${carpeta.estadoOrigen},${this.fecha_desde},${this.fecha_hasta}`;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        let bz: any[] = [];
        console.log(data);
        if (data && data.Cuerpo) {
          const groupMap = new Map<string, any>();

          data.Cuerpo.forEach((e: any) => {
            e.edit =
              (e.tdoc &&
                (e.tdoc.toLowerCase() === "punto de cuenta" ||
                  e.tdoc.toLowerCase().includes("reclamo"))) ||
              carpeta.id === "PUNTO_DE_CUENTA" ||
              carpeta.id === "RECLAMOS"
                ? true
                : false;
            e.existe = e.anom && e.anom !== "" ? true : false;
            e.privado = e.priv === 1 ? true : false;
            e.completed = false;
            e.color = "warn";
            e.nombre_accion = "";

            // ── Limpiar HTML y entidades de campos de texto ──────────────────
            e.cont = this.stripHtml(e.cont || "");
            e.resumen = this.stripHtml(e.resumen || "");
            e.cuenta = this.stripHtml(e.cuenta || "");
            e.sub_cedula = (e.sub_cedula || "").toString().trim();
            e.sub_nombre = this.stripHtml(e.sub_nombre || "").toUpperCase();
            e.sub_cargo = this.stripHtml(e.sub_cargo || "").toUpperCase();

            if (e.accion != null) {
              const text = this.cmbAcciones[e.accion]?.texto || "";
              e.nombre_accion = text;
            }

            // Clave de agrupación por numc / ncontrol / cuenta
            const key = (e.numc || e.ncontrol || e.cuenta || e.id || "0")
              .toString()
              .trim();

            if (!groupMap.has(key)) {
              const folder = {
                ...e,
                keyGroup: key,
                mergedDocumentos: [],
              };

              // Si el elemento individual posee información de persona, agregar como subcaso
              if (
                e.sub_cedula ||
                e.sub_nombre ||
                e.cedula ||
                e.nombres_apellidos
              ) {
                folder.mergedDocumentos.push({
                  ...e,
                  cedula: e.sub_cedula || e.cedula,
                  nombre: e.sub_nombre || e.nombres_apellidos || e.nombre,
                  cargo: e.sub_cargo || e.cargo || e.grado,
                  sub_detalle: e.sub_detalle || e.detalle || "",
                  detalle:
                    e.sub_detalle || e.detalle || e.estatus || e.estado || "PR",
                  observacion: e.observacion || e.obse || "",
                });
              }

              // Si tiene campo subdocumento JSON
              if (e.subdocumento) {
                try {
                  const parsed =
                    typeof e.subdocumento === "string"
                      ? JSON.parse(e.subdocumento)
                      : e.subdocumento;
                  if (Array.isArray(parsed)) {
                    parsed.forEach((subItem: any) => {
                      const itemObj =
                        typeof subItem === "object"
                          ? subItem
                          : JSON.parse(subItem);
                      folder.mergedDocumentos.push(itemObj);
                    });
                  }
                } catch (err) {
                  console.warn(
                    "[DocumentosOk] Error parsing subdocumento:",
                    err,
                  );
                }
              }

              groupMap.set(key, folder);
            } else {
              const folder = groupMap.get(key);
              const cleanCed = e.sub_cedula || e.cedula || "";
              const cleanNom =
                e.sub_nombre || e.nombres_apellidos || e.nombre || "";

              const exists = folder.mergedDocumentos.some((sub: any) => {
                const subCed = (sub.cedula || sub.sub_cedula || "")
                  .toString()
                  .trim();
                const subNom = (
                  sub.nombre ||
                  sub.sub_nombre ||
                  sub.nombres_apellidos ||
                  ""
                )
                  .toString()
                  .trim();
                return (
                  (cleanCed && subCed === cleanCed) ||
                  (cleanNom && subNom === cleanNom)
                );
              });

              if (!exists && (cleanCed || cleanNom)) {
                folder.mergedDocumentos.push({
                  ...e,
                  cedula: cleanCed,
                  nombre: cleanNom,
                  cargo: e.sub_cargo || e.cargo || e.grado,
                  sub_detalle: e.sub_detalle || e.detalle || "",
                  detalle:
                    e.sub_detalle || e.detalle || e.estatus || e.estado || "PR",
                  observacion: e.observacion || e.obse || "",
                });
              }
            }
          });

          // Convertir el Map agrupado a arreglo
          const rawFolders: any[] = [];

          groupMap.forEach((folder) => {
            const key = folder.keyGroup;
            const savedTagInfo = this.documentTags[key];
            const initialTag = savedTagInfo?.tag || folder.etiqueta || "";

            folder.etiqueta = initialTag;
            folder.wde_contenido = initialTag;
            folder.wde_autor = savedTagInfo?.autor || folder.wde_autor || null;
            folder.wde_fecha = savedTagInfo?.fecha || folder.wde_fecha || null;
            folder.selected = false;

            if (initialTag && !this.existingTags.includes(initialTag)) {
              this.existingTags.push(initialTag);
            }

            if (carpeta.filtro === 1) {
              rawFolders.push(folder);
            } else if (
              carpeta.filtro === 3 &&
              (folder.tdoc === "PUNTO DE CUENTA" ||
                folder.tdoc === "RECLAMOS" ||
                folder.tdoc === "RECLAMO" ||
                carpeta.id === "RECLAMOS")
            ) {
              rawFolders.push(folder);
            } else {
              rawFolders.push(folder);
            }
          });

          this.rawBuzonFolders = rawFolders;
          bz = this.agruparPorEtiquetas(rawFolders);
        }

        this.longitud = bz.length;
        this.bzOriginal = bz;
        if (this.longitud > 0) {
          this.recorrerElementos(0);
        } else {
          this.buzon = [];
        }
        this.loadingBuzon = false;
        this.ngxService.stopLoader("loader-documentos");
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error("[DocumentosOk] Error cargando buzón:", error);
        this.toastrService.error("Error al cargar el buzón", "Documentos");
        this.loadingBuzon = false;
        this.ngxService.stopLoader("loader-documentos");
        this.changeDetector.detectChanges();
      },
    );
  }

  // ─── Paginación y Filtrado ───────────────────────────────────────────────────
  public get filteredOriginal(): any[] {
    let list = this.bzOriginal || [];

    if (this.etiquetaFiltro) {
      if (this.etiquetaFiltro === "__SIN_ETIQUETA__") {
        list = list.filter((e) => !e.etiqueta);
      } else {
        list = list.filter((e) => e.etiqueta === this.etiquetaFiltro);
      }
    }

    if (!this.buscarQuery.trim()) return list;

    const q = this.buscarQuery.toLowerCase().trim();
    return list.filter((e) => {
      const cedula = this.getCedula(e).toLowerCase();
      const nombre = this.getNombre(e).toLowerCase();
      const cargo = this.getCargo(e).toLowerCase();
      const cuenta = (e.cuenta || "").toLowerCase();
      const cont = (e.cont || "").toLowerCase();
      const resumen = (e.resumen || "").toLowerCase();
      const numc = (e.numc || "").toLowerCase();
      const etiqueta = (e.etiqueta || "").toLowerCase();

      const subcasos = this.getSubcasos(e);
      const matchSubcaso = subcasos.some((sub: any) => {
        const sced = (sub.cedula || sub.sub_cedula || "")
          .toString()
          .toLowerCase();
        const snom = (
          sub.nombre ||
          sub.sub_nombre ||
          sub.nombres_apellidos ||
          ""
        )
          .toString()
          .toLowerCase();
        const scarg = (sub.cargo || sub.sub_cargo || "")
          .toString()
          .toLowerCase();
        return sced.includes(q) || snom.includes(q) || scarg.includes(q);
      });

      return (
        cedula.includes(q) ||
        nombre.includes(q) ||
        cargo.includes(q) ||
        cuenta.includes(q) ||
        cont.includes(q) ||
        resumen.includes(q) ||
        numc.includes(q) ||
        etiqueta.includes(q) ||
        matchSubcaso
      );
    });
  }

  public recorrerElementos(pagina: number): void {
    const list = this.filteredOriginal;
    this.longitud = list.length;
    const start = this.pageSize * pagina;
    this.buzon = list.slice(start, start + this.pageSize);

    const itemsToFetch: any[] = [];
    this.buzon.forEach((folder) => {
      itemsToFetch.push(folder);
      const sub = this.getSubcasos(folder);
      if (sub && sub.length > 0) {
        itemsToFetch.push(...sub);
      }
    });
    this.cargarFotosBuzon(itemsToFetch);
  }

  public pageChangeEvent(e: any): void {
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    this.recorrerElementos(e.pageIndex);
  }

  public get buzonFiltrado(): any[] {
    return this.buzon;
  }

  // ─── Gestión de Etiquetas y Agrupación ─────────────────────────────────────
  public loadDocumentTagsFromStorage(): void {
    try {
      const stored = localStorage.getItem("gdoc_documentos_tags");
      if (stored) {
        this.documentTags = JSON.parse(stored);
        Object.values(this.documentTags).forEach((item: any) => {
          if (item?.tag && !this.existingTags.includes(item.tag)) {
            this.existingTags.push(item.tag);
          }
        });
      }
    } catch (e) {
      console.warn("[DocumentosOk] Error al cargar etiquetas almacenadas:", e);
    }
  }

  public saveDocumentTagsToStorage(): void {
    try {
      localStorage.setItem(
        "gdoc_documentos_tags",
        JSON.stringify(this.documentTags),
      );
    } catch (e) {
      console.warn("[DocumentosOk] Error al guardar etiquetas:", e);
    }
  }

  public agruparPorEtiquetas(rawFolders: any[]): any[] {
    if (!rawFolders || !Array.isArray(rawFolders)) return [];
    const tagMap = new Map<string, any>();
    const unTagged: any[] = [];

    rawFolders.forEach((folder) => {
      if (!folder) return;
      const tag = (folder.etiqueta || "").toString().trim().toUpperCase();

      if (tag !== "") {
        const tagKey = `TAG_FOLDER_${tag}`;

        if (!tagMap.has(tagKey)) {
          const tagFolder = {
            isTagFolder: true,
            etiqueta: tag,
            wde_contenido: tag,
            wde_autor: folder.wde_autor,
            wde_fecha: folder.wde_fecha,
            numc: (folder.numc || folder.ncontrol || folder.cuenta || "")
              .toString()
              .trim(),
            keyGroup: tagKey,
            tdoc: "Carpeta de Agrupación",
            nombre_accion: `Agrupación: ${tag}`,
            cont: `Carpeta agrupada por etiqueta "${tag}".`,
            resumen: `Carpeta agrupada por etiqueta "${tag}".`,
            puntosDeCuenta: [folder],
            mergedDocumentos: [...(folder.mergedDocumentos || [])],
            selected: false,
          };
          tagMap.set(tagKey, tagFolder);
        } else {
          const tagFolder = tagMap.get(tagKey);
          tagFolder.puntosDeCuenta.push(folder);

          const currentNumc = (
            folder.numc ||
            folder.ncontrol ||
            folder.cuenta ||
            ""
          )
            .toString()
            .trim();
          if (currentNumc && !tagFolder.numc.includes(currentNumc)) {
            tagFolder.numc += `, ${currentNumc}`;
          }

          // Combinar subcasos sin duplicar
          (folder.mergedDocumentos || []).forEach((subItem: any) => {
            if (!subItem) return;
            const cleanCed = (subItem.cedula || subItem.sub_cedula || "")
              .toString()
              .trim();
            const cleanNom = (
              subItem.nombre ||
              subItem.sub_nombre ||
              subItem.nombres_apellidos ||
              ""
            )
              .toString()
              .trim();

            const exists = tagFolder.mergedDocumentos.some((existing: any) => {
              if (!existing) return false;
              const exCed = (existing.cedula || existing.sub_cedula || "")
                .toString()
                .trim();
              const exNom = (
                existing.nombre ||
                existing.sub_nombre ||
                existing.nombres_apellidos ||
                ""
              )
                .toString()
                .trim();
              return (
                (cleanCed && exCed === cleanCed) ||
                (cleanNom && exNom === cleanNom)
              );
            });

            if (!exists) {
              tagFolder.mergedDocumentos.push(subItem);
            }
          });
        }
      } else {
        unTagged.push(folder);
      }
    });

    const result: any[] = [];
    tagMap.forEach((tf) => result.push(tf));
    unTagged.forEach((uf) => result.push(uf));

    return result;
  }

  public refrescarAgrupacionEtiquetas(): void {
    this.bzOriginal = this.agruparPorEtiquetas(this.rawBuzonFolders);
    this.recorrerElementos(this.currentPage);
    this.changeDetector.detectChanges();
  }

  public async apiInsertarEtiqueta(doc: any, etiqueta: string): Promise<any> {
    if (doc.isTagFolder && Array.isArray(doc.puntosDeCuenta)) {
      let lastRes = null;
      for (const p of doc.puntosDeCuenta) {
        lastRes = await this.apiInsertarEtiqueta(p, etiqueta);
      }
      this.refrescarAgrupacionEtiquetas();
      return lastRes;
    }

    const numControl = (
      doc.numc ||
      doc.ncontrol ||
      doc.cuenta ||
      doc.num_control ||
      ""
    )
      .toString()
      .trim();
    const wfDocRaw = doc.idd || doc.id || doc.wf_documento || "0";
    const wfDoc = parseInt(wfDocRaw.toString().trim(), 10);
    const userId = this.loginService.Usuario?.id || this.jwtData?.userId || "";
    const fechaActual = new Date().toISOString();

    this.WEtiqueta = {
      autor: userId,
      contenido: etiqueta.trim().toUpperCase(),
      num_control: numControl,
      wf_documento: isNaN(wfDoc) ? 0 : wfDoc,
    };

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion =
      environment.funcion.INSERTAR_SECRETARIA_ETIQUETA ||
      "WKF_ISecretariaEtiqueta";
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(this.WEtiqueta);

    return new Promise((resolve, reject) => {
      this.apiService.Ejecutar(this.xAPI).subscribe(
        async (data) => {
          const key = doc.keyGroup || numControl;
          if (key) {
            this.documentTags[key] = {
              tag: etiqueta.trim().toUpperCase(),
              autor: userId,
              fecha: fechaActual,
            };
            this.saveDocumentTagsToStorage();
          }
          doc.etiqueta = etiqueta.trim().toUpperCase();
          doc.wde_contenido = etiqueta.trim().toUpperCase();
          doc.wde_autor = userId;
          doc.wde_fecha = fechaActual;

          if (doc.etiqueta && !this.existingTags.includes(doc.etiqueta)) {
            this.existingTags.push(doc.etiqueta);
          }
          this.refrescarAgrupacionEtiquetas();
          resolve(data);
        },
        (error) => {
          this.toastrService.error(
            error?.toString() || "Error al guardar etiqueta",
            "GDoc Wkf.ISecretariaEtiqueta",
          );
          reject(error);
        },
      );
    });
  }

  public setDocTag(doc: any, event?: Event): void {
    if (event) event.stopPropagation();
    if (!doc) return;

    const key =
      doc.keyGroup ||
      (doc.numc || doc.ncontrol || doc.cuenta || "").toString().trim();
    const currentTag =
      doc.etiqueta || doc.wde_contenido || this.documentTags[key]?.tag || "";

    const options: { [key: string]: string } = {};
    this.existingTags.forEach((t) => {
      options[t] = t;
    });
    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    let defaultVal = currentTag;
    if (!defaultVal || !this.existingTags.includes(defaultVal)) {
      defaultVal = "__NEW__";
    }

    const docTipo =
      this.selectedCarpeta?.id === "RECLAMOS"
        ? "este reclamo"
        : "este punto de cuenta";

    Swal.fire({
      title: "Agrupar / Asignar Etiqueta",
      input: "select",
      inputLabel: `Seleccione una etiqueta existente o cree una nueva para agrupar ${docTipo}`,
      inputValue: defaultVal,
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
        input: "swal-select-custom",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const selection = result.value;
        if (selection === "__NEW__") {
          setTimeout(() => {
            Swal.fire({
              title: "Crear Nueva Etiqueta",
              input: "text",
              inputLabel: "Escriba el nombre de la nueva etiqueta",
              inputPlaceholder: "Ej: PRIORITARIO, FUERZA ARMADA...",
              showCancelButton: true,
              confirmButtonText: "Guardar",
              cancelButtonText: "Cancelar",
              customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-secondary",
                input: "swal-input-custom",
              },
              buttonsStyling: false,
              inputValidator: (val) => {
                if (!val || val.trim() === "") {
                  return "¡Debe ingresar un nombre para la etiqueta!";
                }
                return null;
              },
            }).then((textResult) => {
              if (textResult.isConfirmed) {
                const newTag = textResult.value.trim().toUpperCase();
                this.apiInsertarEtiqueta(doc, newTag).then(() => {
                  this.toastrService.success(
                    `Etiqueta "${newTag}" asignada a documento`,
                    "Éxito",
                  );
                  this.recorrerElementos(this.currentPage);
                  this.changeDetector.detectChanges();
                });
              }
            });
          }, 150);
        } else if (selection) {
          this.apiInsertarEtiqueta(doc, selection).then(() => {
            this.toastrService.success(
              `Etiqueta "${selection}" asignada a documento`,
              "Éxito",
            );
            this.recorrerElementos(this.currentPage);
            this.changeDetector.detectChanges();
          });
        }
      }
    });
  }

  public assignTagToSelectedDocs(): void {
    const selected = this.selectedDocs;
    if (selected.length === 0) {
      this.toastrService.warning(
        "Seleccione al menos un documento para etiquetar",
        "Advertencia",
      );
      return;
    }

    const options: { [key: string]: string } = {};
    this.existingTags.forEach((t) => {
      options[t] = t;
    });
    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    const docTipoPlural =
      this.selectedCarpeta?.id === "RECLAMOS" ? "reclamos" : "puntos de cuenta";

    Swal.fire({
      title: `Agrupar / Asignar Etiqueta (${selected.length} seleccionados)`,
      input: "select",
      inputLabel: `Seleccione una etiqueta para agrupar los ${docTipoPlural} seleccionados`,
      inputValue: "__NEW__",
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
        input: "swal-select-custom",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const selection = result.value;
        if (selection === "__NEW__") {
          setTimeout(() => {
            Swal.fire({
              title: "Crear Nueva Etiqueta",
              input: "text",
              inputLabel: "Escriba el nombre de la nueva etiqueta para agrupar",
              inputPlaceholder: "Ej: ORGANO REGULAR 2026",
              showCancelButton: true,
              confirmButtonText: "Guardar y Asignar",
              cancelButtonText: "Cancelar",
              customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-secondary",
                input: "swal-input-custom",
              },
              buttonsStyling: false,
              inputValidator: (val) => {
                if (!val || val.trim() === "") {
                  return "¡Debe ingresar un nombre para la etiqueta!";
                }
                return null;
              },
            }).then((textResult) => {
              if (textResult.isConfirmed) {
                const newTag = textResult.value.trim().toUpperCase();
                this.applyBatchTag(selected, newTag);
              }
            });
          }, 150);
        } else if (selection) {
          this.applyBatchTag(selected, selection);
        }
      }
    });
  }

  public async applyBatchTag(selected: any[], tagValue: string): Promise<void> {
    this.ngxService.startLoader("loader-documentos");
    let successCount = 0;
    for (const doc of selected) {
      try {
        await this.apiInsertarEtiqueta(doc, tagValue);
        doc.selected = false;
        successCount++;
      } catch (e) {
        console.error("Error asignando etiqueta en lote a:", doc, e);
      }
    }
    this.ngxService.stopLoader("loader-documentos");
    this.selectAllDocs = false;
    this.toastrService.success(
      `Etiqueta "${tagValue}" asignada a ${successCount} documento(s)`,
      "Agrupación completada",
    );
    this.recorrerElementos(0);
    this.changeDetector.detectChanges();
  }

  public crearNuevaEtiquetaGeneral(): void {
    const docTipoPlural =
      this.selectedCarpeta?.id === "RECLAMOS" ? "reclamos" : "puntos de cuenta";

    Swal.fire({
      title: "Crear Nueva Etiqueta de Agrupación",
      input: "text",
      inputLabel: `Escriba el nombre de la nueva etiqueta para agrupar ${docTipoPlural}`,
      inputPlaceholder: "Ej: SECRETARIA GENERAL",
      showCancelButton: true,
      confirmButtonText: "Crear Etiqueta",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
        input: "swal-input-custom",
      },
      buttonsStyling: false,
      inputValidator: (val) => {
        if (!val || val.trim() === "") {
          return "¡Debe ingresar un nombre para la etiqueta!";
        }
        return null;
      },
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        const tag = res.value.trim().toUpperCase();
        if (!this.existingTags.includes(tag)) {
          this.existingTags.push(tag);
          this.toastrService.success(
            `Etiqueta "${tag}" creada correctamente`,
            "Nueva Etiqueta",
          );
          this.filterByTag(tag);
        } else {
          this.toastrService.info(
            `La etiqueta "${tag}" ya existe`,
            "Etiqueta Existente",
          );
          this.filterByTag(tag);
        }
      }
    });
  }

  // ─── Selección de Documentos ────────────────────────────────────────────────
  public toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.selectAllDocs = checked;
    this.buzon.forEach((d) => (d.selected = checked));
  }

  public toggleDocSelect(doc: any, event: Event): void {
    event.stopPropagation();
    doc.selected = !doc.selected;
    this.selectAllDocs =
      this.buzon.length > 0 && this.buzon.every((d) => d.selected);
  }

  public clearDocSelection(): void {
    this.selectAllDocs = false;
    this.bzOriginal.forEach((d) => (d.selected = false));
  }

  public get selectedDocs(): any[] {
    return this.bzOriginal.filter((d) => d.selected);
  }

  public get selectedDocsCount(): number {
    return this.selectedDocs.length;
  }

  // ─── Conteo de Casos y Documentos ───────────────────────────────────────────
  public get totalCasosCount(): number {
    return (this.rawBuzonFolders || []).reduce((acc, doc) => {
      const sub = doc.mergedDocumentos || [];
      return acc + (sub.length > 0 ? sub.length : 1);
    }, 0);
  }

  public getTagDocCount(tagName: string): number {
    return (this.rawBuzonFolders || []).filter((e) => e.etiqueta === tagName)
      .length;
  }

  public getTagCasosCount(tagName: string): number {
    return (this.rawBuzonFolders || [])
      .filter((e) => e.etiqueta === tagName)
      .reduce((acc, doc) => {
        const sub = doc.mergedDocumentos || [];
        return acc + (sub.length > 0 ? sub.length : 1);
      }, 0);
  }

  public get unassignedDocsCount(): number {
    return (this.rawBuzonFolders || []).filter((e) => !e.etiqueta).length;
  }

  public filterByTag(tagName: string): void {
    this.etiquetaFiltro = tagName;
    this.recorrerElementos(0);
  }

  // ─── Helpers de campos (sub_cedula, sub_nombre, sub_cargo) ───────────────────
  public getCedula(e: any): string {
    if (!e) return "";
    let ced = (e.sub_cedula || e.cedula || "").toString().trim();
    if (
      !ced &&
      Array.isArray(e.mergedDocumentos) &&
      e.mergedDocumentos.length > 0
    ) {
      ced = (
        e.mergedDocumentos[0]?.sub_cedula ||
        e.mergedDocumentos[0]?.cedula ||
        ""
      )
        .toString()
        .trim();
    }
    if (
      !ced &&
      e.cuenta &&
      e.cuenta.toString().length >= 6 &&
      !isNaN(Number(e.cuenta))
    ) {
      ced = e.cuenta.toString().trim();
    }
    return ced;
  }

  public getNombre(e: any): string {
    if (!e) return "";
    let n = (e.sub_nombre || e.nombre || e.nombres_apellidos || e.nom || "")
      .toString()
      .trim();
    if (
      !n &&
      Array.isArray(e.mergedDocumentos) &&
      e.mergedDocumentos.length > 0
    ) {
      n = (
        e.mergedDocumentos[0]?.sub_nombre ||
        e.mergedDocumentos[0]?.nombre ||
        e.mergedDocumentos[0]?.nombres_apellidos ||
        ""
      )
        .toString()
        .trim();
    }
    return n.toUpperCase();
  }

  public getCargo(e: any): string {
    if (!e) return "";
    let c = (e.sub_cargo || e.cargo || e.grado || e.puesto || "")
      .toString()
      .trim();
    if (
      !c &&
      Array.isArray(e.mergedDocumentos) &&
      e.mergedDocumentos.length > 0
    ) {
      c = (
        e.mergedDocumentos[0]?.sub_cargo ||
        e.mergedDocumentos[0]?.cargo ||
        e.mergedDocumentos[0]?.grado ||
        ""
      )
        .toString()
        .trim();
    }
    return c.toUpperCase();
  }

  // ─── Extraer el código de estatus real del integrante (soporta hash|estatus) ───
  public getEstatusFromDetalle(item: any): string {
    if (!item) return "PR";
    let raw =
      item.sub_detalle ||
      item.detalle ||
      item.s_estatus ||
      item.sub_estatus ||
      item.estatus ||
      item.estado ||
      "";
    if (typeof raw !== "string") {
      raw = (raw || "").toString();
    }
    raw = raw.trim();
    if (!raw) return "PR";

    if (raw.includes("|")) {
      const parts = raw.split("|");
      if (parts.length > 1 && parts[1].trim()) {
        return parts[1].trim().toUpperCase();
      }
    }
    return raw.toUpperCase();
  }

  // ─── Etiqueta de detalle de estatus de la persona ─────────────────────────────
  public getDetalleLabel(item: any): string {
    const val = this.getEstatusFromDetalle(item);

    if (
      !val ||
      val === "1" ||
      val === "0" ||
      val === "4" ||
      val === "PR" ||
      val === "PROCESAR" ||
      val === "PROCESADO" ||
      val === "APROBADO"
    ) {
      return "APROBADO";
    }

    if (
      val === "NP" ||
      val === "NO PROCESAR" ||
      val === "NEGADO" ||
      val === "RECHAZADO"
    )
      return "NEGADO";
    if (val === "NPPIDD") return "NP POR INT. DEL DIRECTOR";
    if (val === "NPPIDJ") return "NP POR INT. DEL JEFE DE AREA";
    if (val === "CR" || val === "CODIGO ROJO" || val === "CÓDIGO ROJO")
      return "CÓDIGO ROJO";
    if (val === "BD") return "NO PROCESAR POR ASCENSO";
    if (val === "PE" || val === "PENDIENTE") return "PENDIENTE";
    if (val === "DI" || val === "DIFERIDO") return "DIFERIDO";

    if (val.startsWith("NP ")) return "NEGADO";
    if (val.startsWith("PE ")) return "PENDIENTE";

    return val || "APROBADO";
  }

  // ─── Evaluar si un caso interno es Aprobado ──────────────────────────────────
  public isAprobado(item: any): boolean {
    if (!item) return false;
    const raw = (
      item.sub_detalle ||
      item.detalle ||
      item.s_estatus ||
      item.sub_estatus ||
      item.estatus ||
      item.estado ||
      ""
    )
      .toString()
      .trim()
      .toUpperCase();

    if (
      raw === "NP" ||
      raw === "NEGADO" ||
      raw === "NO PROCESAR" ||
      raw.startsWith("NP") ||
      raw.includes("NEGADO") ||
      raw.includes("RECHAZADO")
    ) {
      return false;
    }

    if (
      !this.esDocFirmado(this.activeDoc) &&
      (raw === "ES" || raw === "EN ESPERA")
    ) {
      return false;
    }

    const val = this.getEstatusFromDetalle(item);
    return (
      val === "1" ||
      val === "PR" ||
      val === "PROCESAR" ||
      val === "PROCESADO" ||
      val === "APROBADO"
    );
  }

  // ─── Evaluar si un caso interno es Negado / No Procesar / Código Rojo ─────────
  public isNoProcesar(item: any): boolean {
    if (this.esDocFirmado(this.activeDoc)) {
      return !this.isAprobado(item);
    }
    const val = this.getEstatusFromDetalle(item);
    if (
      !val ||
      val === "1" ||
      val === "0" ||
      val === "4" ||
      val === "PR" ||
      val === "PROCESAR" ||
      val === "PROCESADO" ||
      val === "APROBADO"
    ) {
      return false;
    }
    return (
      val === "NP" ||
      val === "NEGADO" ||
      val === "NO PROCESAR" ||
      val === "NPPIDD" ||
      val === "NPPIDJ" ||
      val === "CR" ||
      val === "BD" ||
      val === "CODIGO ROJO" ||
      val === "CÓDIGO ROJO" ||
      val.startsWith("NP ") ||
      val.includes("RECHAZADO")
    );
  }

  // ─── Evaluar si un caso interno está Pendiente / Diferido ─────────────────────
  public isPendiente(item: any): boolean {
    if (this.esDocFirmado(this.activeDoc)) return false;
    const val = this.getEstatusFromDetalle(item);
    return (
      val === "PE" ||
      val === "PENDIENTE" ||
      val === "DI" ||
      val === "DIFERIDO" ||
      val.startsWith("PE ")
    );
  }

  public isEnEspera(item: any): boolean {
    if (this.esDocFirmado(this.activeDoc)) return false;
    const val = this.getEstatusFromDetalle(item);
    return val === "ES" || val === "EN ESPERA";
  }

  public getMinisterialSwitchLabel(item: any): string {
    if (this.esDocFirmado(this.activeDoc)) {
      return this.isAprobado(item) ? "APROBADO" : "NEGADO";
    }
    if (this.isEnEspera(item)) return "EN ESPERA";
    if (this.isNoProcesar(item)) return "NEGADO";
    return "APROBADO";
  }

  // ─── Obtener subcasos APROBADOS / PROCESAR ─────────────────────────────────────
  public getSubcasosProcesar(e: any): any[] {
    if (!e) return [];
    try {
      const list = this.getSubcasos(e) || [];
      // En CUADRO_DECISORIO para Ministro (o si está firmado), mostrar todos los integrantes juntos para evaluación / visualización de resultados
      if (
        this.selectedCarpeta?.id === "CUADRO_DECISORIO" &&
        (this.currentProfile === "Ministro" || this.esDocFirmado(e))
      ) {
        return list;
      }
      return list.filter(
        (item) => item && !this.isNoProcesar(item) && !this.isPendiente(item),
      );
    } catch (err) {
      return [];
    }
  }

  // ─── Obtener subcasos NEGADOS / EXCEPCIONES / CÓDIGO ROJO / PENDIENTES ──────────
  public getSubcasosNoProcesar(e: any): any[] {
    if (!e) return [];
    try {
      // En CUADRO_DECISORIO para Ministro (o si está firmado), no dividir en bloque aparte para evitar que salten de bloque al decidir
      if (
        this.selectedCarpeta?.id === "CUADRO_DECISORIO" &&
        (this.currentProfile === "Ministro" || this.esDocFirmado(e))
      ) {
        return [];
      }
      const list = this.getSubcasos(e) || [];
      return list.filter(
        (item) => item && (this.isNoProcesar(item) || this.isPendiente(item)),
      );
    } catch (err) {
      return [];
    }
  }

  // ─── Obtener datos a mostrar por elemento del buzón ──────────────────────────
  public getIdentificador(e: any): string {
    if (!e) return "";
    const ced = this.getCedula(e);
    if (ced) return ced;
    return e.cuenta || e.numc || "";
  }

  public getAsunto(e: any): string {
    if (!e) return "";
    if (e.tdoc === "TRAMITACION POR ORGANO REGULAR") {
      return e.cont || e.resumen || "";
    }
    let asu = e.resumen || e.cont || "";
    if (
      !asu &&
      Array.isArray(e.mergedDocumentos) &&
      e.mergedDocumentos.length > 0
    ) {
      asu = e.mergedDocumentos[0]?.resumen || e.mergedDocumentos[0]?.cont || "";
    }
    return asu;
  }

  public getFecha(e: any): string {
    if (e.fecha) return e.fecha.substring(0, 10);
    if (e.fech) return e.fech.substring(0, 10);
    return "";
  }

  // ─── Actualizar buzón ─────────────────────────────────────────────────────────
  public actualizarBuzon(): void {
    if (this.selectedCarpeta) {
      this.cargarBuzon(this.selectedCarpeta);
    }
  }

  // ─── Limpiar HTML y entidades (&nbsp;, &#160;) del texto ─────────────────────
  public stripHtml(html: string): string {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&#160;/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&[a-z0-9#]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ─── Asunto limpio sin HTML ───────────────────────────────────────────────────
  public getAsuntoClean(e: any): string {
    return this.stripHtml(this.getAsunto(e));
  }

  // ─── Parser para Datos de Reclamos ────────────────────────────────────────────
  public getReclamosData(doc: any): any {
    let jsonToParse =
      doc.detallejsonfinal ||
      doc.detallefinaljson ||
      doc.detalleJsonFinal ||
      doc.detalleJson;

    if (!jsonToParse && doc.detalle && doc.detalle.includes("{")) {
      try {
        const parts = doc.detalle.split("|PR|");
        jsonToParse = parts.length > 1 ? parts[1] : doc.detalle;
      } catch (e) {}
    }

    if (jsonToParse && jsonToParse.includes("{")) {
      try {
        let safeJson = jsonToParse;
        if (typeof safeJson === "string") {
          safeJson = safeJson.replace(/u003c/g, "<").replace(/u003e/g, ">");
          safeJson = safeJson.replace(/u0026/g, "&");
          safeJson = safeJson.replace(/="([^"]*)"/g, "='$1'");
        }

        let parsed =
          typeof safeJson === "string" ? JSON.parse(safeJson) : safeJson;
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }

        let formValues = parsed.obse ? parsed.obse : parsed;
        if (typeof formValues === "string") {
          formValues = JSON.parse(formValues);
        }

        return formValues;
      } catch (e) {
        console.error("Error parsing Reclamos JSON data", e);
      }
    }

    return null;
  }

  // ─── Verifica si el HTML tiene contenido real ──────────────────────────
  public tieneContenido(html: string): boolean {
    if (!html) return false;
    const limpio = html.replace(/<[^>]*>?/gm, "").trim();
    return limpio.length > 0;
  }

  // ─── Cargar fotos de cédula via blob CDN ──────────────────────────────────────
  public cargarFotosBuzon(items: any[]): void {
    if (!items || items.length === 0) return;
    items.forEach((item) => {
      const rawCed = this.getCedula(item);
      const cedula = rawCed.replace(/\./g, "").trim();
      if (!cedula) return;

      if (this.loadingFotos[cedula] || this.fotosCasos[cedula] !== undefined) {
        return;
      }

      this.loadingFotos[cedula] = true;
      const payload = {
        ruta: "img/temp/" + cedula + "/",
        archivo: "foto.jpg",
      };

      this.apiService.postBlob("federate/sssifanb/dwscdn", payload).subscribe({
        next: (data: Blob) => {
          this.loadingFotos[cedula] = false;
          if (data && data.size > 0) {
            const rawUrl = URL.createObjectURL(data);
            this.rawUrlsMap[cedula] = rawUrl;
            this.fotosCasos[cedula] =
              this.sanitizer.bypassSecurityTrustUrl(rawUrl);
          } else {
            this.fotosCasos[cedula] = "";
          }
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          this.loadingFotos[cedula] = false;
          console.error("Error al cargar foto de cédula " + cedula, error);
          this.fotosCasos[cedula] = "";
          this.changeDetector.detectChanges();
        },
      });
    });
  }

  // ─── Ver foto en modal ampliado (Swal) ───────────────────────────────────────
  public verFotoAmpliada(cedula: string): void {
    if (!cedula) return;
    const cleanCed = cedula.toString().replace(/\./g, "").trim();
    const rawUrl = this.rawUrlsMap[cleanCed];

    const swalOptions: any = {
      title: `Cédula: ${cleanCed}`,
      imageAlt: "Fotografía Militar / Afiliado",
      imageHeight: 450,
      confirmButtonColor: "#5e72e4",
      confirmButtonText: "Cerrar",
      background: "#ffffff",
      color: "#2d3748",
    };

    if (rawUrl) {
      swalOptions.imageUrl = rawUrl;
    } else {
      swalOptions.imageUrl =
        "https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/" +
        cleanCed +
        "/foto.jpg";
    }

    Swal.fire(swalOptions);
  }

  // ─── Abrir panel de detalle ───────────────────────────────────────────────────
  public openDetail(e: any): void {
    if (!e) return;
    this.observacion = "";
    this.showPdf = false;
    this.pdfUrl = null;
    this.isDetailOpen = true;

    if (
      e.isTagFolder &&
      Array.isArray(e.puntosDeCuenta) &&
      e.puntosDeCuenta.length > 0
    ) {
      this.currentTagGroupFolder = e;
      this.groupCases = e.puntosDeCuenta;
      this.currentGroupCaseIndex = 0;
      this.activeDoc = { ...this.groupCases[0] };
    } else {
      this.currentTagGroupFolder = null;
      this.groupCases = [];
      this.currentGroupCaseIndex = -1;
      this.activeDoc = { ...e };
    }

    this.editandoContenido = false;
    this.contenidoEditado = (
      this.getAsuntoClean(this.activeDoc) ||
      this.activeDoc?.asunto ||
      this.activeDoc?.cont ||
      ""
    ).toUpperCase();

    try {
      const subcasos = this.getSubcasos(this.activeDoc) || [];
      this.cargarFotosBuzon([this.activeDoc, ...subcasos]);
    } catch (err) {
      console.warn("[DocumentosOk] Error en cargarFotosBuzon:", err);
    }

    if (this.selectedCarpeta?.id === "RECLAMOS") {
      this.consultarDatosBasicos();
    } else if (this.selectedCarpeta?.id === "ACTIVIDADES_EN_EL_EXTERIOR") {
      this.consultarDetalleDocumento(this.activeDoc);
    }

    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  // ─── Navegación entre Casos del Agrupado ───────────────────────────────────────
  public selectGroupCase(index: number): void {
    if (!this.groupCases || index < 0 || index >= this.groupCases.length)
      return;
    this.currentGroupCaseIndex = index;
    // Renovar referencia clonando el objeto para forzar refrescamiento reactivo en Angular
    this.activeDoc = { ...this.groupCases[index] };
    this.observacion = "";
    this.showPdf = false;
    this.pdfUrl = null;
    this.editandoContenido = false;
    this.contenidoEditado = (
      this.getAsuntoClean(this.activeDoc) ||
      this.activeDoc?.asunto ||
      this.activeDoc?.cont ||
      ""
    ).toUpperCase();
    try {
      const subcasos = this.getSubcasos(this.activeDoc) || [];
      this.cargarFotosBuzon([this.activeDoc, ...subcasos]);
    } catch (err) {
      console.warn("[DocumentosOk] Error en cargarFotosBuzon:", err);
    }

    if (this.selectedCarpeta?.id === "RECLAMOS") {
      this.consultarDatosBasicos();
    } else if (this.selectedCarpeta?.id === "ACTIVIDADES_EN_EL_EXTERIOR") {
      this.consultarDetalleDocumento(this.activeDoc);
    }

    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  public nextGroupCase(): void {
    if (
      this.groupCases &&
      this.currentGroupCaseIndex < this.groupCases.length - 1
    ) {
      this.selectGroupCase(this.currentGroupCaseIndex + 1);
    }
  }

  public prevGroupCase(): void {
    if (this.groupCases && this.currentGroupCaseIndex > 0) {
      this.selectGroupCase(this.currentGroupCaseIndex - 1);
    }
  }

  // ─── Obtener subcasos / personas dentro del expediente ────────────────────────
  public getSubcasos(e: any): any[] {
    if (!e) return [];
    if (e.isTagFolder) {
      if (Array.isArray(e.mergedDocumentos) && e.mergedDocumentos.length > 0) {
        return e.mergedDocumentos;
      }
      const allSub: any[] = [];
      if (Array.isArray(e.puntosDeCuenta)) {
        e.puntosDeCuenta.forEach((p: any) => {
          if (p && p.mergedDocumentos) {
            p.mergedDocumentos.forEach((s: any) => {
              if (s && !allSub.includes(s)) allSub.push(s);
            });
          }
        });
      }
      return allSub;
    }

    let list: any[] = [];

    // 1. Prioridad: mergedDocumentos generados al agrupar
    if (Array.isArray(e.mergedDocumentos) && e.mergedDocumentos.length > 0) {
      list = [...e.mergedDocumentos];
    }

    // 2. Si no hay mergedDocumentos, intentar parsear subdocumento JSON
    if (list.length === 0 && e.subdocumento) {
      try {
        const parsed =
          typeof e.subdocumento === "string"
            ? JSON.parse(e.subdocumento)
            : e.subdocumento;
        if (Array.isArray(parsed)) {
          list = parsed.map((item: any) =>
            typeof item === "object" ? item : JSON.parse(item),
          );
        }
      } catch (err) {
        console.warn("[DocumentosOk] Error parsing subdocumento:", err);
      }
    }

    // 3. Fallbacks de colecciones existentes
    if (
      list.length === 0 &&
      Array.isArray(e.documentos) &&
      e.documentos.length > 0
    ) {
      list = [...e.documentos];
    } else if (
      list.length === 0 &&
      Array.isArray(e.lstCuenta) &&
      e.lstCuenta.length > 0
    ) {
      list = [...e.lstCuenta];
    }

    // 4. Si estamos navegando dentro de una carpeta agrupada, buscar en mergedDocumentos de la carpeta
    if (
      list.length === 0 &&
      this.currentTagGroupFolder &&
      Array.isArray(this.currentTagGroupFolder.mergedDocumentos) &&
      this.currentTagGroupFolder.mergedDocumentos.length > 0
    ) {
      const eNumc = (e.numc || e.ncontrol || e.cuenta || "").toString().trim();
      const matched = this.currentTagGroupFolder.mergedDocumentos.filter(
        (sub: any) => {
          if (!sub) return false;
          const subNumc = (sub.numc || sub.ncontrol || sub.cuenta || "")
            .toString()
            .trim();
          return eNumc && subNumc && subNumc === eNumc;
        },
      );
      if (matched.length > 0) {
        list = [...matched];
      }
    }

    // 5. Si el caso individual posee datos de persona propios, sintetizar subcaso
    if (list.length === 0 && (this.getCedula(e) || this.getNombre(e))) {
      list = [
        {
          ...e,
          cedula: this.getCedula(e),
          sub_cedula: this.getCedula(e),
          nombre: this.getNombre(e),
          sub_nombre: this.getNombre(e),
          cargo: this.getCargo(e),
          sub_cargo: this.getCargo(e),
          sub_detalle:
            e.sub_detalle || e.detalle || e.estatus || e.estado || "PR",
          detalle: e.sub_detalle || e.detalle || e.estatus || e.estado || "PR",
          observacion: e.observacion || e.sub_observacion || e.obse || "",
          sub_observacion: e.observacion || e.sub_observacion || e.obse || "",
        },
      ];
    }

    // 6. Normalizar campos en cada integrante para asegurar que la vista siempre tenga los valores
    return list
      .map((item: any) => {
        if (!item) return item;
        const ced = (item.sub_cedula || item.cedula || item.cuenta || "")
          .toString()
          .trim();
        const nom = (
          item.sub_nombre ||
          item.nombre ||
          item.nombres_apellidos ||
          item.nom ||
          ""
        )
          .toString()
          .trim()
          .toUpperCase();
        const car = (
          item.sub_cargo ||
          item.cargo ||
          item.grado ||
          item.puesto ||
          ""
        )
          .toString()
          .trim()
          .toUpperCase();
        const det =
          item.sub_detalle ||
          item.detalle ||
          item.estatus ||
          item.estado ||
          "PR";
        const obs = item.observacion || item.sub_observacion || item.obse || "";

        item.cedula = ced;
        item.sub_cedula = ced;
        item.nombre = nom;
        item.sub_nombre = nom;
        item.cargo = car;
        item.sub_cargo = car;
        item.detalle = det;
        item.sub_detalle = det;
        item.observacion = obs;
        item.sub_observacion = obs;

        // ── Lógica Exclusiva para Ministro en CUADRO_DECISORIO: todos por defecto en "ES" SOLO si NO está firmado ──
        if (
          this.currentProfile === "Ministro" &&
          this.selectedCarpeta?.id === "CUADRO_DECISORIO" &&
          !this.esDocFirmado(e)
        ) {
          const rawEstatus = this.getEstatusFromDetalle(item);

          const isDefault =
            rawEstatus === "" ||
            rawEstatus === "1" ||
            rawEstatus === "0" ||
            rawEstatus === "4" ||
            rawEstatus === "PR" ||
            rawEstatus === "PROCESAR" ||
            rawEstatus === "PROCESADO" ||
            rawEstatus === "APROBADO";

          if (isDefault && !item.__minister_touched) {
            item.sub_detalle = "ES";
            item.detalle = "ES";
            item.s_estatus = "ES";
            item.sub_estatus = "ES";
            item.estatus = "ES";
            item.estado = "ES";
          }
        } else if (this.esDocFirmado(e)) {
          // En documento firmado, el estatus es APROBADO ("PR") o NEGADO ("NP") solamente
          const rawEstatus = this.getEstatusFromDetalle(item);
          if (
            rawEstatus === "ES" ||
            rawEstatus === "EN ESPERA" ||
            !this.isAprobado(item)
          ) {
            item.sub_detalle = "NP";
            item.detalle = "NP";
            item.s_estatus = "NP";
            item.sub_estatus = "NP";
            item.estatus = "NP";
            item.estado = "NP";
          }
        }

        return item;
      })
      .sort((a: any, b: any) => {
        const idA = parseInt(a.cedula || a.sub_cedula || "0", 10);
        const idB = parseInt(b.cedula || b.sub_cedula || "0", 10);
        return idB - idA;
      });
  }

  // ─── TrackBy para optimizar y forzar re-render de integrantes ────────────────
  public trackBySubcaso(index: number, item: any): string {
    if (!item) return `${index}`;
    return `${item.cedula || item.sub_cedula || item.cuenta || index}_${item.sub_detalle || item.detalle || ""}_${index}`;
  }

  // ─── Cerrar panel de detalle ──────────────────────────────────────────────────
  public closeDetail(): void {
    this.isDetailOpen = false;
    this.activeDoc = null;
    this.currentTagGroupFolder = null;
    this.groupCases = [];
    this.currentGroupCaseIndex = -1;
    this.observacion = "";
    this.showPdf = false;
    this.pdfUrl = null;
    this.editandoContenido = false;
    this.contenidoEditado = "";
    this.changeDetector.detectChanges();
  }

  // ─── Evaluar si un documento está Firmado ────────────────────────────
  public esDocFirmado(doc?: any): boolean {
    if (!doc) doc = this.activeDoc;
    if (this.selectedEstadoBuzon === "firmados" || this.estadoOrigen === 7)
      return true;
    if (!doc) return false;
    return (
      doc.estado === 7 ||
      doc.idestado === 7 ||
      doc.idestado === "7" ||
      doc.estatus === 7 ||
      doc.estatus === "7" ||
      doc.idestado === 18 || // Cuadro decisorio firmado/promovido
      doc.estado === 18 ||
      !!doc.anom_firmado ||
      !!doc.archivo_firmado
    );
  }

  // ─── URL del PDF del documento ────────────────────────────────────────────────
  public getDwsUrl(e: any): string {
    if (!e) return "";
    const ncontrol = e.numc || e.ncontrol || "0";
    let archivo =
      e.anom_firmado || e.archivo_firmado || e.anom || e.archivo || "";
    if (!archivo) return "";

    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo);
  }

  // ─── Abrir PDF en nueva pestaña ───────────────────────────────────────────────
  public verPDF(e: any): void {
    const url = this.getDwsUrl(e);
    if (url) {
      window.open(url, "_blank");
    } else {
      this.toastrService.warning(
        "Este documento no tiene archivo adjunto.",
        "Sin archivo",
      );
    }
  }

  // ─── Alternar Estatus de Subcaso / Integrante (Solo en Nivel Ministro) ────────
  public toggleSubcasoEstatus(item: any, event?: any): void {
    if (this.currentProfile !== "Ministro") return;

    let isCurrentlyNoProcesar = this.isNoProcesar(item);
    if (event && event.target && event.target.checked !== undefined) {
      // Si vino del input checkbox, checked true = APROBADO (no procesar false), false = NEGADO (no procesar true)
      isCurrentlyNoProcesar = !event.target.checked;
    } else {
      // Si vino de clic en el texto o sin evento nativo:
      // Si estaba en ESPERA o NEGADO -> pasa a APROBADO (isCurrentlyNoProcesar = false)
      // Si estaba en APROBADO -> pasa a NEGADO (isCurrentlyNoProcesar = true)
      const currentLabel = this.getMinisterialSwitchLabel(item);
      isCurrentlyNoProcesar = currentLabel === "APROBADO";
    }
    const newStatus = isCurrentlyNoProcesar ? "NP" : "PR";

    item.__minister_touched = true;
    item.sub_detalle = newStatus;
    item.detalle = newStatus;
    item.s_estatus = newStatus;
    item.sub_estatus = newStatus;
    item.estatus = newStatus;
    item.estado = newStatus;

    // ── En CUADRO_DECISORIO: se permite seleccionar MÁS DE UN integrante a la vez.
    // Al aprobar uno ("PR"), sólo los integrantes que aún estén "EN ESPERA" (sin decisión previa)
    // pasan automáticamente a "NP" (NEGADO), respetando a los que ya fueron previamente aprobados.
    if (
      this.selectedCarpeta?.id === "CUADRO_DECISORIO" &&
      newStatus === "PR" &&
      this.activeDoc
    ) {
      const allItems = this.getSubcasos(this.activeDoc);
      allItems.forEach((sibling) => {
        if (sibling !== item && this.isEnEspera(sibling)) {
          sibling.__minister_touched = true;
          sibling.sub_detalle = "NP";
          sibling.detalle = "NP";
          sibling.s_estatus = "NP";
          sibling.sub_estatus = "NP";
          sibling.estatus = "NP";
          sibling.estado = "NP";
        }
      });
    }

    this.changeDetector.detectChanges();
  }

  // ─── Modal de Firma Ministerial (APROBADO, NEGADO, VISTO, DIFERIDO, OTRO) ───────
  public async solicitarFirmaMinistro(): Promise<void> {
    if (!this.activeDoc) return;

    console.log("Verificando");
    console.log(this.activeDoc);

    (Swal as any).selectedDecision = null;

    const { value: decisionSeleccionada } = await Swal.fire({
      title: "Decisión y Firma Ministerial",
      html: `
        <p class="text-muted mb-3" style="font-size: 0.88rem;">
          Seleccione la decisión final para el expediente <strong>Nº ${this.activeDoc.numc || this.activeDoc.ncontrol || ""}</strong>:
        </p>
        <div class="swal-decision-grid">
          <button id="btn-swal-aprobado" class="swal-decision-btn btn-swal-aprobado" type="button">
            <i class="fas fa-check-circle"></i>
            <span>APROBADO</span>
          </button>
          <button id="btn-swal-negado" class="swal-decision-btn btn-swal-negado" type="button">
            <i class="fas fa-times-circle"></i>
            <span>NEGADO</span>
          </button>
          <button id="btn-swal-visto" class="swal-decision-btn btn-swal-visto" type="button">
            <i class="fas fa-eye"></i>
            <span>VISTO</span>
          </button>
          <button id="btn-swal-diferido" class="swal-decision-btn btn-swal-diferido" type="button">
            <i class="fas fa-clock"></i>
            <span>DIFERIDO</span>
          </button>
          <button id="btn-swal-otro" class="swal-decision-btn btn-swal-otro" type="button">
            <i class="fas fa-comment-dots"></i>
            <span>OTRO</span>
          </button>
        </div>

        <div class="swal-cancel-wrapper mt-3">
          <button id="btn-swal-cancelar" class="swal-cancel-btn" type="button">
            <i class="fas fa-times mr-1"></i> Cancelar sin Acción
          </button>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: false,
      customClass: {
        popup: "swal-executive-popup",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        if (!popup) return;

        const bindBtn = (id: string, val: string) => {
          const btn = popup.querySelector(id);
          if (btn) {
            btn.addEventListener("click", () => {
              (Swal as any).selectedDecision = val;
              Swal.clickConfirm();
            });
          }
        };

        bindBtn("#btn-swal-aprobado", "APROBADO");
        bindBtn("#btn-swal-negado", "NEGADO");
        bindBtn("#btn-swal-visto", "VISTO");
        bindBtn("#btn-swal-diferido", "DIFERIDO");
        bindBtn("#btn-swal-otro", "OTRO");

        const cancelBtn = popup.querySelector("#btn-swal-cancelar");
        if (cancelBtn) {
          cancelBtn.addEventListener("click", () => {
            (Swal as any).selectedDecision = null;
            Swal.close();
          });
        }
      },
      preConfirm: () => {
        return (Swal as any).selectedDecision || null;
      },
    });

    if (!decisionSeleccionada) return;

    let observacionFinal = this.observacion.trim().toUpperCase();

    if (decisionSeleccionada === "OTRO") {
      const { value: comentarioOtro } = await Swal.fire({
        title: "Especificar motivo de la decisión (OTRO)",
        input: "textarea",
        inputLabel: "Describa el motivo o justificación de la decisión:",
        inputPlaceholder: "Escriba aquí la justificación explicativa...",
        showCancelButton: true,
        confirmButtonColor: "#5e72e4",
        cancelButtonColor: "#8898aa",
        confirmButtonText: "Confirmar y Firmar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "Debe ingresar una explicación cuando selecciona la opción OTRO.";
          }
          return null;
        },
      });

      if (!comentarioOtro) return;
      observacionFinal = comentarioOtro.trim().toUpperCase();
    } else if (
      decisionSeleccionada === "DIFERIDO" ||
      decisionSeleccionada === "NEGADO"
    ) {
      if (!observacionFinal) {
        const { value: comentarioReq } = await Swal.fire({
          title: `Observación requerida para ${decisionSeleccionada}`,
          input: "textarea",
          inputLabel: `Ingrese el motivo o razón para la decisión '${decisionSeleccionada}':`,
          inputPlaceholder: "Escriba aquí la observación...",
          showCancelButton: true,
          confirmButtonColor: "#5e72e4",
          cancelButtonColor: "#8898aa",
          confirmButtonText: "Continuar y Firmar",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value || !value.trim()) {
              return `La observación es obligatoria para registrar la decisión '${decisionSeleccionada}'.`;
            }
            return null;
          },
        });

        if (!comentarioReq) return;
        observacionFinal = comentarioReq.trim().toUpperCase();
      }
    }

    this.fnxFirmaMinistro(decisionSeleccionada);
    this.observacion = observacionFinal;
    this.loadingAction = true;
    this.redistribuir(decisionSeleccionada);
  }

  // ─── Utilidades para PDF de Punto de Cuenta ──────────────────────────────────
  private async cargarImagenParaPDF(
    url: string,
    maxDim: number = 500,
    isJpeg: boolean = false,
    timeoutMs: number = 6000,
  ): Promise<string | null> {
    if (!url) return null;
    return new Promise((resolve) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn("[cargarImagenParaPDF] Timeout cargando:", url);
          resolve(null);
        }
      }, timeoutMs);

      const img = new Image();
      if (url.startsWith("http://") || url.startsWith("https://")) {
        img.crossOrigin = "Anonymous";
      }
      img.onload = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        try {
          let origW = img.naturalWidth || img.width || 300;
          let origH = img.naturalHeight || img.height || 300;
          let targetW = origW;
          let targetH = origH;
          if (origW > maxDim || origH > maxDim) {
            if (origW >= origH) {
              targetH = Math.round((origH * maxDim) / origW);
              targetW = maxDim;
            } else {
              targetW = Math.round((origW * maxDim) / origH);
              targetH = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            if (isJpeg) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, targetW, targetH);
            }
            ctx.drawImage(img, 0, 0, targetW, targetH);
            if (isJpeg) {
              resolve(canvas.toDataURL("image/jpeg", 0.78));
            } else {
              resolve(canvas.toDataURL("image/png"));
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          console.warn("[cargarImagenParaPDF] Error al procesar en canvas:", e);
          resolve(null);
        }
      };
      img.onerror = () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        console.warn("[cargarImagenParaPDF] Error cargando imagen:", url);
        resolve(null);
      };
      img.src = url;
    });
  }

  private formatFechaPuntoCuenta(d: any): string {
    let date = new Date();
    if (d) {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) date = parsed;
    }
    const day = String(date.getDate()).padStart(2, "0");
    const meses = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const month = meses[date.getMonth()] || "SEP";
    const year = String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  }

  // ─── Generación de PDF Exclusivo para CUADRO_DECISORIO (PUNTO DE CUENTA) ────────
  public async generarPuntoDeCuentaPDF(): Promise<void> {
    if (!this.activeDoc) return;

    // 1. Confirmar firma y revisar comentarios oficiales para el MPPD
    // Transcribir observaciones existentes (del campo 'Observación para Decisión' o subcasos) en mayúsculas
    let comentarioInicial = (
      this.observacion ||
      this.activeDoc?.observacion ||
      ""
    )
      .toString()
      .trim();
    if (!comentarioInicial) {
      const subObsList = (this.getSubcasos(this.activeDoc) || [])
        .filter((c: any) =>
          (c.observacion || c.sub_observacion || "").toString().trim(),
        )
        .map((c: any) => {
          const nom = (c.nombre || c.nombres || c.cedula || "Candidato")
            .toString()
            .trim();
          const obs = (c.observacion || c.sub_observacion).toString().trim();
          return `${nom}: ${obs}`;
        });
      if (subObsList.length > 0) {
        comentarioInicial = subObsList.join(" | ");
      }
    }
    comentarioInicial = comentarioInicial.toUpperCase();
    const tieneObservacion = !!comentarioInicial;

    const modalHtml = `
      <div style="text-align: left; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-left: 4px solid #8e1c26; padding: 12px 14px; border-radius: 6px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-weight: 700; color: #8e1c26; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            <i class="fas fa-file-signature mr-1"></i> Emisión de Cuadro Decisorio Ministerial
          </div>
          <div style="font-size: 0.82rem; color: #475569;">
            Se procederá a generar el <b>Papel de Trabajo oficial (Carta)</b> con firma y sello del General en Jefe Ministro del Poder Popular para la Defensa y decisiones de los integrantes.
          </div>
        </div>

        ${
          tieneObservacion
            ? `
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-top: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fas fa-comment-alt text-danger mr-1"></i> Observación para Decisión Registrada:
              </span>
              <span style="font-size: 0.65rem; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">CARGADA</span>
            </div>
            <div style="font-size: 0.82rem; font-weight: 600; color: #0f172a; line-height: 1.4; word-break: break-word; text-transform: uppercase;">
              ${comentarioInicial}
            </div>
          </div>
        `
            : `
          <div style="margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label for="swal-mppd-comentario" style="font-weight: 700; font-size: 0.75rem; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
                <i class="fas fa-pen-fancy text-danger mr-1"></i> Comentarios del MPPD (Opcional):
              </label>
              <span style="font-size: 0.65rem; font-weight: 700; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">EN MAYÚSCULAS</span>
            </div>
            <textarea id="swal-mppd-comentario"
                      rows="3"
                      style="width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 0.82rem; font-family: inherit; border: 1.5px solid #cbd5e1; border-radius: 6px; resize: vertical; text-transform: uppercase; outline: none; transition: border-color 0.2s;"
                      placeholder="OBSERVACIONES O INSTRUCCIONES DEL MINISTRO..."
                      onfocus="this.style.borderColor='#8e1c26'"
                      onblur="this.style.borderColor='#cbd5e1'"
                      oninput="this.value = this.value.toUpperCase()"></textarea>
          </div>
        `
        }
      </div>
    `;

    const confirmacion = await Swal.fire({
      title: "Cuadro Decisorio - Ministro",
      html: modalHtml,
      showCancelButton: true,
      confirmButtonColor: "#8e1c26",
      cancelButtonColor: "#64748b",
      confirmButtonText:
        '<i class="fas fa-file-signature mr-1"></i> Firmar y Subir',
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        if (tieneObservacion) {
          return comentarioInicial;
        }
        const el = document.getElementById(
          "swal-mppd-comentario",
        ) as HTMLTextAreaElement;
        return el ? el.value.trim().toUpperCase() : "";
      },
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    if (confirmacion.value !== undefined) {
      this.observacion = confirmacion.value.toString().trim().toUpperCase();
      if (this.activeDoc) {
        this.activeDoc.observacion = this.observacion;
      }
    }

    // 2. Indicador de progreso
    Swal.fire({
      title: "Generando Cuadro Decisorio...",
      html: "Confeccionando documento ministerial tamaño Carta, fotografías y sellos oficiales...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // 3. Obtener subcasos (candidatos) y asegurar carga de fotos
    const subcasos = this.getSubcasos(this.activeDoc);
    const candidates = subcasos.length > 0 ? subcasos : [this.activeDoc];
    this.cargarFotosBuzon(candidates);

    // Esperar brevemente por si alguna foto de la CDN está descargando
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 4. Cargar recursos gráficos institucionales con optimización de tamaño y rutas de respaldo
    const [escudoImg, firmaImg, selloImg] = await Promise.all([
      this.cargarImagenParaPDF("assets/img/brand/escudo.png", 300, false, 5000)
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "assets/images/escudo.png",
              300,
              false,
              5000,
            ),
        )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "assets/img/mppd/escudos/100.jpeg",
              300,
              false,
              5000,
            ),
        ),
      this.cargarImagenParaPDF(
        "assets/img/mppd/firma_mppd.png",
        600,
        false,
        6000,
      ).then(
        (res) =>
          res ||
          this.cargarImagenParaPDF(
            "./assets/img/mppd/firma_mppd.png",
            600,
            false,
            6000,
          ),
      ),
      this.cargarImagenParaPDF(
        "assets/img/mppd/sello_mppd.png",
        500,
        false,
        6000,
      )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "./assets/img/mppd/sello_mppd.png",
              500,
              false,
              6000,
            ),
        )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "/assets/img/mppd/sello_mppd.png",
              500,
              false,
              6000,
            ),
        ),
    ]);

    // 5. Configurar documento jsPDF formato Carta (Letter: 215.9 x 279.4 mm) con compresión activa
    const pageWidth = 215.9;
    const pageHeight = 279.4; // Formato Carta
    const margin = 10;
    const contentWidth = pageWidth - margin * 2; // 195.9 mm

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
      compress: true,
    });

    // 5.1 Marca de agua "PAPEL DE TRABAJO" (sin líneas de marco exterior)
    try {
      (pdf as any).saveGraphicsState();
    } catch (e) {}
    pdf.setTextColor(240, 240, 240);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(38);
    try {
      pdf.text("PAPEL DE TRABAJO", pageWidth / 2, 140, {
        align: "center",
        angle: 45,
      } as any);
    } catch (e) {
      pdf.text("PAPEL DE TRABAJO", pageWidth / 2, 140, { align: "center" });
    }
    try {
      (pdf as any).restoreGraphicsState();
    } catch (e) {}

    // 5.2 Marca institucional vertical "MPPD" (esquina superior derecha, posición 207mm para despeje total)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 32, 96);
    pdf.text("M\nP\nP\nD", 207, 16);

    // 5.3 Encabezado: Escudo y membrete izquierdo
    if (escudoImg) {
      try {
        pdf.addImage(escudoImg, "PNG", 28, 12, 14, 14, undefined, "FAST");
      } catch (e) {}
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(5.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text("República Bolivariana de Venezuela", 35, 27.5, {
      align: "center",
    });
    pdf.text("Ministerio del Poder Popular para la Defensa", 35, 30, {
      align: "center",
    });
    pdf.text("Dirección General del Despacho del MPPD", 35, 32.5, {
      align: "center",
    });

    // Cuadro de Número de Control / Expediente
    const numControl = (
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.cuenta ||
      "012-26"
    )
      .toString()
      .trim();
    const borderGray = [115, 115, 115];
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.35);
    pdf.rect(20, 34.5, 30, 6, "S");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.text(`Nº ${numControl}`, 35, 38.7, { align: "center" });

    // 5.4 Título Central: CUADRO DECISORIO (Fuente 13 / Tahoma Style)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(0, 0, 0);
    pdf.text("CUADRO DECISORIO AL GENERAL EN JEFE MINISTRO DEL", 135, 14.5, {
      align: "center",
    });
    pdf.text("PODER POPULAR PARA LA DEFENSA", 135, 19.5, { align: "center" });

    // 5.5 Cuadro Presentante / Fecha / Página
    const boxX = 65;
    const boxY = 22;
    const boxW = 137;
    const boxH = 17.5;
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(boxX, boxY, boxW, boxH, "S");
    pdf.line(152, boxY, 152, boxY + boxH);
    pdf.line(180, boxY, 180, boxY + boxH);

    // Presentante
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Presentante:", boxX + 2, boxY + 3.8);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.2);
    pdf.text("LUÍS ADOLFO ROSALES MOLINA", 108.5, boxY + 6.8, {
      align: "center",
    });
    pdf.setFontSize(6.8);
    pdf.text("MAYOR GENERAL", 108.5, boxY + 10.5, { align: "center" });
    pdf.setFontSize(6.2);
    pdf.text("DIRECTOR GENERAL DEL DESPACHO DEL MPPD", 108.5, boxY + 14.2, {
      align: "center",
    });

    // Fecha (Fecha oficial del día de la firma ministerial)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Fecha:", 166, boxY + 4, { align: "center" });
    pdf.line(152, boxY + 6, 180, boxY + 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    const fechaDoc = this.formatFechaPuntoCuenta(new Date());
    pdf.text(fechaDoc, 166, boxY + 12.5, { align: "center" });

    // Página
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Página:", 191, boxY + 4, { align: "center" });
    pdf.line(180, boxY + 6, boxX + boxW, boxY + 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.text("1/1", 191, boxY + 12.5, { align: "center" });

    // 5.6 Franja ASUNTO
    const redColor = [225, 0, 0];
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 41, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("ASUNTO:", margin + 2, 44);

    // Contenido ASUNTO
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 45, contentWidth, 8, "FD");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    const asuntoRaw = (
      this.activeDoc.asunto ||
      this.activeDoc.cont ||
      "PROPUESTA DE NOMBRAMIENTO"
    ).toUpperCase();
    const splitAsunto = pdf.splitTextToSize(asuntoRaw, contentWidth - 4);
    pdf.text(splitAsunto, margin + 2, 48.5);

    // 5.7 Franja ARGUMENTACIÓN
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 54, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("ARGUMENTACIÓN:", margin + 2, 57);

    // Contenido ARGUMENTACIÓN
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 58, contentWidth, 5, "FD");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.8);
    const argumentacion =
      this.activeDoc.argumentacion ||
      "Se somete a consideración del ciudadano General en Jefe, Ministro del Poder Popular para la Defensa, el siguiente nombramiento:";
    pdf.text(argumentacion, margin + 2, 61.8);

    // 5.8 Encabezado de Tabla de Decisiones
    const tableY = 64;
    const colW = [7, 23, 33, 20, 48, 34, 30.9];
    const colX: number[] = [margin];
    for (let i = 0; i < colW.length; i++) {
      colX.push(colX[i] + colW[i]);
    }

    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, tableY, contentWidth, 5.5, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(5.8);
    pdf.setTextColor(255, 255, 255);

    pdf.text("Nº", colX[0] + colW[0] / 2, tableY + 3.8, { align: "center" });
    pdf.text("ACTUAL", colX[1] + colW[1] / 2, tableY + 3.8, {
      align: "center",
    });
    pdf.text(
      "GRADO, NOMBRES\nY APELLIDOS",
      colX[2] + colW[2] / 2,
      tableY + 2.4,
      { align: "center" },
    );
    pdf.text("CANDIDATO\nPROPUESTO", colX[3] + colW[3] / 2, tableY + 2.4, {
      align: "center",
    });
    pdf.text(
      "GRADO, NOMBRES\nY APELLIDOS",
      colX[4] + colW[4] / 2,
      tableY + 2.4,
      { align: "center" },
    );
    pdf.text("DECISIÓN", colX[5] + colW[5] / 2, tableY + 3.8, {
      align: "center",
    });
    pdf.text("OBSERVACIONES", colX[6] + colW[6] / 2, tableY + 3.8, {
      align: "center",
    });

    // Líneas divisorias en cabecera
    pdf.setDrawColor(240, 240, 240);
    for (let i = 1; i < colX.length - 1; i++) {
      pdf.line(colX[i], tableY, colX[i], tableY + 5.5);
    }

    // 5.9 Filas de Candidatos / Decisión (Altura 22mm para que 3 candidatos quepan con holgura en Hoja Carta)
    const startBodyY = tableY + 5.5;
    const rowH = 22; // 3 candidatos = 66 mm
    const totalTableH = rowH * candidates.length;

    // Columna 1: Nº ("01") unificada para el bloque con borde gris suave
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.35);
    pdf.rect(colX[0], startBodyY, colW[0], totalTableH, "S");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text("01", colX[0] + colW[0] / 2, startBodyY + totalTableH / 2 + 1.5, {
      align: "center",
    });

    // Columna 2 & 3: "PLAZA VACANTE" unificada para el bloque con borde gris suave
    const plazaW = colW[1] + colW[2];
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(colX[1], startBodyY, plazaW, totalTableH, "S");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    const cargoActual = (
      this.activeDoc.actual ||
      this.activeDoc.cargo_actual ||
      "PLAZA VACANTE"
    ).toUpperCase();
    pdf.text(
      cargoActual,
      colX[1] + plazaW / 2,
      startBodyY + totalTableH / 2 + 1.5,
      { align: "center" },
    );

    // Recorrer cada candidato para las columnas 4, 5, 6 y 7
    for (let idx = 0; idx < candidates.length; idx++) {
      const item = candidates[idx];
      const yCand = startBodyY + idx * rowH;

      // Columna 4: CANDIDATO PROPUESTO (Foto optimizada en JPEG liviano)
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.rect(colX[3], yCand, colW[3], rowH, "S");
      const cleanCed = (this.getCedula(item) || "").replace(/\./g, "").trim();
      let photoImg = null;
      if (cleanCed && this.rawUrlsMap[cleanCed]) {
        // Redimensionar foto a 250px en JPEG (peso ~15KB en vez de 10MB)
        photoImg = await this.cargarImagenParaPDF(
          this.rawUrlsMap[cleanCed],
          250,
          true,
          4000,
        );
      }
      const pW = 15;
      const pH = 19;
      const pX = colX[3] + (colW[3] - pW) / 2;
      const pY = yCand + (rowH - pH) / 2;

      if (photoImg) {
        try {
          pdf.addImage(photoImg, "JPEG", pX, pY, pW, pH, undefined, "FAST");
          pdf.setDrawColor(180, 180, 180);
          pdf.rect(pX, pY, pW, pH, "S");
        } catch (e) {
          pdf.setFillColor(240, 240, 240);
          pdf.rect(pX, pY, pW, pH, "FD");
        }
      } else {
        pdf.setFillColor(242, 242, 242);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(pX, pY, pW, pH, "FD");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(5);
        pdf.setTextColor(140, 140, 140);
        pdf.text("FOTO", pX + pW / 2, pY + pH / 2 + 1, { align: "center" });
      }

      // Columna 5: GRADO, NOMBRES Y APELLIDOS / DATOS
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.rect(colX[4], yCand, colW[4], rowH, "S");
      const cNom = this.getNombre(item);
      const cCed = this.getCedula(item);
      const cGrado = (item.grado || item.sub_grado || "").toUpperCase();
      const cCargo = (this.getCargo(item) || "").toUpperCase();
      const cPromo = (item.promocion || item.sub_promocion || "").toUpperCase();

      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      let curY = yCand + 3.8;
      const fullName = `${cGrado ? cGrado + " " : ""}${cNom}`.trim();
      const splitName = pdf.splitTextToSize(fullName, colW[4] - 4);
      pdf.text(splitName, colX[4] + 2, curY);
      curY += splitName.length * 2.6 + 0.4;

      pdf.setFontSize(5.8);
      pdf.text(`C.I. Nº ${cCed || "N/A"}`, colX[4] + 2, curY);
      curY += 2.6;

      if (cPromo) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(5);
        const splitPromo = pdf.splitTextToSize(
          `PROMOCIÓN: ${cPromo}`,
          colW[4] - 4,
        );
        pdf.text(splitPromo, colX[4] + 2, curY);
        curY += splitPromo.length * 2.1;
      }

      if (cCargo && cCargo !== "S/C") {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(5);
        const splitCargo = pdf.splitTextToSize(
          `CARGO ACTUAL: ${cCargo}`,
          colW[4] - 4,
        );
        pdf.text(splitCargo, colX[4] + 2, curY);
      }

      // Columna 6: DECISIÓN (Casillas Aprobado / Negado con bordes suaves)
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.rect(colX[5], yCand, colW[5], rowH, "S");
      const estatusStr = this.getMinisterialSwitchLabel(item);
      const isAprobado = estatusStr === "APROBADO";

      const boxSize = 5.5;
      const boxY = yCand + rowH / 2 - 4;

      // Casilla APROBADO
      const apX = colX[5] + 5;
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.setLineWidth(0.35);
      pdf.rect(apX, boxY, boxSize, boxSize, "S");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(5);
      pdf.setTextColor(0, 0, 0);
      pdf.text("APROBADO", apX + boxSize / 2, boxY + boxSize + 2.8, {
        align: "center",
      });

      // Casilla NEGADO
      const negX = colX[5] + 20;
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.rect(negX, boxY, boxSize, boxSize, "S");
      pdf.text("NEGADO", negX + boxSize / 2, boxY + boxSize + 2.8, {
        align: "center",
      });

      // Marcar según la decisión tomada con colores MATE pastel secos
      if (isAprobado) {
        pdf.setDrawColor(85, 134, 100); // Verde salvia mate pastel seco
        pdf.setLineWidth(0.85);
        pdf.line(apX + 1.0, boxY + 2.8, apX + 2.2, boxY + 4.5);
        pdf.line(apX + 2.2, boxY + 4.5, apX + 4.6, boxY + 1.0);
      } else {
        pdf.setDrawColor(182, 98, 90); // Terracota / ladrillo mate pastel seco
        pdf.setLineWidth(0.85);
        pdf.line(negX + 1.0, boxY + 1.0, negX + 4.5, boxY + 4.5);
        pdf.line(negX + 4.5, boxY + 1.0, negX + 1.0, boxY + 4.5);
      }

      // Columna 7: OBSERVACIONES (en Mayúsculas y formato elegante)
      pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      pdf.setLineWidth(0.35);
      pdf.rect(colX[6], yCand, colW[6], rowH, "S");
      const obs = (item.observacion || item.sub_observacion || "")
        .toString()
        .trim()
        .toUpperCase();
      if (obs) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(5);
        pdf.setTextColor(30, 30, 30);
        const splitObs = pdf.splitTextToSize(obs, colW[6] - 4);
        pdf.text(splitObs, colX[6] + 2, yCand + 3.8);
      }
    }

    // 5.10 Franja COMENTARIOS DEL MPPD
    const comY = startBodyY + totalTableH + 2.5;
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, comY, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("COMENTARIOS DEL MPPD:", margin + 2, comY + 2.8);

    // Contenedor de Comentarios del MPPD
    const comBoxH = 13;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, comY + 4, contentWidth, comBoxH, "FD");
    if (this.observacion) {
      pdf.setTextColor(20, 20, 20);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.8);
      const splitComentarios = pdf.splitTextToSize(
        this.observacion.toUpperCase(),
        contentWidth - 4,
      );
      pdf.text(splitComentarios, margin + 2, comY + 8);
    }

    // 5.11 Firma Oficial del Ministro y Sello 5x5 cm (Centrada, amplia y con sello oficial)
    const sigLineY = 222;
    const centerX = pageWidth / 2;

    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.4);
    pdf.line(centerX - 42, sigLineY, centerX + 42, sigLineY);

    // Texto con +2 puntos de tamaño para presencia jerárquica
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text("GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ", centerX, sigLineY + 5, {
      align: "center",
    });
    pdf.setFontSize(10);
    pdf.text("General en Jefe", centerX, sigLineY + 9.5, { align: "center" });
    pdf.setFontSize(9.5);
    pdf.text(
      "Ministro del Poder Popular para la Defensa",
      centerX,
      sigLineY + 14,
      { align: "center" },
    );

    // Estampar Sello Oficial en el lado izquierdo (55 x 55 mm, desplazado más a la izquierda)
    if (selloImg) {
      try {
        pdf.addImage(
          selloImg,
          "PNG",
          centerX - 68,
          sigLineY - 37,
          55,
          55,
          undefined,
          "FAST",
        );
      } catch (e) {
        console.warn("[PuntoDeCuenta] Aviso al estampar sello:", e);
      }
    }

    // Estampar Firma Oficial del Ministro (95 x 41 mm, desplazada un poco más a la derecha)
    if (firmaImg) {
      try {
        pdf.addImage(
          firmaImg,
          "PNG",
          centerX - 39,
          sigLineY - 27,
          95,
          41,
          undefined,
          "FAST",
        );
      } catch (e) {
        console.warn("[PuntoDeCuenta] Aviso al estampar firma:", e);
      }
    }

    // 5.12 Iniciales de redacción (al pie de la página Carta)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.setTextColor(60, 60, 60);
    pdf.text("RESA/WJBF/fabm", margin + 2, 271);

    // 6. Generar Blob del PDF y preparar nombre de archivo oficial con patron PC-cleanNumc.pdf
    const pdfBlob = pdf.output("blob");
    const cleanNumc = (
      this.activeDoc?.numc ||
      this.activeDoc?.ncontrol ||
      numControl
    )
      .toString()
      .replace(/[\r\n\t /]+/g, "_")
      .trim();
    const filename = `PC-${cleanNumc}.pdf`;

    // 7. Descargar copia local preliminar para el usuario
    pdf.save(filename);

    // 8. Construir formulario multipart siguiendo el patrón de tinder-pdf-viewer
    const formData = new FormData();
    formData.append("archivos", pdfBlob, filename);
    formData.append(
      "nombre",
      this.activeDoc?.signatures?.mainSignatory || "MINISTRO DE LA DEFENSA",
    );
    formData.append("locacion", "Caracas, Venezuela");
    formData.append("razon", "Punto de Cuenta Ministerial - Cuadro Decisorio");
    formData.append("contacto", "MPPD");
    formData.append("codigo", filename);
    formData.append("return", "true"); // <-- Solicitar retorno de archivo PDF firmado directamente

    // Firma digital visible en cabecera (esquina superior derecha, sutil ~2cm)
    formData.append("visible", "true");

    // --- NUEVOS PARÁMETROS PARA EL BACKEND EN GO ---
    formData.append("transparente", "true"); // El Widget Annotation será INVISIBLE
    formData.append("page", "1"); // Página donde se ubicará el Widget interactivo

    // Coordenadas PDF (en puntos, no mm) para colocar el Widget Annotation
    // Arriba a la derecha: x ~ 195mm (550pts), y ~ 20mm desde arriba (930pts desde abajo)
    formData.append("llx", "540"); // Margen izquierdo
    formData.append("lly", "910"); // Margen inferior
    formData.append("urx", "580"); // Margen derecho
    formData.append("ury", "970"); // Margen superior

    // 9. Consumir servicio Go de firma con barras de progreso de subida
    let signedPdfBlob: Blob = pdfBlob;
    try {
      signedPdfBlob = await new Promise<Blob>(
        (resolvePromise, rejectPromise) => {
          this.fileService.FirmarPDFProgress(formData).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                const progress = Math.round(100 * (event.loaded / event.total));
                Swal.update({
                  title: "Enviando al servidor...",
                  html: `Progreso de subida: <b>${progress}%</b><br><div style="width: 100%; background: #e9ecef; border-radius: 4px; overflow: hidden; margin-top: 10px;"><div style="width: ${progress}%; height: 8px; background: #2dce89; transition: width 0.1s ease;"></div></div>`,
                });
              } else if (event.type === HttpEventType.Response) {
                if (event.body) {
                  resolvePromise(event.body);
                } else {
                  resolvePromise(pdfBlob);
                }
              }
            },
            error: (err: any) => {
              console.warn("[PuntoDeCuenta] Advertencia al firmar PDF:", err);
              resolvePromise(pdfBlob);
            },
          });
        },
      );
    } catch (errSign) {
      console.warn("[PuntoDeCuenta] Excepción en FirmarPDFProgress:", errSign);
      signedPdfBlob = pdfBlob;
    }

    // 10. Subir archivo a la carpeta oficial del caso mediante subirarchivos (identificador encriptado)
    try {
      const uploadForm = new FormData();
      uploadForm.append("identificador", btoa("D" + numControl));
      uploadForm.append("return", "true");
      uploadForm.append("archivos", signedPdfBlob, filename);

      await new Promise((resolve) => {
        this.apiService.EnviarArchivos(uploadForm).subscribe({
          next: (data) => {
            console.log("[PuntoDeCuenta] Respuesta EnviarArchivos:", data);
            resolve(data);
          },
          error: (err) => {
            console.warn("[PuntoDeCuenta] Aviso al subir archivo:", err);
            resolve(null);
          },
        });
        setTimeout(() => resolve(null), 4000);
      });
    } catch (errUp) {
      console.warn("[PuntoDeCuenta] Error al subir archivo a la ruta:", errUp);
    }

    // 11. Registrar adjunto en el Workflow (WKF_ADocumentoAdjunto)
    try {
      const docAdjunto = {
        archivo: filename,
        usuario: this.loginService?.Usuario?.id || "",
        documento: numControl,
      };
      const xAPI: IAPICore = {
        funcion: "WKF_ADocumentoAdjunto",
        parametros: "",
        valores: JSON.stringify(docAdjunto),
      };
      await new Promise((resolve) => {
        this.apiService.Ejecutar(xAPI).subscribe({
          next: (data) => {
            console.log(
              "[PuntoDeCuenta] Respuesta WKF_ADocumentoAdjunto:",
              data,
            );
            resolve(data);
          },
          error: (err) => resolve(null),
        });
        setTimeout(() => resolve(null), 3000);
      });
    } catch (errAdj) {
      console.warn("[PuntoDeCuenta] Aviso al registrar adjunto:", errAdj);
    }

    // 12. Actualizar referencias del documento y ejecutar firma ministerial
    this.activeDoc.numc = numControl;
    this.activeDoc.anom = filename;
    this.activeDoc.archivo = filename;
    this.activeDoc.archivo_firmado = filename;
    try {
      this.fnxFirmaMinistro("APROBADO");
    } catch (errFnx) {
      console.warn("[PuntoDeCuenta] Aviso en fnxFirmaMinistro:", errFnx);
    }

    // 12.1 Actualizar en base de datos el estatus de los subdocumentos según la selección de los casos (WKF_APromoverSubDocumento)
    try {
      await this.actualizarBaseDatosSubcasosDecisorios();
    } catch (errBdSub) {
      console.warn(
        "[PuntoDeCuenta] Aviso al actualizar subdocumentos en BD:",
        errBdSub,
      );
    }

    Swal.close();
    this.toastrService.success(
      "Documento Cuadro Decisorio (Papel de Trabajo) tamaño Carta generado, firmado y subido al servidor exitosamente.",
      "GDoc Cuadro Decisorio",
    );

    // 13. Avanzar flujo a FAVORABLE
    this.loadingAction = true;
    this.redistribuir("FAVORABLE");
  }

  // ─── Generación de PDF Exclusivo para ACTIVIDADES EN EL EXTERIOR ────────────
  public async generarActividadesExteriorPDF(): Promise<void> {
    if (!this.activeDoc) return;

    // 1. Confirmar firma y revisar comentarios oficiales para el MPPD
    const viaje = this.getViajesData(this.activeDoc) || {};
    const pais = (viaje.invitado || viaje.pais || "EXTERIOR")
      .toString()
      .toUpperCase()
      .trim();
    const dirigidoA = (viaje.dirigido || "OFICIAL DESIGNADO")
      .toString()
      .toUpperCase()
      .trim();
    const cantPersonas = viaje.personas || 1;
    const motivoViaje = (
      viaje.motivo ||
      this.getAsuntoClean(this.activeDoc) ||
      this.activeDoc.cont ||
      "COMISIÓN DE SERVICIO AL EXTERIOR"
    )
      .toString()
      .toUpperCase()
      .trim();
    const fechaInicioStr = this.formatNgbDate(viaje.fechaInicio);
    const fechaFinStr = this.formatNgbDate(viaje.fechaFin);
    const duracionDias =
      this.getDiasViaje(viaje.fechaInicio, viaje.fechaFin) || "—";
    const gastos = viaje.gastos || {};
    const gastosBoletos = (gastos.boletos || "NO ESPECIFICA")
      .toString()
      .toUpperCase();
    const gastosAlojamiento = (gastos.alojamiento || "NO ESPECIFICA")
      .toString()
      .toUpperCase();
    const gastosAlimentacion = (gastos.alimentacion || "NO ESPECIFICA")
      .toString()
      .toUpperCase();
    const gastosTransporte = (gastos.transporte || "NO ESPECIFICA")
      .toString()
      .toUpperCase();

    let comentarioInicial = (
      this.observacion ||
      this.activeDoc?.observacion ||
      ""
    )
      .toString()
      .trim()
      .toUpperCase();
    const tieneObservacion = !!comentarioInicial;

    const modalHtml = `
      <div style="text-align: left; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-left: 4px solid #8e1c26; padding: 12px 14px; border-radius: 6px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-weight: 700; color: #8e1c26; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            <i class="fas fa-globe-americas mr-1"></i> Autorización de Actividades en el Exterior
          </div>
          <div style="font-size: 0.82rem; color: #475569;">
            Se procederá a generar el <b>Documento Oficial Ministerial (Carta)</b> con firma y sello del General en Jefe Ministro del Poder Popular para la Defensa y aprobación del viaje a <b>${pais}</b>.
          </div>
        </div>

        ${
          tieneObservacion
            ? `
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-top: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fas fa-comment-alt text-danger mr-1"></i> Observación Registrada:
              </span>
              <span style="font-size: 0.65rem; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">CARGADA</span>
            </div>
            <div style="font-size: 0.82rem; font-weight: 600; color: #0f172a; line-height: 1.4; word-break: break-word; text-transform: uppercase;">
              ${comentarioInicial}
            </div>
          </div>
        `
            : `
          <div style="margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label for="swal-mppd-comentario-ext" style="font-weight: 700; font-size: 0.75rem; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
                <i class="fas fa-pen-fancy text-danger mr-1"></i> Comentarios / Instrucciones del Ministro:
              </label>
              <span style="font-size: 0.65rem; font-weight: 700; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">EN MAYÚSCULAS</span>
            </div>
            <textarea id="swal-mppd-comentario-ext"
                      rows="3"
                      style="width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 0.82rem; font-family: inherit; border: 1.5px solid #cbd5e1; border-radius: 6px; resize: vertical; text-transform: uppercase; outline: none; transition: border-color 0.2s;"
                      placeholder="INSTRUCCIONES U OBSERVACIONES PARA EL VIAJE AL EXTERIOR..."
                      onfocus="this.style.borderColor='#8e1c26'"
                      onblur="this.style.borderColor='#cbd5e1'"
                      oninput="this.value = this.value.toUpperCase()"></textarea>
          </div>
        `
        }
      </div>
    `;

    const confirmacion = await Swal.fire({
      title: "Actividades en el Exterior - Ministro",
      html: modalHtml,
      showCancelButton: true,
      confirmButtonColor: "#8e1c26",
      cancelButtonColor: "#64748b",
      confirmButtonText:
        '<i class="fas fa-file-signature mr-1"></i> Firmar y Subir',
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        if (tieneObservacion) {
          return comentarioInicial;
        }
        const el = document.getElementById(
          "swal-mppd-comentario-ext",
        ) as HTMLTextAreaElement;
        return el ? el.value.trim().toUpperCase() : "";
      },
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    if (confirmacion.value !== undefined) {
      this.observacion = confirmacion.value.toString().trim().toUpperCase();
      if (this.activeDoc) {
        this.activeDoc.observacion = this.observacion;
      }
    }

    // 2. Indicador de progreso
    Swal.fire({
      title: "Generando Actividades en el Exterior...",
      html: "Confeccionando documento ministerial tamaño Carta, itinerario, gastos y sellos oficiales...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // 3. Cargar recursos gráficos institucionales con optimización de tamaño y rutas de respaldo
    const [escudoImg, firmaImg, selloImg, banderaImg] = await Promise.all([
      this.cargarImagenParaPDF("assets/img/brand/escudo.png", 300, false, 5000)
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "assets/images/escudo.png",
              300,
              false,
              5000,
            ),
        )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "assets/img/mppd/escudos/100.jpeg",
              300,
              false,
              5000,
            ),
        ),
      this.cargarImagenParaPDF(
        "assets/img/mppd/firma_mppd.png",
        600,
        false,
        6000,
      ).then(
        (res) =>
          res ||
          this.cargarImagenParaPDF(
            "./assets/img/mppd/firma_mppd.png",
            600,
            false,
            6000,
          ),
      ),
      this.cargarImagenParaPDF(
        "assets/img/mppd/sello_mppd.png",
        500,
        false,
        6000,
      )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "./assets/img/mppd/sello_mppd.png",
              500,
              false,
              6000,
            ),
        )
        .then(
          (res) =>
            res ||
            this.cargarImagenParaPDF(
              "/assets/img/mppd/sello_mppd.png",
              500,
              false,
              6000,
            ),
        ),
      this.cargarImagenParaPDF(this.getFlagUrl(pais), 200, false, 3000).catch(
        () => null,
      ),
    ]);

    // 4. Configurar documento jsPDF formato Carta (Letter: 215.9 x 279.4 mm)
    const pageWidth = 215.9;
    const pageHeight = 279.4;
    const margin = 10;
    const contentWidth = pageWidth - margin * 2; // 195.9 mm

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
      compress: true,
    });

    // 4.1 Marca de agua "PAPEL DE TRABAJO"
    try {
      (pdf as any).saveGraphicsState();
    } catch (e) {}
    pdf.setTextColor(240, 240, 240);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(38);
    try {
      pdf.text("PAPEL DE TRABAJO", pageWidth / 2, 140, {
        align: "center",
        angle: 45,
      } as any);
    } catch (e) {
      pdf.text("PAPEL DE TRABAJO", pageWidth / 2, 140, { align: "center" });
    }
    try {
      (pdf as any).restoreGraphicsState();
    } catch (e) {}

    // 4.2 Marca institucional vertical "MPPD" (esquina superior derecha, posición 207mm)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 32, 96);
    pdf.text("M\nP\nP\nD", 207, 16);

    // 4.3 Encabezado: Escudo y membrete izquierdo
    if (escudoImg) {
      try {
        pdf.addImage(escudoImg, "PNG", 28, 12, 14, 14, undefined, "FAST");
      } catch (e) {}
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(5.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text("República Bolivariana de Venezuela", 35, 27.5, {
      align: "center",
    });
    pdf.text("Ministerio del Poder Popular para la Defensa", 35, 30, {
      align: "center",
    });
    pdf.text("Dirección General del Despacho del MPPD", 35, 32.5, {
      align: "center",
    });

    // Cuadro de Número de Control / Expediente
    const numControl = (
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.cuenta ||
      "012-26"
    )
      .toString()
      .trim();
    const borderGray = [115, 115, 115];
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.35);
    pdf.rect(20, 34.5, 30, 6, "S");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.text(`Nº ${numControl}`, 35, 38.7, { align: "center" });

    // 4.4 Título Central: ACTIVIDADES EN EL EXTERIOR
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      "ACTIVIDADES EN EL EXTERIOR AL GENERAL EN JEFE MINISTRO DEL",
      135,
      14.5,
      {
        align: "center",
      },
    );
    pdf.text("PODER POPULAR PARA LA DEFENSA", 135, 19.5, { align: "center" });

    // 4.5 Cuadro Presentante / Fecha / Página
    const boxX = 65;
    const boxY = 22;
    const boxW = 137;
    const boxH = 17.5;
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(boxX, boxY, boxW, boxH, "S");
    pdf.line(152, boxY, 152, boxY + boxH);
    pdf.line(180, boxY, 180, boxY + boxH);

    // Presentante
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Presentante:", boxX + 2, boxY + 3.8);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.2);
    pdf.text("LUÍS ADOLFO ROSALES MOLINA", 108.5, boxY + 6.8, {
      align: "center",
    });
    pdf.setFontSize(6.8);
    pdf.text("MAYOR GENERAL", 108.5, boxY + 10.5, { align: "center" });
    pdf.setFontSize(6.2);
    pdf.text("DIRECTOR GENERAL DEL DESPACHO DEL MPPD", 108.5, boxY + 14.2, {
      align: "center",
    });

    // Fecha
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Fecha:", 166, boxY + 4, { align: "center" });
    pdf.line(152, boxY + 6, 180, boxY + 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    const fechaDoc = this.formatFechaPuntoCuenta(new Date());
    pdf.text(fechaDoc, 166, boxY + 12.5, { align: "center" });

    // Página
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.text("Página:", 191, boxY + 4, { align: "center" });
    pdf.line(180, boxY + 6, boxX + boxW, boxY + 6);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.text("1/1", 191, boxY + 12.5, { align: "center" });

    // 4.6 Franja ASUNTO
    const redColor = [225, 0, 0];
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 41, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("ASUNTO:", margin + 2, 44);

    // Contenido ASUNTO
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 45, contentWidth, 8, "FD");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    const asuntoRaw = `ACTIVIDAD EN EL EXTERIOR - ${motivoViaje}`;
    const splitAsunto = pdf.splitTextToSize(asuntoRaw, contentWidth - 4);
    pdf.text(splitAsunto, margin + 2, 48.5);

    // 4.7 Franja DATOS DE LA COMISIÓN Y PAÍS ANFITRIÓN
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 55, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("DATOS DE LA COMISIÓN Y PAÍS ANFITRIÓN:", margin + 2, 58);

    // Contenedor de Datos de Comisión
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, 59, contentWidth, 26, "FD");

    // Fila 1: País Destino y Delegación
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text("PAÍS DESTINO / ANFITRIÓN:", margin + 3, 63);

    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    pdf.text(pais, margin + 3, 68);

    // Estampar Bandera si cargó
    if (banderaImg) {
      try {
        const textW = pdf.getTextWidth(pais);
        pdf.addImage(
          banderaImg,
          "PNG",
          margin + 5 + textW,
          63.5,
          9,
          6,
          undefined,
          "FAST",
        );
      } catch (e) {}
    }

    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text("CANTIDAD DE PERSONAS:", margin + 130, 63);

    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${cantPersonas} PERSONA(S)`, margin + 130, 68);

    // Línea divisoria interna
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin + 2, 71, margin + contentWidth - 2, 71);

    // Fila 2: Dirigido a, Fecha Inicio, Fecha Fin, Duración
    // Dirigido A
    pdf.setFontSize(5.8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("DIRIGIDO A / DESIGNADO:", margin + 3, 75);

    pdf.setFontSize(7.2);
    pdf.setTextColor(15, 23, 42);
    const splitDirigido = pdf.splitTextToSize(dirigidoA, 62);
    pdf.text(splitDirigido, margin + 3, 79.5);

    // Fecha Inicio
    pdf.setFontSize(5.8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("FECHA INICIO:", margin + 70, 75);

    pdf.setFontSize(7.8);
    pdf.setTextColor(22, 101, 52); // Verde esmeralda
    pdf.text(fechaInicioStr, margin + 70, 79.5);

    // Fecha Retorno
    pdf.setFontSize(5.8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("FECHA RETORNO:", margin + 115, 75);

    pdf.setFontSize(7.8);
    pdf.setTextColor(185, 28, 28); // Rojo
    pdf.text(fechaFinStr, margin + 115, 79.5);

    // Duración
    pdf.setFontSize(5.8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("DURACIÓN:", margin + 160, 75);

    pdf.setFontSize(7.8);
    pdf.setTextColor(30, 64, 175); // Azul real
    pdf.text(duracionDias, margin + 160, 79.5);

    // 4.8 Franja COBERTURA DE GASTOS Y LOGÍSTICA
    const gastosY = 87;
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, gastosY, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("COBERTURA DE GASTOS Y LOGÍSTICA:", margin + 2, gastosY + 2.8);

    // Tabla de Gastos (4 columnas iguales)
    const tableGastosY = gastosY + 4;
    const colGW = contentWidth / 4; // ~48.975 mm cada columna
    const headerGH = 5;
    const rowGH = 8;

    pdf.setFillColor(241, 245, 249);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, tableGastosY, contentWidth, headerGH, "FD");

    pdf.setFontSize(5.8);
    pdf.setTextColor(51, 65, 85);
    pdf.text(
      "BOLETOS AÉREOS",
      margin + colGW * 0 + colGW / 2,
      tableGastosY + 3.4,
      { align: "center" },
    );
    pdf.text(
      "HOSPEDAJE / ALOJAMIENTO",
      margin + colGW * 1 + colGW / 2,
      tableGastosY + 3.4,
      { align: "center" },
    );
    pdf.text(
      "ALIMENTACIÓN",
      margin + colGW * 2 + colGW / 2,
      tableGastosY + 3.4,
      { align: "center" },
    );
    pdf.text(
      "TRANSPORTE INTERNO",
      margin + colGW * 3 + colGW / 2,
      tableGastosY + 3.4,
      { align: "center" },
    );

    // Fila Valores de Gastos
    const valGH = tableGastosY + headerGH;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, valGH, contentWidth, rowGH, "FD");

    pdf.setFontSize(6.8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(gastosBoletos, margin + colGW * 0 + colGW / 2, valGH + 5.2, {
      align: "center",
    });
    pdf.text(gastosAlojamiento, margin + colGW * 1 + colGW / 2, valGH + 5.2, {
      align: "center",
    });
    pdf.text(gastosAlimentacion, margin + colGW * 2 + colGW / 2, valGH + 5.2, {
      align: "center",
    });
    pdf.text(gastosTransporte, margin + colGW * 3 + colGW / 2, valGH + 5.2, {
      align: "center",
    });

    // Líneas divisorias verticales en tabla de gastos
    for (let i = 1; i < 4; i++) {
      const lineX = margin + colGW * i;
      pdf.line(lineX, tableGastosY, lineX, valGH + rowGH);
    }

    // 4.9 Franja ARGUMENTACIÓN Y JUSTIFICACIÓN
    const argY = 106;
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, argY, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(
      "ARGUMENTACIÓN Y JUSTIFICACIÓN INSTITUCIONAL:",
      margin + 2,
      argY + 2.8,
    );

    // Contenido ARGUMENTACIÓN
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, argY + 4, contentWidth, 16, "FD");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.8);
    const argumentacion =
      this.activeDoc.argumentacion ||
      "Se somete a la consideración del ciudadano General en Jefe, Ministro del Poder Popular para la Defensa, la participación institucional en la actividad en el exterior descrita, para dar cumplimiento a los objetivos estratégicos, compromisos de cooperación técnico-militar y representación oficial de la Fuerza Armada Nacional Bolivariana.";
    const splitArg = pdf.splitTextToSize(argumentacion, contentWidth - 4);
    pdf.text(splitArg, margin + 2, argY + 8);

    // 4.10 Franja DECISIÓN DEL CIUDADANO MINISTRO
    const decY = 128;
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, decY, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("DECISIÓN DEL CIUDADANO MINISTRO:", margin + 2, decY + 2.8);

    // Contenido DECISIÓN
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, decY + 4, contentWidth, 18, "FD");

    const boxSize = 5.5;
    const apX = margin + 30;
    const negX = margin + 110;
    const decBoxY = decY + 7;

    // Casilla APROBADO (Marcada)
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.35);
    pdf.rect(apX, decBoxY, boxSize, boxSize, "S");

    pdf.setDrawColor(85, 134, 100); // Verde salvia mate pastel
    pdf.setLineWidth(0.9);
    pdf.line(apX + 1.0, decBoxY + 2.8, apX + 2.2, decBoxY + 4.5);
    pdf.line(apX + 2.2, decBoxY + 4.5, apX + 4.6, decBoxY + 1.0);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text("APROBADO", apX + 8, decBoxY + 4.2);

    // Casilla NEGADO (Sin marcar)
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.35);
    pdf.rect(negX, decBoxY, boxSize, boxSize, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(140, 140, 140);
    pdf.text("NEGADO", negX + 8, decBoxY + 4.2);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.2);
    pdf.setTextColor(71, 85, 105);
    pdf.text(
      "AUTORIZADA LA COMISIÓN DE SERVICIO AL EXTERIOR SEGÚN ITINERARIO DESCRITO.",
      pageWidth / 2,
      decBoxY + 11.5,
      { align: "center" },
    );

    // 4.11 Franja OBSERVACIONES / INSTRUCCIONES DEL MPPD
    const obsY = 152;
    pdf.setFillColor(redColor[0], redColor[1], redColor[2]);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, obsY, contentWidth, 4, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("INSTRUCCIONES Y OBSERVACIONES DEL MPPD:", margin + 2, obsY + 2.8);

    // Contenido OBSERVACIONES
    const obsBoxH = 20;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.rect(margin, obsY + 4, contentWidth, obsBoxH, "FD");

    const textoObs = (
      this.observacion ||
      "CÚMPLASE CONFORME A LA DOCTRINA MILITAR Y DISPOSICIONES VIGENTES DE LA FUERZA ARMADA NACIONAL BOLIVARIANA."
    ).toUpperCase();

    pdf.setTextColor(20, 20, 20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    const splitObs = pdf.splitTextToSize(textoObs, contentWidth - 4);
    pdf.text(splitObs, margin + 2, obsY + 9);

    // 4.12 Firma Oficial del Ministro y Sello Oficial
    const sigLineY = 222;
    const centerX = pageWidth / 2;

    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.4);
    pdf.line(centerX - 42, sigLineY, centerX + 42, sigLineY);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text("GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ", centerX, sigLineY + 5, {
      align: "center",
    });
    pdf.setFontSize(10);
    pdf.text("General en Jefe", centerX, sigLineY + 9.5, { align: "center" });
    pdf.setFontSize(9.5);
    pdf.text(
      "Ministro del Poder Popular para la Defensa",
      centerX,
      sigLineY + 14,
      { align: "center" },
    );

    // Estampar Sello Oficial en el lado izquierdo (55 x 55 mm)
    if (selloImg) {
      try {
        pdf.addImage(
          selloImg,
          "PNG",
          centerX - 68,
          sigLineY - 37,
          55,
          55,
          undefined,
          "FAST",
        );
      } catch (e) {
        console.warn("[ActividadesExterior] Aviso al estampar sello:", e);
      }
    }

    // Estampar Firma Oficial del Ministro (95 x 41 mm)
    if (firmaImg) {
      try {
        pdf.addImage(
          firmaImg,
          "PNG",
          centerX - 39,
          sigLineY - 27,
          95,
          41,
          undefined,
          "FAST",
        );
      } catch (e) {
        console.warn("[ActividadesExterior] Aviso al estampar firma:", e);
      }
    }

    // 4.13 Iniciales de redacción (pie de página Carta)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.setTextColor(60, 60, 60);
    pdf.text("RESA/WJBF/fabm", margin + 2, 271);

    // 5. Generar Blob del PDF y preparar nombre de archivo oficial con patron EXT-cleanNumc.pdf
    const pdfBlob = pdf.output("blob");
    const cleanNumc = (
      this.activeDoc?.numc ||
      this.activeDoc?.ncontrol ||
      numControl
    )
      .toString()
      .replace(/[\r\n\t /]+/g, "_")
      .trim();
    const filename = `EXT-${cleanNumc}.pdf`;

    // 6. Descargar copia local preliminar para el usuario
    pdf.save(filename);

    // 7. Construir formulario multipart para el servicio Go de firma digital
    const formData = new FormData();
    formData.append("archivos", pdfBlob, filename);
    formData.append(
      "nombre",
      this.activeDoc?.signatures?.mainSignatory || "MINISTRO DE LA DEFENSA",
    );
    formData.append("locacion", "Caracas, Venezuela");
    formData.append(
      "razon",
      "Actividades en el Exterior - Aprobación Ministerial",
    );
    formData.append("contacto", "MPPD");
    formData.append("codigo", filename);
    formData.append("return", "true");
    formData.append("visible", "true");
    formData.append("transparente", "true");
    formData.append("page", "1");
    formData.append("llx", "540");
    formData.append("lly", "910");
    formData.append("urx", "580");
    formData.append("ury", "970");

    // 8. Consumir servicio Go de firma con barras de progreso de subida
    let signedPdfBlob: Blob = pdfBlob;
    try {
      signedPdfBlob = await new Promise<Blob>((resolvePromise) => {
        this.fileService.FirmarPDFProgress(formData).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = Math.round(100 * (event.loaded / event.total));
              Swal.update({
                title: "Enviando al servidor...",
                html: `Progreso de subida: <b>${progress}%</b><br><div style="width: 100%; background: #e9ecef; border-radius: 4px; overflow: hidden; margin-top: 10px;"><div style="width: ${progress}%; height: 8px; background: #2dce89; transition: width 0.1s ease;"></div></div>`,
              });
            } else if (event.type === HttpEventType.Response) {
              if (event.body) {
                resolvePromise(event.body);
              } else {
                resolvePromise(pdfBlob);
              }
            }
          },
          error: (err: any) => {
            console.warn(
              "[ActividadesExterior] Advertencia al firmar PDF:",
              err,
            );
            resolvePromise(pdfBlob);
          },
        });
      });
    } catch (errSign) {
      console.warn(
        "[ActividadesExterior] Excepción en FirmarPDFProgress:",
        errSign,
      );
      signedPdfBlob = pdfBlob;
    }

    // 9. Subir archivo a la carpeta oficial del caso mediante EnviarArchivos
    try {
      const uploadForm = new FormData();
      uploadForm.append("identificador", btoa("D" + numControl));
      uploadForm.append("return", "true");
      uploadForm.append("archivos", signedPdfBlob, filename);

      await new Promise((resolve) => {
        this.apiService.EnviarArchivos(uploadForm).subscribe({
          next: (data) => {
            console.log(
              "[ActividadesExterior] Respuesta EnviarArchivos:",
              data,
            );
            resolve(data);
          },
          error: (err) => {
            console.warn("[ActividadesExterior] Aviso al subir archivo:", err);
            resolve(null);
          },
        });
        setTimeout(() => resolve(null), 4000);
      });
    } catch (errUp) {
      console.warn(
        "[ActividadesExterior] Error al subir archivo a la ruta:",
        errUp,
      );
    }

    // 10. Registrar adjunto en el Workflow (WKF_ADocumentoAdjunto)
    try {
      const docAdjunto = {
        archivo: filename,
        usuario: this.loginService?.Usuario?.id || "",
        documento: numControl,
      };
      const xAPI: IAPICore = {
        funcion: "WKF_ADocumentoAdjunto",
        parametros: "",
        valores: JSON.stringify(docAdjunto),
      };
      await new Promise((resolve) => {
        this.apiService.Ejecutar(xAPI).subscribe({
          next: (data) => {
            console.log(
              "[ActividadesExterior] Respuesta WKF_ADocumentoAdjunto:",
              data,
            );
            resolve(data);
          },
          error: (err) => resolve(null),
        });
        setTimeout(() => resolve(null), 3000);
      });
    } catch (errAdj) {
      console.warn("[ActividadesExterior] Aviso al registrar adjunto:", errAdj);
    }

    // 11. Actualizar referencias del documento y ejecutar firma ministerial
    this.activeDoc.numc = numControl;
    this.activeDoc.anom = filename;
    this.activeDoc.archivo = filename;
    this.activeDoc.archivo_firmado = filename;
    try {
      this.fnxFirmaMinistro("APROBADO");
    } catch (errFnx) {
      console.warn("[ActividadesExterior] Aviso en fnxFirmaMinistro:", errFnx);
    }

    Swal.close();
    this.toastrService.success(
      "Documento de Actividades en el Exterior tamaño Carta generado, firmado y subido al servidor exitosamente.",
      "GDoc Actividades en el Exterior",
    );

    // 12. Avanzar flujo a FAVORABLE
    this.loadingAction = true;
    this.redistribuir("FAVORABLE");
  }

  // ─── Actualizar estado de subcasos/cuentas en Base de Datos (WKF_APromoverSubDocumento) ────
  public async actualizarBaseDatosSubcasosDecisorios(): Promise<void> {
    if (!this.activeDoc) return;
    const docId = (
      this.activeDoc.wfdocumento ||
      this.activeDoc.idd ||
      this.activeDoc.id ||
      ""
    ).toString();
    const numControl = (
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.cuenta ||
      ""
    )
      .toString()
      .trim();
    const fecha = new Date().toISOString();
    const llave = Md5.init(numControl + fecha);
    const usuario =
      this.loginService?.Usuario?.cedula ||
      this.jwtData?.userCedula ||
      "MINISTRO";

    // 1. Obtener la lista de integrantes del caso
    const subcasosEvaluados = this.getSubcasos(this.activeDoc);
    if (!subcasosEvaluados || subcasosEvaluados.length === 0) return;

    // 2. Consultar registros reales de la BD para asegurar los 'ids' oficiales
    let dbSubcasos: any[] = [];
    if (docId) {
      try {
        const xAPISub: IAPICore = {
          funcion: "WKF_CSubDocumentoID",
          parametros: docId,
          valores: "",
        };
        const resp: any = await firstValueFrom(
          this.apiService.Ejecutar(xAPISub),
        );
        if (resp && resp.Cuerpo && Array.isArray(resp.Cuerpo)) {
          dbSubcasos = resp.Cuerpo;
        }
      } catch (err) {
        console.warn(
          "[actualizarBaseDatosSubcasosDecisorios] Error consultando WKF_CSubDocumentoID:",
          err,
        );
      }
    }

    // 3. Mapear y preparar notas de entrega para cada integrante evaluado
    const lstNotaEntrega: any[] = [];
    for (let i = 0; i < subcasosEvaluados.length; i++) {
      const evalItem = subcasosEvaluados[i];
      const cedula = (
        this.getCedula(evalItem) ||
        evalItem.cedula ||
        evalItem.sub_cedula ||
        ""
      )
        .toString()
        .trim();

      // Buscar id en BD por cédula o por índice o en el propio objeto
      let subId = evalItem.ids || evalItem.id || evalItem.sub_id;
      let dbMatch = dbSubcasos.find((dbItem: any) => {
        const dbCed = (dbItem.cedula || dbItem.sub_cedula || "")
          .toString()
          .trim();
        return dbCed && cedula && dbCed === cedula;
      });
      if (!dbMatch && dbSubcasos[i]) {
        dbMatch = dbSubcasos[i];
      }
      if (dbMatch && dbMatch.ids) {
        subId = dbMatch.ids;
      }

      if (!subId) {
        console.warn(
          "[actualizarBaseDatosSubcasosDecisorios] No se encontró subId para integrante:",
          evalItem,
        );
        continue;
      }

      // Determinar decisión ministerial: "PR" (Aprobado) o "NP" (Negado)
      const label = this.getMinisterialSwitchLabel(evalItem);
      const decisionCode = label === "APROBADO" ? "PR" : "NP";
      let observacionFinal = decisionCode;
      if (evalItem.detallefinaljson && decisionCode === "PR") {
        observacionFinal = evalItem.detallefinaljson;
      } else if (evalItem.observacion || evalItem.sub_observacion) {
        observacionFinal = `${decisionCode} - ${(
          evalItem.observacion || evalItem.sub_observacion
        )
          .toString()
          .trim()
          .toUpperCase()}`;
      }

      lstNotaEntrega.push({
        id: subId,
        nombre: evalItem.nombre || evalItem.sub_nombre || "",
        cedula: cedula,
        numc: numControl,
        observacion: observacionFinal,
        llave: llave,
        udep: evalItem.udep || "",
        cuenta: evalItem.cuenta || "",
        cargo: this.getCargo(evalItem) || evalItem.cargo || "",
      });
    }

    if (lstNotaEntrega.length === 0) return;

    // 4. Promover cada subdocumento en BD utilizando WKF_APromoverSubDocumento
    const destino = 3;
    const estatus = 1;
    for (const e of lstNotaEntrega) {
      try {
        const xAPI: IAPICore = {
          funcion: "WKF_APromoverSubDocumento",
          valores: "",
          parametros: `${destino},${estatus},${e.llave}|${e.observacion},${usuario},1,${e.id}`,
        };
        await firstValueFrom(this.apiService.Ejecutar(xAPI));
        console.log(
          `[actualizarBaseDatosSubcasosDecisorios] Subdocumento ${e.id} promovido como ${e.observacion}`,
        );
      } catch (errPromover) {
        console.error(
          `[actualizarBaseDatosSubcasosDecisorios] Error promoviendo subdocumento ${e.id}:`,
          errPromover,
        );
      }
    }
  }

  // ─── Descargar Documento Firmado desde resueltos/ (PC-numc) ─────────────────
  public descargarDocumentoFirmadoCuadroDecisorio(doc?: any): void {
    const targetDoc = doc || this.activeDoc;
    if (!targetDoc) return;

    const rawNumc = (
      targetDoc.numc ||
      targetDoc.ncontrol ||
      targetDoc.cuenta ||
      ""
    )
      .toString()
      .replace(/[\r\n\t /]+/g, "_")
      .trim();

    if (!rawNumc) {
      this.toastrService.warning(
        "El documento no posee un número de control asignado.",
        "Aviso",
      );
      return;
    }

    const cleanNumc = rawNumc.startsWith("PC-") ? rawNumc : `PC-${rawNumc}`;
    const cleanName = cleanNumc.replace(/\.pdf$/i, "");

    const payload = {
      ruta: "resueltos/",
      archivo: `${cleanName}.pdf`,
    };

    Swal.fire({
      title: "Cargando Documento Firmado...",
      text: "Descargando Cuadro Decisorio oficial desde el servidor...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.apiService.postBlob("dwscdn", payload).subscribe({
      next: (data: Blob) => {
        Swal.close();
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL, "_blank");
      },
      error: (error) => {
        Swal.close();
        console.error("Error al descargar el PDF firmado:", error);
        const fallbackUrl = this.getDwsUrl(targetDoc);
        if (fallbackUrl) {
          window.open(fallbackUrl, "_blank");
        } else {
          this.toastrService.error(
            "No se pudo obtener el archivo firmado desde el servidor de almacenamiento.",
            "Error",
          );
        }
      },
    });
  }

  // ─── Descargar Documento Firmado Actividades Exterior desde resueltos/ (EXT-numc) ────
  public descargarDocumentoFirmadoActividadesExterior(doc?: any): void {
    const targetDoc = doc || this.activeDoc;
    if (!targetDoc) return;

    const rawNumc = (
      targetDoc.numc ||
      targetDoc.ncontrol ||
      targetDoc.cuenta ||
      ""
    )
      .toString()
      .replace(/[\r\n\t /]+/g, "_")
      .trim();

    if (!rawNumc) {
      this.toastrService.warning(
        "El documento no posee un número de control asignado.",
        "Aviso",
      );
      return;
    }

    const cleanNumc = rawNumc.startsWith("EXT-") ? rawNumc : `EXT-${rawNumc}`;
    const cleanName = cleanNumc.replace(/\.pdf$/i, "");

    const payload = {
      ruta: "resueltos/",
      archivo: `${cleanName}.pdf`,
    };

    Swal.fire({
      title: "Cargando Documento Firmado...",
      text: "Descargando Actividades en el Exterior oficial desde el servidor...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.apiService.postBlob("dwscdn", payload).subscribe({
      next: (data: Blob) => {
        Swal.close();
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL, "_blank");
      },
      error: (error) => {
        Swal.close();
        console.error("Error al descargar el PDF firmado:", error);
        const fallbackUrl = this.getDwsUrl(targetDoc);
        if (fallbackUrl) {
          window.open(fallbackUrl, "_blank");
        } else {
          this.toastrService.error(
            "No se pudo obtener el archivo firmado desde el servidor de almacenamiento.",
            "Error",
          );
        }
      },
    });
  }

  // ─── Edición de Contenido/Asunto (Jefe de Secretaría) ───────────────────────
  public loadingEditContenido: boolean = false;
  public editandoContenido: boolean = false;
  public contenidoEditado: string = "";

  public activarEdicionContenido(): void {
    this.editandoContenido = true;
    if (!this.contenidoEditado && this.activeDoc) {
      this.contenidoEditado = (
        this.getAsuntoClean(this.activeDoc) ||
        this.activeDoc.asunto ||
        this.activeDoc.cont ||
        ""
      ).toUpperCase();
    }
    this.changeDetector.detectChanges();
  }

  public cancelarEdicionContenido(): void {
    this.editandoContenido = false;
    if (this.activeDoc) {
      this.contenidoEditado = (
        this.getAsuntoClean(this.activeDoc) ||
        this.activeDoc.asunto ||
        this.activeDoc.cont ||
        ""
      ).toUpperCase();
    }
    this.changeDetector.detectChanges();
  }

  public editarContenidoDocumento(): void {
    if (!this.activeDoc) return;

    const numc = (
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.cuenta ||
      ""
    )
      .toString()
      .trim();

    if (!numc) {
      this.toastrService.warning(
        "El documento no posee un número de control asignado.",
        "Aviso",
      );
      return;
    }

    const contenido = (this.contenidoEditado || "")
      .toString()
      .trim()
      .toUpperCase();
    if (!contenido) {
      this.toastrService.warning(
        "El contenido del documento no puede estar vacío.",
        "Campo requerido",
      );
      return;
    }

    this.loadingEditContenido = true;
    const xAPI: IAPICore = {
      funcion: "WKF_UDocumentoSecretaria",
      parametros: `${numc},${contenido}`,
      valores: "",
    };

    this.apiService.Ejecutar(xAPI).subscribe({
      next: (data: any) => {
        this.loadingEditContenido = false;
        this.editandoContenido = false;

        // Actualizar datos del activeDoc localmente
        this.activeDoc.asunto = contenido;
        this.activeDoc.cont = contenido;
        if (this.activeDoc.resumen !== undefined) {
          this.activeDoc.resumen = contenido;
        }

        // Actualizar en el caso agrupado si aplica
        if (
          this.currentGroupCaseIndex >= 0 &&
          this.groupCases &&
          this.groupCases[this.currentGroupCaseIndex]
        ) {
          this.groupCases[this.currentGroupCaseIndex].asunto = contenido;
          this.groupCases[this.currentGroupCaseIndex].cont = contenido;
        }

        // Actualizar en la lista del buzón
        if (this.buzon && Array.isArray(this.buzon)) {
          const itemBuzon = this.buzon.find(
            (b: any) =>
              (b.numc || b.ncontrol || b.cuenta || "").toString().trim() ===
              numc,
          );
          if (itemBuzon) {
            itemBuzon.asunto = contenido;
            itemBuzon.cont = contenido;
          }
        }

        this.toastrService.success(
          "Asunto / Contenido del documento actualizado correctamente.",
          "Documento Modificado",
        );
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
      },
      error: (err: any) => {
        this.loadingEditContenido = false;
        console.error("[editarContenidoDocumento] Error:", err);
        this.toastrService.error(
          "Ocurrió un error al actualizar el contenido del documento.",
          "Error WKF_UDocumentoSecretaria",
        );
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
      },
    });
  }

  // ─── Acciones: Favorable / Firmar ─────────────────────────
  public ejecutarAccion(decision: "FAVORABLE" | "FIRMAR" | "ARCHIVAR"): void {
    if (!this.activeDoc) return;
    if (
      !this.observacion.trim() &&
      decision !== "FAVORABLE" &&
      decision !== "FIRMAR" &&
      decision !== "ARCHIVAR"
    ) {
      this.toastrService.warning(
        "Debe ingresar una observación.",
        "Campo requerido",
      );
      return;
    }
    this.loadingAction = true;
    this.redistribuir(decision);
  }

  async ActualizarUbicacionSecretaria() {
    if (!this.activeDoc) return;

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas devolver este documento al analista?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f39c12",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, devolver",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) {
      return;
    }

    this.loadingAction = true;
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_AUbicacionSecretaria";
    this.xAPI.parametros = `16,${this.activeDoc.idd}`;
    this.xAPI.valores = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          "Documento devuelto al analista correctamente.",
          "Documentos",
        );
        this.loadingAction = false;
        this.closeDetail();
        this.actualizarBuzon();
      },
      (error) => {
        this.loadingAction = false;
        console.error("Error al devolver al analista", error);
        this.toastrService.error(
          "Ocurrió un error al devolver el documento al analista.",
          "Error",
        );
      },
    );
  }

  async redistribuir(decision: any) {
    if (decision === "ARCHIVAR") {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de archivar el documento? En cualquier otro momento puede ser recuperado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) {
        this.loadingAction = false;
        return;
      }

      let localEstadoActual =
        this.selectedCarpeta?.id === "ACTIVIDADES_EN_EL_EXTERIOR"
          ? 11
          : this.selectedCarpeta?.id === "CUADRO_DECISORIO"
            ? 17
            : this.selectedCarpeta?.id === "PRESIDENCIALES"
              ? 4
              : 14;
      let localEstadoDestino = 1;

      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_ARedistribuir";
      this.xAPI.valores = "";
      this.xAPI.parametros = `${localEstadoActual},${localEstadoActual},${localEstadoDestino},${this.jwtData.userId},${this.activeDoc.idd}`;
      console.log(this.xAPI.parametros);
    } else {
      let estadoDestino = Math.min(this.estadoOrigen + 1, 7);

      // Flujo especial para RECLAMOS, PUNTO DE CUENTA, CUADRO DECISORIO y ACTIVIDADES EN EL EXTERIOR
      if (
        this.selectedCarpeta?.id === "RECLAMOS" ||
        this.selectedCarpeta?.id === "PUNTO_DE_CUENTA" ||
        this.selectedCarpeta?.id === "CUADRO_DECISORIO" ||
        this.selectedCarpeta?.id === "ACTIVIDADES_EN_EL_EXTERIOR"
      ) {
        if (this.estadoOrigen === 2) estadoDestino = 5;
        else if (this.estadoOrigen === 5) estadoDestino = 6;
        else if (this.estadoOrigen === 6) estadoDestino = 7;
      }

      // Flujo específico para PRESIDENCIALES: va del 4,3 al 4,5 y luego 4,6 y 4,7 final
      if (this.selectedCarpeta?.id === "PRESIDENCIALES") {
        if (this.estadoOrigen === 3) estadoDestino = 5;
        else if (this.estadoOrigen === 5) estadoDestino = 6;
        else if (this.estadoOrigen === 6) estadoDestino = 7;
      }

      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_ARedistribuir";
      this.xAPI.valores = "";
      this.xAPI.parametros = `${this.estadoActual},${this.estadoActual},${estadoDestino},${this.jwtData.userId},${this.activeDoc.idd}`;
      console.log(this.xAPI.parametros);
    }

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        const msgLabel =
          decision === "FIRMAR" || decision === "APROBADO"
            ? "Documento firmado"
            : decision === "ARCHIVAR"
              ? "Documento archivado"
              : `Decisión ${decision} registrada`;
        this.toastrService.success(`${msgLabel} correctamente.`, "Documentos");
        this.loadingAction = false;
        this.closeDetail();
        this.actualizarBuzon();

        this.guardarAlerta(1, this.utilService.ConvertirFecha(null));
        // this.toastrService.success(
        //   "El documento ha sido redistribuido segun su selección",
        //   `GDoc Wkf.DocumentoObservacion`,
        // );
      },
      (error) => {
        console.error(error);
        this.loadingAction = false;
      },
    );
  }

  async enviarAResoluciones(doc?: any) {
    const targetDoc = doc || this.activeDoc;
    if (!targetDoc) return;
    const docId = targetDoc.idd || targetDoc.id || targetDoc.numc;
    const userId = this.loginService.Usuario?.id || this.jwtData?.userId || "1";

    const result = await Swal.fire({
      title: "¿Enviar a Resoluciones?",
      text: "¿Está seguro que desea enviar el trámite a resoluciones?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5e72e4",
      cancelButtonColor: "#f5365c",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      this.loadingAction = true;
      this.ngxService.startLoader("loader-documentos");

      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_ARedistribuir";
      this.xAPI.valores = "";
      this.xAPI.parametros = `3,3,1,${userId},${docId}`;

      this.apiService.Ejecutar(this.xAPI).subscribe({
        next: (data) => {
          this.ngxService.stopLoader("loader-documentos");
          this.loadingAction = false;
          this.toastrService.success(
            "El trámite ha sido enviado a Resoluciones exitosamente.",
            "Redistribución de Documento",
          );
          if (this.closeDetail) this.closeDetail();
          if (this.actualizarBuzon) this.actualizarBuzon();
        },
        error: (error) => {
          this.ngxService.stopLoader("loader-documentos");
          this.loadingAction = false;
          console.error(error);
          this.toastrService.error(
            "Error al redistribuir el documento",
            "Error",
          );
        },
      });
    }
  }

  async enviarAOficio(doc?: any) {
    const targetDoc = doc || this.activeDoc;
    if (!targetDoc) return;
    const docId = targetDoc.idd || targetDoc.id || targetDoc.numc;
    const userId = this.loginService.Usuario?.id || this.jwtData?.userId || "1";

    const result = await Swal.fire({
      title: "¿Enviar a Oficio?",
      text: "¿Está seguro que desea enviar el trámite a Oficio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#11cdef",
      cancelButtonColor: "#f5365c",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      this.loadingAction = true;
      this.ngxService.startLoader("loader-documentos");

      this.xAPI = {} as IAPICore;
      this.xAPI.funcion = "WKF_ARedistribuir";
      this.xAPI.valores = "";
      this.xAPI.parametros = `4,4,8,${userId},${docId}`;

      this.apiService.Ejecutar(this.xAPI).subscribe({
        next: (data) => {
          this.ngxService.stopLoader("loader-documentos");
          this.loadingAction = false;
          this.toastrService.success(
            "El trámite ha sido enviado a Oficio exitosamente.",
            "Redistribución de Documento",
          );
          if (this.closeDetail) this.closeDetail();
          if (this.actualizarBuzon) this.actualizarBuzon();
        },
        error: (error) => {
          this.ngxService.stopLoader("loader-documentos");
          this.loadingAction = false;
          console.error(error);
          this.toastrService.error(
            "Error al redistribuir el documento",
            "Error",
          );
        },
      });
    }
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo;
    this.WAlerta.documento = parseInt(this.activeDoc.numc);
    this.WAlerta.estado = this.estadoActual;
    this.WAlerta.usuario = this.jwtData.userId;
    this.WAlerta.observacion = `PROCESO DE VALIDACION DEL ${this.selectedCarpeta?.id === "RECLAMOS" ? "RECLAMO" : this.selectedCarpeta?.nombre || "DOCUMENTO"}`;
    this.WAlerta.fecha = fecha;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_AAlertas";
    this.xAPI.parametros = "";
    console.log(this.WAlerta);
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

  public fnxFirmaMinistro(decision: string = "") {
    let numero_control = btoa("D" + this.activeDoc.numc);
    let archivo = this.activeDoc.anom;

    let dec = (decision || this.activeDoc?.decision || "")
      .toString()
      .trim()
      .toUpperCase();

    if (!dec) {
      if (
        this.selectedCarpeta?.id === "CUADRO_DECISORIO" ||
        this.selectedCarpeta?.id === "ACTIVIDADES_EN_EL_EXTERIOR"
      ) {
        dec = "APROBADO";
      }
    }

    if (this.activeDoc) {
      this.activeDoc.decision = dec;
    }

    let fnx = {
      funcion: "Fnx_FirmarPuntos",
      codigo: this.encriptarService.GCodeEncrypt(numero_control),
      archivo: archivo,
      puntos: 1,
      decision: "${dec}",
    };

    this.apiService.ExecFnx(fnx).subscribe(
      async (data) => {
        console.log(data);
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      },
    ); //
  }
  public perfilSolicitante: any = null;

  consultarDatosBasicos() {
    this.perfilSolicitante = null;
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "MPPD_CDatosBasicos";
    this.xAPI.parametros = this.activeDoc.sub_cedula || this.activeDoc.cedula;
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        if (data && data.Cuerpo && data.Cuerpo.length > 0) {
          this.perfilSolicitante = data.Cuerpo[0];
          this.changeDetector.detectChanges();
        }
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DatosBasicos`);
      },
    );
  }

  getNombreCategoria(id: string): string {
    if (!this.Categorias || !id) return id;
    const cat = this.Categorias.find(
      (c: any) =>
        c.codigo == id || c.id == id || c.valor == id || c.cod_categoria == id,
    );
    return cat
      ? cat.nombre || cat.descripcion || cat.texto || cat.nombre_categoria || id
      : id;
  }

  getNombreClasificacion(id: string): string {
    if (!this.Clasificaciones || !id) return id;
    const clas = this.Clasificaciones.find(
      (c: any) =>
        c.codigo == id ||
        c.id == id ||
        c.valor == id ||
        c.cod_clasificacion == id,
    );
    return clas
      ? clas.nombre ||
          clas.descripcion ||
          clas.texto ||
          clas.nombre_clasificacion ||
          id
      : id;
  }

  getNombreComponente(id: string): string {
    if (!this.Componentes || !id) return id;
    const comp = this.Componentes.find(
      (c: any) =>
        c.codigo == id || c.id == id || c.valor == id || c.cod_componente == id,
    );
    return comp
      ? comp.nombre ||
          comp.descripcion ||
          comp.texto ||
          comp.nombre_componente ||
          id
      : id;
  }

  formatDateSpanish(dateStr: string): string {
    if (!dateStr || dateStr === "1900-01-01") return "NO REGISTRA";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const monthIndex = parseInt(parts[1], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${parts[2]}${months[monthIndex]}${parts[0]}`;
    }
    return dateStr;
  }

  // ─── Actividades en el Exterior ──────────────────────────────────────────────
  public loadingDetalleViaje: boolean = false;

  public consultarDetalleDocumento(doc: any): void {
    if (!doc) return;
    const docId =
      doc.idd || doc.wfdocumento || doc.id || doc.ncontrol || doc.numc;
    if (!docId) return;

    this.loadingDetalleViaje = true;
    const xAPI: IAPICore = {
      funcion: "WKF_CDocumentoDetalle",
      parametros: `1,1,${docId}`,
      valores: "",
    };

    this.apiService.Ejecutar(xAPI).subscribe({
      next: (data) => {
        this.loadingDetalleViaje = false;
        if (data && data.Cuerpo && data.Cuerpo.length > 0) {
          const detail = data.Cuerpo[0];
          Object.assign(doc, detail);
          if (this.activeDoc) {
            Object.assign(this.activeDoc, detail);
            delete this.activeDoc._parsedViajesData;
          }
          this.changeDetector.markForCheck();
          this.changeDetector.detectChanges();
        }
      },
      error: (err) => {
        this.loadingDetalleViaje = false;
        console.warn(
          "[DocumentosOk] Error consultando WKF_CDocumentoDetalle:",
          err,
        );
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
      },
    });
  }

  public getViajesData(doc: any): any {
    if (!doc) return null;
    if (doc._parsedViajesData) {
      return doc._parsedViajesData;
    }

    let raw =
      doc.viajes_descripcion ||
      doc.viaje ||
      doc.viajes ||
      doc.actividadesExt ||
      doc.actividades ||
      doc.detallejson ||
      doc.detallefinaljson;

    // Buscar en observacion / subdocumento / detalle si contienen atributos de viaje
    if (!raw) {
      const candidates = [
        doc.observacion,
        doc.sub_observacion,
        doc.detalle,
        doc.subdocumento,
        doc.cont,
      ];
      for (const cand of candidates) {
        if (
          typeof cand === "string" &&
          (cand.includes('"pais"') ||
            cand.includes('"motivo"') ||
            cand.includes('"gastos"') ||
            cand.includes('"fechaInicio"'))
        ) {
          raw = cand;
          break;
        }
      }
    }

    if (raw) {
      try {
        let data = raw;
        while (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (Array.isArray(data) && data.length > 0) {
          data = data[0];
        }
        if (data && typeof data === "object") {
          if (data.observacion && typeof data.observacion === "object") {
            data = data.observacion;
          }
          doc._parsedViajesData = data;
          return data;
        }
      } catch (e) {
        // Fallback to text synthesis
      }
    }

    // ── Si no viene estructura JSON guardada, sintetizar desde el texto del expediente ──
    const fullText = (
      (doc.asunto || "") +
      " " +
      (doc.cont || "") +
      " " +
      (doc.resumen || "")
    ).toUpperCase();

    if (fullText.trim()) {
      let detectedCountry = "EXTERIOR";
      const countries = [
        "CHINA",
        "RUSIA",
        "BIELORRUSIA",
        "IRAN",
        "IRÁN",
        "TURQUIA",
        "TURQUÍA",
        "CUBA",
        "NICARAGUA",
        "BRASIL",
        "COLOMBIA",
        "ARGENTINA",
        "MEXICO",
        "MÉXICO",
        "ESPAÑA",
        "ITALIA",
        "FRANCIA",
        "PORTUGAL",
        "INDIA",
        "SUDAFRICA",
        "SUDÁFRICA",
      ];
      for (const c of countries) {
        if (fullText.includes(c)) {
          detectedCountry = c;
          break;
        }
      }

      // Extraer fechas si existen en formato 23NOV26 o similar
      let fechaIni: any = null;
      let fechaFin: any = null;
      const matchFechas = fullText.match(
        /(\d{1,2})\s*(?:AL|A)\s*(\d{1,2})\s*([A-Z]{3})\s*(\d{2,4})/,
      );
      if (matchFechas) {
        const mesesMap: { [key: string]: number } = {
          ENE: 1,
          FEB: 2,
          MAR: 3,
          ABR: 4,
          MAY: 5,
          JUN: 6,
          JUL: 7,
          AGO: 8,
          SEP: 9,
          OCT: 10,
          NOV: 11,
          DIC: 12,
        };
        const mesNum = mesesMap[matchFechas[3]] || 11;
        let anio = parseInt(matchFechas[4], 10);
        if (anio < 100) anio += 2000;
        fechaIni = {
          year: anio,
          month: mesNum,
          day: parseInt(matchFechas[1], 10),
        };
        fechaFin = {
          year: anio,
          month: mesNum,
          day: parseInt(matchFechas[2], 10),
        };
      }

      const syntheticViaje = {
        pais: detectedCountry,
        invitado: detectedCountry,
        motivo: this.getAsuntoClean(doc) || doc.cont || "COMISIÓN DE SERVICIO",
        dirigido: fullText.includes("REPRESENTANTE")
          ? "REPRESENTANTE DEL MPPD"
          : "OFICIAL DESIGNADO",
        personas: 1,
        fechaInicio: fechaIni,
        fechaFin: fechaFin,
        gastos: {
          boletos: "PAÍS INVITANTE",
          alimentacion: "PAÍS INVITANTE",
          alojamiento: "PAÍS INVITANTE",
          transporte: "PAÍS INVITANTE",
        },
      };

      doc._parsedViajesData = syntheticViaje;
      return syntheticViaje;
    }

    return null;
  }

  public formatNgbDate(dateObj: any): string {
    if (!dateObj) return "No definida";
    if (typeof dateObj === "string") {
      const parts = dateObj.substring(0, 10).split("-");
      if (parts.length === 3) {
        dateObj = {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          day: parseInt(parts[2], 10),
        };
      }
    }
    if (!dateObj.day || !dateObj.month || !dateObj.year) return "No definida";
    const day = dateObj.day < 10 ? "0" + dateObj.day : dateObj.day;
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const monthStr = months[dateObj.month - 1] || "???";
    return `${day}${monthStr}${dateObj.year}`;
  }

  public getDiasViaje(inicio: any, fin: any): string {
    if (!inicio || !fin) return "";

    const parseToDate = (val: any): Date | null => {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (val.year && val.month && val.day) {
        return new Date(val.year, val.month - 1, val.day);
      }
      if (typeof val === "string") {
        const partsIso = val.substring(0, 10).split("-");
        if (partsIso.length === 3) {
          const y = parseInt(partsIso[0], 10);
          const m = parseInt(partsIso[1], 10);
          const d = parseInt(partsIso[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
          }
        }
        const partsSlash = val.substring(0, 10).split("/");
        if (partsSlash.length === 3) {
          const d = parseInt(partsSlash[0], 10);
          const m = parseInt(partsSlash[1], 10);
          const y = parseInt(partsSlash[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
          }
        }
        const dParsed = new Date(val);
        if (!isNaN(dParsed.getTime())) return dParsed;
      }
      return null;
    };

    const dInicio = parseToDate(inicio);
    const dFin = parseToDate(fin);

    if (
      !dInicio ||
      !dFin ||
      isNaN(dInicio.getTime()) ||
      isNaN(dFin.getTime())
    ) {
      return "";
    }

    // Normalizar a UTC para evitar desfases horarios
    const tInicio = Date.UTC(
      dInicio.getFullYear(),
      dInicio.getMonth(),
      dInicio.getDate(),
    );
    const tFin = Date.UTC(dFin.getFullYear(), dFin.getMonth(), dFin.getDate());

    const diffTime = Math.abs(tFin - tInicio);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "1 DÍA";
    }
    return `${diffDays} ${diffDays === 1 ? "DÍA" : "DÍAS"}`;
  }

  public getFlagUrl(countryName: string): string {
    if (!countryName) return "assets/images/placeholder-flag.png";
    const name = countryName.toLowerCase().trim();
    if (this.countryToIsoMap[name]) {
      return `https://flagcdn.com/w160/${this.countryToIsoMap[name]}.png`;
    }
    for (const key of Object.keys(this.countryToIsoMap)) {
      if (name.includes(key) || key.includes(name)) {
        return `https://flagcdn.com/w160/${this.countryToIsoMap[key]}.png`;
      }
    }
    return "assets/images/placeholder-flag.png";
  }

  private readonly countryToIsoMap: { [key: string]: string } = {
    afganistán: "af",
    albania: "al",
    alemania: "de",
    andorra: "ad",
    angola: "ao",
    "antigua y barbuda": "ag",
    "arabia saudita": "sa",
    argelia: "dz",
    argentina: "ar",
    armenia: "am",
    australia: "au",
    austria: "at",
    azerbaiyán: "az",
    bahamas: "bs",
    bangladés: "bd",
    barbados: "bb",
    baréin: "bh",
    bélgica: "be",
    belice: "bz",
    benín: "bj",
    bielorrusia: "by",
    birmania: "mm",
    bolivia: "bo",
    "bosnia y herzegovina": "ba",
    botsuana: "bw",
    brasil: "br",
    brunéi: "bn",
    bulgaria: "bg",
    "burkina faso": "bf",
    burundi: "bi",
    bután: "bt",
    "cabo verde": "cv",
    camboya: "kh",
    camerún: "cm",
    canadá: "ca",
    catar: "qa",
    chad: "td",
    chile: "cl",
    china: "cn",
    chipre: "cy",
    "ciudad del vaticano": "va",
    colombia: "co",
    comoras: "km",
    "corea del norte": "kp",
    "corea del sur": "kr",
    "costa de marfil": "ci",
    "costa rica": "cr",
    croacia: "hr",
    cuba: "cu",
    dinamarca: "dk",
    dominica: "dm",
    ecuador: "ec",
    egipto: "eg",
    "el salvador": "sv",
    "emiratos árabes unidos": "ae",
    eritrea: "er",
    eslovaquia: "sk",
    eslovenia: "si",
    españa: "es",
    "estados unidos": "us",
    estonia: "ee",
    etiopía: "et",
    filipinas: "ph",
    finlandia: "fi",
    fiyi: "fj",
    francia: "fr",
    gabón: "ga",
    gambia: "gm",
    georgia: "ge",
    ghana: "gh",
    granada: "gd",
    grecia: "gr",
    guatemala: "gt",
    guyana: "gy",
    guinea: "gn",
    "guinea ecuatorial": "gq",
    "guinea-bisáu": "gw",
    haití: "ht",
    honduras: "hn",
    hungría: "hu",
    india: "in",
    indonesia: "id",
    irak: "iq",
    irán: "ir",
    irlanda: "ie",
    islandia: "is",
    "islas marshall": "mh",
    "islas salomón": "sb",
    israel: "il",
    italia: "it",
    jamaica: "jm",
    japón: "jp",
    jordania: "jo",
    kazajistán: "kz",
    kenia: "ke",
    kirguistán: "kg",
    kiribati: "ki",
    kuwait: "kw",
    laos: "la",
    lesoto: "ls",
    letonia: "lv",
    líbano: "lb",
    liberia: "lr",
    libia: "ly",
    liechtenstein: "li",
    lituania: "lt",
    luxemburgo: "lu",
    "macedonia del norte": "mk",
    madagascar: "mg",
    malasia: "my",
    malaui: "mw",
    maldivas: "mv",
    malí: "ml",
    malta: "mt",
    marruecos: "ma",
    mauricio: "mu",
    mauritania: "mr",
    méxico: "mx",
    micronesia: "fm",
    moldavia: "md",
    mónaco: "mc",
    mongolia: "mn",
    montenegro: "me",
    mozambique: "mz",
    namibia: "na",
    nauru: "nr",
    nepal: "np",
    nicaragua: "ni",
    níger: "ne",
    nigeria: "ng",
    noruega: "no",
    "nueva zelanda": "nz",
    omán: "om",
    "países bajos": "nl",
    pakistán: "pk",
    palaos: "pw",
    panamá: "pa",
    "papúa nueva guinea": "pg",
    paraguay: "py",
    perú: "pe",
    polonia: "pl",
    portugal: "pt",
    "reino unido": "gb",
    "república centroafricana": "cf",
    "república checa": "cz",
    "república del congo": "cg",
    "república democrática del congo": "cd",
    "república dominicana": "do",
    ruanda: "rw",
    rumanía: "ro",
    rusia: "ru",
    samoa: "ws",
    "san cristóbal y nieves": "kn",
    "san marino": "sm",
    "san vicente y las granadinas": "vc",
    "santa lucía": "lc",
    "santo tomé y príncipe": "st",
    senegal: "sn",
    serbia: "rs",
    seychelles: "sc",
    "sierra leona": "sl",
    singapur: "sg",
    siria: "sy",
    somalia: "so",
    "sri lanka": "lk",
    suazilandia: "sz",
    sudáfrica: "za",
    sudán: "sd",
    "sudán del sur": "ss",
    suecia: "se",
    suiza: "ch",
    surinam: "sr",
    tailandia: "th",
    tanzania: "tz",
    tayikistán: "tj",
    "timor oriental": "tl",
    togo: "tg",
    tonga: "to",
    "trinidad y tobago": "tt",
    túnez: "tn",
    turkmenistán: "tm",
    turquía: "tr",
    tuvalu: "tv",
    ucrania: "ua",
    uganda: "ug",
    uruguay: "uy",
    uzbekistán: "uz",
    vanuatu: "vu",
    venezuela: "ve",
    vietnam: "vn",
    yemen: "ye",
    yibuti: "dj",
    zambia: "zm",
    zimbabue: "zw",
  };

  public formatFechaRegistro(dateStr: string): string {
    if (!dateStr || dateStr === "1900-01-01") return "—";
    const cleanDate = dateStr.split(" ")[0]; // YYYY-MM-DD
    const parts = cleanDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }
}
