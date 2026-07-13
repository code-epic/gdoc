import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
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

/**
 * ResueltosIosComponent
 * Modo tarjeta (Tinder/Typeless) optimizado para iOS/iPad/Safari.
 * No embebe PDFs (WebKit iOS no lo permite); en su lugar muestra
 * tarjetas con metadata y un botón "Ver PDF" que abre el documento
 * en el visor nativo del sistema.
 */
@Component({
  selector: "app-resueltos-ios",
  templateUrl: "./resueltos_ios.component.html",
  styleUrls: ["./resueltos_ios.component.scss"],
})
export class ResueltosIosComponent implements OnInit, OnDestroy {
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

  // Loading flags
  public loadingFolders = false;
  public loadingDocuments = false;
  public actionLoading = false;
  public openingPdf = false;

  // Componentes map
  public componentMap: { [key: number]: string } = {};

  // Context menu
  public contextMenuVisible = false;
  public contextMenuCoords = { x: 0, y: 0 };
  public contextMenuType: "folder" | "document" | "" = "";
  public contextMenuData: any = null;
  public contextMenuIndex = -1;

  // Vista tarjeta
  public cardMode = false;
  public currentDocIndex = -1;
  public observations = "";
  public swipeState: "" | "swiping-right" | "swiping-left" | "approved" | "rejected" = "";

  // Mobile master-detail
  public mobileView: "folders" | "documents" = "folders";
  public isMobile = false;
  private resizeListener: (() => void) | null = null;

  // JWT
  public jwtData = { userId: "", userName: "", userRole: "" };

  // API
  public xAPI: IAPICore = { funcion: "", parametros: "", valores: "" };

  // Flag de PDF real vs demo
  public activar_pdf = false;

