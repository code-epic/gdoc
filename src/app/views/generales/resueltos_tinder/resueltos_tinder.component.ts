import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from "@angular/core";
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
  PdfAction,
  TinderPdfViewerComponent,
} from "src/app/components/tinder-pdf-viewer/tinder-pdf-viewer.component";

/**
 * ResueltosTinderComponent
 * Nueva versión del buzón de resueltos con visor PDF nativo Safari-safe.
 * Mantiene filtros, paginación y acciones del componente anterior.
 * Usa TinderPdfViewerComponent para la vista inmersiva.
 */
@Component({
  selector: "app-resueltos-tinder",
  templateUrl: "./resueltos_tinder.component.html",
  styleUrls: ["./resueltos_tinder.component.scss"],
})
export class ResueltosTinderComponent implements OnInit, OnDestroy {
  @ViewChild(TinderPdfViewerComponent) tinderViewer!: TinderPdfViewerComponent;

  // -- Componente inyectado desde el padre (Buzon) --
  @Input() componente: string = "";

  // ── Estado del explorador ─────────────────────────────
  public allFolders: any[] = [];
  public filteredFolders: any[] = [];
  public paginatedFolders: any[] = [];
  public selectedFolder: any = null;
  public documents: any[] = [];

  // Filtros y paginación de carpetas
  public activeFilter = "ALL";
  public folderSearch = "";
  public folderPage = 1;
  public totalPages = 1;
  public pageSize = 6;

  public documentTags: { [docKey: string]: { priority: string, tag: string } } = {};
  public existingTags: string[] = [];
  public documentGroups: Array<{ name: string; docs: any[] }> = [];
  public flatDocuments: any[] = [];
  public expandedDocGroups: { [groupName: string]: boolean } = {};
  public selectedDocsSet = new Set<string>();

  // Loading flags
  public loadingFolders = false;
  public loadingDocuments = false;
  public actionLoading = false;

  // Componentes map
  public componentMap: { [key: number]: string } = {};

  // Context menu
  public contextMenuVisible = false;
  public contextMenuCoords = { x: 0, y: 0 };
  public contextMenuType: "folder" | "document" | "" = "";
  public contextMenuData: any = null;
  public contextMenuIndex = -1;

  // Vista inmersiva
  public immersiveMode = false;
  public currentDocIndex = -1;

  // JWT
  public jwtData = {
    userId: "",
    userLogin: "",
    userName: "",
    userRole: "",
    userCedula: "",
  };

  // API
  public xAPI: IAPICore = { funcion: "", parametros: "", valores: "" };

  // Flag de PDF real vs demo
  public activar_pdf = false;

