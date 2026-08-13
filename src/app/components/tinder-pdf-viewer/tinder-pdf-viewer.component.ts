import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { environment } from "src/environments/environment";
import { FileService } from "src/app/services/apicore/file.service";
import { HttpEventType } from "@angular/common/http";
import Swal from "sweetalert2";

/* ─── Interfaces públicas ─────────────────────────────── */

export interface DocumentComment {
  id: string;
  text: string;
  status: "pending" | "resolved";
  author: string;
  date: string;
}

export interface TinderDocument {
  cedula?: string;
  nombres_apellidos?: string;
  ncontrol?: string;
  numc?: string;
  digital?: string;
  anom?: string;
  archivo?: string;
  comentarios?: DocumentComment[];
  [key: string]: any;
}

export interface JwtUserData {
  userId: string;
  userName: string;
  userRole: string;
  userLogin?: string;
  userCedula?: string;
}

export interface PdfAction {
  doc: TinderDocument;
  observations: string;
  index: number;
}

/* ─── Componente genérico visor PDF Tinder ─────────────── */
/*  Safari-safe: <object> tag, fallback data URL, sin       */
/*  backdrop-filter, sin 100vw, sin ng-deep.               */
/*  El padre provee: documentos, resolver PDF URL,          */
/*  y maneja las acciones (aprobar/rechazar).               */
/* ──────────────────────────────────────────────────────── */