  // Touch tracking
  private touchStartX = 0;
  private touchCurrentX = 0;
  private isDragging = false;

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
    document.documentElement.classList.add("immersive-active");
    this.checkMobile();
    this.resizeListener = () => this.checkMobile();
    window.addEventListener("resize", this.resizeListener);
    this.loadComponentMap();
    this.decodeUserToken();
    this.loadFolders();
  }

  ngOnDestroy(): void {
    document.body.classList.remove("immersive-active");
    document.documentElement.classList.remove("immersive-active");
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.mobileView = "folders";
    }
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
      1: "#5dbe8e",
      2: "#6dc0d5",
      3: "#7b8edc",
      4: "#e07a8e",
      5: "#e6c974",
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
            userName: decoded.Usuario.nombre || decoded.Usuario.usuario || "",
            userRole: decoded.Usuario.tipo || "Usuario",
          };
        }
      }
      if (!this.jwtData.userId && this.loginService.Usuario) {
        this.jwtData = {
          userId: this.loginService.Usuario.id || "",
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
    this.ngxService.startLoader("ld-folders-ios");
    this.xAPI = { funcion: environment.funcion.GRUPO_CARPETA_ENTRADA, parametros: "36", valores: "" };

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
        this.ngxService.stopLoader("ld-folders-ios");
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error cargando carpetas:", error);
        this.toastrService.error("Error de conexión al cargar carpetas", "Buzón Resueltos");
        this.loadingFolders = false;
        this.ngxService.stopLoader("ld-folders-ios");
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
    this.totalPages = Math.max(1, Math.ceil(this.filteredFolders.length / this.pageSize));
    if (this.folderPage > this.totalPages) this.folderPage = this.totalPages;

    const start = (this.folderPage - 1) * this.pageSize;
    this.paginatedFolders = this.filteredFolders.slice(start, start + this.pageSize);
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
    if (this.isMobile) {
      this.mobileView = "documents";
    }
  }

  public backToFolders(): void {
    this.mobileView = "folders";
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
          this.documents = data.Cuerpo.map((e: any) => ({ ...e, completed: false }));
        }
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

  // ── Vista tarjeta ─────────────────────────────────────
  public enterCardMode(index: number): void {
    if (this.documents.length === 0) return;
    console.log('[resueltos_ios] enterCardMode', index, 'docs', this.documents.length);
    this.currentDocIndex = index;
    this.observations = "";
    this.cardMode = true;
    this.swipeState = "";
    this.cdr.detectChanges();
    setTimeout(() => {
      console.log('[resueltos_ios] cardMode after CD', this.cardMode, 'cardView element', document.querySelector('.rios-card-view'));
    }, 0);
  }

  public enterCardModeFromFolder(): void {
    if (this.documents.length > 0) {
      this.enterCardMode(0);
    } else {
      this.toastrService.warning("La carpeta seleccionada no tiene documentos.");
    }
  }

  public exitCardMode(): void {
    this.cardMode = false;
    this.currentDocIndex = -1;
    this.observations = "";
    this.swipeState = "";
    this.cdr.detectChanges();
  }

  get activeDoc(): any {
    return this.documents[this.currentDocIndex] || null;
  }

  get hasPrev(): boolean {
    return this.currentDocIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentDocIndex < this.documents.length - 1;
  }

  // ── Apertura de PDF (nativo iOS) ──────────────────────
  public async openCurrentPdf(): Promise<void> {
    if (!this.activeDoc) return;
    this.openingPdf = true;

    try {
      const url = this.resolvePdfUrl(this.activeDoc);
      if (!url) {
        this.toastrService.warning("Este documento no tiene PDF asociado.");
        this.openingPdf = false;
        return;
      }

      // Demo: archivo local
      if (!this.activar_pdf) {
        this.openUrl(url);
        this.openingPdf = false;
        return;
      }

      // Fetch con auth → data URL
      const token = sessionStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = "Bearer " + token;

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (blob.size === 0) throw new Error("PDF vacío");

      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          this.openUrl(reader.result as string);
        }
        this.openingPdf = false;
        this.cdr.detectChanges();
      };
      reader.onerror = () => {
        this.toastrService.error("Error leyendo el PDF");
        this.openingPdf = false;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(pdfBlob);
    } catch (err: any) {
      console.error("Error abriendo PDF:", err);
      this.toastrService.error(err.message || "Error abriendo PDF");
      this.openingPdf = false;
      this.cdr.detectChanges();
    }
  }

  private openUrl(url: string): void {
    const win = window.open(url, "_blank");
    if (!win || win.closed || typeof win.closed === "undefined") {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  private resolvePdfUrl(doc: any): string {
    if (!this.activar_pdf) {
      return "assets/000643.pdf";
    }
    const ncontrol = doc.ncontrol || doc.numc || "0";
    const archivo = doc.archivo || doc.anom || "";
    if (!archivo) return "";
    const peticion = btoa("D" + ncontrol) + "/" + archivo;
    return this.apiService.URL + "dws/" + peticion;
  }

  // ── Swipe / touch gestures ────────────────────────────
  public onTouchStart(e: TouchEvent): void {
    if (this.actionLoading || this.openingPdf) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
    this.isDragging = true;
    this.swipeState = "";
  }

  public onTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return;
    this.touchCurrentX = e.touches[0].clientX;
    const diff = this.touchCurrentX - this.touchStartX;

    if (Math.abs(diff) > 20) {
      this.swipeState = diff > 0 ? "swiping-right" : "swiping-left";
    } else {
      this.swipeState = "";
    }
  }

  public onTouchEnd(e: TouchEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = this.touchCurrentX - this.touchStartX;
    const threshold = 80;

    if (diff > threshold) {
      this.approveCurrent();
    } else if (diff < -threshold) {
      this.rejectCurrent();
    } else {
      this.swipeState = "";
    }
  }

  // ── Acciones ──────────────────────────────────────────
  public approveCurrent(): void {
    if (!this.activeDoc || this.actionLoading) return;

    if (this.swipeState !== "approved") {
      this.swipeState = "approved";
      setTimeout(() => this.executeApprove(), 250);
    } else {
      this.executeApprove();
    }
  }

  private executeApprove(): void {
    const doc = this.activeDoc;
    if (!doc) return;

    this.actionLoading = true;
    this.ngxService.startLoader("ld-approve-ios");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment = this.observations.trim()
      ? this.observations.toUpperCase()
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

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        this.xAPI = {
          funcion: environment.funcion.PROMOVER_ESTATUS,
          parametros: `2,${userDb},${controlId}`,
          valores: "",
        };
        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(`Documento ${controlId} firmado y aprobado`, "Resoluciones");
            this.removeCurrentDoc();
            this.actionLoading = false;
            this.ngxService.stopLoader("ld-approve-ios");
            this.advanceOrExit();
          },
          (err) => {
            console.error("Error promoviendo estatus:", err);
            this.toastrService.error("Error al aplicar firma/sello digital");
            this.actionLoading = false;
            this.ngxService.stopLoader("ld-approve-ios");
            this.swipeState = "";
            this.cdr.detectChanges();
          },
        );
      },
      (err) => {
        console.error("Error guardando observación:", err);
        this.toastrService.error("No se pudo registrar la aprobación");
        this.actionLoading = false;
        this.ngxService.stopLoader("ld-approve-ios");
        this.swipeState = "";
        this.cdr.detectChanges();
      },
    );
  }

  public rejectCurrent(): void {
    if (!this.activeDoc || this.actionLoading) return;

    if (this.observations.trim() === "") {
      this.swipeState = "swiping-left";
      this.toastrService.warning("Ingrese una observación para rechazar");
      setTimeout(() => {
        if (this.swipeState === "swiping-left") this.swipeState = "";
      }, 400);
      return;
    }

    this.swipeState = "rejected";
    setTimeout(() => this.executeReject(), 250);
  }

  private executeReject(): void {
    const doc = this.activeDoc;
    if (!doc) return;

    this.actionLoading = true;
    this.ngxService.startLoader("ld-reject-ios");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment = this.observations.toUpperCase();

    this.xAPI = {
      funcion: environment.funcion.DOCUMENTO_OBSERVACION,
      parametros: "",
      valores: JSON.stringify({
        documento: controlId,
        estado: doc.ultimo_estado || doc.estatus || 36,
        estatus: doc.ultimo_estado || 36,
        observacion: comment,
        accion: "1",
        usuario: userDb,
      }),
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        this.xAPI = {
          funcion: environment.funcion.UBICACION_RECHAZO,
          parametros: `1,1,1,,${userDb},${controlId}`,
          valores: "",
        };
        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(`Documento ${controlId} rechazado y devuelto`, "Resoluciones");
            this.removeCurrentDoc();
            this.actionLoading = false;
            this.ngxService.stopLoader("ld-reject-ios");
            this.advanceOrExit();
          },
          (err) => {
            console.error("Error en rechazo:", err);
            this.toastrService.error("Error al devolver el documento");
            this.actionLoading = false;
            this.ngxService.stopLoader("ld-reject-ios");
            this.swipeState = "";
            this.cdr.detectChanges();
          },
        );
      },
      (err) => {
        console.error("Error registrando observación:", err);
        this.toastrService.error("Error al procesar la observación");
        this.actionLoading = false;
        this.ngxService.stopLoader("ld-reject-ios");
        this.swipeState = "";
        this.cdr.detectChanges();
      },
    );
  }

  private removeCurrentDoc(): void {
    if (this.currentDocIndex > -1 && this.currentDocIndex < this.documents.length) {
      this.documents.splice(this.currentDocIndex, 1);
    }
  }

  private advanceOrExit(): void {
    if (this.documents.length === 0) {
      this.exitCardMode();
      this.selectedFolder = null;
      this.loadFolders();
      return;
    }
    if (this.currentDocIndex >= this.documents.length) {
      this.currentDocIndex = this.documents.length - 1;
    }
    this.observations = "";
    this.swipeState = "";
    this.cdr.detectChanges();
  }

  public nextDoc(): void {
    if (this.hasNext && !this.actionLoading) {
      this.swipeState = "";
      this.currentDocIndex++;
      this.observations = "";
      this.cdr.detectChanges();
    }
  }

  public prevDoc(): void {
    if (this.hasPrev && !this.actionLoading) {
      this.swipeState = "";
      this.currentDocIndex--;
      this.observations = "";
      this.cdr.detectChanges();
    }
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
      this.ngxService.startLoader("ld-fast-ios");
      this.saveObservationAndPromote(doc, userDb, "APROBADO MEDIANTE ACCIÓN RÁPIDA", "ld-fast-ios");
    });
  }

  public promptReject(doc: any): void {
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
      this.ngxService.startLoader("ld-fast-reject-ios");
      this.saveObservationAndReject(doc, userDb, result.value.toUpperCase(), "ld-fast-reject-ios");
    });
  }

  private saveObservationAndPromote(doc: any, userDb: string, comment: string, loaderId: string): void {
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
            this.toastrService.success(`Documento ${doc.ncontrol || doc.numc} firmado`);
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

  private saveObservationAndReject(doc: any, userDb: string, comment: string, loaderId: string): void {
    this.xAPI = {
      funcion: environment.funcion.DOCUMENTO_OBSERVACION,
      parametros: "",
      valores: JSON.stringify({
        documento: doc.ncontrol || doc.numc,
        estado: doc.ultimo_estado || doc.estatus || 36,
        estatus: doc.ultimo_estado || 36,
        observacion: comment,
        accion: "1",
        usuario: userDb,
      }),
    };

    this.apiService.Ejecutar(this.xAPI).subscribe(
      () => {
        this.xAPI = {
          funcion: environment.funcion.UBICACION_RECHAZO,
          parametros: `1,1,1,,${userDb},${doc.ncontrol || doc.numc}`,
          valores: "",
        };
        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            this.toastrService.success(`Documento ${doc.ncontrol || doc.numc} devuelto`);
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

  public onDocumentRightClick(event: MouseEvent, doc: any, index: number): void {
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

  // ── Keyboard ──────────────────────────────────────────
  public onKeyDown(event: KeyboardEvent): void {
    if (!this.cardMode || this.actionLoading) return;
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT") return;

    switch (event.key) {
      case "ArrowLeft":
        this.prevDoc();
        event.preventDefault();
        break;
      case "ArrowRight":
      case " ":
        this.nextDoc();
        event.preventDefault();
        break;
      case "a":
      case "A":
        this.approveCurrent();
        event.preventDefault();
        break;
      case "r":
      case "R":
        this.rejectCurrent();
        event.preventDefault();
        break;
      case "Escape":
        this.exitCardMode();
        event.preventDefault();
        break;
    }
  }
}
