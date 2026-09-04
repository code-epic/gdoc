import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { UtilService } from "src/app/services/util/util.service";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal from "sweetalert2";
import {
  TinderPdfViewerComponent,
  PdfAction,
} from "src/app/components/tinder-pdf-viewer/tinder-pdf-viewer.component";
import { LectorService } from "src/app/services/resoluciones/lector.service";

@Component({
  selector: "app-resueltos-ok",
  templateUrl: "./resueltos_ok.component.html",
  styleUrls: ["./resueltos_ok.component.scss"],
})
export class ResueltosOkComponent implements OnInit, OnDestroy {
  detalleCarpeta: any;
  @HostListener("window:keydown", ["$event"])
  onWindowKeyDown(event: KeyboardEvent) {
    // Cerrar buscador avanzado con tecla Escape
    if (event.key === "Escape" || event.code === "Escape") {
      if (this.showAdvancedSearchModal) {
        this.closeAdvancedSearch();
      }
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    // Abrir buscador avanzado con Ctrl + B (o Cmd + B)
    if (isCtrlOrCmd && (event.key === "b" || event.key === "B")) {
      event.preventDefault(); // Evita comportamiento por defecto del navegador (marcadores)
      if (!this.showAdvancedSearchModal) {
        this.openAdvancedSearch();
      }
    }

    if (
      isCtrlOrCmd &&
      (event.key === "-" ||
        event.key === "+" ||
        event.key === "=" ||
        event.key === "0")
    ) {
      event.preventDefault();
    }
  }

  @ViewChild("tinderViewer") tinderViewer!: TinderPdfViewerComponent;

  // Vista Explorador
  public allFolders: any[] = [];
  public filteredFolders: any[] = [];
  public paginatedFolders: any[] = [];
  public selectedFolder: any = null;

  private _documents: any[] = [];
  get documents(): any[] {
    return this._documents;
  }
  set documents(val: any[]) {
    this._documents = val;
    this.processDocumentsGrouping();
  }

  public documentSearchQuery = "";

  public documentTags: {
    [docKey: string]: {
      priority: string;
      tag: string;
      distribution?: string[];
    };
  } = {};
  public existingTags: string[] = [];
  public documentGroups: Array<{ name: string; docs: any[] }> = [];
  public flatDocuments: any[] = [];
  public expandedDocGroups: { [groupName: string]: boolean } = {};

  get filteredDocumentsList() {
    if (!this.documentSearchQuery) return this.documents;
    const query = this.documentSearchQuery.toLowerCase().trim();
    return this.documents.filter((doc) => {
      if (
        doc.numero_carpeta &&
        doc.numero_carpeta.toLowerCase().includes(query)
      )
        return true;

      if (doc.documentos && Array.isArray(doc.documentos)) {
        for (const item of doc.documentos) {
          if (item.cedula && item.cedula.toLowerCase().includes(query))
            return true;
          if (
            item.nombres_apellidos &&
            item.nombres_apellidos.toLowerCase().includes(query)
          )
            return true;
        }
      }
      return false;
    });
  }

  // Paginación y Filtros de Carpetas
  public activeComponentFilter = "ALL";
  public folderSearchQuery = "";
  public folderPage = 1;
  public folderPageSize = 5;
  public totalPages = 1;

  // Tinder View / Immersive View
  public immersiveMode = false;
  public activeDoc: any = null;
  public currentDocIndex = -1;
  public pdfUrl: SafeResourceUrl | null = null;
  public rawPdfUrl: string | null = null;
  public documentObservations = "";
  public activar_pdf = false; // Cambiado a true para producción

  // Loading flags
  public loadingExplorer = false;
  public loadingDocuments = false;
  public loadingPdf = false;
  public actionExecuting = false;
  public executingType: "approve" | "reject" | "" = "";

  public fundamentoGlobal: string = "";

  // Mappings and config
  public Componentes: any[] = [];
  public componentMap: { [key: number]: string } = {};
  public displayCounts: { [key: string]: number } = {};

  // Context Menu
  public contextMenuVisible = false;
  public contextMenuCoords = { x: 0, y: 0 };
  public contextMenuType: "folder" | "document" | "" = "";
  public contextMenuData: any = null;
  public contextMenuIndex = -1;
  // JWT Metadata
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

  // Perfil dinámico de seguridad
  public currentProfile:
    | "Edicion"
    | "Revision"
    | "Jefe"
    | "Secretaria"
    | "Direccion"
    | "Aprobador" = "Edicion";
  public showingFirmados: boolean = false;

  // --- PROCESAMIENTO DE CASOS ---
  public isProcessModalOpen: boolean = false;
  public selectedDocForProcessing: any = null;
  public extractedCases: any[] = [];
  public loadingProcessData: boolean = false;
  public isAscensoType: boolean = false;

  // Tab-based layout state for cases processing modal
  public activeTab: "casos" | "detalles" = "casos";
  public processingInstrucciones: string = "";
  public processingObservaciones: string = "";
  public processingPublicacion: string = "Publicar";

  // --- DISTRIBUCIÓN (Solo Dirección + Firmados) ---
  public isDistributionModalOpen: boolean = false;
  public selectedDocForDistribution: any = null;
  public distributionOptions: string[] = [
    "NORMAL",
    "PDF RRSS",
    "OFICIO",
    "GACETA",
    "SOBRE",
    "NO PUBLICAR",
  ];
  public selectedDistributions: Set<string> = new Set<string>();
  public distributionObservacion: string = "";

  // Acceso exclusivo al botón de Firmar Rápido
  public isMinistro: boolean = false;
  public viewerProfile:
    | "Edicion"
    | "Revision"
    | "Jefe"
    | "Secretaria"
    | "Direccion"
    | "Aprobador" = "Edicion";

  // API core object
  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public resolvePdfUrl = (doc: any): string => {
    // const activar_pdf = (this as any).activar_pdf;
    // if (!activar_pdf) {
    // }
    const ncontrol = doc.ncontrol || doc.numc || "0";
    const archivo = doc.archivo || doc.anom || "";
    if (!archivo) {
      return "";
    }
    const peticion = btoa("D" + ncontrol) + "/" + archivo;
    return this.apiService.Dws(peticion);
  };

  constructor(
    private apiService: ApiService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private lectorService: LectorService,
  ) {}

  ngOnInit() {
    // Activa la clase inmersiva en el body/html para ocultar sidebar y navbar
    document.body.classList.add("immersive-active");
    document.documentElement.classList.add("immersive-active");

    this.loadComponentMap();
    this.decodeUserToken();
    try {
      const saved = localStorage.getItem("ok_document_tags");
      if (saved) {
        this.documentTags = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading document tags:", e);
    }
    this.loadFolders();
  }

  ngOnDestroy() {
    // Desactiva la clase inmersiva al destruir el componente
    document.body.classList.remove("immersive-active");
    document.documentElement.classList.remove("immersive-active");
  }

  public exitComponent() {
    this.router.navigate(["/dashboard"]);
  }

  // --- CARGA DE METADATOS Y COMPONENTES ---
  private loadComponentMap() {
    try {
      const compSession = sessionStorage.getItem("MPPD_CComponente");
      if (compSession) {
        this.Componentes = JSON.parse(atob(compSession));
        this.Componentes.forEach((c) => {
          this.componentMap[c.cod_componente] = c.nombre_componente;
        });
      } else {
        this.componentMap = {
          1: "EJERCITO",
          2: "ARMADA",
          3: "AVIACION",
          4: "GUARDIA NACIONAL",
          5: "MILICIA",
        };
      }
    } catch (e) {
      console.error("Error al decodificar componentes de sessionStorage:", e);
    }
  }

  private decodeUserToken() {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const helper = new JwtHelperService();
        const decoded = helper.decodeToken(token);
        console.log(decoded);
        if (decoded && decoded.Usuario) {
          this.jwtData = {
            userId: decoded.Usuario.usuario || "",
            userName: decoded.Usuario.nombre || decoded.Usuario.usuario || "",
            userRole: decoded.Usuario.tipo || "Usuario",
            userCedula: this.loginService.Usuario.cedula || "",
            perfil:
              sessionStorage.getItem("perfil") ||
              decoded.Usuario.descripcion ||
              "",
            userCargo: decoded.Usuario.cargo || "",
          };
          // Verificar si el usuario es MINISTRO para habilitar firma directa
          const desc: string = (decoded.Usuario.descripcion || "")
            .trim()
            .toUpperCase();
          this.isMinistro = desc === "MINISTRO";
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

      // Intentar mapear perfil de forma síncrona usando caché o rol
      const perfilStr = (
        sessionStorage.getItem("perfil") ||
        this.jwtData.perfil ||
        ""
      ).toUpperCase();
      const roleStr = (this.jwtData.userRole || "").toUpperCase();

      if (perfilStr && perfilStr !== "") {
        this.mapProfile(perfilStr);
      } else if (roleStr && roleStr !== "USUARIO") {
        this.mapProfile(roleStr);
      } else {
        // Fallback asíncrono para usuarios ya logueados
        const token = sessionStorage.getItem("token");
        if (token) {
          const helper = new JwtHelperService();
          const decoded = helper.decodeToken(token);
          if (decoded && decoded.Usuario) {
            const cedula = decoded.Usuario.cedula || "";
            const sistema = decoded.Usuario.sistema || environment.ID || "";
            const correo = decoded.Usuario.correo || "";

            const userApi = {
              funcion: environment.funcion.CONSULTAR_USUARIO_PERFIL,
              parametros: `${cedula},${sistema},${correo}`,
              valores: "",
            } as IAPICore;

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
                  this.loadFolders(); // Recargar carpetas ahora con el perfil correcto
                }
              } catch (e) {
                console.error("Error procesando perfil de DB:", e);
              }
            });
          }
        }
      }

