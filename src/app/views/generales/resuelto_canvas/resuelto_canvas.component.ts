import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-resuelto-canvas",
  templateUrl: "./resuelto_canvas.component.html",
  styleUrls: ["./resuelto_canvas.component.scss"],
})
export class ResueltoCanvasComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild("container") containerRef!: ElementRef;

  public zoomScale: number = 1.0;

  // Recibimos la data estructurada (el mapeo de Golang/Base de datos)
  @Input() documentData: any = {
    header: {
      resolutionNum: "060768",
      date: "2025-07-24",
      anniversaries: "215°, 166° y 26°",
    },
    body: {
      preamble: "Por disposición del Ciudadano Presidente...",
      pages: [
        {
          pageIndex: 0,
          headerHtml: "",
          casesHtml: `<p style="margin-top: 13pt;"><strong>ÚNICO:</strong> Efectuar el siguiente nombramiento:</p><p style="text-align: center;"><strong>HOSPITAL MILITAR UNIVERSITARIO "DOCTOR CARLOS ARVELO"<br>SUBDIRECCIÓN ADMINISTRATIVA</strong></p><p style="text-indent: 0; margin-left: 40px; margin-top: 0; margin-bottom: 6pt;">&mdash; Coronel <strong>RAFAEL SANCHEZ ATACHO</strong>, C.I. N° <strong>21113915</strong></p>`,
        },
      ],
      signatures: {
        initials: "LARM/RMRA/b.l.s.",
        mainSignatory: "GONZALES",
        signatoryTitle: "General en Jefe",
        signatoryRole: "Ministro del Poder Popular para la Defensa",
        wetStampImageUrl: "assets/img/mppd/sello_mppd.png",
        signatureImageUrl: "assets/img/mppd/firma_mppd.png",
      },
    },
  };

  @Input() lineSpacing: number = 1.15;
  @Input() profile: "Edicion" | "Revision" | "Jefe" | "Secretaria" | "Direccion" | "Aprobador" = "Edicion";
  @Input() showSignaturesForPrint: boolean = false;

  @Output() lineSpacingChange = new EventEmitter<number>();
  @Output() profileChange = new EventEmitter<string>();

  @Output() zoneSelected = new EventEmitter<string>();
  @Output() basamentoLegalChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() unicoParrafoChange = new EventEmitter<string>();
  @Output() resolutionChange = new EventEmitter<string>();
  @Output() initialsChange = new EventEmitter<string>();
  @Output() casesBlur = new EventEmitter<void>();

  public currentLineSpacing: number = 1.15;
  private activeElement: HTMLElement | null = null;

  decreaseLineSpacing() {
    this.currentLineSpacing = parseFloat(Math.max(0.5, this.currentLineSpacing - 0.05).toFixed(2));
    this.applyLineSpacing();
    this.lineSpacingChange.emit(this.currentLineSpacing);
  }

  increaseLineSpacing() {
    this.currentLineSpacing = parseFloat((this.currentLineSpacing + 0.05).toFixed(2));
    this.applyLineSpacing();
    this.lineSpacingChange.emit(this.currentLineSpacing);
  }

  private applyLineSpacing() {
    if (this.activeElement) {
      this.activeElement.style.setProperty('line-height', this.currentLineSpacing.toString(), 'important');
      const children = this.activeElement.querySelectorAll('p, span, div');
      children.forEach(child => {
        (child as HTMLElement).style.setProperty('line-height', this.currentLineSpacing.toString(), 'important');
      });
      
      // Forzar actualización en el modelo de datos si es necesario (el HTML reflejará el inline style)
      // Especialmente útil para .cases-list
      if (this.activeElement.classList.contains('cases-list')) {
        this.casesInput$.next();
      }
    }
  }

  private casesInput$ = new Subject<void>();

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.casesInput$.pipe(debounceTime(600)).subscribe(() => {
      this.casesBlur.emit();
      this.paginateDOM();
    });
  }

  ngOnDestroy(): void {
    this.casesInput$.complete();
  }

  ngAfterViewInit() {
    // Retardo mínimo para asegurar que el DOM está renderizado
    setTimeout(() => {
      this.autoFit();
      this.paginateDOM();
    }, 100);
  }

  @HostListener("window:resize")
  onResize() {
    // Opcional: auto-ajustar al redimensionar
    // this.autoFit();
  }

  zoomIn() {
    if (this.zoomScale < 2) {
      this.zoomScale += 0.1;
    }
  }

  zoomOut() {
    if (this.zoomScale > 0.4) {
      this.zoomScale -= 0.1;
    }
  }

  autoFit() {
    if (!this.containerRef) return;
    const availableWidth = this.el.nativeElement.offsetWidth;
    const a4WidthPx = 794; // 210mm en px (96 DPI)

    // Dejar un margen (ej. 40px)
    const targetWidth = availableWidth - 40;

    if (targetWidth > 400 && targetWidth < a4WidthPx) {
      this.zoomScale = Math.max(0.5, targetWidth / a4WidthPx);
    } else {
      this.zoomScale = 1; // Tamaño natural o fallback seguro
    }
  }

  // Función para activar el panel de edición lateral según el área clickeada
  editMode(zone: string) {
    this.zoneSelected.emit(zone);
  }

  onBasamentoLegalEdit(event: Event) {
    const target = event.target as HTMLElement;
    this.basamentoLegalChange.emit(target.innerText || "");
  }

  onUnicoParrafoEdit(event: Event) {
    const target = event.target as HTMLElement;
    this.unicoParrafoChange.emit(target.innerHTML || "");
  }

  onDateEdit(event: Event) {
    if (this.documentData && this.documentData.header) {
      const text = (event.target as HTMLElement).innerText || "";
      this.documentData.header.date = text;
      this.dateChange.emit(text);
    }
  }

  onResolutionEdit(event: Event) {
    if (this.documentData && this.documentData.header) {
      const text = (event.target as HTMLElement).innerText || "";
      this.documentData.header.resolutionNum = text;
      this.resolutionChange.emit(text);
    }
  }

  onInitialsEdit(event: Event) {
    if (this.documentData && this.documentData.signatures) {
      const text = (event.target as HTMLElement).innerText || "";
      this.documentData.signatures.initials = text;
      this.initialsChange.emit(text);
    }
  }

  onCasesListBlur() {
    // Ya no es estrictamente necesario, pero lo dejamos por si hace blur rápido
    this.casesBlur.emit();
  }

  onCasesListInput(event: Event, pageIndex: number) {
    const target = event.target as HTMLElement;
    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] =
        target.innerHTML;
      this.casesInput$.next();
    } else if (
      this.documentData &&
      this.documentData.body &&
      this.documentData.body.pages
    ) {
      // Dummy data fallback
      this.documentData.body.pages[pageIndex].casesHtml = target.innerHTML;
      this.casesInput$.next();
    }
  }

  onPasteCases(event: ClipboardEvent, pageIndex: number) {
    event.preventDefault();

    let html = event.clipboardData?.getData("text/html");
    const plainText = event.clipboardData?.getData("text/plain") || "";

    if (!html) {
      html = plainText
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Limpiar basura de Word y dejar solo etiquetas seguras
    Array.from(doc.body.childNodes).forEach((node) =>
      this.cleanHtmlNodes(node),
    );

    // Formatear cédulas
    const cleanHtml = this.formatCedulasInHtml(doc.body.innerHTML);

    document.execCommand("insertHTML", false, cleanHtml);

    // Guardar cambios manualmente
    const target = event.target as HTMLElement;
    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] =
        target.innerHTML;
      this.casesInput$.next();
    } else if (this.documentData?.body?.pages) {
      this.documentData.body.pages[pageIndex].casesHtml = target.innerHTML;
      this.casesInput$.next();
    }

    setTimeout(() => {
      this.casesInput$.next();
    }, 100);
  }

  paginateDOM() {
    if (!this.documentData || !this.documentData.pages) return;

    let allCasesHtml = '';
    this.documentData.pages.forEach((p: any) => allCasesHtml += (p.casesHtml || ''));

    const parser = new DOMParser();
    const doc = parser.parseFromString(allCasesHtml, 'text/html');
    const nodes = Array.from(doc.body.childNodes).filter(n => n.nodeName !== '#text' || n.textContent!.trim() !== '');
    const paragraphs = nodes.map(n => (n as HTMLElement).outerHTML || n.textContent || '');

    // Resetear a una sola página limpia
    this.documentData.pages = [{
      pageIndex: 0,
      headerHtml: "",
      casesHtml: ""
    }];

    for (let p of paragraphs) {
      let currentPageIdx = this.documentData.pages.length - 1;
      this.documentData.pages[currentPageIdx].casesHtml += p;

      this.cdr.detectChanges(); 

      const canvases = this.el.nativeElement.querySelectorAll('.a4-canvas');
      const currentCanvas = canvases[currentPageIdx] as HTMLElement;

      // Si se desborda, mover este nodo a una página nueva
      if (currentCanvas && currentCanvas.scrollHeight > currentCanvas.clientHeight + 2) {
        const currentHtml = this.documentData.pages[currentPageIdx].casesHtml;
        this.documentData.pages[currentPageIdx].casesHtml = currentHtml.substring(0, currentHtml.length - p.length);
        
        this.documentData.pages.push({
          pageIndex: currentPageIdx + 1,
          headerHtml: "",
          casesHtml: p
        });
        this.cdr.detectChanges();
      }
    }
  }

  private cleanHtmlNodes(node: Node) {
    const allowedTags = [
      "P",
      "BR",
      "B",
      "STRONG",
      "I",
      "EM",
      "U",
      "SPAN",
      "DIV",
      "UL",
      "OL",
      "LI",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
    ];

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      if (!allowedTags.includes(el.tagName)) {
        // Remover etiqueta pero conservar contenido
        const fragment = document.createDocumentFragment();
        while (el.firstChild) {
          fragment.appendChild(el.firstChild);
        }
        el.parentNode?.replaceChild(fragment, el);
      } else {
        // Capturar estilos seguros
        const fontFamily = el.style.fontFamily;
        const fontSize = el.style.fontSize;
        const color = el.style.color;
        const backgroundColor = el.style.backgroundColor;
        const textAlign = el.style.textAlign;
        const textIndent = el.style.textIndent;
        const marginLeft = el.style.marginLeft;
        const marginTop = el.style.marginTop;
        const marginBottom = el.style.marginBottom;

        const isUnderline = el.style.textDecoration.includes("underline");
        const isBold =
          el.style.fontWeight === "bold" ||
          parseInt(el.style.fontWeight) >= 700;
        const isItalic = el.style.fontStyle === "italic";

        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }

        // Re-aplicar estilos
        if (fontFamily) el.style.fontFamily = fontFamily;
        if (fontSize) el.style.fontSize = fontSize;
        if (color) el.style.color = color;
        if (backgroundColor) el.style.backgroundColor = backgroundColor;
        if (textAlign) el.style.textAlign = textAlign;
        if (textIndent) el.style.textIndent = textIndent;
        if (marginLeft) el.style.marginLeft = marginLeft;
        if (marginTop) el.style.marginTop = marginTop;
        if (marginBottom) el.style.marginBottom = marginBottom;

        if (isUnderline || el.tagName === "U")
          el.style.textDecoration = "underline";
        if (isBold || el.tagName === "B" || el.tagName === "STRONG")
          el.style.fontWeight = "bold";
        if (isItalic || el.tagName === "I" || el.tagName === "EM")
          el.style.fontStyle = "italic";

        // Limpiar hijos
        const children = Array.from(el.childNodes);
        children.forEach((child) => this.cleanHtmlNodes(child));
      }
    } else if (node.nodeType !== Node.TEXT_NODE) {
      node.parentNode?.removeChild(node);
    }
  }

  private formatCedulasInHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walk.nextNode())) {
      if (node.nodeValue) {
        node.nodeValue = node.nodeValue.replace(/\b(\d{6,9})\b/g, (match) => {
          return match.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });
      }
    }
    return tempDiv.innerHTML;
  }

  onFocusEditable(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = "rgba(142, 202, 230, 0.15)"; // Un azul muy suave
    
    this.activeElement = target;
    
    const inlineLh = target.style.lineHeight;
    if (inlineLh && !isNaN(parseFloat(inlineLh))) {
       this.currentLineSpacing = parseFloat(inlineLh);
    }
  }

  onBlurEditable(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = "transparent";
  }

  onPaste(event: ClipboardEvent) {
    // Evitar que el navegador pegue HTML con estilos (colores, fuentes, etc)
    event.preventDefault();

    // Extraer solo texto plano del portapapeles
    const text = event.clipboardData?.getData("text/plain") || "";

    // Insertarlo en el cursor usando execCommand para mantener el historial de Deshacer
    document.execCommand("insertText", false, text);

    // Emitir el cambio hacia arriba
    const target = event.target as HTMLElement;
    this.basamentoLegalChange.emit(target.innerText || "");
  }
}
