import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
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
  @ViewChild("tinderViewer") tinderViewer!: TinderPdfViewerComponent;

  // Vista Explorador
  public allFolders: any[] = [];
  public filteredFolders: any[] = [];
  public paginatedFolders: any[] = [];
  public selectedFolder: any = null;
  public documents: any[] = [];

  // Paginación y Filtros de Carpetas
  public activeComponentFilter = "ALL";
  public folderSearchQuery = "";
  public folderPage = 1;
  public totalPages = 1;
  public folderPageSize = 5;

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
  public jwtData: { userId: string; userName: string; userRole: string } = {
    userId: "",
    userName: "",
    userRole: "",
  };

  // API core object
  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public resolvePdfUrl = (doc: any): string => {
    if (!this.activar_pdf) {
      return "assets/000643.pdf";
    }
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
        if (decoded && decoded.Usuario) {
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
      console.error("Error al decodificar JWT:", e);
    }
  }

  // --- LOGICA EXPLORADOR (CARPETAS Y DOCUMENTOS) ---
  public loadFolders() {
    this.loadingExplorer = true;
    this.ngxService.startLoader("ld-folders-ok");

    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.CONSULTAR_ENTRADAS_TIPO;
    this.xAPI.parametros = "36"; // Resoluciones procesadas
    this.xAPI.valores = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        try {
          if (data && data.Cuerpo) {
            this.allFolders = data.Cuerpo.map((e) => ({
              codigo: e.codigo,
              tipo: e.tipo,
              c_tipo: e.c_tipo,
              fecha: e.fecha,
            }));
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
        this.toastrService.error(
          "Error de conexión al cargar carpetas",
          "Buzón Resueltos",
        );
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
    // Se envía el código del tipo y estatus 36.
    // NOTA: Ajustar parámetros según lo que requiera la API ahora.
    this.xAPI.parametros = `${folder.codigo}`;
    this.xAPI.valores = null;

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data && data.Cuerpo) {
          this.documents = data.Cuerpo.map((e) => {
            e.completed = false;
            return e;
          });
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
  public startImmersiveMode(startIndex: number) {
    if (this.documents.length === 0) {
      return;
    }
    console.log(
      "[resueltos_ok] startImmersiveMode",
      startIndex,
      "docs",
      this.documents.length,
    );
    this.immersiveMode = true;
    this.currentDocIndex = startIndex;
    this.activeDoc = this.documents[this.currentDocIndex];
    this.documentObservations = "";
    this.changeDetector.detectChanges();
    setTimeout(() => {
      console.log(
        "[resueltos_ok] immersiveMode after CD",
        this.immersiveMode,
        "tinder element",
        document.querySelector("app-tinder-pdf-viewer"),
      );
    }, 0);
  }

  public startImmersiveFromFolder() {
    if (this.selectedFolder) {
      if (this.documents.length > 0) {
        this.startImmersiveMode(0);
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
  }

  /** Cuando el hijo emite approve */
  public onTinderApprove(action: PdfAction) {
    this.documentObservations = action.observations;
    this.approveDocument(action.doc);
  }

  /** Cuando el hijo emite reject */
  public onTinderReject(action: PdfAction) {
    this.documentObservations = action.observations;
    this.rejectDocument(action.doc);
  }

  /** Cuando el hijo emite close */
  public onTinderClose() {
    this.exitImmersiveMode();
  }

  /** Cuando el hijo tiene error de carga PDF */
  public onTinderPdfError(msg: string) {
    console.warn("PDF load error from viewer:", msg);
  }

  private loadActivePdf() {
    if (!this.activeDoc) {
      return;
    }
    this.loadingPdf = true;
    this.pdfUrl = null;
    this.rawPdfUrl = null;

    if (!this.activar_pdf) {
      // Simulación con archivo de ejemplo local
      this.pdfUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl("assets/000643.pdf");
      this.rawPdfUrl = "assets/000643.pdf";
      this.loadingPdf = false;
      this.changeDetector.detectChanges();
      return;
    }

    const ncontrol = this.activeDoc.ncontrol || this.activeDoc.numc || "0";
    const archivo = this.activeDoc.archivo || this.activeDoc.anom || "";

    if (archivo === "") {
      Swal.fire(
        "Atención",
        "Este documento no posee un archivo PDF asociado.",
        "warning",
      );
      this.loadingPdf = false;
      this.changeDetector.detectChanges();
      return;
    }

    const peticion = btoa("D" + ncontrol) + "/" + archivo;
    const url = this.apiService.URL + "dws/" + peticion;
    const downloadUrl = this.apiService.Dws(peticion);

    // Detección de iOS / iPadOS Safari
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // En iOS Safari / iPad, usamos directamente la URL de descarga para evitar
      // el bloqueo de URLs tipo blob: en iframes.
      this.rawPdfUrl = downloadUrl;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(downloadUrl);
      setTimeout(() => {
        this.loadingPdf = false;
        this.changeDetector.detectChanges();
      }, 800);
      return;
    }

    const headers = new Headers({
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    });

    fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "HTTP status " + response.status + " - " + response.statusText,
          );
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob.size === 0) {
          throw new Error("El PDF recibido está vacío (0 bytes).");
        }
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.rawPdfUrl = blobUrl;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        setTimeout(() => {
          this.loadingPdf = false;
          this.changeDetector.detectChanges();
        }, 800);
      })
      .catch((error) => {
        console.error("Error fetching PDF blob:", error);
        Swal.fire({
          title: "Error cargando PDF",
          text: `Se produjo un error al descargar el PDF: ${error.message || error}\nLa aplicación intentará usar el enlace directo de descarga.`,
          icon: "error",
        });
        this.rawPdfUrl = downloadUrl;
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(downloadUrl);
        this.loadingPdf = false;
        this.changeDetector.detectChanges();
      });
  }

  public onPdfLoaded() {
    this.loadingPdf = false;
    this.changeDetector.detectChanges();
  }

  // Desplazamiento Tinder (padre sincroniza estado con el hijo)
  public async nextDocument() {
    if (this.currentDocIndex < this.documents.length - 1) {
      this.currentDocIndex++;
      this.activeDoc = this.documents[this.currentDocIndex];
      this.documentObservations = "";
    }
  }

  public async prevDocument() {
    if (this.currentDocIndex > 0) {
      this.currentDocIndex--;
      this.activeDoc = this.documents[this.currentDocIndex];
      this.documentObservations = "";
    }
  }

  // --- ACCIONES TINDER (APROBAR / RECHAZAR) ---
  public async approveDocument(docOverride?: any) {
    const doc = docOverride || this.activeDoc;
    if (!doc || this.actionExecuting) {
      return;
    }

    this.actionExecuting = true;
    this.executingType = "approve";
    this.ngxService.startLoader("ld-approve");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment =
      this.documentObservations.trim() !== ""
        ? this.documentObservations.toUpperCase()
        : "APROBADO E INYECTADO CON FIRMA Y SELLO DIGITAL";

    // 1. Guardar Observación
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
    this.xAPI.valores = JSON.stringify({
      documento: controlId,
      estado: doc.ultimo_estado || doc.estatus || 36,
      estatus: 2,
      observacion: comment,
      accion: "0",
      usuario: userDb,
    });
    this.xAPI.parametros = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (obsRes) => {
        // 2. Promover Estatus (Inyección Firma y Sello backend)
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
        this.xAPI.valores = "";
        this.xAPI.parametros = `2,${userDb},${controlId}`;

        this.apiService.Ejecutar(this.xAPI).subscribe(
          (promoRes) => {
            this.toastrService.success(
              `Documento ${controlId} firmado y aprobado con éxito`,
              "Resoluciones",
            );
            this.removeApprovedDocFromVector();

            this.actionExecuting = false;
            this.executingType = "";
            this.ngxService.stopLoader("ld-approve");

            if (this.documents.length > 0) {
              if (this.currentDocIndex >= this.documents.length) {
                this.currentDocIndex = this.documents.length - 1;
              }
              this.activeDoc = this.documents[this.currentDocIndex];
              this.loadActivePdf();
            } else {
              this.exitImmersiveMode();
              this.selectedFolder = null;
              this.loadFolders();
            }
          },
          (promoError) => {
            console.error("Error al promover estatus:", promoError);
            this.toastrService.error("Error al aplicar firma/sello digital");
            this.actionExecuting = false;
            this.executingType = "";
            this.ngxService.stopLoader("ld-approve");
            this.changeDetector.detectChanges();
          },
        );
      },
      (obsError) => {
        console.error("Error al guardar la observación:", obsError);
        this.toastrService.error("No se pudo registrar la aprobación.");
        this.actionExecuting = false;
        this.executingType = "";
        this.ngxService.stopLoader("ld-approve");
        this.changeDetector.detectChanges();
      },
    );
  }

  public async rejectDocument(docOverride?: any) {
    const doc = docOverride || this.activeDoc;
    if (!doc || this.actionExecuting) {
      return;
    }

    if (this.documentObservations.trim() === "") {
      Swal.fire({
        title: "Motivo de Rechazo Requerido",
        text: "Debe ingresar una observación que justifique el rechazo en el panel de la derecha.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    this.actionExecuting = true;
    this.executingType = "reject";
    this.ngxService.startLoader("ld-reject");

    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;
    const comment = this.documentObservations.toUpperCase();

    // 1. Guardar Observación con acción '1' (Rechazo)
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
    this.xAPI.valores = JSON.stringify({
      documento: controlId,
      estado: doc.ultimo_estado || doc.estatus || 36,
      estatus: doc.ultimo_estado || 36,
      observacion: comment,
      accion: "1",
      usuario: userDb,
    });
    this.xAPI.parametros = "";

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (obsRes) => {
        // 2. Retorno de Ubicación / Rechazo
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = environment.funcion.UBICACION_RECHAZO;
        this.xAPI.valores = "";
        this.xAPI.parametros = `1,1,1,,${userDb},${controlId}`;

        this.apiService.Ejecutar(this.xAPI).subscribe(
          (rejectRes) => {
            this.toastrService.success(
              `Documento ${controlId} rechazado y devuelto a origen`,
              "Resoluciones",
            );
            this.removeApprovedDocFromVector();

            this.actionExecuting = false;
            this.executingType = "";
            this.ngxService.stopLoader("ld-reject");

            if (this.documents.length > 0) {
              if (this.currentDocIndex >= this.documents.length) {
                this.currentDocIndex = this.documents.length - 1;
              }
              this.activeDoc = this.documents[this.currentDocIndex];
              this.loadActivePdf();
            } else {
              this.exitImmersiveMode();
              this.selectedFolder = null;
              this.loadFolders();
            }
          },
          (rejectError) => {
            console.error("Error en rechazo/retorno:", rejectError);
            this.toastrService.error("Error al devolver el documento.");
            this.actionExecuting = false;
            this.executingType = "";
            this.ngxService.stopLoader("ld-reject");
            this.changeDetector.detectChanges();
          },
        );
      },
      (obsError) => {
        console.error("Error al registrar observación de rechazo:", obsError);
        this.toastrService.error("Error al procesar la observación.");
        this.actionExecuting = false;
        this.executingType = "";
        this.ngxService.stopLoader("ld-reject");
        this.changeDetector.detectChanges();
      },
    );
  }

  public async approveFast(doc: any) {
    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;

    Swal.fire({
      title: "Aprobación Rápida",
      text: `¿Está seguro de firmar y aprobar el documento ${controlId} directamente?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2dce89",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, firmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ngxService.startLoader("ld-fast");

        // Guardar Obs
        this.xAPI = {} as IAPICore;
        this.xAPI.funcion = environment.funcion.DOCUMENTO_OBSERVACION;
        this.xAPI.valores = JSON.stringify({
          documento: controlId,
          estado: doc.ultimo_estado || doc.estatus || 36,
          estatus: 2,
          observacion: "APROBADO E INYECTADO MEDIANTE ACCIÓN RÁPIDA",
          accion: "0",
          usuario: userDb,
        });
        this.xAPI.parametros = "";

        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            // Promover
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.PROMOVER_ESTATUS;
            this.xAPI.valores = "";
            this.xAPI.parametros = `2,${userDb},${controlId}`;

            this.apiService.Ejecutar(this.xAPI).subscribe(
              () => {
                this.toastrService.success(
                  `Documento ${controlId} firmado con éxito`,
                );
                this.documents = this.documents.filter(
                  (d) => (d.ncontrol || d.numc) !== controlId,
                );
                this.ngxService.stopLoader("ld-fast");

                if (this.documents.length === 0) {
                  this.selectedFolder = null;
                  this.loadFolders();
                } else {
                  this.changeDetector.detectChanges();
                }
              },
              (err) => {
                console.error(err);
                this.toastrService.error("Error al promover estado.");
                this.ngxService.stopLoader("ld-fast");
                this.changeDetector.detectChanges();
              },
            );
          },
          (err) => {
            console.error(err);
            this.toastrService.error("Error al registrar aprobación.");
            this.ngxService.stopLoader("ld-fast");
            this.changeDetector.detectChanges();
          },
        );
      }
    });
  }

  public promptReject(doc: any) {
    const controlId = doc.ncontrol || doc.numc;
    const userDb = this.jwtData.userId;

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
          estatus: doc.ultimo_estado || 36,
          observacion: result.value.toUpperCase(),
          accion: "1",
          usuario: userDb,
        });
        this.xAPI.parametros = "";

        this.apiService.Ejecutar(this.xAPI).subscribe(
          () => {
            // Ubicación Rechazo
            this.xAPI = {} as IAPICore;
            this.xAPI.funcion = environment.funcion.UBICACION_RECHAZO;
            this.xAPI.valores = "";
            this.xAPI.parametros = `1,1,1,,${userDb},${controlId}`;

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
}