      console.log(
        "[ResueltosOk] Perfil inicial asignado por rol/DB:",
        this.currentProfile,
        "Rol:",
        this.jwtData.userRole,
        "Perfil Cache/JWT:",
        perfilStr || this.jwtData.perfil,
      );
    } catch (e) {
      console.error("Error al decodificar JWT:", e);
    }
  }

  private mapProfile(perfilVal: string) {
    const perfilStr = (perfilVal || "").toUpperCase();
    const roleStr = (this.jwtData.userRole || "").toUpperCase();

    if (perfilStr.includes("REDACTOR") || perfilStr === "RESOLUCION REDACTOR") {
      this.currentProfile = "Edicion";
    } else if (perfilStr.includes("JEFE") || perfilStr === "RESOLUCION JEFE") {
      this.currentProfile = "Jefe";
    } else if (
      perfilStr.includes("SECRETARIA") ||
      perfilStr.includes("SECREATARIA") ||
      perfilStr.includes("SEC") ||
      roleStr.includes("SEC")
    ) {
      this.currentProfile = "Secretaria";
    } else if (
      perfilStr.includes("DIRECCION") ||
      perfilStr === "DIRECCION" ||
      roleStr.includes("DIR")
    ) {
      this.currentProfile = "Direccion";
    } else if (
      perfilStr.includes("MINISTRO") ||
      perfilStr === "MINISTRO" ||
      roleStr.includes("APROB") ||
      roleStr.includes("MIN") ||
      roleStr.includes("FIRMAN")
    ) {
      this.currentProfile = "Aprobador";
    } else if (
      perfilStr.includes("REVISION") ||
      perfilStr === "RESOLUCION REVISION" ||
      roleStr.includes("REV")
    ) {
      this.currentProfile = "Revision";
    } else {
      this.currentProfile = "Edicion";
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

  public onProfileChange() {
    this.showingFirmados = false;
    this.selectedFolder = null;
    this.documents = [];
    this.loadFolders();
  }

  public toggleShowingFirmados(): void {
    this.showingFirmados = !this.showingFirmados;
    this.selectedFolder = null;
    this.documents = [];
    this.loadFolders();
  }

  // --- MODAL DE DISTRIBUCIÓN ---
  public openDistributionModal(doc: any): void {
    this.selectedDocForDistribution = doc;
    // Restaurar selecciones previas guardadas en el doc (si existen)
    const savedDist: string[] = doc?.distribution || [];
    this.selectedDistributions = new Set<string>(savedDist);
    this.isDistributionModalOpen = true;
    this.closeContextMenu();
  }

  public isOptionChecked(option: string): boolean {
    return this.selectedDistributions.has(option);
  }

  public toggleDistributionOption(option: string): void {
    if (option === "NO PUBLICAR") {
      // Si se selecciona "No Publicar" se desmarcan las demás opciones
      if (this.selectedDistributions.has("NO PUBLICAR")) {
        this.selectedDistributions.delete("NO PUBLICAR");
      } else {
        this.selectedDistributions.clear();
        this.selectedDistributions.add("NO PUBLICAR");
      }
    } else {
      // Al marcar cualquier otra opción, se elimina "No Publicar"
      this.selectedDistributions.delete("NO PUBLICAR");
      if (this.selectedDistributions.has(option)) {
        this.selectedDistributions.delete(option);
      } else {
        this.selectedDistributions.add(option);
      }
    }
  }

  public saveDistribution(): void {
    if (!this.selectedDocForDistribution) return;

    // Actualizamos el objeto local
    const distribution = Array.from(this.selectedDistributions);
    this.selectedDocForDistribution.distribution = distribution;

    // Persistir en documentTags
    const carpetaKey = this.selectedDocForDistribution.numero_carpeta;
    if (!this.documentTags[carpetaKey]) {
      this.documentTags[carpetaKey] = { priority: "Normal", tag: "" };
    }
    this.documentTags[carpetaKey].distribution = distribution;

    // Objeto reactivo según el schema
    const ResolucionDistribuir = {
      numero_resuelto:
        this.selectedDocForDistribution.numero_resol ||
        this.selectedDocForDistribution.numero_carpeta ||
        "",
      observacion: this.distributionObservacion || "",
      normal: this.selectedDistributions.has("NORMAL") ? 1 : 0,
      pdf_rrss: this.selectedDistributions.has("PDF RRSS") ? 1 : 0,
      oficio: this.selectedDistributions.has("OFICIO") ? 1 : 0,
      gaceta: this.selectedDistributions.has("GACETA") ? 1 : 0,
      sobre: this.selectedDistributions.has("SOBRE") ? 1 : 0,
      no_publicar: this.selectedDistributions.has("NO PUBLICAR") ? 1 : 0,
      responsable:
        this.jwtData.userId || this.loginService.Usuario?.usuario || "",
    };

    // Llamada al API
    this.ngxService.startLoader("ld-fast");
    this.xAPI = {} as IAPICore;
    // Usamos el nombre de la función que el backend debe tener configurado para esta tabla (asumimos MPPD_IDistribucionResolucion o la que se asigne)
    this.xAPI.funcion = environment.funcion.RESOLUCION_DISTRIBUCION;
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify(ResolucionDistribuir);

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (res: any) => {
        this.ngxService.stopLoader("ld-fast");
        this.toastrService.success(
          "Distribución guardada correctamente",
          "Éxito",
        );
        this.closeDistributionModal();
      },
      (error) => {
        this.ngxService.stopLoader("ld-fast");
        this.toastrService.error("Error al guardar la distribución", "Error");
        console.error("Error en distribución:", error);
      },
    );
  }

  public closeDistributionModal(): void {
    this.isDistributionModalOpen = false;
    this.selectedDocForDistribution = null;
    this.distributionObservacion = ""; // Limpiar textarea
  }

  // --- LOGICA EXPLORADOR (CARPETAS Y DOCUMENTOS) ---
  public loadFolders() {
    this.loadingExplorer = true;
    this.ngxService.startLoader("ld-folders-ok");

    // Limpiar buzón de documentos (sección derecha)
    this.selectedFolder = null;
    this.documents = [];
    this.documentSearchQuery = "";

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.ENTRADAS_PROCESO_TIPO_TOTAL;
    let paramVal = "36";

    if (this.showingFirmados) {
      paramVal = "7766";
    } else {
      if (this.currentProfile === "Aprobador") {
        paramVal = "880";
      } else if (this.currentProfile === "Secretaria") {
        paramVal = "930";
      } else if (this.currentProfile === "Direccion") {
        paramVal = "340";
      } else if (this.currentProfile === "Jefe") {
        paramVal = "991";
      } else if (this.currentProfile === "Revision") {
        paramVal = "990";
      }
    }

    this.xAPI.parametros = paramVal;
    this.xAPI.valores = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        try {
          // console.log(data);

          if (data && data.Cuerpo) {
            this.allFolders = data.Cuerpo.map((e) => ({
              codigo: e.codigo,
              tipo: e.tipo,
              c_tipo: e.c_tipo,
              fecha: e.fecha,
            }));
            // console.log(this.allFolders);
            this.filterAndPaginateFolders();
          }
        } catch (error) {
          console.error("Error procesando carpetas:", error);
        } finally {
          this.loadingExplorer = false;
          this.ngxService.stopLoader("ld-folders-ok");
          this.changeDetector.detectChanges();
        }
      },
      (error) => {
        console.error("Error cargando carpetas del buzón:", error);
        // REVISAR URGENTE PARA EJECUCION DEL MINISTRO
        //this.toastrService.error("Error de conexión al cargar carpetas", "Buzón Resueltos");
        this.loadingExplorer = false;
        this.ngxService.stopLoader("ld-folders-ok");
        this.changeDetector.detectChanges();
      },
    );
  }

  public setComponentFilter(value: string) {
    this.activeComponentFilter = value;
    this.folderPage = 1;
    this.filterAndPaginateFolders();
  }

  public filterAndPaginateFolders() {
    let result = [...this.allFolders];

    // 1. Filtrar por Componente Tab
    // (Deshabilitado ya que la nueva consulta no trae componente)
    if (this.activeComponentFilter !== "ALL") {
      // const compId = parseInt(this.activeComponentFilter, 10);
      // result = result.filter((f) => f.componente === compId);
    }

    console.log(result);

    // 2. Filtrar por Búsqueda Query
    if (this.folderSearchQuery.trim() !== "") {
      const query = this.folderSearchQuery.toLowerCase();
      result = result.filter(
        (f) => f.tipo && f.tipo.toLowerCase().includes(query),
      );
    }

    this.filteredFolders = result;
    this.totalPages = Math.ceil(
      this.filteredFolders.length / this.folderPageSize,
    );

    if (this.folderPage > this.totalPages && this.totalPages > 0) {
      this.folderPage = this.totalPages;
    }

    // 3. Obtener Página
    const startIdx = (this.folderPage - 1) * this.folderPageSize;
    this.paginatedFolders = this.filteredFolders.slice(
      startIdx,
      startIdx + this.folderPageSize,
    );
    this.changeDetector.detectChanges();
  }

  public nextFolderPage() {
    if (this.folderPage < this.totalPages) {
      this.folderPage++;
      this.filterAndPaginateFolders();
    }
  }

  public prevFolderPage() {
    if (this.folderPage > 1) {
      this.folderPage--;
      this.filterAndPaginateFolders();
    }
  }

  // --- SELECCIÓN MÚLTIPLE (BULK) ---
  public getSelectedCount(): number {
    return this.documents.filter((d) => d.selected).length;
  }

  public isAllSelected(): boolean {
    return this.documents.length > 0 && this.documents.every((d) => d.selected);
  }

  public toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.documents.forEach((d) => (d.selected = checked));
  }

  public getComponentColor(code: number): string {
    const colors: { [key: number]: string } = {
      1: "#2dce89", // Ejército - Verde
      2: "#11cdef", // Armada - Azul claro
      3: "#5e72e4", // Aviación - Azul
      4: "#f5365c", // Guardia Nacional - Rojo/Gris
      5: "#ffd600", // Milicia - Amarillo
    };
    return colors[code] || "#8898aa";
  }

  public onFolderClick(folder: any) {
    this.selectedFolder = folder;
    this.ListarActosAdministrativos(folder.tipo);
    this.loadFolderDocuments(folder);
  }

  public onFolderDblClick(folder: any) {
    this.onFolderClick(folder);
  }

  public loadFolderDocuments(folder: any) {
    this.loadingDocuments = true;
    this.documents = [];

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.ENTRADAS_PROCESO_TIPO;

    let paramVal = "36";
    if (this.showingFirmados) {
      paramVal = "7766";
    } else {
      if (this.currentProfile === "Aprobador") {
        paramVal = "880";
      } else if (this.currentProfile === "Secretaria") {
        paramVal = "930";
      } else if (this.currentProfile === "Direccion") {
        paramVal = "340";
      } else if (this.currentProfile === "Jefe") {
        paramVal = "991";
      } else if (this.currentProfile === "Revision") {
        paramVal = "990";
      }
    }

    this.xAPI.parametros = `${folder.codigo},${paramVal}`;
    this.xAPI.valores = null;

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log("Datos actos administrativos");
        console.log(data);
        if (data && data.Cuerpo) {
          const rawDocs = data.Cuerpo.map((e) => {
            e.completed = false;
            return e;
          });

          // Agrupar por numero_carpeta
          const grupos: { [key: string]: any } = {};
          rawDocs.forEach((doc: any) => {
            const num =
              doc.numero_carpeta || doc.ncontrol || doc.numc || "SIN_CARPETA";
            if (!grupos[num]) {
              grupos[num] = {
                numero_carpeta: num,
                asunto: folder.tipo || "Sin Asunto",
                cantidad: 0,
                selected: false,
                documentos: [],
              };
            }
            grupos[num].cantidad++;
            grupos[num].documentos.push(doc);
          });

          // Subir numero_resol y fecha_resolucion del primer doc al objeto grupo
          Object.values(grupos).forEach((grupo: any) => {
            if (grupo.documentos?.length > 0) {
              const d = grupo.documentos[0];
              grupo.numero_resol = d.numero_resol || null;
              grupo.fecha_resolucion = d.fecha_resolucion || null;
              grupo.observacion = d.observacion || null;
              grupo.pub_observacion = d.pub_observacion || null;
              grupo.normal = d.normal;
              grupo.pdf_rrss = d.pdf_rrss;
              grupo.oficio = d.oficio;
              grupo.gaceta = d.gaceta;
              grupo.sobre = d.sobre;
              grupo.no_publicar = d.no_publicar;

              // Mapear observación de rechazo (soportando ambos nombres de columna) e ignorar 'null'
              let rechazoText =
                d.rechazos_observacion || d.robservaciones || null;

              // Si el perfil es Aprobador, el rechazo SOLO se debe ver si el usuario es 'admin'
              if (
                this.currentProfile === "Aprobador" &&
                d.usuario !== "admin"
              ) {
                rechazoText = null;
              }

              grupo.rechazos_observacion =
                rechazoText && rechazoText !== "null" ? rechazoText : null;
            }
          });

          this.documents = Object.values(grupos);
        }
        this.loadingDocuments = false;
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error("Error al cargar documentos de la carpeta:", error);
        this.toastrService.error(
          "No se pudieron obtener los documentos de esta carpeta",
        );
        this.loadingDocuments = false;
        this.changeDetector.detectChanges();
      },
    );
  }

  // --- LOGICA VISTA INMERSIVA (TINDER-STYLE) ---
  public startImmersiveMode(
    grupo: any,
    forcedProfile?:
      | "Edicion"
      | "Revision"
      | "Jefe"
      | "Secretaria"
      | "Direccion"
      | "Aprobador",
  ) {
    this.documentSearchQuery = "";
    this.immersiveMode = true;
    this.currentDocIndex = this.documents.indexOf(grupo);
    if (this.currentDocIndex === -1) this.currentDocIndex = 0;
    this.activeDoc = grupo;
    this.documentObservations = "";

    if (forcedProfile) {
      this.viewerProfile = forcedProfile;
    } else {
      this.viewerProfile = this.currentProfile;
    }

    this.changeDetector.detectChanges();
    setTimeout(() => {
      this.loadActivePdf();
    }, 0);
    console.log(this.activeDoc, "Viewer Profile:", this.viewerProfile);
  }

  public startImmersiveFromFolder() {
    if (this.selectedFolder) {
      if (this.documents.length > 0) {
        this.startImmersiveMode(this.documents[0]);
      } else {
        this.toastrService.warning(
          "La carpeta seleccionada no tiene documentos.",
        );
      }
    }
  }

  public exitImmersiveMode() {
    this.immersiveMode = false;
    this.activeDoc = null;
    this.currentDocIndex = -1;
    this.pdfUrl = null;
    this.rawPdfUrl = null;
    this.changeDetector.detectChanges();
  }

  // --- HANDLERS PARA EL COMPONENTE TINDER-PDF-VIEWER ---

  /** Cuando el hijo emite navigate (cambio de documento) */
  public onTinderNavigate(event: { doc: any; index: number }) {
    this.currentDocIndex = event.index;
    this.activeDoc = event.doc;
    this.loadActivePdf();
  }

  /** Cuando el hijo emite approve */
  public onTinderApprove(action: PdfAction) {
    this.ngxService.startLoader("ld-fast");
    const doc = action.doc;
    const userDb = this.jwtData.userId;
    const controlId = doc.ncontrol || doc.numc;

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
    this.xAPI.valores = JSON.stringify({
      documento: controlId,
      estado: doc.ultimo_estado || doc.estatus || 36,
      estatus: 2,
      observacion: action.observations || "APROBADO MEDIANTE VISOR",
      accion: "0",
      usuario: userDb,
    });
    this.xAPI.parametros = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
        this.xAPI.valores = "";
        this.xAPI.parametros = `2,${userDb},${controlId}`;

        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(
              `Documento ${controlId} firmado`,
              "Éxito",
            );
            this.removeDocFromViewer(doc);
            this.ngxService.stopLoader("ld-fast");
            if (this.tinderViewer) this.tinderViewer.resetAction();
          },
          (err) => {
            console.error(err);
            this.toastrService.error("Error al firmar documento");
            this.ngxService.stopLoader("ld-fast");
            if (this.tinderViewer) this.tinderViewer.resetAction();
          },
        );
      },
      (err) => {
        console.error(err);
        this.toastrService.error("Error al observar documento");
        this.ngxService.stopLoader("ld-fast");
        if (this.tinderViewer) this.tinderViewer.resetAction();
      },
    );
  }

  /** Cuando el hijo emite reject */
  public async onTinderReject(action: PdfAction) {
    console.log("uff control reject");
    this.ngxService.startLoader("ld-fast");
    const doc = action.doc;
    const userDb = this.jwtData.userId;
    const controlId = doc.ncontrol || doc.numc;

    const previousState = "36";
    const targetDocs =
      doc.documentos && doc.documentos.length > 0 ? doc.documentos : [doc];
    const numero_carpeta = doc.numero_carpeta || "000000";

    for (const d of targetDocs) {
      const cedulaVal = d.cedula || d.persona?.cedula || "";
      if (!cedulaVal) continue;

      const xAPIFirma = {
        funcion: environment.funcion.ACTUALIZAR_ESTATUS_FIRMA,
        parametros: `${previousState},${cedulaVal},${numero_carpeta}`,
        valores: null,
      } as any;

      try {
        await this.apiService.Ejecutar(xAPIFirma).toPromise();
      } catch (errFirma) {
        console.error(
          `Error actualizando estatus de firma para C.I. ${cedulaVal}:`,
          errFirma,
        );
      }
    }

    this.toastrService.success(`Documento ${controlId} devuelto`, "Éxito");
    this.removeDocFromViewer(doc);
    this.ngxService.stopLoader("ld-fast");
    if (this.tinderViewer) {
      this.tinderViewer.resetAction();
    }
  }

  private removeDocFromViewer(doc: any) {
    const numCarpeta = doc.numero_carpeta;
    this.documents = this.documents.filter(
      (d) => (d.ncontrol || d.numc) !== (doc.ncontrol || doc.numc),
    );

    if (this.documents.length === 0) {
      this.selectedFolder = null;
      if (this.immersiveMode) this.exitImmersiveMode();
      this.loadFolders();
    } else {
      if (this.immersiveMode) {
        if (this.currentDocIndex >= this.documents.length) {
          this.currentDocIndex = this.documents.length - 1;
        }
        this.activeDoc = this.documents[this.currentDocIndex];
        this.loadActivePdf();
      }
      this.changeDetector.detectChanges();
    }
  }

  /** Cuando el hijo emite close */
  public onTinderClose() {
    this.exitImmersiveMode();
  }

  /** Cuando el hijo emite el evento de envío / ruteo */
  public onTinderDocumentRouted(action: PdfAction, targetRoleName: string) {
    this.toastrService.success(
      `El caso de la carpeta N° ${action.doc.numero_carpeta} fue enviado a ${targetRoleName} exitosamente.`,
      "Caso Enviado",
    );

    if (this.tinderViewer) {
      this.tinderViewer.resetAction();
    }

    const numCarpeta = action.doc.numero_carpeta;
    this.documents = this.documents.filter(
      (d) => d.numero_carpeta !== numCarpeta,
    );

    if (this.documents.length === 0) {
      this.selectedFolder = null;
      if (this.immersiveMode) this.exitImmersiveMode();
      this.loadFolders();
    } else {
      if (this.immersiveMode) {
        if (this.currentDocIndex >= this.documents.length) {
          this.currentDocIndex = this.documents.length - 1;
        }
        this.activeDoc = this.documents[this.currentDocIndex];
        this.loadActivePdf();
      }
      this.changeDetector.detectChanges();
    }
  }

  /** Cuando el hijo tiene error de carga PDF */
  public onTinderPdfError(msg: string) {
    console.warn("PDF load error from viewer:", msg);
  }

  private loadActivePdf() {
    this.loadingPdf = false;
    this.pdfUrl = null;
    this.rawPdfUrl = null;
    this.changeDetector.detectChanges();
  }

  public onPdfLoaded() {
    this.loadingPdf = false;
    this.changeDetector.detectChanges();
  }

  public async approveFast(grupo: any) {
    const numCarpeta = grupo.numero_carpeta;
    const docsToSign = grupo.documentos || [];
    const userDb = this.jwtData.userId;

    if (docsToSign.length === 0) return;

    Swal.fire({
      title: "Firma Rápida de Carpeta",
      text: `¿Está seguro de firmar los ${docsToSign.length} casos de la carpeta N° ${numCarpeta}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2dce89",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, firmar todo",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.startLoader("ld-fast");

        let successCount = 0;
        let errorCount = 0;

        for (const doc of docsToSign) {
          const controlId = doc.ncontrol || doc.numc;
          try {
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
            this.xAPI.valores = JSON.stringify({
              documento: controlId,
              estado: doc.ultimo_estado || doc.estatus || 36,
              estatus: 2,
              observacion: "APROBADO MEDIANTE ACCIÓN RÁPIDA DE CARPETA",
              accion: "0",
              usuario: userDb,
            });
            this.xAPI.parametros = "";

            await this.apiService.Ejecutar(this.xAPI).toPromise();

            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
            this.xAPI.valores = "";
            this.xAPI.parametros = `2,${userDb},${controlId}`;

            await this.apiService.Ejecutar(this.xAPI).toPromise();
            successCount++;
          } catch (error) {
            console.error(`Error firmando ${controlId}:`, error);
            errorCount++;
          }
        }

        this.ngxService.stopLoader("ld-fast");

        if (errorCount > 0) {
          this.toastrService.warning(
            `Éxito: ${successCount}, Errores: ${errorCount}`,
            "Firma de Carpeta",
          );
        } else {
          this.toastrService.success(
            `Se firmaron ${successCount} casos exitosamente.`,
            "Carpeta Firmada",
          );
        }

        this.documents = this.documents.filter(
          (d) => d.numero_carpeta !== numCarpeta,
        );

        if (this.documents.length === 0) {
          this.selectedFolder = null;
          if (this.immersiveMode) this.exitImmersiveMode();
          this.loadFolders();
        } else {
          if (this.immersiveMode) {
            if (this.currentDocIndex >= this.documents.length) {
              this.currentDocIndex = this.documents.length - 1;
            }
            this.activeDoc = this.documents[this.currentDocIndex];
            this.loadActivePdf();
          }
          this.changeDetector.detectChanges();
        }
      }
    });
  }

  public async cancelFast(grupo: any) {
    const numCarpeta = grupo.numero_carpeta;
    const docsToCancel = grupo.documentos || [];
    const userDb = this.jwtData.userId;

    if (docsToCancel.length === 0) return;

    Swal.fire({
      title: "Anular Carpeta",
      text: `Ingrese el motivo para anular los ${docsToCancel.length} casos de la carpeta N° ${numCarpeta}:`,
      input: "textarea",
      inputPlaceholder: "Escriba las observaciones aquí...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, anular todo",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un motivo!";
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        this.ngxService.startLoader("ld-fast");

        const motivo = result.value.toUpperCase();
        let successCount = 0;
        let errorCount = 0;

        for (const doc of docsToCancel) {
          const controlId = doc.ncontrol || doc.numc;
          try {
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.ACTUALIZAR_ESTATUS_FIRMA;
            this.xAPI.valores = "";

            this.xAPI.parametros = `881,${doc.cedula},${doc.numero_carpeta}`;
            await this.apiService.Ejecutar(this.xAPI).toPromise();
            successCount++;
          } catch (error) {
            console.error(`Error anulando ${controlId}:`, error);
            errorCount++;
          }
        }

        this.ngxService.stopLoader("ld-fast");

        if (errorCount > 0) {
          this.toastrService.warning(
            `Éxito: ${successCount}, Errores: ${errorCount}`,
            "Anulación de Carpeta",
          );
        } else {
          this.toastrService.success(
            `Se anularon ${successCount} casos exitosamente.`,
            "Carpeta Anulada",
          );
        }

        this.documents = this.documents.filter(
          (d) => d.numero_carpeta !== numCarpeta,
        );
        if (this.documents.length === 0) {
          this.selectedFolder = null;
          if (this.immersiveMode) this.exitImmersiveMode();
          this.loadFolders();
        } else {
          if (this.immersiveMode) {
            if (this.currentDocIndex >= this.documents.length) {
              this.currentDocIndex = this.documents.length - 1;
            }
            this.activeDoc = this.documents[this.currentDocIndex];
            this.loadActivePdf();
          }
          this.changeDetector.detectChanges();
        }
      }
    });
  }

  public approveAllFast() {
    if (!this.documents || this.documents.length === 0) {
      this.toastrService.warning("No hay carpetas para firmar.", "Aviso");
      return;
    }
    // Seleccionar todos y llamar al método masivo
    this.documents.forEach((d) => (d.selected = true));
    this.approveSelectedFast();
  }

  public async approveSelectedFast() {
    const selectedGroups = this.documents.filter((d) => d.selected);
    if (selectedGroups.length === 0) return;

    let totalDocsToSign = 0;
    selectedGroups.forEach((g) => (totalDocsToSign += g.documentos.length));

    const result = await Swal.fire({
      title: "Firma Masiva de Carpetas",
      text: `¿Está seguro de firmar y aprobar ${totalDocsToSign} casos agrupados en ${selectedGroups.length} carpetas seleccionadas?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2dce89",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, firmar seleccionados",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      this.ngxService.startLoader("ld-fast");
      const userDb = this.jwtData.userId;
      let successCount = 0;
      let errorCount = 0;

      for (const grupo of selectedGroups) {
        const docsToSign = grupo.documentos || [];
        for (const doc of docsToSign) {
          const controlId = doc.ncontrol || doc.numc;
          try {
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
            this.xAPI.valores = JSON.stringify({
              documento: controlId,
              estado: doc.ultimo_estado || doc.estatus || 36,
              estatus: 2,
              observacion: "APROBADO MEDIANTE FIRMA MASIVA DE CARPETAS",
              accion: "0",
              usuario: userDb,
            });
            this.xAPI.parametros = "";

            await this.apiService.Ejecutar(this.xAPI).toPromise();

            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
            this.xAPI.valores = "";
            this.xAPI.parametros = `2,${userDb},${controlId}`;

            await this.apiService.Ejecutar(this.xAPI).toPromise();
            successCount++;
          } catch (error) {
            console.error(`Error procesando ${controlId}:`, error);
            errorCount++;
          }
        }
      }

      this.ngxService.stopLoader("ld-fast");

      if (errorCount > 0) {
        this.toastrService.warning(
          `Éxito: ${successCount}, Errores: ${errorCount}`,
          "Firma Masiva",
        );
      } else {
        this.toastrService.success(
          `Se firmaron ${successCount} documentos en total.`,
          "Firma Masiva Exitosa",
        );
      }

      // Remover carpetas aprobadas
      this.documents = this.documents.filter((d) => !d.selected);
      if (this.documents.length === 0) {
        this.selectedFolder = null;
        if (this.immersiveMode) this.exitImmersiveMode();
        this.loadFolders();
      } else {
        this.changeDetector.detectChanges();
      }
    }
  }

  public async cancelSelectedFast() {
    const selectedGroups = this.documents.filter((d) => d.selected);
    if (selectedGroups.length === 0) return;

    let totalDocsToCancel = 0;
    selectedGroups.forEach((g) => (totalDocsToCancel += g.documentos.length));

    Swal.fire({
      title: "Anulación Masiva de Carpetas",
      text: `Ingrese el motivo para anular los ${totalDocsToCancel} casos agrupados en ${selectedGroups.length} carpetas seleccionadas:`,
      input: "textarea",
      inputPlaceholder: "Escriba las observaciones aquí...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, anular seleccionados",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un motivo!";
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        this.ngxService.startLoader("ld-fast");

        const userDb = this.jwtData.userId;
        const motivo = result.value.toUpperCase();
        let successCount = 0;
        let errorCount = 0;

        for (const grupo of selectedGroups) {
          const docsToCancel = grupo.documentos || [];
          for (const doc of docsToCancel) {
            const controlId = doc.ncontrol || doc.numc;
            try {
              this.xAPI = {} as IAPICore;
              this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
              this.xAPI.valores = JSON.stringify({
                documento: controlId,
                estado: doc.ultimo_estado || doc.estatus || 36,
                estatus: Math.max(
                  1,
                  (doc.ultimo_estado || doc.estatus || 36) - 1,
                ),
                observacion: motivo,
                accion: "1",
                usuario: userDb,
              });
              this.xAPI.parametros = "";

              await this.apiService.Ejecutar(this.xAPI).toPromise();

              const currentState = doc.ultimo_estado || doc.estatus || 36;
              const previousState = Math.max(1, currentState - 1);
              this.xAPI = {} as IAPICore;
              this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
              this.xAPI.valores = "";
              this.xAPI.parametros = `${previousState},${userDb},${controlId}`;

              await this.apiService.Ejecutar(this.xAPI).toPromise();
              successCount++;
            } catch (error) {
              console.error(`Error anulando ${controlId}:`, error);
              errorCount++;
            }
          }
        }

        this.ngxService.stopLoader("ld-fast");

        if (errorCount > 0) {
          this.toastrService.warning(
            `Éxito: ${successCount}, Errores: ${errorCount}`,
            "Anulación Masiva",
          );
        } else {
          this.toastrService.success(
            `Se anularon ${successCount} casos exitosamente.`,
            "Carpetas Anuladas",
          );
        }

        this.documents = this.documents.filter((d) => !d.selected);
        if (this.documents.length === 0) {
          this.selectedFolder = null;
          if (this.immersiveMode) this.exitImmersiveMode();
          this.loadFolders();
        } else {
          this.changeDetector.detectChanges();
        }
      }
    });
  }

  public promptReject(doc: any) {
    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;

    // console.log("Alta seleccion de datos y control II");

    Swal.fire({
      title: "Rechazar Documento",
      text: "Ingrese el motivo del rechazo del resuelto:",
      input: "textarea",
      inputPlaceholder: "Escriba las observaciones aquí...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Confirmar Rechazo",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un motivo!";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.ngxService.startLoader("ld-fast-reject");

        // Guardar Obs
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
        this.xAPI.valores = JSON.stringify({
          documento: controlId,
          estado: doc.ultimo_estado || doc.estatus || 36,
          estatus: Math.max(1, (doc.ultimo_estado || doc.estatus || 36) - 1),
          observacion: result.value.toUpperCase(),
          accion: "1",
          usuario: userDb,
        });
        this.xAPI.parametros = "";

        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            // Ubicación Rechazo
            const currentState = doc.ultimo_estado || doc.estatus || 36;
            const previousState = Math.max(1, currentState - 1);
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
            this.xAPI.valores = "";
            this.xAPI.parametros = `${previousState},${userDb},${controlId}`;

            this.apiService.Ejecutar(this.xAPI).subscribe(
              () => {
                this.toastrService.success(
                  `Documento ${controlId} devuelto a origen`,
                );
                this.documents = this.documents.filter(
                  (d) => (d.ncontrol || d.numc) !== controlId,
                );
                this.ngxService.stopLoader("ld-fast-reject");

                if (this.documents.length === 0) {
                  this.selectedFolder = null;
                  this.loadFolders();
                } else {
                  this.changeDetector.detectChanges();
                }
              },
              (err) => {
                console.error(err);
                this.toastrService.error("Error al devolver el documento.");
                this.ngxService.stopLoader("ld-fast-reject");
                this.changeDetector.detectChanges();
              },
            );
          },
          (err) => {
            console.error(err);
            this.toastrService.error("Error al registrar rechazo.");
            this.ngxService.stopLoader("ld-fast-reject");
            this.changeDetector.detectChanges();
          },
        );
      }
    });
  }

  private removeApprovedDocFromVector() {
    if (
      this.currentDocIndex > -1 &&
      this.currentDocIndex < this.documents.length
    ) {
      this.documents.splice(this.currentDocIndex, 1);
    }
  }

  // --- ATAJOS DE TECLADO (TINDER NAVIGATION) ---
  // NOTA: El componente hijo TinderPdfViewerComponent maneja sus propios
  // atajos de teclado via (window:keydown) en su template.
  // Este HostListener se mantiene como fallback para acciones del padre.

  // --- MENU CONTEXTUAL DERECHO ---
  public onFolderRightClick(event: MouseEvent, folder: any) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuCoords = { x: event.clientX, y: event.clientY };
    this.contextMenuType = "folder";
    this.contextMenuData = folder;
  }

  public onDocumentRightClick(event: MouseEvent, doc: any, index: number) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuCoords = { x: event.clientX, y: event.clientY };
    this.contextMenuType = "document";
    this.contextMenuData = doc;
    this.contextMenuIndex = index;
  }

  public closeContextMenu() {
    this.contextMenuVisible = false;
    this.contextMenuType = "";
    this.contextMenuData = null;
    this.contextMenuIndex = -1;
  }

  public openSelectedFolder() {
    if (this.contextMenuData) {
      this.onFolderClick(this.contextMenuData);
    }
    this.closeContextMenu();
  }

  public ListarActosAdministrativos(tipo: string) {
    // Limpiar ruido: saltos de línea (\r, \n), tabulaciones y espacios al inicio/final
    const cleanTipo = tipo ? tipo.replace(/[\r\n\t]+/g, "").trim() : "";

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.CONSULTAR_ACTOS_ADMINISTRATIVOS;
    this.xAPI.parametros = `${cleanTipo}`;

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.fundamentoGlobal = data[0].fundamento || "";
        }
      },
      (err) => {
        console.error(err);
        this.toastrService.error("Error al registrar rechazo.");
        this.ngxService.stopLoader("ld-fast-reject");
        this.changeDetector.detectChanges();
      },
    );
  }

  // ── Tagging & Priority operations for Documents ─────
  public processDocumentsGrouping(): void {
    const listToProcess = this.filteredDocumentsList || [];
    const groupsMap = new Map<string, any[]>();
    const flatList: any[] = [];
    const collectedTags = new Set<string>();

    listToProcess.forEach((doc, idx) => {
      const key = doc.numero_carpeta;
      const tagInfo = this.documentTags[key];
      const priority = tagInfo?.priority || "Normal";

      // Fallback: If no tag in documentTags, search in doc.documentos for a non-empty observacion
      let tag = tagInfo?.tag || "";
      if (!tag && doc.documentos && Array.isArray(doc.documentos)) {
        const foundObs = doc.documentos
          .map((d) => d.observacion)
          .find((o) => o && o.trim() !== "");
        if (foundObs) {
          tag = foundObs.trim().toUpperCase();
        }
      }

      doc.index = idx;
      doc.priority = priority;
      doc.tag = tag;

      if (tag && tag.trim() !== "") {
        collectedTags.add(tag);
        if (!groupsMap.has(tag)) {
          groupsMap.set(tag, []);
        }
        groupsMap.get(tag)!.push(doc);
      } else {
        flatList.push(doc);
      }
    });

    // Recorrer observaciones de todos los documentos para extraer tags existentes
    listToProcess.forEach((doc) => {
      if (doc.documentos && Array.isArray(doc.documentos)) {
        doc.documentos.forEach((d: any) => {
          if (d.observacion && d.observacion.trim() !== "") {
            collectedTags.add(d.observacion.trim().toUpperCase());
          }
        });
      }
    });

    this.existingTags = Array.from(collectedTags).sort();

    this.documentGroups = Array.from(groupsMap.entries())
      .map(([name, docs]) => ({
        name,
        docs: docs.sort((a, b) =>
          a.numero_carpeta.localeCompare(b.numero_carpeta),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.flatDocuments = flatList.sort((a, b) =>
      a.numero_carpeta.localeCompare(b.numero_carpeta),
    );
  }

  public toggleDocGroup(groupName: string, event: MouseEvent): void {
    event.stopPropagation();
    this.expandedDocGroups[groupName] = !this.expandedDocGroups[groupName];
    this.changeDetector.detectChanges();
  }

  public isDocGroupExpanded(groupName: string): boolean {
    return this.expandedDocGroups[groupName] === true; // collapsed by default
  }

  public saveDocumentTags(): void {
    try {
      localStorage.setItem(
        "ok_document_tags",
        JSON.stringify(this.documentTags),
      );
    } catch (e) {
      console.error("Error writing document tags to localStorage:", e);
    }
    this.processDocumentsGrouping();
    this.changeDetector.detectChanges();
  }

  public setDocPriority(doc: any, priority: string): void {
    if (!doc) return;
    const key = doc.numero_carpeta;
    if (!this.documentTags[key]) {
      this.documentTags[key] = { priority: "Normal", tag: "" };
    }
    this.documentTags[key].priority = priority;
    this.saveDocumentTags();
    this.closeContextMenu();
  }

  public async apiActualizarEtiqueta(
    numeroCarpeta: string,
    etiqueta: string,
  ): Promise<any> {
    const xAPI = {} as IAPICore;
    xAPI.funcion = environment.funcion.ACTUALIZAR_CARPETA_ETIQUETA;
    xAPI.parametros = `${numeroCarpeta},${etiqueta}`;
    xAPI.valores = "";
    try {
      return await this.apiService.Ejecutar(xAPI).toPromise();
    } catch (e) {
      console.error(
        `Error actualizando etiqueta para carpeta ${numeroCarpeta}:`,
        e,
      );
      throw e;
    }
  }

  public setDocTag(doc: any): void {
    if (!doc) return;
    this.closeContextMenu();
    const key = doc.numero_carpeta;
    const currentTag = this.documentTags[key]?.tag || "";

    const options: { [key: string]: string } = {};
    this.existingTags.forEach((t) => {
      options[t] = t;
    });
    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    let defaultVal = currentTag;
    if (!defaultVal || !this.existingTags.includes(defaultVal)) {
      defaultVal = "__NEW__";
    }

    Swal.fire({
      title: "Asignar Etiqueta",
      input: "select",
      inputLabel: "Seleccione una etiqueta existente o cree una nueva",
      inputValue: defaultVal,
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-success",
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
              showCancelButton: true,
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              customClass: {
                confirmButton: "btn btn-success",
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
                this.applyDocTag(key, newTag);
              }
            });
          }, 150);
        } else if (selection) {
          this.applyDocTag(key, selection);
        }
      }
    });
  }

  private applyDocTag(key: string, tagValue: string): void {
    if (!this.documentTags[key]) {
      this.documentTags[key] = { priority: "Normal", tag: "" };
    }
    this.documentTags[key].tag = tagValue;
    this.saveDocumentTags();

    // Persistir en base de datos
    this.apiActualizarEtiqueta(key, tagValue).then(
      () =>
        this.toastrService.success(
          `Etiqueta "${tagValue}" guardada en base de datos.`,
          "Éxito",
        ),
      () =>
        this.toastrService.error(
          "No se pudo guardar la etiqueta en el servidor.",
          "Error",
        ),
    );
  }

  public clearDocSelection(): void {
    this.documents.forEach((d) => (d.selected = false));
    this.changeDetector.detectChanges();
  }

  get selectedDocsCount(): number {
    return this.documents.filter((d) => d.selected).length;
  }

  public assignTagToSelectedDocs(): void {
    const selected = this.documents.filter((d) => d.selected);
    if (selected.length === 0) return;

    const options: { [key: string]: string } = {};

    const predefinedTags = [
      "EJERCITO BOLIVARIANO",
      "ARMADA BOLIVARIANA",
      "AVIACION MILITAR BOLIVARIANA",
      "GUARDIA NACIONAL BOLIVARIANA",
      "MILICIA BOLIVARIANA",
      "COMANDO ESTRATEGICO OPERACIONAL",
      "COMANDO DE DEFENSA AEROESPACIAL INTEGRAL",
      "VICEMINISTERIO DE EDUCACION",
      "UNIVERSIDAD MILITAR BOLIVARIANA",
      "VICEMINISTERIO DE PLANIFICACION",
      "VICEMINISTERIO DE SERVICIOS",
      "GUARDIA DE HONOR PRESIDENCIAL",
      "EMPRESAS Y SERVICIOS",
      "CONTRALORIA GENERAL",
      "INSPECTORIA GENERAL",
      "SISTEMA DE JUSTICIA MILITAR",
      "DIRECCIONES GENERALES DEL MPPD",
    ];

    predefinedTags.forEach((t) => {
      options[t] = t;
    });

    this.existingTags.forEach((t) => {
      options[t] = t;
    });

    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    Swal.fire({
      title: "Asignar Etiqueta a Seleccionados",
      input: "select",
      inputLabel:
        "Seleccione una etiqueta existente o cree una nueva para las carpetas seleccionadas",
      inputValue: "__NEW__",
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-success",
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
              showCancelButton: true,
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-secondary",
                input: "swal-input-custom",
              },
              buttonsStyling: false,
              inputValidator: (val) => {
                if (!val || val.trim() === "") {
                  return "¡Debe ingresar un nombre!";
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

  private async applyBatchTag(
    selected: any[],
    tagValue: string,
  ): Promise<void> {
    this.ngxService.startLoader("ld-fast");
    try {
      for (const doc of selected) {
        const key = doc.numero_carpeta;
        if (!this.documentTags[key]) {
          this.documentTags[key] = { priority: "Normal", tag: "" };
        }
        this.documentTags[key].tag = tagValue;

        // Execute sequentially and wait for completion
        await this.apiActualizarEtiqueta(key, tagValue);
      }

      this.toastrService.success(
        "Etiquetas actualizadas en base de datos.",
        "Éxito",
      );
    } catch (err) {
      console.error("Error updating tags in batch:", err);
      this.toastrService.warning(
        "Algunas etiquetas no se guardaron en el servidor.",
        "Advertencia",
      );
    } finally {
      this.ngxService.stopLoader("ld-fast");
    }

    this.saveDocumentTags();
    this.clearDocSelection();
  }

  public assignPriorityToSelectedDocs(priority: string): void {
    const selected = this.documents.filter((d) => d.selected);
    if (selected.length === 0) return;
    selected.forEach((doc) => {
      const key = doc.numero_carpeta;
      if (!this.documentTags[key]) {
        this.documentTags[key] = { priority: "Normal", tag: "" };
      }
      this.documentTags[key].priority = priority;
    });
    this.saveDocumentTags();
    this.clearDocSelection();
  }

  // --- METODOS DE PROCESAMIENTO DE CASOS ---

  public ObtenerResuelto(numero_carpeta: string): Promise<any> {
    return new Promise((resolve) => {
      const cleanNumeroCarpeta = numero_carpeta
        ? numero_carpeta.replace(/[\r\n\t]+/g, "").trim()
        : "";
      const xAPI = {} as IAPICore;
      xAPI.funcion = environment.funcion.OBTENER_RESUELTO;
      xAPI.parametros = `${cleanNumeroCarpeta}`;
      this.apiService.Ejecutar(xAPI).subscribe(
        (data: any) => {
          resolve(data && data.length > 0 ? data[0] : null);
        },
        (err: any) => {
          console.error("Error al obtener resuelto desde PostgreSQL:", err);
          resolve(null);
        },
      );
    });
  }

  public async openProcessModal(doc: any) {
    this.selectedDocForProcessing = doc;
    this.extractedCases = [];
    this.isProcessModalOpen = true;
    this.loadingProcessData = true;
    this.isAscensoType = false;

    // Verificar si es de tipo Ascenso
    if (doc.asunto && doc.asunto.toUpperCase().includes("ASCENSO")) {
      this.isAscensoType = true;
    }

    // Initialize tab and form values
    this.activeTab = "casos";
    this.processingInstrucciones = doc.instrucciones || "";
    this.processingObservaciones = doc.pub_observacion || doc.observacion || "";
    this.processingPublicacion = doc.publicacion || "Publicar";

    try {
      // 1. Intentar obtener el template de resolución
      const pgTemplate = await this.ObtenerResuelto(doc.numero_carpeta);
      let htmlCompleto = "";
      let docsOriginales: any[] = [];

      if (pgTemplate && pgTemplate.task) {
        const unico_parrafo = pgTemplate.task.unico_parrafo || "";
        const lista_casos = pgTemplate.task.lista_casos || "";
        htmlCompleto = unico_parrafo + " " + lista_casos;
        docsOriginales =
          pgTemplate.task.documentos_originales ||
          pgTemplate.task.documentos ||
          [];
      }

      if (docsOriginales.length === 0 && doc.documentos) {
        docsOriginales = doc.documentos;
      }

      // 2. Intentar parsear el HTML con LectorService
      let parsedOficiales: any[] = [];
      if (htmlCompleto) {
        parsedOficiales = this.lectorService.extraerDatosMilitar(htmlCompleto);
      }

      // 3. Mapeo de casos con lógica de fallback
      if (parsedOficiales && parsedOficiales.length > 0) {
        this.extractedCases = parsedOficiales.map((o, idx) => {
          const match = docsOriginales.find((d) => {
            const dCed = (d.cedula || d.persona?.cedula || "")
              .toString()
              .replace(/\./g, "")
              .trim();
            const oCed = (o.cedula || "").toString().replace(/\./g, "").trim();
            return dCed === oCed;
          });
          return {
            cedula: o.cedula || "",
            nombre: o.nombre || "",
            asunto: o.ubicacion || match?.asunto || "",
            orden: match?.orden || (this.isAscensoType ? idx + 1 : null),
          };
        });
      } else {
        // Fallback: usar las cédulas de documentos_originales
        this.extractedCases = docsOriginales.map((d: any, idx: number) => ({
          cedula: d.cedula || d.persona?.cedula || "",
          nombre: d.nombres_apellidos || d.nombre || "",
          asunto: d.asunto || "",
          orden: d.orden || (this.isAscensoType ? idx + 1 : null),
        }));
      }
    } catch (e) {
      console.error("Error al cargar datos del modal de procesamiento:", e);
      this.toastrService.error(
        "Ocurrió un error al cargar la información del documento.",
      );
    } finally {
      this.loadingProcessData = false;
      this.changeDetector.detectChanges();
    }
  }

  public closeProcessModal() {
    this.isProcessModalOpen = false;
    this.selectedDocForProcessing = null;
    this.extractedCases = [];
    this.isAscensoType = false;
    this.activeTab = "casos";
    this.processingInstrucciones = "";
    this.processingObservaciones = "";
    this.processingPublicacion = "Publicar";
    this.changeDetector.detectChanges();
  }

  /**
   * Convierte la fecha del resuelto (ej. "17 AGO 2026", "17 DE AGOSTO DE 2026", "17/08/2026")
   * a formato estándar YYYY-MM-DD para búsquedas de sistema.
   */
  public obtenerFechaSistema(fechaStr: string): string {
    if (!fechaStr) return "";

    let str = fechaStr
      .toUpperCase()
      .replace(/\bDE\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    const matchDDMMYYYY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (matchDDMMYYYY) {
      const d = matchDDMMYYYY[1].padStart(2, "0");
      const m = matchDDMMYYYY[2].padStart(2, "0");
      const y = matchDDMMYYYY[3];
      return `${y}-${m}-${d}`;
    }

    const mesesMap: { [key: string]: string } = {
      ENE: "01",
      ENERO: "01",
      FEB: "02",
      FEBRERO: "02",
      MAR: "03",
      MARZO: "03",
      ABR: "04",
      ABRIL: "04",
      MAY: "05",
      MAYO: "05",
      JUN: "06",
      JUNIO: "06",
      JUL: "07",
      JULIO: "07",
      AGO: "08",
      AGOSTO: "08",
      SEP: "09",
      SEPTIEMBRE: "09",
      OCT: "10",
      OCTUBRE: "10",
      NOV: "11",
      NOVIEMBRE: "11",
      DIC: "12",
      DICIEMBRE: "12",
    };

    const partes = str.split(" ");
    let dia = "";
    let mesStr = "";
    let anio = "";

    for (const p of partes) {
      if (/^\d{1,2}$/.test(p)) {
        dia = p.padStart(2, "0");
      } else if (/^[A-ZÑÁÉÍÓÚ]+$/.test(p)) {
        mesStr = p;
      } else if (/^\d{4}$/.test(p)) {
        anio = p;
      }
    }

    if (dia && mesStr && anio) {
      let mesNum = mesesMap[mesStr];
      if (!mesNum) {
        const prefix = mesStr.substring(0, 3);
        mesNum = mesesMap[prefix] || "";
      }
      if (mesNum) {
        return `${anio}-${mesNum}-${dia}`;
      }
    }

    try {
      const d = new Date(fechaStr);
      if (!isNaN(d.getTime())) {
        const diaNum = d.getDate().toString().padStart(2, "0");
        const mesNum = (d.getMonth() + 1).toString().padStart(2, "0");
        const anioNum = d.getFullYear();
        return `${anioNum}-${mesNum}-${diaNum}`;
      }
    } catch (e) {}

    return "";
  }

  public async saveProcessedCases() {
    if (!this.selectedDocForProcessing) return;

    this.ngxService.startLoader("ld-fast");
    const doc = this.selectedDocForProcessing;
    const numeroCarpeta = doc.numero_carpeta || "000000";
    const numeroResolucion = doc.numero_resol || doc.numc || "";

    try {
      // Guardar campos de detalles en el documento local
      doc.instrucciones = this.processingInstrucciones;
      doc.pub_observacion = this.processingObservaciones;
      doc.observacion = this.processingObservaciones;
      doc.publicacion = this.processingPublicacion;
      doc.fecha_sistema = this.obtenerFechaSistema(doc.fecha_resolucion);

      // Normalizar asuntos en mayúsculas y sin acentos antes de procesar
      this.extractedCases.forEach((caso) => {
        caso.asunto = this.lectorService.normalizarAsunto(caso.asunto);
      });

      // Actualizar en memoria el listado del documento
      if (doc.documentos) {
        doc.documentos.forEach((d: any) => {
          const match = this.extractedCases.find((c) => c.cedula === d.cedula);
          if (match) {
            d.asunto = match.asunto;
            if (this.isAscensoType) {
              d.orden = match.orden;
            }
          }
        });
      }

      // Obtener el template de resolución
      const pgTemplate = await this.ObtenerResuelto(doc.numero_carpeta);
      let taskObj: any = {};
      if (pgTemplate && pgTemplate.task) {
        taskObj = { ...pgTemplate.task };
      } else {
        taskObj = {
          fecha_resolucion: doc.fecha_resolucion,
          numero_carpeta: numeroCarpeta,
          numero_resolucion: numeroResolucion,
          basamento_legal: "",
          unico_parrafo: "",
          lista_casos: "",
          styles: null,
          ediciones: [],
          comentarios: [],
        };
      }

      // Actualizar la lista en el taskObj
      taskObj.instrucciones = this.processingInstrucciones;
      taskObj.pub_observacion = this.processingObservaciones;
      taskObj.observacion = this.processingObservaciones;
      taskObj.publicacion = this.processingPublicacion;
      taskObj.fecha_sistema = doc.fecha_sistema;

      taskObj.documentos_originales = this.extractedCases.map((c) => ({
        cedula: c.cedula,
        nombres_apellidos: c.nombre,
        asunto: c.asunto,
        orden: c.orden,
      }));

      // 1. Construir la colección DocResoluciones para PostgreSQL
      const DocResoluciones = this.extractedCases.map((c) => {
        // Encontrar documento original correspondiente
        const d =
          doc.documentos?.find((item: any) => {
            const itemCed = (item.cedula || item.persona?.cedula || "")
              .toString()
              .replace(/\./g, "")
              .trim();
            const cCed = (c.cedula || "").toString().replace(/\./g, "").trim();
            return itemCed === cCed;
          }) || {};

        const toSqlDate = (dateStr: string) => {
          if (!dateStr) return null;
          const converted = this.obtenerFechaSistema(dateStr);
          return converted ? converted : null;
        };

        const fechaResolSql = toSqlDate(doc.fecha_resolucion);
        let dia = null;
        let mes = null;
        let anio = null;
        if (fechaResolSql) {
          const parts = fechaResolSql.split("-");
          if (parts.length === 3) {
            dia = parseInt(parts[2], 10);
            mes = parseInt(parts[1], 10);
            anio = parseInt(parts[0], 10);
          }
        }

        return {
          grado: parseInt(d.agrado || d.grado || d.cod_grado || 0, 10),
          anio: anio || d.anio || new Date().getFullYear(),
          asunto: c.asunto,
          cedula: c.cedula,
          pais: parseInt(d.cod_pais || d.pais || 1, 10),
          reserva: parseInt(d.cod_reserva || d.reserva || 0, 10),
          solicitud: parseInt(d.cod_solicitud || d.solicitud || 0, 10),
          tipo: parseInt(
            d.cod_tipo_resol || d.tipo || doc.cod_tipo_resol || 0,
            10,
          ),
          unidad: parseInt(d.cod_unidad || d.unidad || 0, 10),
          comando: d.comando || "",
          comision_fin: toSqlDate(d.comision_fin),
          comision_inicio: toSqlDate(d.comision_inicio),
          creador: d.creador || this.jwtData?.userName || "",
          destino: d.destino || "",
          dia: dia || d.dia || new Date().getDate(),
          distribucion: d.distribucion || "",
          estatus: parseInt(d.esta || d.estatus || 1, 10),
          modificado: toSqlDate(d.f_modificado || d.modificado),
          fecha_termino: toSqlDate(d.f_termino || d.fecha_termino),
          falta: d.falta || "",
          registro: toSqlDate(
            d.fecha_registro ||
              d.registro ||
              new Date().toISOString().substring(0, 10),
          ),
          fecha_resolucion: fechaResolSql,
          formato: d.formato || "",
          ultimo_ascenso: toSqlDate(d.fultimoascenso || d.ultimo_ascenso),
          instrucciones: this.processingInstrucciones,
          mes: mes || d.mes || new Date().getMonth() + 1,
          documento: parseInt(d.documento || doc.id || 0, 10),
          causa: parseInt(d.causa || 0, 10),
          autor_modificar: this.jwtData?.userName || "",
          motivo: d.motivo || "",
          numero: numeroResolucion,
          observacion: this.processingObservaciones,
          orden_merito: c.orden ? parseInt(c.orden, 10) : null,
          otro_resuelto: d.otro_resuelto || "",
          autor_registro:
            d.registrado || d.autor_registro || this.jwtData?.userName || "",
          termino: parseInt(d.termino || 0, 10),
          unidad_texto: d.unidad_comando || d.unidad_texto || "",
          archivo: d.anom || d.archivo || "",
        };
      });

      if (DocResoluciones.length === 0) {
        this.ngxService.stopLoader("ld-fast");
        this.toastrService.warning("No hay casos para procesar.");
        return;
      }

      // 2. Mostrar modal de progreso SweetAlert2
      Swal.fire({
        title: "Procesando Resoluciones",
        html: `Registrando caso <b>1</b> de ${DocResoluciones.length}...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 3. Lanzar la inserción recursiva
      this.procesarResolucionRecursivo(
        0,
        DocResoluciones.length,
        DocResoluciones,
        doc,
        taskObj,
      );
    } catch (e) {
      console.error("Error en saveProcessedCases:", e);
      this.ngxService.stopLoader("ld-fast");
      this.toastrService.error("Ocurrió un error al procesar los casos.");
    }
  }

  /**
   * Ejecuta recursivamente el registro de resoluciones elemento por elemento.
   */
  private procesarResolucionRecursivo(
    index: number,
    total: number,
    list: any[],
    doc: any,
    taskObj: any,
  ) {
    // if (index < total) {
    // Actualizar diálogo de progreso
    const container = Swal.getHtmlContainer();
    if (container) {
      const bTag = container.querySelector("b");
      if (bTag) bTag.textContent = (index + 1).toString();
    }

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.INSERTAR_RESOLUCIONES;
    this.xAPI.parametros = "";
    this.xAPI.valores = JSON.stringify([list[index]]);

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (res: any) => {
        this.procesarResolucionRecursivo(index + 1, total, list, doc, taskObj);
      },
      (error) => {
        this.ngxService.stopLoader("ld-fast");
        Swal.close();
        this.toastrService.error(
          `Error al registrar el caso C.I. ${list[index].cedula}.`,
          "Error",
        );
        console.error("Error en registrar caso:", error);
      },
    );
    // } else {
    //   // 1. Guardar el estado consolidado en MongoDB mediante ExecColeccion
    //   const numeroCarpeta = doc.numero_carpeta || "000000";
    //   const numeroResolucion = doc.numero_resol || doc.numc || "";

    //   let obj = {
    //     usuario: this.jwtData?.userId,
    //     numero_carpeta: numeroCarpeta,
    //     numero_resolucion: numeroResolucion,
    //     task: taskObj,
    //     fecha: new Date(),
    //   };

    //   let cl = {
    //     coleccion: "estatus_resolucion",
    //     numero_carpeta: `${numeroCarpeta}`,
    //     numero_resolucion: `${numeroResolucion}`,
    //     driver: environment.driver.PRINCIPAL,
    //     objeto: obj,
    //     donde: '{"numero_carpeta":"' + numeroCarpeta + '"}',
    //     upsert: true,
    //   };

    //   this.apiService.ExecColeccion(cl).subscribe(
    //     (res: any) => {
    //       this.ngxService.stopLoader("ld-fast");
    //       this.isProcessModalOpen = false;
    //       Swal.close();
    //       Swal.fire({
    //         title: "¡Procesado!",
    //         text: "Todos los casos de esta resolución se han insertado y el estado se guardó en MongoDB.",
    //         icon: "success",
    //         confirmButtonColor: "#2e5a73",
    //         confirmButtonText: "Aceptar",
    //       });
    //       this.changeDetector.detectChanges();
    //     },
    //     (err: any) => {
    //       this.ngxService.stopLoader("ld-fast");
    //       this.isProcessModalOpen = false;
    //       Swal.close();
    //       console.error("Error al guardar en MongoDB:", err);
    //       this.toastrService.error("Se registraron los casos en PostgreSQL, pero no se pudo guardar el estado en MongoDB.");
    //       this.changeDetector.detectChanges();
    //     }
    //   );
    // }
  }

  // --- BÚSQUEDA AVANZADA GLOBAL ---
  public showAdvancedSearchModal: boolean = false;
  public advancedSearchQuery: string = "";
  public advancedSearchResults: any[] = [];
  public isSearchingAdvanced: boolean = false;
  public advancedSearchStatus: string = "idle"; // 'idle', 'searching', 'success', 'error', 'empty'

  public openAdvancedSearch() {
    this.showAdvancedSearchModal = true;
    this.advancedSearchQuery = "";
    this.advancedSearchResults = [];
    this.advancedSearchStatus = "idle";

    setTimeout(() => {
      const input = document.getElementById("advancedSearchInput");
      if (input) input.focus();
    }, 100);
  }

  public closeAdvancedSearch() {
    this.showAdvancedSearchModal = false;
  }

  public performAdvancedSearch() {
    if (!this.advancedSearchQuery || this.advancedSearchQuery.trim().length < 3)
      return;

    this.isSearchingAdvanced = true;
    this.advancedSearchStatus = "searching";
    this.advancedSearchResults = [];

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.CONSULTAR_DOCUMENTOS_LIBRES;
    this.xAPI.parametros = this.advancedSearchQuery.trim();

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (res: any) => {
        this.isSearchingAdvanced = false;
        if (res && Array.isArray(res) && res.length > 0) {
          this.advancedSearchStatus = "success";
          // Mapear la estructura JSON proveída (con 'task' y 'documentos_originales') a la interfaz
          this.advancedSearchResults = res.map((doc: any) => {
            const task = doc.task || {};
            const docOriginales = task.documentos_originales || [];
            const primerDoc = docOriginales.length > 0 ? docOriginales[0] : {};

            // Extraer fecha formateada
            let fechaFormat = "N/A";
            if (doc.fecha) {
              try {
                fechaFormat = new Date(doc.fecha).toLocaleDateString();
              } catch (e) {}
            } else if (task.fecha_resolucion) {
              fechaFormat = task.fecha_resolucion;
            }

            return {
              numero_carpeta: doc.numero_carpeta || "S/N",
              asunto: task.asunto || primerDoc.asunto || "Sin Asunto",
              fecha_resolucion: fechaFormat,
              buzon: doc.buzon || "Bandeja General",
              observacion: task.observacion || task.pub_observacion || "",
              rechazo:
                primerDoc.observacion && primerDoc.observacion !== "null"
                  ? primerDoc.observacion
                  : "",
              usuario:
                primerDoc.responsable ||
                primerDoc.creador ||
                primerDoc.registrado ||
                "Desconocido",
              fecha_registro:
                primerDoc.fecha_registro || primerDoc.fecha_entrada || "N/A",
              comentarios_count: Array.isArray(task.comentarios)
                ? task.comentarios.length
                : 0,
              expanded: false,
              loadingDetails: false,
            };
          });
        } else {
          this.advancedSearchStatus = "empty";
          this.advancedSearchResults = [];
        }
      },
      (error) => {
        this.isSearchingAdvanced = false;
        this.advancedSearchStatus = "error";
        this.toastrService.error("Error al buscar documentos.");
      },
    );
  }

  public toggleDetails(res: any) {
    res.expanded = !res.expanded;
    if (res.expanded && !res.detailsLoaded) {
      res.loadingDetails = true;
      let xAPI = {} as IAPICore;
      xAPI.funcion = environment.funcion.CONSULTAR_CARPETA_RESOLUCIONES;
      xAPI.parametros = res.numero_carpeta;

      this.apiService.Ejecutar(xAPI).subscribe(
        (data: any) => {
          res.loadingDetails = false;
          res.detailsLoaded = true;

          if (data && data.Cuerpo && data.Cuerpo.length > 0) {
            const detalle = data.Cuerpo[0];
            res.estadoCarpeta = this.mapEstatus(detalle.estatus);
            res.tipoDocumento = this.mapTipo(detalle.cod_tipo_entrada);
            res.fecha_entrada = detalle.fecha_entrada;
            res.cuenta_oficio = detalle.cuenta_oficio;
            res.numero_resol = detalle.numero_resol;
          }
        },
        (error) => {
          res.loadingDetails = false;
          res.detailsLoaded = true;
        },
      );
    }
  }

  private mapEstatus(estatus: string | number): string {
    const e = parseInt(estatus as string, 10);
    switch (e) {
      case 36:
        return "REDACTAR - EDICION";
      case 776:
        return "FIRMADO";
      case 7776:
        return "PUBLICADO POR EL MINISTRO";
      case 880:
        return "MINISTRO APROBADOR";
      case 930:
        return "SECRETARIA (JEFE)";
      case 990:
        return "RESOLUCION (REVISION)";
      case 991:
        return "RESOLUCION (JEFE)";
      default:
        return "ESTATUS (" + e + ")";
    }
  }

  private mapTipo(tipo: string | number): string {
    const t = parseInt(tipo as string, 10);
    switch (t) {
      case 85:
        return "NOMBRAMIENTO";
      case 86:
        return "NORMAS";
      case 87:
        return "PENSION DE GRACIA";
      default:
        return "OTRO (" + t + ")";
    }
  }

  //Mostrar los PDF cuando ya estan publicados
  VerPDF(doc: any) {
    const num = doc.numero_resol || doc.numero_resuelto;
    if (num) {
      this.getResueltoId(num);
    } else {
      this.toastrService.warning(
        "El documento no posee un número de resolución asignado.",
      );
    }
  }

  getResueltoId(numero: string) {
    if (numero && numero.toString().trim() !== "") {
      const payload = {
        ruta: "resueltos/",
        archivo: `${numero.trim()}.pdf`,
      };
      // Mostrar indicador de carga
      Swal.fire({
        title: "Cargando PDF...",
        text: "Por favor espere mientras se descarga el documento desde el servidor.",
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
          console.error("Error al descargar el PDF:", error);
          this.toastrService.error(
            "No se pudo obtener el archivo PDF desde el servidor de almacenamiento.",
          );
        },
      });
    }
  }
}
