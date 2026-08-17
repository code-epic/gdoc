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

@Component({
  selector: "app-resueltos-ok",
  templateUrl: "./resueltos_ok.component.html",
  styleUrls: ["./resueltos_ok.component.scss"],
})
export class ResueltosOkComponent implements OnInit, OnDestroy {
  @HostListener("window:keydown", ["$event"])
  onWindowKeyDown(event: KeyboardEvent) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
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

  public documentTags: { [docKey: string]: { priority: string; tag: string; distribution?: string[] } } =
    {};
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
  } = {
    userId: "",
    userName: "",
    userRole: "",
    userCedula: "",
    perfil: "",
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

  // --- DISTRIBUCIÓN (Solo Dirección + Firmados) ---
  public isDistributionModalOpen: boolean = false;
  public selectedDocForDistribution: any = null;
  public distributionOptions: string[] = ['NORMAL', 'PDF RRSS', 'OFICIO', 'GACETA', 'SOBRE', 'NO PUBLICAR'];
  public selectedDistributions: Set<string> = new Set<string>();
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

  public closeDistributionModal(): void {
    this.isDistributionModalOpen = false;
    this.selectedDocForDistribution = null;
  }

  public isOptionChecked(option: string): boolean {
    return this.selectedDistributions.has(option);
  }

  public toggleDistributionOption(option: string): void {
    if (option === 'NO PUBLICAR') {
      // Si se selecciona "No Publicar" se desmarcan las demás opciones
      if (this.selectedDistributions.has('NO PUBLICAR')) {
        this.selectedDistributions.delete('NO PUBLICAR');
      } else {
        this.selectedDistributions.clear();
        this.selectedDistributions.add('NO PUBLICAR');
      }
    } else {
      // Al marcar cualquier otra opción, se elimina "No Publicar"
      this.selectedDistributions.delete('NO PUBLICAR');
      if (this.selectedDistributions.has(option)) {
        this.selectedDistributions.delete(option);
      } else {
        this.selectedDistributions.add(option);
      }
    }
  }

  public saveDistribution(): void {
    if (!this.selectedDocForDistribution) return;
    const distribution = Array.from(this.selectedDistributions);
    // Guardar en el objeto del documento para reflejo reactivo inmediato
    this.selectedDocForDistribution.distribution = distribution;
    // Persistir en documentTags también
    const carpetaKey = this.selectedDocForDistribution.numero_carpeta;
    if (!this.documentTags[carpetaKey]) {
      this.documentTags[carpetaKey] = { priority: 'Normal', tag: '' };
    }
    this.documentTags[carpetaKey].distribution = distribution;
    this.closeDistributionModal();
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
              grupo.numero_resol   = d.numero_resol   || null;
              grupo.fecha_resolucion = d.fecha_resolucion || null;
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
        input: "swal-select-custom"
      },
      buttonsStyling: false
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
                input: "swal-input-custom"
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
        input: "swal-select-custom"
      },
      buttonsStyling: false
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
                input: "swal-input-custom"
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

  private async applyBatchTag(selected: any[], tagValue: string): Promise<void> {
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
}
