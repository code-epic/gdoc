import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ─── Interfaces públicas ─────────────────────────────── */

export interface TinderDocument {
  cedula?: string;
  nombres_apellidos?: string;
  ncontrol?: string;
  numc?: string;
  digital?: string;
  anom?: string;
  archivo?: string;
  [key: string]: any;
}

export interface JwtUserData {
  userId: string;
  userName: string;
  userRole: string;
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
  /* ── Inputs ──────────────────────────────────────────── */
  @Input() documents: TinderDocument[] = [];
  @Input() startIndex = 0;
  @Input() jwtData: JwtUserData = { userId: "", userName: "", userRole: "" };
  @Input() loading = false;
  @Input() useCanvas = false;
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

  /* ── Estado interno ──────────────────────────────────── */
  public currentIndex = 0;
  public pdfSrc: SafeResourceUrl | null = null;
  public rawPdfUrl: string | null = null;
  public loadingPdf = false;
  public actionExecuting = false;
  public executingType: "approve" | "reject" | "" = "";
  public observations = "";
  public pdfError = false;
  public pdfErrorMsg = "";
  public swipeDir: "" | "left" | "right" = "";
  public isSafari = false;
  public objectFailed = false;
  
  public activeTab: 'explorador' | 'metadata' = 'explorador';