@Component({
  selector: "app-tinder-pdf-viewer",
  templateUrl: "./tinder-pdf-viewer.component.html",
  styleUrls: ["./tinder-pdf-viewer.component.scss"],
})
export class TinderPdfViewerComponent implements OnChanges, OnDestroy {
  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(event: KeyboardEvent) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (isCtrlOrCmd && (event.key === '-' || event.key === '+' || event.key === '=' || event.key === '0')) {
      event.preventDefault();
    }
  }
  /* ── Inputs ──────────────────────────────────────────── */
  @Input() documents: TinderDocument[] = [];
  @Input() startIndex = 0;
  @Input() jwtData: JwtUserData = {
    userId: "",
    userName: "",
    userRole: "",
    userLogin: "",
    userCedula: "",
  };
  @Input() loading = false;
  @Input() useCanvas = false;
  @Input() profile:
    | "Edicion"
    | "Revision"
    | "Jefe"
    | "Secretaria"
    | "Direccion"
    | "Aprobador" = "Edicion";
  @Input() approveLabel = "Aprobar y Firmar";
  @Input() rejectLabel = "Rechazar";
  @Input() approveIcon = "fas fa-signature";
  @Input() rejectIcon = "fas fa-times-circle";

  /**
   * Callback que resuelve la URL de descarga/visualización del PDF.
   * El componente llama a esta función al cambiar de documento.
   * Debe retornar la URL con autorización incluida o accesible.
   * Ejemplo: (doc) => apiService.Dws(btoa('D' + doc.ncontrol) + '/' + doc.archivo)
   */
  @Input() pdfUrlResolver: ((doc: TinderDocument) => string) | null = null;

  /* ── Outputs ─────────────────────────────────────────── */
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<PdfAction>();
  @Output() reject = new EventEmitter<PdfAction>();
  @Output() navigate = new EventEmitter<{
    doc: TinderDocument;
    index: number;
  }>();
  @Output() pdfLoadError = new EventEmitter<string>();
  @Output() sendToReview = new EventEmitter<PdfAction>();
  @Output() sendToBoss = new EventEmitter<PdfAction>();
  @Output() sendToSecretariat = new EventEmitter<PdfAction>();
  @Output() sendToDirection = new EventEmitter<PdfAction>();
  @Output() sendToMinister = new EventEmitter<PdfAction>();
  @Output() approvedAndSigned = new EventEmitter<PdfAction>();

  /* ── Estado interno ──────────────────────────────────── */
  public currentIndex = 0;
  public pdfSrc: SafeResourceUrl | null = null;
  public rawPdfUrl: string | null = null;
  public loadingPdf = false;
  public actionExecuting = false;
  public executingType:
    | "approve"
    | "reject"
    | "sendToReview"
    | "sendToBoss"
    | "sendToSecretariat"
    | "sendToDirection"
    | "sendToMinister"
    | "" = "";
  public observations = "";
  @ViewChild("resueltoCanvas") resueltoCanvas: any;

  public hasSavedState = false;
  public printModeActive = false;
  public pdfError = false;
  public pdfErrorMsg = "";
  public swipeDir: "" | "left" | "right" = "";
  public isSafari = false;
  public objectFailed = false;

  public searchCarpeta = "";
  public uniqueCarpetas: string[] = [];

  public activeTab: "explorador" | "metadata" | "comments" = "explorador";

  get pendingCommentsCount(): number {
    if (!this.activeDoc || !this.activeDoc.comentarios) return 0;
    return this.activeDoc.comentarios.filter((c) => c.status === "pending")
      .length;
  }

  public resolveComment(id: string) {
    if (!this.activeDoc || !this.activeDoc.comentarios) return;
    const comment = this.activeDoc.comentarios.find((c) => c.id === id);
    if (comment) {
      comment.status = "resolved";
      // Also notify the canvas to remove the yellow highlight if it's currently showing
      if (this.resueltoCanvas) {
        this.resueltoCanvas.removeHighlight(id);
      }
      this.saveDocumentState();
      this.cdr.detectChanges();
    }
  }

  public onCommentAdded() {
    this.syncFromCanvas();
    this.saveDocumentState();
  }

  private touchX = 0;
  private touchY = 0;
  private timer: any = null;
  private blobs: string[] = [];
  // API core object

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public nuevo_numero_resuelto: string = "";

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private fileService: FileService,
  ) {
    // Detección robusta de Safari (desktop + iOS)
    const ua = navigator.userAgent.toLowerCase();
    const isIOS =
      /ipad|iphone|ipod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafariUA = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(
      ua,
    );
    this.isSafari = isSafariUA || isIOS;
    console.log(
      "[TinderPdfViewer] isSafari=",
      this.isSafari,
      "UA=",
      navigator.userAgent,
    );
  }

  /* ── Lifecycle ───────────────────────────────────────── */

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      "[TinderPdfViewer] ngOnChanges",
      Object.keys(changes),
      "docs",
      this.documents.length,
      "startIndex",
      this.startIndex,
    );
    if (changes.documents || changes.startIndex) {
      if (changes.documents && this.documents) {
        this.extractUniqueCarpetas();
      }

      if (this.documents.length > 0) {
        const idx = changes.startIndex
          ? changes.startIndex.currentValue
          : this.currentIndex;
        this.currentIndex = Math.max(
          0,
          Math.min(idx, this.documents.length - 1),
        );
        this.loadCurrentPdf();
      }
    }
  }

  private extractUniqueCarpetas() {
    const set = new Set<string>();
    if (this.documents && this.documents.length > 0) {
      this.documents.forEach((d: any) => {
        const num = (d.numero_carpeta || d.numc || d.ncontrol || "")
          .toString()
          .trim();
        if (num && num !== "000000") {
          set.add(num);
        }
      });
    }
    this.uniqueCarpetas = Array.from(set).sort();
  }

  public goToCarpeta(folderStr: string) {
    if (!folderStr || this.actionExecuting) return;

    // Primero buscar coincidencia exacta
    const query = folderStr.trim().toLowerCase();
    let index = this.documents.findIndex((d: any) => {
      const numC = (d.numero_carpeta || d.numc || d.ncontrol || "")
        .toString()
        .toLowerCase()
        .trim();
      return numC === query;
    });

    // Si no hay exacta, buscar que lo contenga
    if (index === -1) {
      index = this.documents.findIndex((d: any) => {
        const numC = (d.numero_carpeta || d.numc || d.ncontrol || "")
          .toString()
          .toLowerCase();
        return numC.includes(query);
      });
    }

    if (index !== -1) {
      this.currentIndex = index;
      this.loadCurrentPdf();
      this.navigate.emit({ doc: this.activeDoc, index: this.currentIndex });
      this.searchCarpeta = ""; // limpiar tras selección
    } else {
      console.warn("Carpeta no encontrada:", folderStr);
    }
  }

  ngOnDestroy(): void {
    this.revokeAll();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /* ── Getters ─────────────────────────────────────────── */

  get activeDoc(): TinderDocument | null {
    return this.documents[this.currentIndex] || null;
  }

  get total(): number {
    return this.documents.length;
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex >= this.documents.length - 1;
  }

  @Input() defaultBasamentoLegal =
    `El Ministro del Poder Popular para la Defensa, GENERAL EN JEFE GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ, nombrado mediante Decreto Nº 5.277 de fecha 18 de marzo de 2026, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria Nº 6.999 de fecha 18 de marzo de 2026, en ejercicio de las atribuciones que le confiere el artículo 78 numeral 19 del Decreto N° 1.424 con Rango, Valor y Fuerza de Ley Orgánica de la Administración Pública de fecha 17 de noviembre de 2014, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria Nº 6.147 de fecha 17 de noviembre de 2014, actuando de conformidad con lo establecido en los artículos 30 y 31 numeral 8 de la Ley Constitucional de la Fuerza Armada Nacional Bolivariana, publicada en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria N° 6.508 de fecha 30 de enero de 2020,`;

  public canvasData: any = null;

  public lineSpacing = 1.15;

  public increaseLineSpacing() {
    this.lineSpacing = parseFloat((this.lineSpacing + 0.05).toFixed(2));
  }

  public decreaseLineSpacing() {
    this.lineSpacing = parseFloat(
      Math.max(0.5, this.lineSpacing - 0.05).toFixed(2),
    );
  }

  generateHeaderHtml(isFirstPage: boolean): string {
    if (!isFirstPage) return "";
    if (this.activeDoc && this.activeDoc._headerHtml) {
      return this.activeDoc._headerHtml;
    }
    const superiorUnit = "ÚNICO:";
    const asunto =
      this.activeDoc?.asunto || "Efectuar los siguientes nombramientos:";
    const subordinateUnit = "";

    return `
      <p style="margin-top: 13pt;"><strong>${superiorUnit}</strong> ${asunto}</p>
      <p style="text-align: center;"><strong>${subordinateUnit}</strong></p>
    `;
  }

  public updateCanvasData() {
    if (!this.activeDoc) {
      this.canvasData = null;
      return;
    }

    const basamentoLegalText =
      this.activeDoc.basamentoLegal ||
      this.activeDoc.preamble ||
      this.defaultBasamentoLegal;
    const cases = this.activeDoc.documentos || [];
    const pages = [];

    // --- HOJA ÚNICA CONTINUA ---
    let headerHtml =
      this.activeDoc._headerHtml || this.generateHeaderHtml(true);
    let formattedCases = cases.map((persona: any) => {
      const cedulaFormateada = String(persona.cedula || "").replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ".",
      );
      return `<p style="text-indent: 0; margin-left: 40px; margin-top: 0; margin-bottom: 6pt;">- ${persona.grado || "Ciudadano(a)"} <strong>${(persona.nombres_apellidos || persona.nombres + " " + persona.apellidos).toUpperCase()}</strong>, C.I. N° <strong>${cedulaFormateada}</strong></p>`;
    });

    let casesHtml = this.activeDoc["_pageCasesHtml_0"];
    if (casesHtml === undefined || casesHtml === null) {
      casesHtml = formattedCases.join("\n");
    } else {
      // Si el html guardado contiene el encabezado anterior de forma redundante,
      // lo limpiamos para evitar duplicación, ya que ahora unico_parrafo se renderiza por separado.
      if (
        casesHtml.includes("ÚNICO:") ||
        casesHtml.includes("unico") ||
        casesHtml.includes("Unico") ||
        casesHtml.includes("nombramiento")
      ) {
        const matchIdx = casesHtml.indexOf("&mdash;");
        if (matchIdx !== -1) {
          casesHtml = casesHtml.substring(matchIdx);
        } else {
          const matchIdx2 = casesHtml.indexOf("—");
          if (matchIdx2 !== -1) {
            casesHtml = casesHtml.substring(matchIdx2);
          }
        }
      }
    }

    pages.push({
      pageIndex: 0,
      headerHtml: "",
      casesHtml: casesHtml,
    });

    const rawDateStr = this.activeDoc.fecha_resolucion;
    let formattedDate = "";
    if (rawDateStr && rawDateStr.includes("-")) {
      const parts = rawDateStr.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parts[2];
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
        formattedDate = `${day}${months[monthNum - 1]}${year}`;
      } else {
        formattedDate = rawDateStr;
      }
    } else if (rawDateStr) {
      formattedDate = rawDateStr;
    } else {
      const rawDate = new Date();
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
      formattedDate = `${String(rawDate.getDate()).padStart(2, "0")}${months[rawDate.getMonth()]}${rawDate.getFullYear()}`;
    }

    // Asegurarse de que no queden espacios (e.g., "08 AGO 2026" -> "08AGO2026")
    formattedDate = formattedDate.replace(/\s+/g, "");

    const resNum =
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.numero_carpeta ||
      "000000";

    this.canvasData = {
      header: {
        resolutionNum: resNum,
        date: formattedDate,
        anniversaries: "216°, 167° y 27°",
      },
      bodyData: this.activeDoc, // Referencia para mutar estado directamente desde canvas
      body: {
        basamentoLegal: basamentoLegalText,
        unicoParrafo: headerHtml,
        action: "RESUELVE",
      },
      pages: pages,
      styles: this.activeDoc.styles || null,
      comentarios: this.activeDoc.comentarios || [],
      signatures: {
        initials: "LARM/JAOG/B.O.merb",
        mainSignatory: "GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ",
        signatoryTitle: "General en Jefe",
        signatoryRole: `Ministro del Poder Popular<br>para la Defensa`,
        wetStampImageUrl: "./assets/img/mppd/sello_mppd.png",
        signatureImageUrl: "./assets/img/mppd/firma_mppd.png",
      },
    };
    // console.log("[TinderPdfViewer] canvasData:", this.canvasData);
  }

  public async printCanvas() {
    // 1. Mostrar modal de carga inicial
    Swal.fire({
      title: "Generando PDF...",
      text: "Por favor espere mientras se procesa el documento.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.printModeActive = true;
    this.loadingPdf = true;

    // Limpiar espacios en blanco de la fecha de resolución antes de generar
    if (this.activeDoc?.fecha_resolucion) {
      this.activeDoc.fecha_resolucion = this.activeDoc.fecha_resolucion
        .toString()
        .replace(/\s+/g, "");
    }

    // Asignar un nuevo objeto para forzar la detección de cambios en Angular (@Input)
    if (this.canvasData?.header?.date) {
      this.canvasData = {
        ...this.canvasData,
        header: {
          ...this.canvasData.header,
          date: this.canvasData.header.date.toString().replace(/\s+/g, ""),
        },
      };
    }

    this.cdr.detectChanges();

    // LIMPIEZA FORZADA DEL DOM (Anula el caché visual de contenteditable)
    const dateSpans = document.querySelectorAll(
      ".a4-canvas .m-resolucion-lugar-fecha .variable, .a4-canvas .doc-header u",
    );
    dateSpans.forEach((span) => {
      if (
        span.textContent &&
        span.textContent.match(/[A-Z]/i) &&
        span.textContent.match(/[0-9]/)
      ) {
        span.textContent = span.textContent.replace(/\s+/g, "");
      }
    });

    // 2. Guardar y temporalmente resetear el zoom a 1.0 para evitar distorsión de escala
    let originalZoom = 1.0;
    if (this.resueltoCanvas) {
      originalZoom = this.resueltoCanvas.zoomScale || 1.0;
      this.resueltoCanvas.zoomScale = 1.0;
      this.cdr.detectChanges();
    }

    // Pequeño retardo para permitir que las firmas, sellos y el zoom se rendericen en el DOM
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // 0. Asignar nuevo numero de resolucion antes de inyectar firma y generar PDF
      await this.crearSemillero();
    } catch (e) {
      // Si falla, detenemos el flujo de firmado
      this.actionExecuting = false;
      this.printModeActive = false;
      this.loadingPdf = false;
      Swal.close();
      this.cdr.detectChanges();
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [215.9, 330.2], // Oficio (8.5 x 13 pulgadas)
      });

      const canvases = document.querySelectorAll(".a4-canvas");
      if (canvases.length > 0) {
        for (let i = 0; i < canvases.length; i++) {
          const canvasElement = canvases[i] as HTMLElement;

          const htmlCanvas = await html2canvas(canvasElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: "#ffffff",
          });

          const imgData = htmlCanvas.toDataURL("image/jpeg", 0.98);

          const pageWidth = 215.9;
          const pageHeight = 330.2; // Oficio

          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
        }
      }

      const cleanNumc = (
        this.activeDoc?.numc ||
        this.activeDoc?.ncontrol ||
        this.canvasData?.header?.resolutionNum ||
        ""
      )
        .toString()
        .replace(/[\r\n\t]+/g, "")
        .trim();
      const filename = cleanNumc
        ? `${cleanNumc}.pdf`
        : `${new Date().getTime()}.pdf`;

      // Dibujar "M P P D" verticalmente en la esquina superior derecha
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 128);
      pdf.text("M\nP\nP\nD", 195, 20);

      // Generar el blob del PDF local original
      const pdfBlob = pdf.output("blob");

      // Construir formulario multipart
      const formData = new FormData();
      formData.append("archivos", pdfBlob, filename);
      formData.append(
        "nombre",
        this.activeDoc?.signatures?.mainSignatory || "MINISTRO DE LA DEFENSA",
      );
      formData.append("locacion", "Caracas, Venezuela");
      formData.append("razon", "Firma de Resolución Ministerial");
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

      // Consumir servicio Go de firma con barras de progreso de subida
      const signedPdfBlob = await new Promise<Blob>(
        (resolvePromise, rejectPromise) => {
          this.fileService.FirmarPDFProgress(formData).subscribe(
            (event: any) => {
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
                  rejectPromise(
                    new Error(
                      "No se recibieron datos en la respuesta del servidor.",
                    ),
                  );
                }
              }
            },
            (err: any) => {
              rejectPromise(err);
            },
          );
        },
      );

      // Cerrar modal de carga con éxito
      Swal.close();

      // Ofrecer la opción de ver/descargar el documento firmado devuelto por Go
      await Swal.fire({
        title: "Proceso Completado",
        text: "El documento ha sido firmado digitalmente y guardado con éxito. ¿Desea descargar una copia firmada para verla?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, descargar",
        cancelButtonText: "No, continuar",
        confirmButtonColor: "#2dce89",
        cancelButtonColor: "#8898aa",
      }).then((resAlert) => {
        if (resAlert.isConfirmed) {
          const downloadUrl = window.URL.createObjectURL(signedPdfBlob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          if (this.resueltoCanvas) {
            this.resueltoCanvas.zoomScale = originalZoom;
          }
          this.printModeActive = false;
          this.loadingPdf = false;
          this.cdr.detectChanges();
        }
      });
    } catch (err) {
      console.error("Error generando/firmando PDF: ", err);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al generar o firmar el documento PDF.",
        icon: "error",
        confirmButtonColor: "#f5365c",
      });
    } finally {
      // 3. Restaurar zoom original y apagar modo de impresión
      if (this.resueltoCanvas) {
        this.resueltoCanvas.zoomScale = originalZoom;
      }
      this.printModeActive = false;
      this.loadingPdf = false;
      this.cdr.detectChanges();
    }
  }

  public confirmSaveDocumentState() {
    Swal.fire({
      title: "¿Guardar Cambios?",
      text: "¿Está seguro que desea guardar el progreso actual de la resolución?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#5e72e4",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDocumentState();
      }
    });
  }

  public syncFromCanvas() {
    console.log("uff control");
    if (this.resueltoCanvas && this.resueltoCanvas.documentData) {
      // Sincronizar todos los cambios del canvas a activeDoc
      this.activeDoc.basamentoLegal =
        this.resueltoCanvas.documentData.body?.basamentoLegal ||
        this.activeDoc.basamentoLegal;
      this.activeDoc._headerHtml =
        this.resueltoCanvas.documentData.body?.unicoParrafo ||
        this.activeDoc._headerHtml;

      if (this.resueltoCanvas.documentData.styles) {
        this.activeDoc.styles = JSON.parse(
          JSON.stringify(this.resueltoCanvas.documentData.styles),
        );
      }

      if (this.resueltoCanvas.documentData.comentarios) {
        this.activeDoc.comentarios = JSON.parse(
          JSON.stringify(this.resueltoCanvas.documentData.comentarios),
        );
      }

      let allCasesHtml = "";
      if (
        this.resueltoCanvas.documentData.pages &&
        this.resueltoCanvas.documentData.pages.length > 0
      ) {
        this.resueltoCanvas.documentData.pages.forEach((p: any) => {
          allCasesHtml += p.casesHtml || "";
        });
        this.activeDoc["_pageCasesHtml_0"] = allCasesHtml;
      }
    }
  }

  public saveDocumentState() {
    if (!this.activeDoc) return;

    // Asegurarnos de que tenemos los datos más recientes SIN destruir el estado actual del canvas
    this.syncFromCanvas();

    const userCed = this.jwtData?.userCedula;
    const numeroCarpeta = this.activeDoc.numero_carpeta || "000000";
    const numeroResolucion =
      this.activeDoc.numc || this.activeDoc.ncontrol || "";

    console.log(this.jwtData);

    const now = new Date();
    const editRecord = {
      usuario: userCed,
      fecha: now.toLocaleString("es-VE"),
      nombre: this.jwtData?.userName || "Usuario",
      login: this.jwtData?.userLogin || "",
    };

    if (!this.activeDoc.ediciones) {
      this.activeDoc.ediciones = [];
    }
    this.activeDoc.ediciones.push(editRecord);

    // Objeto task (lst) con todos los elementos de la resolución
    const lst = {
      fecha_resolucion: this.activeDoc.fecha_resolucion,
      numero_carpeta: numeroCarpeta,
      numero_resolucion: numeroResolucion,
      basamento_legal:
        this.activeDoc.basamentoLegal || this.defaultBasamentoLegal,
      unico_parrafo:
        this.activeDoc._headerHtml || this.generateHeaderHtml(true),
      lista_casos: this.activeDoc["_pageCasesHtml_0"] || "",
      documentos_originales: this.activeDoc.documentos || [],
      styles: this.activeDoc.styles || null,
      ediciones: this.activeDoc.ediciones,
      comentarios: this.activeDoc.comentarios || [],
    };

    let obj = {
      usuario: this.jwtData?.userId,
      numero_carpeta: numeroCarpeta,
      numero_resolucion: numeroResolucion,
      task: lst,
      fecha: new Date(),
    };

    let cl = {
      coleccion: "estatus_resolucion",
      numero_carpeta: `${numeroCarpeta}`,
      numero_resolucion: `${numeroResolucion}`,
      driver: environment.driver.PRINCIPAL,
      objeto: obj,
      donde: '{\"numero_carpeta\":\"' + numeroCarpeta + '\"}',
      upsert: true,
    };

    this.apiService.ExecColeccion(cl).subscribe(
      (res: any) => {
        console.log("Estado de resolución guardado con éxito", res);
        this.hasSavedState = true;
        Swal.fire({
          title: "¡Guardado!",
          text: "El estado del documento se ha guardado exitosamente.",
          icon: "success",
          confirmButtonColor: "#2dce89",
          confirmButtonText: "Aceptar",
        });
      },
      (err: any) => {
        console.error("Error al guardar estado de resolución", err);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al intentar guardar el estado del documento.",
          icon: "error",
          confirmButtonColor: "#f5365c",
          confirmButtonText: "Aceptar",
        });
      },
    );
  }

  public onResolutionChange(value: string) {
    this.updateActiveDoc("numc", value);
    this.updateActiveDoc("ncontrol", value);
    this.updateCanvasData();
  }

  public updateActiveDoc(field: string, value: string) {
    if (this.activeDoc) {
      if (field === "fecha_resolucion" && value) {
        this.activeDoc[field] = value.toString().replace(/\s+/g, "");
      } else {
        this.activeDoc[field] = value;
      }
    }
  }

  public onCanvasDateChange(dateStr: string) {
    if (!this.activeDoc) return;
    try {
      const cleanStr = dateStr
        .replace(/de/gi, "")
        .replace(/del/gi, "")
        .replace(/,/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const parts = cleanStr.split(" ");
      if (parts.length >= 3) {
        const day = parts[0].padStart(2, "0");
        const monthStr = parts[1].toUpperCase().substring(0, 3);
        const year = parts[2];
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
        const monthIdx = months.findIndex((m) => monthStr.startsWith(m)) + 1;
        if (monthIdx > 0 && year.length === 4) {
          this.activeDoc.fecha_resolucion = `${year}-${String(monthIdx).padStart(2, "0")}-${day}`;
          this.updateCanvasData();
          return;
        }
      }
    } catch (e) {}
    this.activeDoc.fecha_resolucion = dateStr
      ? dateStr.toString().replace(/\s+/g, "")
      : dateStr;
    this.updateCanvasData();
  }

  /* ── Navegación ──────────────────────────────────────── */

  nextDocument(): void {
    if (this.isLast || this.actionExecuting) {
      return;
    }
    this.swipeDir = "right";
    setTimeout(() => {
      this.currentIndex++;
      this.cleanState();
      this.swipeDir = "";
      const doc = this.activeDoc;
      if (doc) {
        this.navigate.emit({ doc, index: this.currentIndex });
      }
      this.loadCurrentPdf();
    }, 300);
  }

  prevDocument(): void {
    if (this.isFirst || this.actionExecuting) {
      return;
    }
    this.swipeDir = "left";
    setTimeout(() => {
      this.currentIndex--;
      this.cleanState();
      this.swipeDir = "";
      const doc = this.activeDoc;
      if (doc) {
        this.navigate.emit({ doc, index: this.currentIndex });
      }
      this.loadCurrentPdf();
    }, 300);
  }

  onClose(): void {
    this.close.emit();
  }

  /** Abre el PDF actual en una nueva pestaña (útil para Safari/iOS) */
  openPdfInNewTab(): void {
    if (!this.rawPdfUrl) {
      return;
    }
    console.log(
      "[TinderPdfViewer] openPdfInNewTab",
      this.rawPdfUrl.substring(0, 80),
    );
    const win = window.open(this.rawPdfUrl, "_blank");
    if (!win || win.closed || typeof win.closed === "undefined") {
      // Popup bloqueado: intentar con location.href
      const a = document.createElement("a");
      a.href = this.rawPdfUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /* ── Acciones ────────────────────────────────────────── */

  async onApprove(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) {
      return;
    }
    this.actionExecuting = true;
    this.executingType = "approve";

    try {
      // 1. Comportarse como "Guardar PDF": Generar, subir y firmar
      await this.printCanvas();

      // 2. Pasar al siguiente paso: FIRMADO POR MINISTRO 7766
      await this.actualizarEstatusFirma("7766");

      // 3. Emitir el ruteo para avanzar el visor al siguiente documento
      this.approvedAndSigned.emit({
        doc: this.activeDoc,
        observations: this.observations.trim(),
        index: this.currentIndex,
      });
    } catch (e) {
      console.error("[TinderPdfViewer] Error en onApprove:", e);
    } finally {
      this.actionExecuting = false;
    }
  }

  onReject(): void {
    console.log("estece quieto");
    if (this.actionExecuting || !this.activeDoc) {
      return;
    }

    const isFirstReject = this.profile === "Revision"; // Primer rechazo hacia Edición
    const hasComments =
      this.activeDoc.comentarios && this.activeDoc.comentarios.length > 0;
    const prefilledObservation =
      this.observations.trim() !== ""
        ? this.observations.trim()
        : isFirstReject && hasComments
          ? "DOCUMENTO CON COMENTARIOS/OBSERVACIONES EN EL TEXTO"
          : "";

    Swal.fire({
      title: "¿Rechazar Documento?",
      text: "Por favor confirme el rechazo y verifique el motivo:",
      input: "textarea",
      inputValue: prefilledObservation,
      inputPlaceholder:
        "Escriba las observaciones o motivos del rechazo aquí...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e07a8e",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          if (isFirstReject && hasComments) {
            return null; // Permitido si es Revisión y hay comentarios
          }
          return "Debe ingresar una observación que justifique el rechazo.";
        }
        return null;
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      this.observations = result.value
        ? result.value.trim().toUpperCase()
        : "DOCUMENTO CON COMENTARIOS EN EL TEXTO";

      this.actionExecuting = true;
      this.executingType = "reject";
      this.syncFromCanvas();
      // aqui debemos implementar el metodo de rechazo para mover y actualizar el estatus
      // hacer un regitro de rechazo a:
      // console.log("----------");
      // console.log(this.activeDoc);
      let rechazoTTL = {
        funcion: "rechazos_resolucion",
      };
      let obj = {
        usuario: this.jwtData?.userId,
        numero_carpeta: this.activeDoc.numero_carpeta,
        ncontrol_documento: this.activeDoc.ncontrol_documento,
        cedula: this.activeDoc.cedula,
        fecha_resolucion: this.activeDoc.fecha_resolucion,
        responsable: this.jwtData.userName,
        observacion: this.observations.trim(),
        // transcriptor: this.activeDoc.transcriptor,
        fecha: new Date(),
      };

      let cl = {
        coleccion: "rechazos_resolucion",
        numero_carpeta: `${this.activeDoc.numero_carpeta}`,
        numero_resolucion: `${this.activeDoc.numc}`,
        driver: environment.driver.PRINCIPAL,
        objeto: obj,
        donde: `{"numero_carpeta":"${this.activeDoc.numero_carpeta}"}`,
        upsert: true,
      };
      await this.apiService.ExecColeccion(cl).subscribe(
        (response) => {
          console.log("Se registro el rechazo a: " + this.activeDoc.ncontrol);
          console.log(response);
        },
        (error) => {
          console.error(error);
        },
      );

      this.reject.emit({
        doc: this.activeDoc,
        observations: this.observations.trim(),
        index: this.currentIndex,
      });
    });
  }

  private async actualizarEstatusFirma(estatus: string): Promise<void> {
    console.log("Alta seleccion de datos y control");
    if (!this.activeDoc) return;
    const targetDocs =
      this.activeDoc.documentos && this.activeDoc.documentos.length > 0
        ? this.activeDoc.documentos
        : [this.activeDoc];

    const numero_carpeta = this.activeDoc.numero_carpeta || "000000";

    for (const doc of targetDocs) {
      const cedulaVal = doc.cedula || doc.persona?.cedula || "";
      if (!cedulaVal) continue;

      const xAPI = {} as IAPICore;
      xAPI.funcion = environment.funcion.ACTUALIZAR_ESTATUS_FIRMA;
      xAPI.parametros = `${estatus},${cedulaVal},${numero_carpeta},${this.activeDoc.numc},${this.activeDoc.fecha_resolucion}`;
      xAPI.valores = null;
      console.log("Imprimiendo documentos en lista");

      console.log(this.activeDoc);

      console.log("FINALIZANDO ");
      try {
        await this.apiService.Ejecutar(xAPI).toPromise();
        console.log(
          `[TinderPdfViewer] Estatus de firma actualizado a ${estatus} para C.I. ${cedulaVal} en carpeta ${numero_carpeta}`,
        );
      } catch (err) {
        console.error(
          `[TinderPdfViewer] Error actualizando estatus para C.I. ${cedulaVal}:`,
          err,
        );
      }
    }
  }

  private validarResolucionYFecha(): boolean {
    if (!this.activeDoc) return false;

    const numRes = (
      this.activeDoc.numc ||
      this.activeDoc.ncontrol ||
      this.activeDoc.numero_resolucion ||
      ""
    )
      .toString()
      .trim();

    const fechaRes = (this.activeDoc.fecha_resolucion || "").toString().trim();

    if (!numRes) {
      Swal.fire({
        title: "Campo Requerido",
        text: "Por favor, ingrese el número de resolución en el lienzo antes de enviar.",
        icon: "warning",
        confirmButtonColor: "#fb6340",
      });
      return false;
    }

    if (!fechaRes) {
      Swal.fire({
        title: "Campo Requerido",
        text: "Por favor, ingrese la fecha de resolución en el lienzo antes de enviar.",
        icon: "warning",
        confirmButtonColor: "#fb6340",
      });
      return false;
    }

    return true;
  }

  async onSendToReview(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) return;
    if (!this.validarResolucionYFecha()) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Está seguro de enviar este caso a Revisión (Resolución)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No",
      confirmButtonColor: "#11cdef",
      cancelButtonColor: "#8898aa",
    });

    if (!result.isConfirmed) return;

    this.actionExecuting = true;
    this.executingType = "sendToReview";
    await this.actualizarEstatusFirma("990");
    this.sendToReview.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  async onSendToBoss(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) return;
    if (!this.validarResolucionYFecha()) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Está seguro de enviar este caso a Revisión (Jefe)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No",
      confirmButtonColor: "#172b4d",
      cancelButtonColor: "#8898aa",
    });

    if (!result.isConfirmed) return;

    this.actionExecuting = true;
    this.executingType = "sendToBoss";
    await this.actualizarEstatusFirma("991");
    this.sendToBoss.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  async onSendToSecretariat(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) return;
    if (!this.validarResolucionYFecha()) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Está seguro de enviar este caso a Revisión (Secretaría)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No",
      confirmButtonColor: "#fb6340",
      cancelButtonColor: "#8898aa",
    });

    if (!result.isConfirmed) return;

    this.actionExecuting = true;
    this.executingType = "sendToSecretariat";
    await this.actualizarEstatusFirma("930");
    this.sendToSecretariat.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  async onSendToDirection(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) return;
    if (!this.validarResolucionYFecha()) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Está seguro de enviar este caso a Revisión (Dirección)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No",
      confirmButtonColor: "#8965e0",
      cancelButtonColor: "#8898aa",
    });

    if (!result.isConfirmed) return;

    this.actionExecuting = true;
    this.executingType = "sendToDirection";
    await this.actualizarEstatusFirma("340");
    this.sendToDirection.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  async onSendToMinister(): Promise<void> {
    if (this.actionExecuting || !this.activeDoc) return;
    if (!this.validarResolucionYFecha()) return;

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `¿Está seguro de enviar este caso al Aprobador (Ministro)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No",
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
    });

    if (!result.isConfirmed) return;

    this.actionExecuting = true;
    this.executingType = "sendToMinister";
    await this.actualizarEstatusFirma("880");
    this.sendToMinister.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  /** El padre llama esto cuando la acción termina (éxito o error) */
  resetAction(): void {
    this.actionExecuting = false;
    this.executingType = "";
    this.cdr.detectChanges();
  }

  /** El padre llama esto para forzar recarga del PDF tras acción */
  reloadAfterAction(): void {
    this.resetAction();
    this.loadCurrentPdf();
  }

  /** El padre llama esto cuando se eliminaron documentos y necesita ajustar el índice */
  adjustIndexAfterRemoval(): void {
    if (this.currentIndex >= this.documents.length) {
      this.currentIndex = Math.max(0, this.documents.length - 1);
    }
    if (this.documents.length === 0) {
      this.onClose();
      return;
    }
    this.loadCurrentPdf();
  }

  /* ── Touch ───────────────────────────────────────────── */

  onTouchStart(e: TouchEvent): void {
    this.touchX = e.touches[0].clientX;
    this.touchY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent): void {
    if (this.actionExecuting) {
      return;
    }
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) > 120 && Math.abs(dy) < 100) {
      dx > 0 ? this.onApprove() : this.onReject();
    }
  }

  /* ── Keyboard ────────────────────────────────────────── */

  onKeyDown(event: KeyboardEvent): void {
    if (this.actionExecuting) {
      return;
    }
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT") {
      return;
    }

    switch (event.key) {
      case "Escape":
        this.onClose();
        event.preventDefault();
        break;
    }
  }

  /* ── Carga de PDF (Safari-safe) ──────────────────────── */

  /**
   * Carga un PDF desde una URL externa.
   * Estrategia cross-browser:
   *  - Safari/iOS: fetch con auth → blob URL → <embed>; si falla, data URL → <embed>;
   *    si aún falla, ofrece abrir en nueva pestaña.
   *  - Chrome/Firefox/Edge: fetch con auth → blob URL → <object>, fallback a data URL.
   */
  loadPdfFromUrl(url: string): void {
    console.log(
      "[TinderPdfViewer] loadPdfFromUrl",
      url,
      "isSafari=",
      this.isSafari,
    );
    this.loadingPdf = true;
    this.pdfError = false;
    this.pdfErrorMsg = "";
    this.objectFailed = false;
    this.rawPdfUrl = url;
    this.revokeAll();

    const token = sessionStorage.getItem("token") || "";
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    fetch(url, { headers })
      .then((res) => {
        const ct = res.headers.get("content-type") || "unknown";
        console.log(
          "[TinderPdfViewer] fetch status",
          res.status,
          "content-type",
          ct,
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        return res.blob();
      })
      .then((blob) => {
        console.log(
          "[TinderPdfViewer] blob size",
          blob.size,
          "type",
          blob.type,
        );
        if (blob.size === 0) {
          throw new Error("PDF vacío (0 bytes)");
        }

        if (!blob.type || blob.type === "application/octet-stream") {
          // Forzar tipo PDF
          blob = new Blob([blob], { type: "application/pdf" });
        }

        if (this.isSafari) {
          // Safari/iOS: data URL (base64) es el método más confiable.
          // Blob URLs en <embed>/<iframe> a menudo muestran PDF en blanco en Safari.
          console.log("[TinderPdfViewer] Safari → data URL directo");
          this.fallbackDataUrl(blob);
          return;
        }

        // Desktop/Android: blob URL primero
        const blobUrl = URL.createObjectURL(blob);
        this.blobs.push(blobUrl);
        this.rawPdfUrl = blobUrl;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        this.timer = setTimeout(() => {
          if (this.loadingPdf && !this.pdfError) {
            console.log("[TinderPdfViewer] blob timeout, fallback a data URL");
            this.fallbackDataUrl(blob);
          }
        }, 5000);

        this.cdr.detectChanges();
      })
      .catch((err) => {
        console.error("[TinderPdfViewer] PDF fetch error:", err);
        this.pdfError = true;
        this.pdfErrorMsg = err.message || "Error cargando PDF";
        this.loadingPdf = false;
        this.pdfLoadError.emit(this.pdfErrorMsg);
        this.cdr.detectChanges();
      });
  }

  /** Fallback: blob → data URL (funciona en Safari y todos los navegadores) */
  private fallbackDataUrl(blob: Blob): void {
    console.log("[TinderPdfViewer] fallbackDataUrl, blob size", blob.size);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const dataUrl = reader.result as string;
        this.rawPdfUrl = dataUrl;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        console.log("[TinderPdfViewer] data URL length", dataUrl.length);

        if (this.isSafari) {
          // En Safari, el data URL en <embed> a veces no dispara load.
          // Ocultamos el spinner para permitir que el visor nativo trabaje.
          setTimeout(() => {
            if (this.loadingPdf) {
              this.loadingPdf = false;
              this.cdr.detectChanges();
            }
          }, 1200);
        } else {
          this.loadingPdf = false;
        }
        this.cdr.detectChanges();
      }
    };
    reader.onerror = () => {
      console.error("[TinderPdfViewer] FileReader error");
      this.loadingPdf = false;
      this.objectFailed = true;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(blob);
  }

  /** <object> disparó load correctamente */
  onObjectLoad(): void {
    console.log("[TinderPdfViewer] onObjectLoad");
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.loadingPdf = false;
    this.cdr.detectChanges();
  }

  /** <object> falló al renderizar */
  onObjectError(): void {
    console.log("[TinderPdfViewer] onObjectError");
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.objectFailed = true;
    this.loadingPdf = false;
    this.cdr.detectChanges();
  }

  /* ── Helpers internos ────────────────────────────────── */

  public ObtenerResuelto(
    numero_carpeta: string,
    numero_resolucion: string,
  ): Promise<any> {
    return new Promise((resolve) => {
      const cleanNumeroResolucion = numero_resolucion
        ? numero_resolucion.replace(/[\r\n\t]+/g, "").trim()
        : "";
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

  private loadSavedState(): Promise<void> {
    return new Promise(async (resolve) => {
      const doc = this.activeDoc;
      if (!doc) {
        resolve();
        return;
      }

      this.hasSavedState = false;
      const idUser =
        this.jwtData?.userId || sessionStorage.getItem("id") || "Desconocido";
      const numero_carpeta = doc.numero_carpeta || "000000";
      const resolucion = doc.ncontrol || doc.numc || "";

      const pgTemplate = await this.ObtenerResuelto(numero_carpeta, resolucion);
      if (pgTemplate) {
        this.hasSavedState = true;
        console.log(
          "[TinderPdfViewer] pgTemplate de PostgreSQL recuperado:",
          pgTemplate,
        );

        // Cargar basamento legal, unico parrafo y lista de casos desde pgTemplate.task si existe
        if (pgTemplate.task) {
          if (
            pgTemplate.task.basamento_legal !== undefined &&
            pgTemplate.task.basamento_legal !== null
          ) {
            doc.basamentoLegal = pgTemplate.task.basamento_legal;
          }
          if (
            pgTemplate.task.unico_parrafo !== undefined &&
            pgTemplate.task.unico_parrafo !== null
          ) {
            doc._headerHtml = pgTemplate.task.unico_parrafo;
          }
          if (
            pgTemplate.task.lista_casos !== undefined &&
            pgTemplate.task.lista_casos !== null
          ) {
            doc["_pageCasesHtml_0"] = pgTemplate.task.lista_casos;
          }
          if (pgTemplate.task.styles) {
            doc.styles = pgTemplate.task.styles;
          }
          if (pgTemplate.task.ediciones) {
            doc.ediciones = pgTemplate.task.ediciones;
          }
          if (pgTemplate.task.comentarios) {
            doc.comentarios = pgTemplate.task.comentarios;
          }
        }

        // Asociar número de resolución de PG si existe
        const resNum = pgTemplate.task.numero_resolucion;
        if (resNum) {
          doc.numc = resNum;
          doc.ncontrol = resNum;
          doc.numero_resolucion = resNum;
        }

        // Asociar fecha de resolución de PG si existe
        const resFecha = pgTemplate.task.fecha_resolucion;
        if (resFecha) {
          doc.fecha_resolucion = resFecha.toString().replace(/\s+/g, "");
        }
      }

      // Asegurar valores por defecto inicializados para evitar conflictos y campos en blanco
      if (!doc.numc) {
        doc.numc = doc.ncontrol || doc.numero_carpeta || "000000";
      }
      if (!doc.ncontrol) {
        doc.ncontrol = doc.numc;
      }
      if (!doc.fecha_resolucion) {
        let defDate = "";
        if (doc.fecha) {
          const d = new Date(doc.fecha);
          if (!isNaN(d.getTime())) {
            defDate = d.toISOString().substring(0, 10);
          }
        }
        if (!defDate) {
          defDate = new Date().toISOString().substring(0, 10);
        }
        doc.fecha_resolucion = defDate;
      }

      resolve();
    });
  }

  private async loadCurrentPdf(): Promise<void> {
    const doc = this.activeDoc;
    if (!doc) return;

    this.loadingPdf = true;
    this.pdfError = false;
    this.pdfErrorMsg = "";
    this.objectFailed = false;
    this.revokeAll();
    this.cdr.detectChanges();

    // Intentar recuperar el estado de base de datos antes de pintar
    await this.loadSavedState();

    this.updateCanvasData();
    this.cdr.detectChanges();

    if (!doc) {
      this.loadingPdf = false;
      this.cdr.detectChanges();
      return;
    }

    if (this.pdfUrlResolver) {
      try {
        const url = this.pdfUrlResolver(doc);
        if (url) {
          this.loadPdfFromUrl(url);
        } else {
          this.pdfError = true;
          this.pdfErrorMsg = "Sin archivo PDF asociado";
          this.loadingPdf = false;
          this.cdr.detectChanges();
        }
      } catch (err: any) {
        this.pdfError = true;
        this.pdfErrorMsg = err.message || "Error resolviendo URL del PDF";
        this.loadingPdf = false;
        this.cdr.detectChanges();
      }
    } else {
      // Sin resolver: mostrar placeholder
      this.loadingPdf = false;
      this.pdfError = true;
      this.pdfErrorMsg = "No se proporcionó resolvedor de URLs";
      this.cdr.detectChanges();
    }
  }

  private cleanState(): void {
    this.observations = "";
    this.pdfError = false;
    this.pdfErrorMsg = "";
    this.objectFailed = false;
  }

  private revokeAll(): void {
    this.blobs.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (_) {}
    });
    this.blobs = [];
  }

  trackByIndex(i: number): number {
    return i;
  }

  //001260

  async crearSemillero(): Promise<void> {
    const xAPI = {} as IAPICore;
    xAPI.funcion = environment.funcion.OBTENER_NUMERO_RESUELTO;
    xAPI.parametros = ``;
    try {
      const data: any = await this.apiService.Ejecutar(xAPI).toPromise();
      if (data && data.Cuerpo && data.Cuerpo.length) {
        const numeroActual = parseInt(data.Cuerpo[0].numero, 10) || 0;
        const nuevoNumero = numeroActual + 1;
        const cleanNumero = nuevoNumero.toString().padStart(6, "0");
        this.nuevo_numero_resuelto = cleanNumero;

        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
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
        const month = months[today.getMonth()];
        const year = today.getFullYear();
        const dateStr = `${day} ${month} ${year}`;

        if (this.canvasData && this.canvasData.header) {
          this.canvasData.header.resolutionNum = cleanNumero;
          this.canvasData.header.date = dateStr;
        }
        if (this.activeDoc) {
          this.activeDoc.numc = cleanNumero;
          this.activeDoc.fecha_resolucion = dateStr;
        }
        this.cdr.detectChanges();

        await this.grabarResuelto(cleanNumero);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (err) {
      console.error("Error al obtener resuelto:", err);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar obtener el número de resolución.",
        icon: "error",
        confirmButtonColor: "#f5365c",
        confirmButtonText: "Aceptar",
      });
      throw err;
    }
  }

  async grabarResuelto(numero: any): Promise<void> {
    let xAPI = {} as IAPICore;
    xAPI.funcion = environment.funcion.INSERTAR_NUMERO_RESUELTO;
    xAPI.parametros = `${numero},RESOLUCION,NUEVO,${this.jwtData?.userId}`;
    try {
      await this.apiService.Ejecutar(xAPI).toPromise();
    } catch (err) {
      console.error("Error al grabar resuelto:", err);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar guardar el número de resolución.",
        icon: "error",
        confirmButtonColor: "#f5365c",
        confirmButtonText: "Aceptar",
      });
      throw err;
    }
  }
}