  constructor(
    private apiService: ApiService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    document.body.classList.add("immersive-active");
    this.loadComponentMap();
    this.decodeUserToken();
    try {
      const saved = localStorage.getItem('tinder_document_tags');
      if (saved) {
        this.documentTags = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading document tags:", e);
    }
    this.loadFolders();
  }

  ngOnDestroy(): void {
    document.body.classList.remove("immersive-active");
  }

  // ── Navegación ────────────────────────────────────────
  public exitComponent(): void {
    this.router.navigate(["/generales"]);
  }

  // ── Componentes ───────────────────────────────────────
  private loadComponentMap(): void {
    try {
      const compSession = sessionStorage.getItem("MPPD_CComponente");
      if (compSession) {
        const componentes = JSON.parse(atob(compSession));
        componentes.forEach((c: any) => {
          this.componentMap[c.cod_componente] = c.nombre_componente;
        });
      } else {
        this.componentMap = {
          1: "EJÉRCITO",
          2: "ARMADA",
          3: "AVIACIÓN",
          4: "G. NACIONAL",
          5: "MILICIA",
        };
      }
    } catch (e) {
      console.error("Error decodificando componentes:", e);
    }
  }

  public getComponentColor(code: number): string {
    const colors: { [key: number]: string } = {
      1: "#5dbe8e", // Ejército - pastel green
      2: "#6dc0d5", // Armada - pastel blue
      3: "#7b8edc", // Aviación - pastel indigo
      4: "#e07a8e", // GN - pastel red
      5: "#e6c974", // Milicia - pastel yellow
    };
    return colors[code] || "#a0aec0";
  }

  // ── JWT ───────────────────────────────────────────────
  private decodeUserToken(): void {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = new JwtHelperService().decodeToken(token);
        if (decoded?.Usuario) {
          this.jwtData = {
            userId: decoded.Usuario.id || "",
            userCedula: decoded.Usuario.cedula || "",
            userLogin: decoded.Usuario.usuario || "",
            userName: decoded.Usuario.nombre || "",
            userRole: decoded.Usuario.tipo || "Usuario",
          };
        }
      }
      if (!this.jwtData.userId && this.loginService.Usuario) {
        this.jwtData = {
          userId: this.loginService.Usuario.id || "",
          userCedula: this.loginService.Usuario.cedula || "",
          userLogin: this.loginService.Usuario.login || "",
          userName: this.loginService.Usuario.nombre || "",
          userRole: this.loginService.Usuario.tipo || "",
        };
      }
    } catch (e) {
      console.error("Error decodificando JWT:", e);
    }
  }

  // ── Carpetas ──────────────────────────────────────────
  public loadFolders(): void {
    this.loadingFolders = true;
    this.ngxService.startLoader("ld-folders-tinder");
    this.xAPI = {
      funcion: environment.funcion.GRUPO_CARPETA_ENTRADA,
      parametros: "36",
      valores: "",
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data?.Cuerpo) {
          this.allFolders = data.Cuerpo.map((e: any) => ({
            cantidad: e.cantidad,
            llav: e.numero_carpeta,
            componente: parseInt(e.cod_componente, 10),
            fecha: e.entrada,
            registro: e.registro,
          }));
        }
        this.filterAndPaginateFolders();
        this.loadingFolders = false;
        this.ngxService.stopLoader("ld-folders-tinder");
        this.cdr.detectChanges();
      },
      (error) => {
        // REVISAR URGENTE PARA EJECUCION DEL MINISTRO
        //this.toastrService.error("Error de conexión al cargar carpetas", "Buzón Resueltos");
        this.loadingFolders = false;
        this.ngxService.stopLoader("ld-folders-tinder");
        this.cdr.detectChanges();
      },
    );
  }

  public setFilter(value: string): void {
    this.activeFilter = value;
    this.folderPage = 1;
    this.filterAndPaginateFolders();
  }

  public onSearchChange(): void {
    this.folderPage = 1;
    this.filterAndPaginateFolders();
  }

  private filterAndPaginateFolders(): void {
    let result = [...this.allFolders];

    if (this.activeFilter !== "ALL") {
      const compId = parseInt(this.activeFilter, 10);
      result = result.filter((f) => f.componente === compId);
    }

    if (this.folderSearch.trim() !== "") {
      const query = this.folderSearch.toLowerCase();
      result = result.filter((f) => f.llav.toLowerCase().includes(query));
    }

    this.filteredFolders = result;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredFolders.length / this.pageSize),
    );
    if (this.folderPage > this.totalPages) this.folderPage = this.totalPages;

    const start = (this.folderPage - 1) * this.pageSize;
    this.paginatedFolders = this.filteredFolders.slice(
      start,
      start + this.pageSize,
    );
    this.cdr.detectChanges();
  }

  public nextFolderPage(): void {
    if (this.folderPage < this.totalPages) {
      this.folderPage++;
      this.filterAndPaginateFolders();
    }
  }

  public prevFolderPage(): void {
    if (this.folderPage > 1) {
      this.folderPage--;
      this.filterAndPaginateFolders();
    }
  }

  // ── Documentos ────────────────────────────────────────
  public onFolderClick(folder: any): void {
    this.selectedFolder = folder;
    this.loadDocuments(folder);
  }

  public onFolderDblClick(folder: any): void {
    this.onFolderClick(folder);
  }

  private loadDocuments(folder: any): void {
    this.loadingDocuments = true;
    this.documents = [];
    this.xAPI = {
      funcion: environment.funcion.ENTRADAS_PROCESO,
      parametros: `${folder.llav},${folder.componente},36,${folder.fecha}`,
      valores: null,
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data?.Cuerpo) {
          this.documents = data.Cuerpo.map((e: any) => ({
            ...e,
            completed: false,
          }));
        }
        this.processDocumentsGrouping();
        this.loadingDocuments = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error cargando documentos:", error);
        this.toastrService.error("No se pudieron obtener los documentos");
        this.loadingDocuments = false;
        this.cdr.detectChanges();
      },
    );
  }

  // ── Vista inmersiva ───────────────────────────────────
  public enterImmersive(index: number): void {
    if (this.documents.length === 0) return;
    this.currentDocIndex = index;
    this.immersiveMode = true;
    this.cdr.detectChanges();
  }

  public enterImmersiveFromFolder(): void {
    if (this.documents.length > 0) {
      this.enterImmersive(0);
    } else {
      this.toastrService.warning(
        "La carpeta seleccionada no tiene documentos.",
      );
    }
  }

  public exitImmersive(): void {
    this.immersiveMode = false;
    this.currentDocIndex = -1;
    this.cdr.detectChanges();
  }

  public onNavigate(event: { doc: any; index: number }): void {
    this.currentDocIndex = event.index;
  }

  // ── Resolvedor de PDF ─────────────────────────────────
  public resolvePdfUrl = (doc: any): string => {
    const ncontrol = doc.ncontrol;
    const archivo = doc.anom;
    if (!archivo) return "";
    const peticion = btoa("D" + ncontrol) + "/" + archivo;
    return this.apiService.URL + "dws/" + peticion;
  };

  // ── Acciones ──────────────────────────────────────────
  public async onApprove(action: PdfAction): Promise<void> {
    const doc = action.doc;
    if (this.actionLoading) return;

    this.actionLoading = true;
    this.ngxService.startLoader("ld-approve-tinder");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment = action.observations
      ? action.observations.toUpperCase()
      : "APROBADO E INYECTADO CON FIRMA Y SELLO DIGITAL";

    this.xAPI = {
      funcion: environment.funcion.DOCUMENTO_OBSERVACION,
      parametros: "",
      valores: JSON.stringify({
        documento: controlId,
        estado: doc.ultimo_estado || doc.estatus || 36,
        estatus: 2,
        observacion: comment,
        accion: "0",
        usuario: userDb,
      }),
    };

    try {
      await this.apiService.Ejecutar(this.xAPI).toPromise();

      this.xAPI = {
        funcion: environment.funcion.PROMOVER_ESTATUS,
        parametros: `2,${userDb},${controlId}`,
        valores: "",
      };
      await this.apiService.Ejecutar(this.xAPI).toPromise();

      // Actualizar estatus de firma a 7766
      const targetDocs =
        doc.documentos && doc.documentos.length > 0 ? doc.documentos : [doc];
      const numero_carpeta = doc.numero_carpeta || "000000";
      console.log("Imprimiendo documentos en lista resueltos_tinder");
      console.log(doc);
      console.log("FINALIZANDO ");
      for (const d of targetDocs) {
        const cedulaVal = d.cedula || d.persona?.cedula || "";
        if (!cedulaVal) continue;

        const xAPIFirma = {
          funcion: environment.funcion.ACTUALIZAR_ESTATUS_FIRMA,
          parametros: `7766,${cedulaVal},${numero_carpeta},${doc.numc},${doc.fecha_resolucion}`,
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

      this.toastrService.success(
        `Documento ${controlId} firmado y aprobado`,
        "Resoluciones",
      );
      this.removeDoc(this.currentDocIndex);
      this.adjustAfterRemoval();
    } catch (err) {
      console.error("Error en onApprove:", err);
      this.toastrService.error(
        "Ocurrió un error al aprobar y firmar el documento",
      );
    } finally {
      this.actionLoading = false;
      this.ngxService.stopLoader("ld-approve-tinder");
      if (this.tinderViewer) {
        this.tinderViewer.resetAction();
      }
      this.cdr.detectChanges();
    }
  }

  public async onReject(action: PdfAction): Promise<void> {
    console.log("entrando en canal de rechazo");
    const doc = action.doc;
    if (this.actionLoading) return;

    if (!action.observations || action.observations.trim() === "") {
      Swal.fire({
        title: "Motivo de Rechazo Requerido",
        text: "Debe ingresar una observación que justifique el rechazo.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    this.actionLoading = true;
    this.ngxService.startLoader("ld-reject-tinder");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment = action.observations.toUpperCase();
    const previousState = "36";

    const targetDocs =
      doc.documentos && doc.documentos.length > 0 ? doc.documentos : [doc];
    const numero_carpeta = doc.numero_carpeta || "000000";

    for (const d of targetDocs) {
      const cedulaVal = d.cedula || d.persona?.cedula || "";
      if (!cedulaVal) continue;

      const xAPIFirma = {
        funcion: environment.funcion.ACTUALIZAR_ESTATUS_FIRMA,
        parametros: `${previousState},${cedulaVal},${numero_carpeta},REJECTED,REJECTED`,
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

    this.toastrService.success(
      `Documento ${controlId} rechazado y devuelto`,
      "Resoluciones",
    );
    this.removeDoc(this.currentDocIndex);
    this.adjustAfterRemoval();
    this.actionLoading = false;
    this.ngxService.stopLoader("ld-reject-tinder");
    if (this.tinderViewer) {
      this.tinderViewer.resetAction();
    }
    this.cdr.detectChanges();
  }

  private removeDoc(index: number): void {
    if (index > -1 && index < this.documents.length) {
      this.documents.splice(index, 1);
    }
  }

  private adjustAfterRemoval(): void {
    if (this.documents.length === 0) {
      this.exitImmersive();
      this.selectedFolder = null;
      this.loadFolders();
      return;
    }
    if (this.currentDocIndex >= this.documents.length) {
      this.currentDocIndex = this.documents.length - 1;
    }
    this.cdr.detectChanges();
  }

  // ── Acciones rápidas ──────────────────────────────────
  public approveFast(doc: any): void {
    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;

    Swal.fire({
      title: "Aprobación Rápida",
      text: `¿Firmar y aprobar el documento ${controlId}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5dbe8e",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, firmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.ngxService.startLoader("ld-fast-tinder");
      this.saveObservationAndPromote(
        doc,
        userDb,
        "APROBADO MEDIANTE ACCIÓN RÁPIDA",
        "ld-fast-tinder",
      );
    });
  }

  public promptReject(doc: any): void {
    console.log("Alta seleccion de datos y control III");
    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;

    Swal.fire({
      title: "Rechazar Documento",
      text: "Ingrese el motivo del rechazo:",
      input: "textarea",
      inputPlaceholder: "Observaciones...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e07a8e",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Confirmar Rechazo",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => (!value ? "Debe ingresar un motivo" : null),
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      this.ngxService.startLoader("ld-fast-reject-tinder");
      this.saveObservationAndReject(
        doc,
        userDb,
        result.value.toUpperCase(),
        "ld-fast-reject-tinder",
      );
    });
  }

  private saveObservationAndPromote(
    doc: any,
    userDb: string,
    comment: string,
    loaderId: string,
  ): void {
    this.xAPI = {
      funcion: environment.funcion.DOCUMENTO_OBSERVACION,
      parametros: "",
      valores: JSON.stringify({
        documento: doc.ncontrol || doc.numc,
        estado: doc.ultimo_estado || doc.estatus || 36,
        estatus: 2,
        observacion: comment,
        accion: "0",
        usuario: userDb,
      }),
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        this.xAPI = {
          funcion: environment.funcion.PROMOVER_ESTATUS,
          parametros: `2,${userDb},${doc.ncontrol || doc.numc}`,
          valores: "",
        };
        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(
              `Documento ${doc.ncontrol || doc.numc} firmado`,
            );
            this.documents = this.documents.filter(
              (d) => (d.ncontrol || d.numc) !== (doc.ncontrol || doc.numc),
            );
            this.ngxService.stopLoader(loaderId);
            if (this.documents.length === 0) {
              this.selectedFolder = null;
              this.loadFolders();
            } else {
              this.cdr.detectChanges();
            }
          },
          (err) => {
            console.error(err);
            this.toastrService.error("Error al promover estado");
            this.ngxService.stopLoader(loaderId);
            this.cdr.detectChanges();
          },
        );
      },
      (err) => {
        console.error(err);
        this.toastrService.error("Error al registrar aprobación");
        this.ngxService.stopLoader(loaderId);
        this.cdr.detectChanges();
      },
    );
  }

  private saveObservationAndReject(
    doc: any,
    userDb: string,
    comment: string,
    loaderId: string,
  ): void {
    console.log("Alta seleccion de datos y control IV");
    this.xAPI = {
      funcion: environment.funcion.DOCUMENTO_OBSERVACION,
      parametros: "",
      valores: JSON.stringify({
        documento: doc.ncontrol || doc.numc,
        estado: doc.ultimo_estado || doc.estatus || 36,
        estatus: Math.max(1, (doc.ultimo_estado || doc.estatus || 36) - 1),
        observacion: comment,
        accion: "1",
        usuario: userDb,
      }),
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        const currentState = doc.ultimo_estado || doc.estatus || 36;
        const previousState = Math.max(1, currentState - 1);
        this.xAPI = {
          funcion: environment.funcion.PROMOVER_ESTATUS,
          parametros: `${previousState},${userDb},${doc.ncontrol || doc.numc}`,
          valores: "",
        };
        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(
              `Documento ${doc.ncontrol || doc.numc} devuelto`,
            );
            this.documents = this.documents.filter(
              (d) => (d.ncontrol || d.numc) !== (doc.ncontrol || doc.numc),
            );
            this.ngxService.stopLoader(loaderId);
            if (this.documents.length === 0) {
              this.selectedFolder = null;
              this.loadFolders();
            } else {
              this.cdr.detectChanges();
            }
          },
          (err) => {
            console.error(err);
            this.toastrService.error("Error al devolver documento");
            this.ngxService.stopLoader(loaderId);
            this.cdr.detectChanges();
          },
        );
      },
      (err) => {
        console.error(err);
        this.toastrService.error("Error al registrar rechazo");
        this.ngxService.stopLoader(loaderId);
        this.cdr.detectChanges();
      },
    );
  }

  // ── Menú contextual ───────────────────────────────────
  public onFolderRightClick(event: MouseEvent, folder: any): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuCoords = { x: event.clientX, y: event.clientY };
    this.contextMenuType = "folder";
    this.contextMenuData = folder;
  }

  public onDocumentRightClick(
    event: MouseEvent,
    doc: any,
    index: number,
  ): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuCoords = { x: event.clientX, y: event.clientY };
    this.contextMenuType = "document";
    this.contextMenuData = doc;
    this.contextMenuIndex = index;
  }

  public closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.contextMenuType = "";
    this.contextMenuData = null;
    this.contextMenuIndex = -1;
  }

  public openContextFolder(): void {
    if (this.contextMenuData) {
      this.onFolderClick(this.contextMenuData);
    }
    this.closeContextMenu();
  }

  // ── Tagging & Priority operations for Documents ─────
  public processDocumentsGrouping(): void {
    const groupsMap = new Map<string, any[]>();
    const flatList: any[] = [];
    const collectedTags = new Set<string>();

    this.documents.forEach((doc, idx) => {
      const key = doc.digital || doc.anom || doc.cedula || idx.toString();
      const tagInfo = this.documentTags[key];
      const priority = tagInfo?.priority || "Normal";
      
      // Fallback: If no tag in documentTags, use doc.observacion if not empty
      let tag = tagInfo?.tag || "";
      if (!tag && doc.observacion && doc.observacion.trim() !== "") {
        tag = doc.observacion.trim().toUpperCase();
      }

      const annotated = {
        ...doc,
        index: idx,
        priority,
        tag,
      };

      if (tag && tag.trim() !== "") {
        collectedTags.add(tag);
        if (!groupsMap.has(tag)) {
          groupsMap.set(tag, []);
        }
        groupsMap.get(tag)!.push(annotated);
      } else {
        flatList.push(annotated);
      }
    });

    // Recorrer observaciones de todos los documentos para extraer tags existentes
    this.documents.forEach(doc => {
      if (doc.observacion && doc.observacion.trim() !== "") {
        collectedTags.add(doc.observacion.trim().toUpperCase());
      }
    });

    this.existingTags = Array.from(collectedTags).sort();

    this.documentGroups = Array.from(groupsMap.entries()).map(([name, docs]) => ({
      name,
      docs: docs.sort((a, b) => a.nombres_apellidos.localeCompare(b.nombres_apellidos)),
    })).sort((a, b) => a.name.localeCompare(b.name));

    this.flatDocuments = flatList.sort((a, b) => a.nombres_apellidos.localeCompare(b.nombres_apellidos));
  }

  public toggleDocGroup(groupName: string, event: MouseEvent): void {
    event.stopPropagation();
    this.expandedDocGroups[groupName] = !this.expandedDocGroups[groupName];
    this.cdr.detectChanges();
  }

  public isDocGroupExpanded(groupName: string): boolean {
    return this.expandedDocGroups[groupName] === true; // collapsed by default
  }

  public saveDocumentTags(): void {
    try {
      localStorage.setItem('tinder_document_tags', JSON.stringify(this.documentTags));
    } catch (e) {
      console.error("Error writing document tags to localStorage:", e);
    }
    this.processDocumentsGrouping();
    this.cdr.detectChanges();
  }

  public setDocPriority(doc: any, priority: string): void {
    if (!doc) return;
    const key = doc.digital || doc.anom || doc.cedula;
    if (!this.documentTags[key]) {
      this.documentTags[key] = { priority: 'Normal', tag: '' };
    }
    this.documentTags[key].priority = priority;
    this.saveDocumentTags();
    this.closeContextMenu();
  }

  public async apiActualizarEtiqueta(numeroCarpeta: string, etiqueta: string): Promise<any> {
    const xAPI = {} as IAPICore;
    xAPI.funcion = environment.funcion.ACTUALIZAR_CARPETA_ETIQUETA;
    xAPI.parametros = `${numeroCarpeta},${etiqueta}`;
    xAPI.valores = "";
    try {
      return await this.apiService.Ejecutar(xAPI).toPromise();
    } catch (e) {
      console.error(`Error actualizando etiqueta para carpeta ${numeroCarpeta}:`, e);
      throw e;
    }
  }

  public setDocTag(doc: any): void {
    if (!doc) return;
    this.closeContextMenu();
    const key = doc.digital || doc.anom || doc.cedula;
    const currentTag = this.documentTags[key]?.tag || "";

    const options: { [key: string]: string } = {};
    this.existingTags.forEach(t => {
      options[t] = t;
    });
    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    let defaultVal = currentTag;
    if (!defaultVal || !this.existingTags.includes(defaultVal)) {
      defaultVal = "__NEW__";
    }

    Swal.fire({
      title: 'Asignar Etiqueta',
      input: 'select',
      inputLabel: 'Seleccione una etiqueta existente o cree una nueva',
      inputValue: defaultVal,
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary',
        input: 'swal-select-custom'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        const selection = result.value;
        if (selection === "__NEW__") {
          setTimeout(() => {
            Swal.fire({
              title: 'Crear Nueva Etiqueta',
              input: 'text',
              inputLabel: 'Escriba el nombre de la nueva etiqueta',
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar',
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary',
                input: 'swal-input-custom'
              },
              buttonsStyling: false,
              inputValidator: (val) => {
                if (!val || val.trim() === "") {
                  return '¡Debe ingresar un nombre para la etiqueta!';
                }
                return null;
              }
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
      this.documentTags[key] = { priority: 'Normal', tag: '' };
    }
    this.documentTags[key].tag = tagValue;
    this.saveDocumentTags();

    // Persistir en base de datos
    this.apiActualizarEtiqueta(key, tagValue).then(
      () => this.toastrService.success(`Etiqueta "${tagValue}" guardada en base de datos.`, "Éxito"),
      () => this.toastrService.error("No se pudo guardar la etiqueta en el servidor.", "Error")
    );
  }

  public isDocSelected(doc: any): boolean {
    const key = doc.digital || doc.anom || doc.cedula;
    return this.selectedDocsSet.has(key);
  }

  public toggleDocSelection(doc: any, event: any): void {
    const key = doc.digital || doc.anom || doc.cedula;
    if (event.target.checked) {
      this.selectedDocsSet.add(key);
    } else {
      this.selectedDocsSet.delete(key);
    }
    this.cdr.detectChanges();
  }

  public clearDocSelection(): void {
    this.selectedDocsSet.clear();
    this.cdr.detectChanges();
  }

  public assignTagToSelectedDocs(): void {
    if (this.selectedDocsSet.size === 0) return;

    const options: { [key: string]: string } = {};
    this.existingTags.forEach(t => {
      options[t] = t;
    });
    options["__NEW__"] = "+ Crear Nueva Etiqueta...";

    Swal.fire({
      title: 'Asignar Etiqueta a Seleccionados',
      input: 'select',
      inputLabel: 'Seleccione una etiqueta existente o cree una nueva para las carpetas seleccionadas',
      inputValue: "__NEW__",
      inputOptions: options,
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary',
        input: 'swal-select-custom'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        const selection = result.value;
        if (selection === "__NEW__") {
          setTimeout(() => {
            Swal.fire({
              title: 'Crear Nueva Etiqueta',
              input: 'text',
              inputLabel: 'Escriba el nombre de la nueva etiqueta',
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar',
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary',
                input: 'swal-input-custom'
              },
              buttonsStyling: false,
              inputValidator: (val) => {
                if (!val || val.trim() === "") {
                  return '¡Debe ingresar un nombre!';
                }
                return null;
              }
            }).then((textResult) => {
              if (textResult.isConfirmed) {
                const newTag = textResult.value.trim().toUpperCase();
                this.applyBatchTag(newTag);
              }
            });
          }, 150);
        } else if (selection) {
          this.applyBatchTag(selection);
        }
      }
    });
  }

  private applyBatchTag(tagValue: string): void {
    const promises: Promise<any>[] = [];

    this.selectedDocsSet.forEach(key => {
      if (!this.documentTags[key]) {
        this.documentTags[key] = { priority: 'Normal', tag: '' };
      }
      this.documentTags[key].tag = tagValue;
      promises.push(this.apiActualizarEtiqueta(key, tagValue));
    });

    Promise.all(promises).then(
      () => this.toastrService.success("Etiquetas actualizadas en base de datos.", "Éxito"),
      (err) => {
        console.error("Error updating tags in batch:", err);
        this.toastrService.warning("Algunas etiquetas no se guardaron en el servidor.", "Advertencia");
      }
    );

    this.saveDocumentTags();
    this.clearDocSelection();
  }

  public assignPriorityToSelectedDocs(priority: string): void {
    if (this.selectedDocsSet.size === 0) return;
    this.selectedDocsSet.forEach(key => {
      if (!this.documentTags[key]) {
        this.documentTags[key] = { priority: 'Normal', tag: '' };
      }
      this.documentTags[key].priority = priority;
    });
    this.saveDocumentTags();
    this.clearDocSelection();
  }
}