  private touchX = 0;
  private touchY = 0;
  private timer: any = null;
  private blobs: string[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
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

  public defaultBasamentoLegal = `El Ministro del Poder Popular para la Defensa, GENERAL EN JEFE GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ, nombrado mediante Decreto Nº 5.277 de fecha 18 de marzo de 2026, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria Nº 6.999 de fecha 18 de marzo de 2026, en ejercicio de las atribuciones que le confiere el artículo 78 numeral 19 del Decreto N° 1.424 con Rango, Valor y Fuerza de Ley Orgánica de la Administración Pública de fecha 17 de noviembre de 2014, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria Nº 6.147 de fecha 17 de noviembre de 2014, actuando de conformidad con lo establecido en los artículos 30 y 31 numeral 8 de la Ley Constitucional de la Fuerza Armada Nacional Bolivariana, publicada en la Gaceta Oficial de la República Bolivariana de Venezuela Extraordinaria N° 6.508 de fecha 30 de enero de 2020,`;

  public canvasData: any = null;

  generateHeaderHtml(isFirstPage: boolean): string {
    if (!isFirstPage) return "";
    if (this.activeDoc && this.activeDoc._headerHtml) {
      return this.activeDoc._headerHtml;
    }
    const superiorUnit = "ÚNICO:";
    const asunto = this.activeDoc?.asunto || "Efectuar los siguientes nombramientos:";
    const subordinateUnit = 'HOSPITAL MILITAR UNIVERSITARIO "DOCTOR CARLOS ARVELO"<br>SUBDIRECCIÓN ADMINISTRATIVA';

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

    // --- ALGORITMO DE PAGINACIÓN DINÁMICA ---
    const charsPerLine = 85; // Aprox caracteres por línea en Tahoma 13pt (Oficio)
    const basamentoLines = Math.ceil(basamentoLegalText.length / charsPerLine);
    
    // Ajustes más precisos y permisivos tras análisis visual
    const firstPageHeaderLines = 14 + basamentoLines; // Membrete + Fechas + Resolución + Basamento + Resuelve + Asunto
    const otherPageHeaderLines = 4; // CONTINUACIÓN DE LA RESOLUCIÓN...
    const footerLines = 15; // Firmas, sellos, iniciales, "Comuníquese". Reducido para no romper antes de tiempo
    const totalLinesPerPage = 52; // Total real matemático en hoja Oficio con line-height 1.35 y fuente 13pt

    let currentCaseIndex = 0;

    // Generar páginas hasta que no queden casos (o al menos 1 página si no hay casos)
    if (cases.length === 0) {
      // Manejo de documento vacío
      pages.push({
        pageIndex: 0,
        headerHtml: this.generateHeaderHtml(true),
        casesHtml: ""
      });
    }

    while (currentCaseIndex < cases.length) {
      let isFirstPage = pages.length === 0;
      let availableLines = totalLinesPerPage - (isFirstPage ? firstPageHeaderLines : otherPageHeaderLines);
      
      let pageCases = [];
      let linesUsed = 0;
      let tempIndex = currentCaseIndex;

      while (tempIndex < cases.length) {
        let persona = cases[tempIndex];
        let caseText = (persona.grado || "Ciudadano(a)") + " " + (persona.nombres_apellidos || persona.nombres + " " + persona.apellidos) + ", C.I. N° " + persona.cedula;
        let caseLines = Math.ceil(caseText.length / charsPerLine) + 0.4; // 0.4 es el margen inferior (6pt)
        
        let isLastAbsoluteCase = (tempIndex === cases.length - 1);

        if (isLastAbsoluteCase) {
           // Si es el último caso del documento, TIENE que caber la firma en esta misma página.
           if (linesUsed + caseLines + footerLines > availableLines) {
              // No caben el caso y la firma juntos.
              if (pageCases.length > 0) {
                  // Mandamos el caso a la siguiente página para que acompañe la firma
                  break; 
              }
           }
        } else {
           // Si no es el último caso, solo verificamos que el caso quepa
           if (linesUsed + caseLines > availableLines) {
              if (pageCases.length > 0) {
                  break; // Se llenó la página
              }
           }
        }

        pageCases.push(persona);
        linesUsed += caseLines;
        tempIndex++;
      }

      let headerHtml = isFirstPage ? this.generateHeaderHtml(isFirstPage) : "";

      const formattedCases = pageCases.map((persona: any) => {
        return `<p style="text-indent: 0; margin-left: 40px; margin-top: 0; margin-bottom: 6pt;">&mdash; ${persona.grado || "Ciudadano(a)"} <strong>${(persona.nombres_apellidos || persona.nombres + " " + persona.apellidos).toUpperCase()}</strong>, C.I. N° <strong>${persona.cedula}</strong></p>`;
      });

      const pageIdx = pages.length;
      let casesHtml = this.activeDoc["_pageCasesHtml_" + pageIdx];
      if (!casesHtml) {
        casesHtml = formattedCases.join("\n");
      }

      pages.push({
        pageIndex: pageIdx,
        headerHtml: headerHtml,
        casesHtml: casesHtml,
      });
      
      currentCaseIndex = tempIndex;
    }

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
        formattedDate = `${day} ${months[monthNum - 1]} ${year}`;
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
      formattedDate = `${String(rawDate.getDate()).padStart(2, "0")} ${months[rawDate.getMonth()]} ${rawDate.getFullYear()}`;
    }

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
        action: "RESUELVE",
      },
      pages: pages,
      signatures: {
        initials: "LARM/RMEA/B.O.merb",
        mainSignatory: "GUSTAVO ENRIQUE GONZÁLEZ LÓPEZ",
        signatoryTitle: "General en Jefe",
        signatoryRole: "Ministro del Poder Popular<br>para la Defensa",
        wetStampImageUrl: "assets/img/mppd/sello_mppd.png",
        signatureImageUrl: "assets/img/mppd/firma_mppd.png",
      },
    };
  }

  public async printCanvas() {
    this.loadingPdf = true;
    this.cdr.detectChanges();

    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [215.9, 355.6],
      });

      const canvases = document.querySelectorAll(".a4-canvas");

      for (let i = 0; i < canvases.length; i++) {
        const canvasElement = canvases[i] as HTMLElement;

        // Renderizar canvas con alta fidelidad
        const htmlCanvas = await html2canvas(canvasElement, {
          scale: 2, // 2x escala para evitar bordes borrosos
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        const imgData = htmlCanvas.toDataURL("image/jpeg", 0.98);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, 0, 215.9, 355.6);
      }

      const filename = this.activeDoc?.numc
        ? `Resolucion_${this.activeDoc.numc}.pdf`
        : `Resuelto_${new Date().getTime()}.pdf`;

      pdf.save(filename);
    } catch (err) {
      console.error("Error generando PDF: ", err);
      alert("Ocurrió un error al generar el documento PDF.");
    } finally {
      this.loadingPdf = false;
      this.cdr.detectChanges();
    }
  }

  public repaginateCases() {
    if (!this.activeDoc) return;

    const globalOffset = this.getGlobalCaretOffset();

    // 1. Concatenate all current HTML pages
    let fullHtml = "";
    let i = 0;
    while (this.activeDoc["_pageCasesHtml_" + i] !== undefined) {
      fullHtml += this.activeDoc["_pageCasesHtml_" + i] + "\n";
      delete this.activeDoc["_pageCasesHtml_" + i];
      i++;
    }

    if (!fullHtml.trim()) {
      this.activeDoc["_pageCasesHtml_0"] = "";
      this.updateCanvasData();
      return;
    }

    // 2. Parse the HTML to extract individual block-level elements (cases)
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullHtml, "text/html");

    // We assume each top-level child of body is a case.
    const casesHtmlArray = Array.from(doc.body.childNodes)
      .map((node) => {
        if (node.nodeType === 1) return (node as Element).outerHTML;
        if (node.nodeType === 3 && node.textContent?.trim())
          return `<div>${node.textContent}</div>`;
        return null;
      })
      .filter((html) => html !== null) as string[];

    // 3. Redistribute cases to pages using DOM height measurement
    const measureCanvas = document.createElement("div");
    measureCanvas.style.width = "215.9mm";
    measureCanvas.style.height = "355.6mm";
    measureCanvas.style.padding = "25mm 20mm 20mm 20mm";
    measureCanvas.style.boxSizing = "border-box";
    measureCanvas.style.fontFamily = "Tahoma, sans-serif";
    measureCanvas.style.fontSize = "13pt";
    measureCanvas.style.lineHeight = "1.15"; /* Equivalente a Word Sencillo */
    measureCanvas.style.position = "absolute";
    measureCanvas.style.visibility = "hidden";
    measureCanvas.style.top = "-9999px";
    document.body.appendChild(measureCanvas);

    let currentCaseIndex = 0;
    let pageIdx = 0;

    while (currentCaseIndex < casesHtmlArray.length) {
      measureCanvas.innerHTML = "";

      const contentWrapper = document.createElement("div");
      contentWrapper.style.display = "flex";
      contentWrapper.style.flexDirection = "column";
      // NOT setting height: 100% so we can measure its natural height
      measureCanvas.appendChild(contentWrapper);

      const bodyWrapper = document.createElement("div");
      bodyWrapper.style.flexGrow = "1";
      contentWrapper.appendChild(bodyWrapper);

      if (pageIdx === 0) {
        const basamentoLegal =
          this.activeDoc.basamentoLegal ||
          this.activeDoc.preamble ||
          "Por disposición del Ciudadano Presidente de la República Bolivariana de Venezuela, de conformidad con lo establecido en el artículo 78 numeral 19...";
        const action = this.activeDoc.accion || "RESUELVE";
        const page0StaticHtml = `
          <div style="text-align: center; font-weight: bold; text-transform: uppercase;">REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
          <div style="text-align: center; font-weight: bold; text-transform: uppercase;">MINISTERIO DEL PODER POPULAR PARA LA DEFENSA</div>
          <div style="text-align: center; font-weight: bold; text-transform: uppercase;">DESPACHO DEL MINISTRO</div>
          <div style="text-align: left; margin-top: 13pt; font-weight: bold;">Caracas, ${this.activeDoc.fecha_resolucion || ""}</div>
          <div style="text-align: right; font-weight: bold;">215°, 166° y 26°</div>
          <div style="text-align: center; margin-top: 13pt; font-weight: bold; text-transform: uppercase;">
            RESOLUCIÓN N° <span style="text-decoration: underline;">${this.activeDoc.numero_carpeta || ""}</span>
          </div>
          <div style="margin-top: 13pt; line-height: 1.35; text-align: justify;">${basamentoLegal}</div>
          <div style="text-align: center; margin-top: 13pt; margin-bottom: 13pt; font-weight: bold; text-transform: uppercase;">${action}</div>
        `;
        const staticNode = document.createElement("div");
        staticNode.innerHTML = page0StaticHtml;
        bodyWrapper.appendChild(staticNode);

        let headerHtml = this.activeDoc._headerHtml;
        if (!headerHtml) {
          const superiorUnit = "ÚNICO:";
          const asunto =
            this.activeDoc.asunto || "Efectuar los siguientes nombramientos:";
          const subordinateUnit =
            'HOSPITAL MILITAR UNIVERSITARIO "DOCTOR CARLOS ARVELO"<br>SUBDIRECCIÓN ADMINISTRATIVA';
          headerHtml = `<div style="margin-top: 13pt;"><strong>${superiorUnit}</strong> ${asunto}</div><div style="text-align: center;"><strong>${subordinateUnit}</strong></div>`;
        }
        const headerNode = document.createElement("div");
        headerNode.innerHTML = headerHtml;
        bodyWrapper.appendChild(headerNode);
      } else {
        const contHeader = document.createElement("p");
        contHeader.style.textAlign = "center";
        contHeader.style.fontWeight = "bold";
        contHeader.style.marginTop = "13pt";
        contHeader.style.marginBottom = "13pt";
        contHeader.innerText =
          "CONTINUACIÓN DE LA RESOLUCIÓN N° 00000 DE FECHA 01 ENE 2026";
        bodyWrapper.appendChild(contHeader);
      }

      const casesContainer = document.createElement("div");
      bodyWrapper.appendChild(casesContainer);

      const signatureSpace = 180; // Espacio conservador para firmas e iniciales
      let pageCases = [];

      while (currentCaseIndex < casesHtmlArray.length) {
        const caseHtml = casesHtmlArray[currentCaseIndex];
        const tempNode = document.createElement("div");
        tempNode.innerHTML = caseHtml;
        casesContainer.appendChild(tempNode);

        const isLastItem = currentCaseIndex === casesHtmlArray.length - 1;
        const currentHeight = contentWrapper.offsetHeight;
        // Restar el padding top+bottom (~170px) del clientHeight para obtener el espacio real
        const availableSpace = measureCanvas.clientHeight - 170;
        const limitHeight = availableSpace - (isLastItem ? signatureSpace : 0);

        if (currentHeight > limitHeight && pageCases.length > 0) {
          casesContainer.removeChild(tempNode);
          break; // Salta a la siguiente página
        }

        pageCases.push(caseHtml);
        currentCaseIndex++;
      }

      this.activeDoc["_pageCasesHtml_" + pageIdx] = pageCases.join("\n");
      pageIdx++;
    }

    if (pageIdx === 0) {
      this.activeDoc["_pageCasesHtml_0"] = "";
    }

    document.body.removeChild(measureCanvas);
    this.updateCanvasData();

    if (globalOffset >= 0) {
      setTimeout(() => {
        this.restoreGlobalCaretOffset(globalOffset);
      }, 10);
    }
  }

  /* ─── Caret Tracking Utilities ────────────────────────── */

  private getGlobalCaretOffset(): number {
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement || !activeElement.classList.contains("cases-list")) {
      return -1;
    }

    // Get offset within the active page
    let localOffset = 0;
    const win = window;
    const sel = win.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(activeElement);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      localOffset = preCaretRange.toString().length;
    }

    // Add text lengths of preceding pages
    let globalOffset = localOffset;
    const allCasesLists = document.querySelectorAll(".cases-list");
    for (let i = 0; i < allCasesLists.length; i++) {
      if (allCasesLists[i] === activeElement) {
        break;
      }
      globalOffset += (allCasesLists[i] as HTMLElement).innerText.length;
    }

    return globalOffset;
  }

  private restoreGlobalCaretOffset(globalOffset: number) {
    if (globalOffset < 0) return;

    const allCasesLists = document.querySelectorAll(".cases-list");
    let remainingOffset = globalOffset;

    for (let i = 0; i < allCasesLists.length; i++) {
      const el = allCasesLists[i] as HTMLElement;
      const textLen = el.innerText.length;

      if (remainingOffset <= textLen || i === allCasesLists.length - 1) {
        // Restore caret here
        this.setCaretPosition(el, remainingOffset);
        el.focus();
        break;
      } else {
        remainingOffset -= textLen;
      }
    }
  }

  private setCaretPosition(element: HTMLElement, offset: number) {
    const doc = element.ownerDocument || document;
    const win = doc.defaultView || window;
    const createRange = function (
      node: Node,
      chars: { count: number },
      range?: Range,
    ): Range {
      if (!range) {
        range = doc.createRange();
        range.selectNode(node);
        range.setStart(node, 0);
      }
      if (chars.count === 0) {
        range.setEnd(node, chars.count);
      } else if (node && chars.count > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent!.length < chars.count) {
            chars.count -= node.textContent!.length;
          } else {
            range.setEnd(node, chars.count);
            chars.count = 0;
          }
        } else {
          for (let lp = 0; lp < node.childNodes.length; lp++) {
            range = createRange(node.childNodes[lp], chars, range);
            if (chars.count === 0) {
              break;
            }
          }
        }
      }
      return range!;
    };

    if (offset >= 0 && win) {
      const sel = win.getSelection();
      const range = createRange(element, { count: offset });
      if (range) {
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  public updateActiveDoc(field: string, value: string) {
    if (this.activeDoc) {
      this.activeDoc[field] = value;
    }
  }

  public onCanvasDateChange(dateStr: string) {
    if (!this.activeDoc) return;
    try {
      const parts = dateStr.trim().split(" ");
      if (parts.length >= 3) {
        const day = parts[0].padStart(2, "0");
        const monthStr = parts[1].toUpperCase();
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
        const monthIdx = months.indexOf(monthStr) + 1;
        if (monthIdx > 0 && year.length === 4) {
          this.activeDoc.fecha_resolucion = `${year}-${String(monthIdx).padStart(2, "0")}-${day}`;
          return;
        }
      }
    } catch (e) {}
    this.activeDoc.fecha_resolucion = dateStr;
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

  onApprove(): void {
    if (this.actionExecuting || !this.activeDoc) {
      return;
    }
    this.actionExecuting = true;
    this.executingType = "approve";
    this.approve.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  onReject(): void {
    if (this.actionExecuting || !this.activeDoc) {
      return;
    }
    if (this.observations.trim() === "") {
      return;
    }
    this.actionExecuting = true;
    this.executingType = "reject";
    this.reject.emit({
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
      case "ArrowLeft":
        this.prevDocument();
        event.preventDefault();
        break;
      case "ArrowRight":
        this.nextDocument();
        event.preventDefault();
        break;
      case " ":
        this.onApprove();
        event.preventDefault();
        break;
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

  private loadCurrentPdf(): void {
    const doc = this.activeDoc;
    if (!doc) return;

    this.updateCanvasData();

    this.loadingPdf = true;
    this.pdfError = false;
    this.pdfErrorMsg = "";
    this.objectFailed = false;
    this.revokeAll();

    if (!this.activeDoc) {
      this.loadingPdf = false;
      this.cdr.detectChanges();
      return;
    }

    if (this.pdfUrlResolver) {
      try {
        const url = this.pdfUrlResolver(this.activeDoc);
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
}
