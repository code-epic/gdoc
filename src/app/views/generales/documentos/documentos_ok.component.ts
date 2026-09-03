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
    this.fecha_desde = this.xyear + "-08-01";
    this.fecha_hasta = this.xyear + "-12-31";
  }

  ngOnInit(): void {
    // Clase inmersiva para ocultar sidebar y navbar
    document.body.classList.add("immersive-active");
    document.documentElement.classList.add("immersive-active");

    this.decodeUserToken();
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
    this.selectedCarpeta = null;
    this.buzon = [];
    this.bzOriginal = [];
    this.longitud = 0;
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

            if (carpeta.filtro === 1) {
              if (e.accion != null) {
                const text = this.cmbAcciones[e.accion]?.texto || "";
                e.nombre_accion = text;
              }
              bz.push(e);
            } else if (carpeta.filtro === 3 && e.tdoc === "PUNTO DE CUENTA") {
              bz.push(e);
            } else {
              bz.push(e);
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
    this.cargarFotosBuzon(this.buzon);
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
      return (
        cedula.includes(q) ||
        nombre.includes(q) ||
        cargo.includes(q) ||
        cuenta.includes(q) ||
        cont.includes(q) ||
        resumen.includes(q) ||
        numc.includes(q)
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
      this.cargarFotosBuzon([e]);
    }
    this.changeDetector.detectChanges();
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

  // ─── URL del PDF del documento ────────────────────────────────────────────────
  public getDwsUrl(e: any): string {
    const ncontrol = e.numc || e.ncontrol || "0";
    const archivo = e.anom || e.archivo || "";
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

  // ─── Acciones: Favorable / Diferido / Negado / Firmar ─────────────────────────
  public ejecutarAccion(decision: "FAVORABLE" | "DIFERIDO" | "NEGADO" | "FIRMAR"): void {
    if (!this.activeDoc) return;
    if (!this.observacion.trim() && decision !== "FAVORABLE" && decision !== "FIRMAR") {
      this.toastrService.warning(
        "Debe ingresar una observación.",
        "Campo requerido",
      );
      return;
    }
    this.loadingAction = true;
    const xAPI: IAPICore = {} as IAPICore;
    xAPI.funcion = "WKF_IDocumentoDecision";
    xAPI.parametros = "";
    xAPI.valores = JSON.stringify({
      documento: this.activeDoc.numc || this.activeDoc.ncontrol || "",
      decision: decision,
      observacion: this.observacion.toUpperCase(),
      usuario: this.jwtData.userId,
    });
    this.apiService.Ejecutar(xAPI).subscribe(
      (_data) => {
        const msgLabel =
          decision === "FIRMAR"
            ? "Documento firmado"
            : `Decisión '${decision}' registrada`;
        this.toastrService.success(
          `${msgLabel} correctamente.`,
          "Documentos",
        );
        this.loadingAction = false;
        this.closeDetail();
        this.actualizarBuzon();
      },
      (err) => {
        console.error("[DocumentosOk] Error en acción:", err);
        this.toastrService.error(
          "Error al registrar la decisión.",
          "Documentos",
        );
        this.loadingAction = false;
      },
    );
  }
}
