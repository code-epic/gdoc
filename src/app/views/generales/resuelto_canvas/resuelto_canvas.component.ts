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
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-resuelto-canvas",
  templateUrl: "./resuelto_canvas.component.html",
  styleUrls: ["./resuelto_canvas.component.scss"],
})
export class ResueltoCanvasComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
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
        mainSignatory: "GUSTAVO ENRIQUE GONZÁLEZ LOPÉZ",
        signatoryTitle: "General en Jefe",
        signatoryRole: "Ministro del Poder Popular<br>para la Defensa",
        wetStampImageUrl: "assets/img/mppd/sello_mppd.png",
        signatureImageUrl: "assets/img/mppd/firma_mppd.png",
      },
    },
  };

  @Input() lineSpacing: number = 1.15;
  @Input() profile:
    | "Edicion"
    | "Revision"
    | "Jefe"
    | "Secretaria"
    | "Direccion"
    | "Aprobador" = "Edicion";
  @Input() showSignaturesForPrint: boolean = false;
  @Input() jwtData: any;

  @Output() lineSpacingChange = new EventEmitter<number>();
  @Output() profileChange = new EventEmitter<string>();

  @Output() zoneSelected = new EventEmitter<string>();
  @Output() basamentoLegalChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() unicoParrafoChange = new EventEmitter<string>();
  @Output() resolutionChange = new EventEmitter<string>();
  @Output() initialsChange = new EventEmitter<string>();
  @Output() casesBlur = new EventEmitter<void>();
  @Output() commentAdded = new EventEmitter<void>();

  public currentLineSpacing: number = 1.15;
  private activeElement: HTMLElement | null = null;
  public activeSection: string = '';

  public showFloatingCommentBtn = false;
  public floatingBtnPos = { x: 0, y: 0 };

  @HostListener('document:selectionchange')
  onSelectionChange() {
    if (this.profile !== 'Revision') {
      this.showFloatingCommentBtn = false;
      return;
    }
    
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        this.floatingBtnPos = {
          x: rect.left + rect.width / 2 - 40,
          y: rect.top - 45
        };
        this.showFloatingCommentBtn = true;
      } else {
        this.showFloatingCommentBtn = false;
      }
    } else {
      this.showFloatingCommentBtn = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentData'] && this.documentData) {
      if (!this.documentData.styles) {
        this.documentData.styles = {
          margins: { top: 25, right: 20, bottom: 5, left: 20 },
          lineHeights: {
             header: 1.75,
             basamento: 1.75,
             unico: 1.35,
             cases: 1.35,
             footer: 1.15,
             firma: 1.5
          }
        };
      }
    }
  }

  updateMargin(side: string, event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(val) && this.documentData?.styles?.margins) {
      this.documentData.styles.margins[side] = val;
      this.paginateDOM();
    }
  }

  decreaseLineSpacing() {
    this.currentLineSpacing = parseFloat(
      Math.max(0.5, this.currentLineSpacing - 0.05).toFixed(2),
    );
    this.applyLineSpacing();
    this.lineSpacingChange.emit(this.currentLineSpacing);
  }

  increaseLineSpacing() {
    this.currentLineSpacing = parseFloat(
      (this.currentLineSpacing + 0.05).toFixed(2),
    );
    this.applyLineSpacing();
    this.lineSpacingChange.emit(this.currentLineSpacing);
  }

  formatText(command: string) {
    document.execCommand(command, false, "");
    // NOTA: No llamamos a this.casesInput$.next() aquí para evitar que el canvas
    // se repagine y elimine la selección visual del usuario.
    // Los cambios en el DOM se guardarán cuando se dispare el evento blur.
  }

  public async addComment() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      Swal.fire('Selección vacía', 'Por favor, selecciona un texto para añadir un comentario.', 'warning');
      return;
    }

    const { value: text } = await Swal.fire({
      title: 'Añadir comentario',
      input: 'textarea',
      inputLabel: 'Escribe tu observación:',
      inputPlaceholder: 'Ej. Revisar este nombre...',
      showCancelButton: true,
      confirmButtonColor: '#f5365c',
      cancelButtonColor: '#8898aa',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (text) {
      const commentId = 'cmt_' + new Date().getTime();
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'resuelto-comment pending';
      span.style.backgroundColor = '#ffe066';
      span.style.color = '#333';
      span.dataset['commentId'] = commentId;
      
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        
        // Sync the modified DOM back to the model immediately
        const container = span.closest('.cases-list') || span.closest('[data-section]');
        if (container) {
          const section = container.getAttribute('data-section');
          if (section === 'cases') {
            const currentCanvas = container.closest('.a4-canvas');
            if (currentCanvas) {
              const canvases = Array.from(this.el.nativeElement.querySelectorAll('.a4-canvas'));
              const pageIdx = canvases.indexOf(currentCanvas);
              if (pageIdx !== -1 && this.documentData && this.documentData.pages) {
                this.documentData.pages[pageIdx].casesHtml = container.innerHTML;
                this.documentData.pages[pageIdx].casesHtmlSafe = this.sanitizer.bypassSecurityTrustHtml(container.innerHTML || '');
              }
            }
          } else if (section === 'unico') {
             this.documentData.body.unicoParrafo = container.innerHTML;
             this.unicoParrafoChange.emit(container.innerHTML);
          } else if (section === 'basamento') {
             this.documentData.body.basamentoLegal = container.innerHTML;
             this.basamentoLegalChange.emit(container.innerHTML);
          }
        }
        
        if (!this.documentData.comentarios) {
          this.documentData.comentarios = [];
        }
        this.documentData.comentarios.push({
          id: commentId,
          text: text,
          status: 'pending',
          author: `${this.jwtData?.userName || 'Usuario'} (${this.jwtData?.userRole || 'Revisión'})`,
          date: new Date().toLocaleString('es-VE')
        });
        
        this.commentAdded.emit();
      } catch (e) {
        console.error(e);
        Swal.fire('Error', 'No se puede añadir el comentario en esta selección (no cruces párrafos).', 'error');
      }
    }
  }

  public removeHighlight(id: string) {
    const spans = this.el.nativeElement.querySelectorAll(`span[data-comment-id="${id}"]`);
    spans.forEach((span: HTMLElement) => {
      span.style.backgroundColor = 'transparent';
      span.style.color = 'inherit';
      span.classList.remove('pending');
      span.classList.add('resolved');
      
      // Sync the modified DOM back to the model
      const container = span.closest('.cases-list') || span.closest('[data-section]');
      if (container) {
        const section = container.getAttribute('data-section');
        if (section === 'cases') {
          const currentCanvas = container.closest('.a4-canvas');
          if (currentCanvas) {
            const canvases = Array.from(this.el.nativeElement.querySelectorAll('.a4-canvas'));
            const pageIdx = canvases.indexOf(currentCanvas);
            if (pageIdx !== -1 && this.documentData && this.documentData.pages) {
              this.documentData.pages[pageIdx].casesHtml = container.innerHTML;
              this.documentData.pages[pageIdx].casesHtmlSafe = this.sanitizer.bypassSecurityTrustHtml(container.innerHTML || '');
            }
          }
        } else if (section === 'unico') {
           this.documentData.body.unicoParrafo = container.innerHTML;
           this.unicoParrafoChange.emit(container.innerHTML);
        } else if (section === 'basamento') {
           this.documentData.body.basamentoLegal = container.innerHTML;
           this.basamentoLegalChange.emit(container.innerHTML);
        }
      }
    });
    // En lugar de casesInput$.next(), emitimos casesBlur si es necesario,
    // o simplemente dejamos que el visor lo detecte.
  }

  private applyLineSpacing() {
    if (this.activeSection && this.documentData?.styles?.lineHeights) {
      this.documentData.styles.lineHeights[this.activeSection] = this.currentLineSpacing;
      
      if (this.activeSection === 'cases' || (this.activeElement && this.activeElement.classList.contains("cases-list"))) {
        this.casesInput$.next();
      }
    } else if (this.activeElement) {
      this.activeElement.style.setProperty(
        "line-height",
        this.currentLineSpacing.toString(),
        "important",
      );
      const children = this.activeElement.querySelectorAll("p, span, div");
      children.forEach((child) => {
        (child as HTMLElement).style.setProperty(
          "line-height",
          this.currentLineSpacing.toString(),
          "important",
        );
      });

      if (this.activeElement.classList.contains("cases-list")) {
        this.casesInput$.next();
      }
    }
  }

  private casesInput$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  public getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || "");
  }

  ngOnInit(): void {
    if (this.documentData && !this.documentData.styles) {
      this.documentData.styles = {
        margins: { top: 25, right: 20, bottom: 5, left: 20 },
        lineHeights: {
           header: 1.75,
           basamento: 1.75,
           unico: 1.35,
           cases: 1.35,
           footer: 1.15,
           firma: 1.5
        }
      };
    }

    this.casesInput$.pipe(debounceTime(600)).subscribe(() => {
      this.casesBlur.emit();
      this.paginateDOM();
    });
  }

  ngOnDestroy(): void {
    this.casesInput$.complete();
  }

  private updateSafeHtmls() {
    if (this.documentData && this.documentData.pages) {
      this.documentData.pages.forEach((p: any) => {
        p.casesHtmlSafe = this.sanitizer.bypassSecurityTrustHtml(p.casesHtml || '');
      });
    }
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

  onCasesListInput(event: Event, pageIndex: number) {
    const target = event.target as HTMLElement;

    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] =
        target.innerHTML;
    }

    // Auto-paginación inteligente tipo Google Docs:
    const currentCanvas = target.closest(".a4-canvas") as HTMLElement;
    if (currentCanvas) {
      const isOverflowing =
        currentCanvas.scrollHeight > currentCanvas.clientHeight + 2;

      if (isOverflowing) {
        if (
          this.documentData &&
          this.documentData.pages &&
          this.documentData.pages[pageIndex]
        ) {
          this.documentData.pages[pageIndex].casesHtml = target.innerHTML;
        }
        // Desbordamiento = repaginamos inmediatamente para empujar el texto a la página siguiente
        this.paginateDOM();
      } else {
        const inputEvent = event as InputEvent;
        // Si el usuario está borrando texto, puede haber espacio de sobra (Underflow)
        const isDeleting =
          inputEvent.inputType && inputEvent.inputType.startsWith("delete");
        if (isDeleting && pageIndex < this.documentData.pages.length - 1) {
          if (
            this.documentData &&
            this.documentData.pages &&
            this.documentData.pages[pageIndex]
          ) {
            this.documentData.pages[pageIndex].casesHtml = target.innerHTML;
          }
          // Llamamos al subject que dispara paginateDOM con debounce (600ms)
          // Así evitamos interrumpir al usuario si mantiene presionado Backspace
          this.casesInput$.next();
        }
      }
    }
  }

  onCasesListBlur(event: Event, pageIndex: number) {
    const target = event.target as HTMLElement;
    const html = target.innerHTML;

    // Al salir del input (blur), SÍ guardamos los cambios en el modelo de datos
    if (
      this.documentData &&
      this.documentData.pages &&
      this.documentData.pages[pageIndex]
    ) {
      this.documentData.pages[pageIndex].casesHtml = html;
      this.documentData.pages[pageIndex].casesHtmlSafe = this.sanitizer.bypassSecurityTrustHtml(html || '');
    }

    // Y luego disparamos la paginación dinámica, ya que el usuario dejó de escribir
    this.casesInput$.next();
    this.casesBlur.emit();
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

    // Guardar cambios manualmente (al pegar sí queremos repintar/paginar)
    const target = event.target as HTMLElement;
    if (
      this.documentData &&
      this.documentData.pages &&
      this.documentData.pages[pageIndex]
    ) {
      this.documentData.pages[pageIndex].casesHtml = target.innerHTML;
    }

    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] =
        target.innerHTML;
    }

    this.casesInput$.next();

    setTimeout(() => {
      this.casesInput$.next();
    }, 100);
  }

  // --- SISTEMA DE RESTAURACIÓN DE PUNTERO (CARET) ---
  savedCaretPosition: { start: number, end: number } | null = null;

  saveCaret() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this.el.nativeElement);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const start = preCaretRange.toString().length;

      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const end = preCaretRange.toString().length;
      
      this.savedCaretPosition = { start, end };
    }
  }

  restoreCaret() {
    if (this.savedCaretPosition !== null) {
      const el = this.el.nativeElement;
      let charIndex = 0;
      const range = document.createRange();
      range.setStart(el, 0);
      range.collapse(true);
      const nodeStack = [el];
      let node,
        foundStart = false,
        foundEnd = false;

      while (!foundEnd && (node = nodeStack.pop())) {
        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharIndex = charIndex + (node.textContent?.length || 0);
          if (
            !foundStart &&
            this.savedCaretPosition.start >= charIndex &&
            this.savedCaretPosition.start <= nextCharIndex
          ) {
            range.setStart(node, this.savedCaretPosition.start - charIndex);
            foundStart = true;
          }
          if (
            !foundEnd &&
            this.savedCaretPosition.end >= charIndex &&
            this.savedCaretPosition.end <= nextCharIndex
          ) {
            range.setEnd(node, this.savedCaretPosition.end - charIndex);
            foundEnd = true;
          }
          charIndex = nextCharIndex;
        } else {
          let i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      this.savedCaretPosition = null;
    }
  }

  paginateDOM() {
    if (!this.documentData || !this.documentData.pages) return;

    // Guardar el cursor antes de destruir las páginas
    this.saveCaret();

    let allCasesHtml = "";
    this.documentData.pages.forEach(
      (p: any) => (allCasesHtml += p.casesHtml || ""),
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(allCasesHtml, "text/html");
    const nodes = Array.from(doc.body.childNodes).filter(
      (n) => n.nodeName !== "#text" || n.textContent!.trim() !== "",
    );
    const paragraphs = nodes.map(
      (n) => (n as HTMLElement).outerHTML || n.textContent || "",
    );

    // Resetear a una sola página limpia
    this.documentData.pages = [
      {
        pageIndex: 0,
        headerHtml: "",
        casesHtml: "",
      },
    ];

    for (let p of paragraphs) {
      let currentPageIdx = this.documentData.pages.length - 1;
      this.documentData.pages[currentPageIdx].casesHtml += p;

      this.cdr.detectChanges();

      const canvases = this.el.nativeElement.querySelectorAll(".a4-canvas");
      const currentCanvas = canvases[currentPageIdx] as HTMLElement;

      // Si se desborda, mover este nodo a una página nueva
      if (
        currentCanvas &&
        currentCanvas.scrollHeight > currentCanvas.clientHeight + 2
      ) {
        const currentHtml = this.documentData.pages[currentPageIdx].casesHtml;
        this.documentData.pages[currentPageIdx].casesHtml =
          currentHtml.substring(0, currentHtml.length - p.length);

        this.documentData.pages.push({
          pageIndex: currentPageIdx + 1,
          headerHtml: "",
          casesHtml: p,
        });
        this.cdr.detectChanges();
      }
    }

    this.updateSafeHtmls();
    this.cdr.detectChanges();

    // Restaurar el cursor después de renderizar las nuevas páginas
    setTimeout(() => {
      this.restoreCaret();
    }, 0);
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
        const textAlign = el.style.textAlign;
        const textIndent = el.style.textIndent;
        const marginLeft = el.style.marginLeft;
        const fontFamily = el.style.fontFamily;
        const fontSize = el.style.fontSize;

        const isUnderline = el.style.textDecoration.includes("underline");
        const isBold =
          el.style.fontWeight === "bold" ||
          parseInt(el.style.fontWeight) >= 700;
        const isItalic = el.style.fontStyle === "italic";

        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }

        // Re-aplicar estilos básicos estructurales
        if (textAlign) el.style.textAlign = textAlign;
        if (textIndent) el.style.textIndent = textIndent;
        if (marginLeft) el.style.marginLeft = marginLeft;
        if (fontFamily) el.style.fontFamily = fontFamily;
        if (fontSize) el.style.fontSize = fontSize;

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
    this.activeSection = target.getAttribute('data-section') || '';

    if (this.activeSection && this.documentData?.styles?.lineHeights?.[this.activeSection]) {
      this.currentLineSpacing = this.documentData.styles.lineHeights[this.activeSection];
    } else {
      const inlineLh = target.style.lineHeight;
      if (inlineLh && !isNaN(parseFloat(inlineLh))) {
        this.currentLineSpacing = parseFloat(inlineLh);
      }
    }
  }

  onBlurEditable(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = "transparent";

    // Consolidar los datos locales al hacer blur para que no se reinicien
    if (target.classList.contains("m-resolucion-unico")) {
      if (this.documentData && this.documentData.body) {
        this.documentData.body.unicoParrafo = target.innerHTML;
      }
    }

    if (target.classList.contains("m-resolucion-basamento")) {
      if (this.documentData && this.documentData.body) {
        const text = target.innerText;
        this.documentData.body.basamentoLegal = text;
        this.documentData.body.preamble = text;
      }
    }
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
