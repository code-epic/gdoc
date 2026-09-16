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
import { LoginService } from "src/app/services/seguridad/login.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { IWKFAlerta } from "src/app/services/control/documentos.service";
import { toBase64String } from "@angular/compiler/src/output/source_map";
import { EncriptarSDC } from "src/app/services/seguridad/encriptar-sdc.service";

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
    {
      id: "ACTIVIDADES EN EL EXTERIOR",
      nombre: "ACTIVIDADES EN EL EXTERIOR",
      icono: "fas fa-envelope",
      color: "#fb6340",
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

  constructor(
    private apiService: ApiService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private encriptarService: EncriptarSDC,
  ) {
    // Fechas fijas: agosto → diciembre del año en curso
    this.fecha_desde = this.xyear + "-06-01";
    this.fecha_hasta = this.xyear + "-12-31";
  }

  ngOnInit(): void {
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
        c.estadoActual = c.id === "RECLAMOS" ? c.estadoActual || 6 : 4;
        if (this.selectedEstadoBuzon === "firmados") {
          c.estadoOrigen = 7;
        } else if (this.currentProfile === "Direccion") {
          c.estadoOrigen = 5;
        } else if (this.currentProfile === "Ministro") {
          c.estadoOrigen = 6;
        } else {
          // Perfil inicial / JefeSecretaria: respeta estadoOrigen inicial propio del objeto (2 para Punto de Cuenta y Reclamos, 4 para TOR)
          c.estadoOrigen =
            c.id === "PUNTO_DE_CUENTA" || c.id === "RECLAMOS" ? 2 : 4;
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

    if (p.includes("MINISTRO") || r.includes("MIN") || r.includes("FIRMAN")) {
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
      carpeta.estadoActual || (carpeta.id === "RECLAMOS" ? 6 : 4);
    this.estadoOrigen =
      carpeta.estadoOrigen ||
      (carpeta.id === "PUNTO_DE_CUENTA" || carpeta.id === "RECLAMOS" ? 2 : 4);

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

  // ─── Evaluar si un caso interno es Negado / No Procesar / Código Rojo ─────────
  public isNoProcesar(item: any): boolean {
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
    const val = this.getEstatusFromDetalle(item);
    return (
      val === "PE" ||
      val === "PENDIENTE" ||
      val === "DI" ||
      val === "DIFERIDO" ||
      val.startsWith("PE ")
    );
  }

  // ─── Obtener subcasos APROBADOS / PROCESAR ─────────────────────────────────────
  public getSubcasosProcesar(e: any): any[] {
    if (!e) return [];
    try {
      const list = this.getSubcasos(e) || [];
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
    let jsonToParse = doc.detallejsonfinal || doc.detallefinaljson || doc.detalleJsonFinal || doc.detalleJson;
    
    if (!jsonToParse && doc.detalle && doc.detalle.includes("{")) {
      try {
        const parts = doc.detalle.split("|PR|");
        jsonToParse = parts.length > 1 ? parts[1] : doc.detalle;
      } catch (e) {}
    }

    if (jsonToParse && jsonToParse.includes("{")) {
      try {
        let safeJson = jsonToParse;
        if (typeof safeJson === 'string') {
           safeJson = safeJson.replace(/u003c/g, '<').replace(/u003e/g, '>');
           safeJson = safeJson.replace(/="([^"]*)"/g, "='$1'"); 
        }

        let parsed = typeof safeJson === "string" ? JSON.parse(safeJson) : safeJson;
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

    try {
      const subcasos = this.getSubcasos(this.activeDoc) || [];
      this.cargarFotosBuzon([this.activeDoc, ...subcasos]);
    } catch (err) {
      console.warn("[DocumentosOk] Error en cargarFotosBuzon:", err);
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
    try {
      const subcasos = this.getSubcasos(this.activeDoc) || [];
      this.cargarFotosBuzon([this.activeDoc, ...subcasos]);
    } catch (err) {
      console.warn("[DocumentosOk] Error en cargarFotosBuzon:", err);
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
    return list.map((item: any) => {
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
        item.sub_detalle || item.detalle || item.estatus || item.estado || "PR";
      const obs = item.observacion || item.sub_observacion || item.obse || "";

      return {
        ...item,
        cedula: ced,
        sub_cedula: ced,
        nombre: nom,
        sub_nombre: nom,
        cargo: car,
        sub_cargo: car,
        detalle: det,
        sub_detalle: det,
        observacion: obs,
        sub_observacion: obs,
      };
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
    this.changeDetector.detectChanges();
  }

  // ─── Evaluar si un documento está Firmado ────────────────────────────
  public esDocFirmado(doc?: any): boolean {
    if (!doc) doc = this.activeDoc;
    if (this.selectedEstadoBuzon === "firmados" || this.estadoOrigen === 7)
      return true;
    if (!doc) return false;
    return doc.estado === 7 || doc.idestado === 7 || doc.idestado === "7";
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
  public toggleSubcasoEstatus(item: any): void {
    if (this.currentProfile !== "Ministro") return;
    const isCurrentlyNoProcesar = this.isNoProcesar(item);
    const newStatus = isCurrentlyNoProcesar ? "PR" : "NP";

    item.sub_detalle = newStatus;
    item.detalle = newStatus;
    item.s_estatus = newStatus;
    item.sub_estatus = newStatus;
    item.estatus = newStatus;
    item.estado = newStatus;

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

    let observacionFinal = this.observacion.trim();

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
      observacionFinal = comentarioOtro.trim();
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
        observacionFinal = comentarioReq.trim();
      }
    }

    this.fnxFirmaMinistro();
    this.observacion = observacionFinal;
    this.loadingAction = true;
    this.redistribuir(decisionSeleccionada);
  }

  // ─── Acciones: Favorable / Diferido / Negado / Firmar ─────────────────────────
  public ejecutarAccion(
    decision: "FAVORABLE" | "DIFERIDO" | "NEGADO" | "FIRMAR",
  ): void {
    if (!this.activeDoc) return;
    if (
      !this.observacion.trim() &&
      decision !== "FAVORABLE" &&
      decision !== "FIRMAR"
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

  async redistribuir(decision: any) {
    const estadoDestino = Math.min(this.estadoOrigen + 1, 7);
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = "WKF_ARedistribuir";
    this.xAPI.valores = "";
    this.xAPI.parametros = `${this.estadoActual},${this.estadoActual},${estadoDestino},${this.jwtData.userId},${this.activeDoc.idd}`;
    console.log(this.xAPI.parametros);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        const msgLabel =
          decision === "FIRMAR"
            ? "Documento firmado"
            : `Decisión '${decision}' registrada`;
        this.toastrService.success(`${msgLabel} correctamente.`, "Documentos");
        this.loadingAction = false;
        this.closeDetail();
        this.actualizarBuzon();

        // this.guardarAlerta(1, this.utilService.ConvertirFecha(this.extender_plazo))
        this.toastrService.success(
          "El documento ha sido redistribuido segun su selección",
          `GDoc Wkf.DocumentoObservacion`,
        );
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
      this.xAPI.parametros = `2,2,1,${userId},${docId}`;

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

  public fnxFirmaMinistro() {
    let numero_control = btoa("D" + this.activeDoc.numc);
    let archivo = this.activeDoc.anom;

    let fnx = {
      funcion: "Fnx_FirmarPuntos",
      codigo: this.encriptarService.GCodeEncrypt(numero_control),
      archivo: archivo,
      puntos: 1,
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
}
