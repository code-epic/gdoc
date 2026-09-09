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
      id: "OFICIOS",
      nombre: "OFICIOS",
      icono: "fas fa-envelope",
      color: "#fb6340",
      disponible: false,
    },
    {
      id: "RADIOGRAMAS",
      nombre: "RADIOGRAMAS",
      icono: "fas fa-broadcast-tower",
      color: "#11cdef",
      disponible: false,
    },
    {
      id: "COMUNICACIONES",
      nombre: "COMUNICACIONES",
      icono: "fas fa-comments",
      color: "#f5365c",
      disponible: false,
    },
    {
      id: "TITULOS",
      nombre: "TITULOS",
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

  constructor(
    private apiService: ApiService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
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
        c.estadoActual = 4;
        if (this.selectedEstadoBuzon === "firmados") {
          c.estadoOrigen = 7;
        } else if (this.currentProfile === "Direccion") {
          c.estadoOrigen = 5;
        } else if (this.currentProfile === "Ministro") {
          c.estadoOrigen = 6;
        } else {
          // Perfil inicial / JefeSecretaria: respeta estadoOrigen inicial propio del objeto (2 para Punto de Cuenta, 4 para TOR)
          c.estadoOrigen = c.id === "PUNTO_DE_CUENTA" ? 2 : 4;
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
    this.estadoActual = carpeta.estadoActual || 4;
    this.estadoOrigen = carpeta.estadoOrigen || 4;

    this.loadingBuzon = true;
    this.ngxService.startLoader("loader-documentos");

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = carpeta.funcion;
    this.xAPI.valores = "";
    this.xAPI.parametros = `${carpeta.estadoActual},${carpeta.estadoOrigen},${this.fecha_desde},${this.fecha_hasta}`;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        const bz: any[] = [];
        console.log(data);
        if (data && data.Cuerpo) {
          const groupMap = new Map<string, any>();

          data.Cuerpo.forEach((e: any) => {
            e.edit =
              e.tdoc && e.tdoc.toLowerCase() === "punto de cuenta"
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
          groupMap.forEach((folder) => {
            if (carpeta.filtro === 1) {
              bz.push(folder);
            } else if (
              carpeta.filtro === 3 &&
              folder.tdoc === "PUNTO DE CUENTA"
            ) {
              bz.push(folder);
            } else {
              bz.push(folder);
            }
          });
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

  // ─── Paginación ───────────────────────────────────────────────────────────────
  public recorrerElementos(pagina: number): void {
    const start = this.pageSize * pagina;
    this.buzon = this.bzOriginal.slice(start, start + this.pageSize);

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

  // ─── Búsqueda en el buzón ─────────────────────────────────────────────────────
  public get buzonFiltrado(): any[] {
    if (!this.buscarQuery.trim()) return this.buzon;
    const q = this.buscarQuery.toLowerCase().trim();
    return this.buzon.filter((e) => {
      const cedula = this.getCedula(e).toLowerCase();
      const nombre = this.getNombre(e).toLowerCase();
      const cargo = this.getCargo(e).toLowerCase();
      const cuenta = (e.cuenta || "").toLowerCase();
      const cont = (e.cont || "").toLowerCase();
      const resumen = (e.resumen || "").toLowerCase();
      const numc = (e.numc || "").toLowerCase();

      // Búsqueda en los subcasos/personas agrupadas
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
        matchSubcaso
      );
    });
  }

  // ─── Helpers de campos (sub_cedula, sub_nombre, sub_cargo) ───────────────────
  public getCedula(e: any): string {
    if (!e) return "";
    return (e.sub_cedula || e.cedula || e.cuenta || "").toString().trim();
  }

  public getNombre(e: any): string {
    if (!e) return "";
    const n = e.sub_nombre || e.nombre || "";
    return n.toString().trim().toUpperCase();
  }

  public getCargo(e: any): string {
    if (!e) return "";
    const c = e.sub_cargo || e.cargo || "";
    return c.toString().trim().toUpperCase();
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
    const list = this.getSubcasos(e);
    return list.filter(
      (item) => !this.isNoProcesar(item) && !this.isPendiente(item),
    );
  }

  // ─── Obtener subcasos NEGADOS / EXCEPCIONES / CÓDIGO ROJO / PENDIENTES ──────────
  public getSubcasosNoProcesar(e: any): any[] {
    const list = this.getSubcasos(e);
    return list.filter(
      (item) => this.isNoProcesar(item) || this.isPendiente(item),
    );
  }

  // ─── Obtener datos a mostrar por elemento del buzón ──────────────────────────
  public getIdentificador(e: any): string {
    if (!e) return "";
    const ced = this.getCedula(e);
    if (ced) return ced;
    return e.cuenta || e.numc || "";
  }

  public getAsunto(e: any): string {
    if (e.tdoc === "TRAMITACION POR ORGANO REGULAR") {
      return e.cont || "";
    }
    return e.resumen || e.cont || "";
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
    this.activeDoc = e;
    this.observacion = "";
    this.showPdf = false;
    this.pdfUrl = null;
    this.isDetailOpen = true;
    if (e) {
      const subcasos = this.getSubcasos(e);
      this.cargarFotosBuzon([e, ...subcasos]);
    }
    this.changeDetector.detectChanges();
  }

  // ─── Obtener subcasos / personas dentro del expediente ────────────────────────
  public getSubcasos(e: any): any[] {
    if (!e) return [];
    let list: any[] = [];
    if (e.subdocumento) {
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
    if (
      list.length === 0 &&
      Array.isArray(e.mergedDocumentos) &&
      e.mergedDocumentos.length > 0
    ) {
      list = e.mergedDocumentos;
    } else if (
      list.length === 0 &&
      Array.isArray(e.documentos) &&
      e.documentos.length > 0
    ) {
      list = e.documentos;
    } else if (
      list.length === 0 &&
      Array.isArray(e.lstCuenta) &&
      e.lstCuenta.length > 0
    ) {
      list = e.lstCuenta;
    }
    return list;
  }

  // ─── Cerrar panel de detalle ──────────────────────────────────────────────────
  public closeDetail(): void {
    this.isDetailOpen = false;
    this.activeDoc = null;
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

    const isFirmado = this.esDocFirmado(e);

    if (isFirmado) {
      let cleanName = archivo.replace(/\.pdf$/i, "");
      if (cleanName.toLowerCase().startsWith("firmado_")) {
        cleanName = cleanName.substring(8);
      } else if (cleanName.toLowerCase().startsWith("firmado")) {
        cleanName = cleanName.substring(7);
      }
      cleanName = cleanName
        .replace(/_tramitacion$/i, "")
        .replace(/_punt$/i, "");

      if (!cleanName.toLowerCase().endsWith("_firmado")) {
        cleanName = `${cleanName}_firmado`;
      }

      archivo = `${cleanName}.pdf`;
    }

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

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo;
    this.WAlerta.documento = parseInt(this.activeDoc.numc);
    this.WAlerta.estado = this.estadoActual;
    this.WAlerta.usuario = this.jwtData.userId;
    this.WAlerta.observacion = "PROCESO DE VALIDACION DEL TOR";
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
}
