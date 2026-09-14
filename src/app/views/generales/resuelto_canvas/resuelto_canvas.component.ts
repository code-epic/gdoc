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
  // Historial para deshacer/rehacer (Undo/Redo)
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private maxHistorySize = 50;
  private isApplyingHistory = false;

  @HostListener("window:keydown", ["$event"])
  onWindowKeyDown(event: KeyboardEvent) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    // 1. Bloquear Zoom
    if (
      isCtrlOrCmd &&
      (event.key === "-" ||
        event.key === "+" ||
        event.key === "=" ||
        event.key === "0")
    ) {
      event.preventDefault();
      return;
    }

    // 2. Control Z / Undo
    if (isCtrlOrCmd && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      this.undo();
      return;
    }

    // 3. Control Shift Z / Redo
    if (isCtrlOrCmd && event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      this.redo();
      return;
    }

    // 4. Control Y / Redo (Alternativo Windows)
    if (isCtrlOrCmd && event.key.toLowerCase() === "y") {
      event.preventDefault();
      this.redo();
      return;
    }
  }

  @ViewChild("container") containerRef!: ElementRef;
  @ViewChild("sandboxContainer") sandboxContainerRef!: ElementRef;
  @ViewChild("imageFileInput") imageFileInput!: ElementRef<HTMLInputElement>;

  // Variables para control interactivo de imágenes
  public selectedImage: HTMLImageElement | null = null;
  public showImageToolbar: boolean = false;
  public imageToolbarPos = { x: 0, y: 0 };
  public imageCustomWidth: number = 0;
  public imageCustomHeight: number = 0;
  public keepAspectRatio: boolean = true;
  public imageOverlayPos = { left: 0, top: 0, width: 0, height: 0 };
  private imageNaturalRatio: number = 1;
  public isDraggingResize: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private dragStartWidth: number = 0;
  private dragStartHeight: number = 0;

  get currentImageWidthDisplay(): string {
    if (!this.selectedImage) return "50%";
    return this.selectedImage.style.width || "50%";
  }

  public zoomScale: number = 1.0;

  get formattedZoom(): number {
    return Math.round(this.zoomScale * 100);
  }

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
  public activeSection: string = "";

  public basamentoLegalSafe: SafeHtml = "";
  public unicoParrafoSafe: SafeHtml = "";

  public showFloatingCommentBtn = false;
  public floatingBtnPos = { x: 0, y: 0 };

  public activeDropdown: string = "";

  toggleDropdown(dropdownName: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdown === dropdownName) {
      this.activeDropdown = "";
    } else {
      this.activeDropdown = dropdownName;
    }
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      this.activeDropdown = "";
    }
  }

  @HostListener("document:selectionchange")
  onSelectionChange() {
    if (this.profile !== "Revision") {
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
          y: rect.top - 45,
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
    if (changes["documentData"] && this.documentData) {
      if (!this.documentData.styles) {
        this.documentData.styles = {
          margins: { top: 25, right: 20, bottom: 5, left: 20 },
          lineHeights: {
            header: 1.75,
            resolucion: 1.15,
            basamento: 1.75,
            resuelve: 1.15,
            unico: 1.35,
            cases: 1.35,
            comuniquese: 1.15,
            footer: 1.15,
            firma: 1.15,
          },
        };
      }
      this.updateSafeHtmls();

      // Forzar repaginación automática tras cargar los datos y renderizar el DOM
      setTimeout(() => {
        if (!this.isPaginating) {
          this.paginateDOM();
        }
      }, 200);
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

  getSelectedBlocks(): HTMLElement[] {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return [];

    const range = selection.getRangeAt(0);
    const blocks: HTMLElement[] = [];

    // Encontrar el contenedor editable raíz
    const container = range.commonAncestorContainer;
    let rootEditable: HTMLElement | null = null;
    let node: Node | null = container;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (
          el.hasAttribute("contenteditable") ||
          el.classList.contains("cases-list")
        ) {
          rootEditable = el;
          break;
        }
      }
      node = node.parentNode;
    }

    if (!rootEditable) return [];

    // Solo apuntamos a elementos de bloque específicos (excluimos divs y spans contenedores)
    const allBlocks = Array.from(
      rootEditable.querySelectorAll("p, li, h1, h2, h3"),
    ) as HTMLElement[];

    // Si el propio contenedor editable es un bloque directo (ej. <p data-section="basamento"> o <p data-section="unico">)
    if (["p", "li", "h1", "h2", "h3"].includes(rootEditable.tagName.toLowerCase())) {
      allBlocks.push(rootEditable);
    }

    // Filtrar bloques que intersectan con el rango de selección
    allBlocks.forEach((block) => {
      if (selection.containsNode(block, true)) {
        blocks.push(block);
      }
    });

    // Fallback: si no se encontró ningún bloque (por ejemplo, la selección está completamente dentro de un solo párrafo)
    if (blocks.length === 0) {
      let node: Node | null = range.startContainer;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (
            ["p", "li", "h1", "h2", "h3"].includes(el.tagName.toLowerCase())
          ) {
            blocks.push(el);
            break;
          }
        }
        if (node === rootEditable) {
          if (["p", "li", "h1", "h2", "h3"].includes((node as HTMLElement).tagName.toLowerCase())) {
            blocks.push(node as HTMLElement);
          }
          break;
        }
        node = node.parentNode;
      }
    }

    return blocks;
  }

  cleanAndConsolidateDOM(element: HTMLElement) {
    if (!element) return;

    // 1. Limpiar spans vacíos o redundantes
    const spans = Array.from(element.querySelectorAll("span")) as HTMLElement[];
    spans.forEach((span) => {
      // Si el span no tiene contenido ni hijos, removerlo
      if (
        span.childNodes.length === 0 ||
        (span.textContent === "" && span.querySelectorAll("*").length === 0)
      ) {
        span.parentNode?.removeChild(span);
        return;
      }

      // Si el span no tiene estilos aplicados y no tiene clase, desenvolverlo
      if (!span.style.cssText && !span.className) {
        const parent = span.parentNode;
        if (parent) {
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
        }
      }
    });

    // 2. Normalizar el elemento para unir nodos de texto adyacentes
    element.normalize();

    // 3. Fusionar spans adyacentes que tengan exactamente el mismo estilo
    const containers = Array.from(
      element.querySelectorAll("p, li, h1, h2, h3"),
    ) as HTMLElement[];
    if (["p", "li", "h1", "h2", "h3"].includes(element.tagName.toLowerCase())) {
      containers.push(element);
    }

    containers.forEach((container) => {
      let child = container.firstChild;
      while (child) {
        let next = child.nextSibling;
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          next &&
          next.nodeType === Node.ELEMENT_NODE
        ) {
          const el1 = child as HTMLElement;
          const el2 = next as HTMLElement;

          if (
            el1.tagName.toLowerCase() === "span" &&
            el2.tagName.toLowerCase() === "span" &&
            el1.style.cssText === el2.style.cssText &&
            !el1.className &&
            !el2.className
          ) {
            // Fusionar el contenido de el2 en el1
            while (el2.firstChild) {
              el1.appendChild(el2.firstChild);
            }
            el2.parentNode?.removeChild(el2);
            // Re-evaluar el nuevo nodo adyacente
            next = el1.nextSibling;
            continue;
          }
        }
        child = next;
      }
    });

    // Normalizar text nodes finales generados por la fusión
    element.normalize();
  }

  applySelectionStyle(property: string, value: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let targetEditable: HTMLElement | null = null;

    // Caso 1: Hay texto seleccionado
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);

      const startContainer = range.startContainer;
      const startOffset = range.startOffset;
      const endContainer = range.endContainer;
      const endOffset = range.endOffset;

      const textNodes: Text[] = [];
      const commonAncestor = range.commonAncestorContainer;

      // Encontrar el contenedor contenteditable
      let node: Node | null = commonAncestor;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (
            el.hasAttribute("contenteditable") ||
            el.classList.contains("cases-list")
          ) {
            targetEditable = el;
            break;
          }
        }
        node = node.parentNode;
      }

      // Crear TreeWalker para recolectar todos los nodos de texto en el rango
      const walker = document.createTreeWalker(
        commonAncestor,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (range.intersectsNode(node)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          },
        },
      );

      if (commonAncestor.nodeType === Node.TEXT_NODE) {
        textNodes.push(commonAncestor as Text);
      } else {
        let currentNode = walker.nextNode();
        while (currentNode) {
          textNodes.push(currentNode as Text);
          currentNode = walker.nextNode();
        }
      }

      if (textNodes.length > 0) {
        // Guardar posiciones para no alterarlas al dividir los nodos
        const nodesToProcess: { node: Text; start: number; end: number }[] = [];
        textNodes.forEach((node) => {
          let start = 0;
          let end = node.length;

          if (node === startContainer) {
            start = startOffset;
          }
          if (node === endContainer) {
            end = endOffset;
          }

          if (start < end) {
            nodesToProcess.push({ node, start, end });
          }
        });

        // Procesar de atrás hacia adelante para mantener los offsets válidos
        for (let i = nodesToProcess.length - 1; i >= 0; i--) {
          const { node, start, end } = nodesToProcess[i];
          let targetNode = node;

          if (end < node.length) {
            targetNode.splitText(end);
          }
          if (start > 0) {
            targetNode = targetNode.splitText(start);
          }

          const parent = targetNode.parentNode as HTMLElement;
          if (
            parent &&
            parent.tagName.toLowerCase() === "span" &&
            parent.childNodes.length === 1 &&
            !parent.className
          ) {
            parent.style[property as any] = value;
          } else {
            const span = document.createElement("span");
            span.style[property as any] = value;
            parent.insertBefore(span, targetNode);
            span.appendChild(targetNode);
          }
        }

        // Limpiar selección para asegurar consistencia
        selection.removeAllRanges();
      }
    }
    // Caso 2: Cursor colapsado, aplicamos al bloque específico más cercano
    else {
      let node: Node | null = selection.anchorNode;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          // Solo aplicar a elementos de bloque reales, no a divs contenedores generales
          if (["p", "li", "h1", "h2", "h3"].includes(tagName)) {
            el.style[property as any] = value;
            targetEditable = el;
            break;
          }
        }
        node = node.parentNode;
      }
    }

    // Consolidar y limpiar el DOM del editable que fue modificado
    if (targetEditable) {
      this.cleanAndConsolidateDOM(targetEditable);
    }

    // Sincronizar el DOM al modelo para que no se pierda el cambio al repaginar
    this.syncDOMToModel();
    this.casesInput$.next();
  }

  applyBlockStyle(property: string, value: string) {
    const blocks = this.getSelectedBlocks();
    blocks.forEach((block) => {
      block.style[property as any] = value;
    });

    this.syncDOMToModel();
    this.casesInput$.next();
  }

  /**
   * Lee el contenido actual de cada .cases-list del DOM y lo persiste en el modelo
   * (documentData.pages[i].casesHtml). También captura basamento y unico.
   * Debe llamarse ANTES de casesInput$.next() cuando se aplican estilos directamente al DOM.
   */
  syncDOMToModel() {
    if (!this.documentData || !this.documentData.pages) return;
    const canvases = this.el.nativeElement.querySelectorAll(".a4-canvas");
    canvases.forEach((canvas: HTMLElement, idx: number) => {
      if (!this.documentData.pages[idx]) return;
      const casesList = canvas.querySelector(".cases-list") as HTMLElement;
      if (casesList) {
        this.cleanAndConsolidateDOM(casesList);
        const html = casesList.innerHTML;
        this.documentData.pages[idx].casesHtml = html;
        this.documentData.pages[idx].casesHtmlSafe =
          this.sanitizer.bypassSecurityTrustHtml(html);
      }
    });

    // También capturar basamento y unico del primer canvas (solo aparecen en página 0)
    const firstCanvas = this.el.nativeElement.querySelector(
      ".a4-canvas",
    ) as HTMLElement | null;
    if (firstCanvas && this.documentData.body) {
      const basamentoEl = firstCanvas.querySelector(
        '[data-section="basamento"]',
      ) as HTMLElement | null;
      if (basamentoEl) {
        this.cleanAndConsolidateDOM(basamentoEl);
        const html = basamentoEl.innerHTML;
        this.documentData.body.basamentoLegal = html;
        this.basamentoLegalSafe = this.sanitizer.bypassSecurityTrustHtml(html);
        this.basamentoLegalChange.emit(html);
      }

      const unicoEl = firstCanvas.querySelector(
        '[data-section="unico"]',
      ) as HTMLElement | null;
      if (unicoEl) {
        this.cleanAndConsolidateDOM(unicoEl);
        const html = unicoEl.innerHTML;
        this.documentData.body.unicoParrafo = html;
        this.unicoParrafoSafe = this.sanitizer.bypassSecurityTrustHtml(html);
        this.unicoParrafoChange.emit(html);
      }
    }
  }

  applyFontSizeSelection(size: string) {
    this.applySelectionStyle("fontSize", size);
  }

  applyLineSpacingSelection(spacing: string) {
    // El interlineado (lineHeight) es un estilo a nivel de párrafo/bloque.
    // Lo aplicamos directamente a los bloques seleccionados para un resultado óptimo.
    this.applyBlockStyle("lineHeight", spacing);
  }

  applyLetterSpacingSelection(spacing: string) {
    this.applySelectionStyle("letterSpacing", spacing);
  }

  adjustBlockPadding(
    property: "paddingLeft" | "paddingRight",
    delta: number,
    skipEmit = false,
  ) {
    const blocks = this.getSelectedBlocks();

    blocks.forEach((el) => {
      const currentVal =
        parseFloat(window.getComputedStyle(el)[property as any]) || 0;
      const inlineStyle = el.style[property as any];
      let val = 0;
      if (inlineStyle.endsWith("mm")) {
        val = parseFloat(inlineStyle);
      } else if (inlineStyle.endsWith("px")) {
        val = parseFloat(inlineStyle) * 0.264583;
      } else {
        val = currentVal * 0.264583;
      }

      const newVal = Math.max(0, val + delta);
      el.style[property as any] = newVal === 0 ? "" : `${newVal}mm`;
    });

    if (!skipEmit) {
      this.syncDOMToModel();
      this.casesInput$.next();
    }
  }

  increaseIndentLeft() {
    this.adjustBlockPadding("paddingLeft", 5);
  }
  decreaseIndentLeft() {
    this.adjustBlockPadding("paddingLeft", -5);
  }
  increaseIndentRight() {
    this.adjustBlockPadding("paddingRight", 5);
  }
  decreaseIndentRight() {
    this.adjustBlockPadding("paddingRight", -5);
  }

  widenLine() {
    this.adjustBlockPadding("paddingLeft", -5, true);
    this.adjustBlockPadding("paddingRight", -5, true);
    this.syncDOMToModel();
    this.saveHistoryState();
    this.casesInput$.next();
  }

  narrowLine() {
    this.adjustBlockPadding("paddingLeft", 5, true);
    this.adjustBlockPadding("paddingRight", 5, true);
    this.syncDOMToModel();
    this.saveHistoryState();
    this.casesInput$.next();
  }

  saveHistoryState() {
    if (this.isApplyingHistory) return;
    if (!this.documentData || !this.documentData.pages) return;

    const state = JSON.stringify(
      this.documentData.pages.map((p: any) => ({
        pageIndex: p.pageIndex,
        casesHtml: p.casesHtml,
      })),
    );

    if (
      this.undoStack.length > 0 &&
      this.undoStack[this.undoStack.length - 1] === state
    ) {
      return;
    }

    this.undoStack.push(state);
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    this.isApplyingHistory = true;
    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);
    const prevState = this.undoStack[this.undoStack.length - 1];
    this.applyHistoryState(prevState);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.isApplyingHistory = true;
    const nextState = this.redoStack.pop()!;
    this.undoStack.push(nextState);
    this.applyHistoryState(nextState);
  }

  private applyHistoryState(stateJson: string) {
    try {
      const pagesData = JSON.parse(stateJson);
      this.saveCaret();

      this.documentData.pages = pagesData.map((p: any) => ({
        pageIndex: p.pageIndex,
        casesHtml: p.casesHtml,
        casesHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(
          p.casesHtml || "",
        ),
      }));

      this.cdr.detectChanges();

      setTimeout(() => {
        this.restoreCaret();
        this.isApplyingHistory = false;
      }, 50);
    } catch (e) {
      console.error("Error al aplicar estado del historial:", e);
      this.isApplyingHistory = false;
    }
  }

  public async addComment() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      Swal.fire(
        "Selección vacía",
        "Por favor, selecciona un texto para añadir un comentario.",
        "warning",
      );
      return;
    }

    const range = sel.getRangeAt(0).cloneRange(); // Guardar el rango ANTES de abrir Swal

    const { value: text } = await Swal.fire({
      title: "Añadir comentario",
      input: "textarea",
      inputLabel: "Escribe tu observación:",
      inputPlaceholder: "Ej. Revisar este nombre...",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (text) {
      const commentId = "cmt_" + new Date().getTime();
      const span = document.createElement("span");
      span.className = "resuelto-comment pending";
      span.style.backgroundColor = "#ffe066";
      span.style.color = "#333";
      span.dataset["commentId"] = commentId;

      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);

        // Sync the modified DOM back to the model immediately
        const container =
          span.closest(".cases-list") || span.closest("[data-section]");
        if (container) {
          const section = container.getAttribute("data-section");
          if (section === "cases") {
            const currentCanvas = container.closest(".a4-canvas");
            if (currentCanvas) {
              const canvases = Array.from(
                this.el.nativeElement.querySelectorAll(".a4-canvas"),
              );
              const pageIdx = canvases.indexOf(currentCanvas);
              if (
                pageIdx !== -1 &&
                this.documentData &&
                this.documentData.pages
              ) {
                this.documentData.pages[pageIdx].casesHtml =
                  container.innerHTML;
                this.documentData.pages[pageIdx].casesHtmlSafe =
                  this.sanitizer.bypassSecurityTrustHtml(
                    container.innerHTML || "",
                  );
              }
            }
          } else if (section === "unico") {
            this.documentData.body.unicoParrafo = container.innerHTML;
            this.unicoParrafoChange.emit(container.innerHTML);
          } else if (section === "basamento") {
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
          status: "pending",
          author: `${this.jwtData?.userName || "Usuario"} (${this.jwtData?.userRole || "Revisión"})`,
          date: new Date().toLocaleString("es-VE"),
        });

        this.commentAdded.emit();
      } catch (e) {
        console.error(e);
        Swal.fire(
          "Error",
          "No se puede añadir el comentario en esta selección (no cruces párrafos).",
          "error",
        );
      }
    }
  }

  public removeHighlight(id: string) {
    const spans = this.el.nativeElement.querySelectorAll(
      `span[data-comment-id="${id}"]`,
    );
    spans.forEach((span: HTMLElement) => {
      // Save reference to container BEFORE detaching span from DOM
      const container =
        span.closest(".cases-list") || span.closest("[data-section]");

      // Unwrap the span to remove it completely from the HTML
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      }

      // Sync the modified DOM back to the model
      if (container) {
        const section = container.getAttribute("data-section");
        if (section === "cases") {
          const currentCanvas = container.closest(".a4-canvas");
          if (currentCanvas) {
            const canvases = Array.from(
              this.el.nativeElement.querySelectorAll(".a4-canvas"),
            );
            const pageIdx = canvases.indexOf(currentCanvas);
            if (
              pageIdx !== -1 &&
              this.documentData &&
              this.documentData.pages
            ) {
              this.documentData.pages[pageIdx].casesHtml = container.innerHTML;
              this.documentData.pages[pageIdx].casesHtmlSafe =
                this.sanitizer.bypassSecurityTrustHtml(
                  container.innerHTML || "",
                );
            }
          }
        } else if (section === "unico") {
          this.documentData.body.unicoParrafo = container.innerHTML;
          this.unicoParrafoChange.emit(container.innerHTML);
        } else if (section === "basamento") {
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
      this.documentData.styles.lineHeights[this.activeSection] =
        this.currentLineSpacing;

      if (
        this.activeSection === "cases" ||
        (this.activeElement &&
          this.activeElement.classList.contains("cases-list"))
      ) {
        this.casesInput$.next();
      }
    } else if (this.activeElement) {
      this.activeElement.style.lineHeight = this.currentLineSpacing.toString();
      const children = this.activeElement.querySelectorAll("p, span, div");
      children.forEach((child) => {
        (child as HTMLElement).style.lineHeight = this.currentLineSpacing.toString();
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
    private sanitizer: DomSanitizer,
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
          resolucion: 1.15,
          basamento: 1.75,
          resuelve: 1.15,
          unico: 1.35,
          cases: 1.35,
          comuniquese: 1.15,
          footer: 1.15,
          firma: 1.15,
        },
      };
    }

    this.casesInput$.pipe(debounceTime(350)).subscribe(() => {
      this.casesBlur.emit();
      this.paginateDOM();
      this.saveHistoryState();
    });

    setTimeout(() => {
      this.saveHistoryState();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.casesInput$.complete();
  }

  private updateSafeHtmls() {
    if (this.documentData) {
      if (this.documentData.body) {
        this.basamentoLegalSafe = this.sanitizer.bypassSecurityTrustHtml(
          this.documentData.body.basamentoLegal ||
            this.documentData.body.preamble ||
            "",
        );
        this.unicoParrafoSafe = this.sanitizer.bypassSecurityTrustHtml(
          this.documentData.body.unicoParrafo || "",
        );
      }
      if (this.documentData.pages) {
        this.documentData.pages.forEach((p: any) => {
          p.casesHtmlSafe = this.sanitizer.bypassSecurityTrustHtml(
            p.casesHtml || "",
          );
        });
      }
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
    this.basamentoLegalChange.emit(target.innerHTML || "");
  }

  onUnicoParrafoEdit(event: Event) {
    const target = event.target as HTMLElement;
    this.unicoParrafoChange.emit(target.innerHTML || "");

    const currentCanvas = target.closest(".a4-canvas") as HTMLElement;
    if (currentCanvas) {
      let isOverflowing = false;
      const casesList = currentCanvas.querySelector(".cases-list");
      if (casesList) {
        const canvasRect = currentCanvas.getBoundingClientRect();
        const listRect = casesList.getBoundingClientRect();
        isOverflowing = canvasRect.bottom - listRect.bottom < 76;
      }

      if (isOverflowing) {
        this.paginateDOM();
      }
    }
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

  getFirstInitial(): string {
    const initials = this.documentData?.signatures?.initials || "";
    if (initials.includes("/")) {
      const parts = initials.split("/");
      return parts[0] + "/";
    }
    return initials;
  }

  onCasesListInput(event: Event, pageIndex: number) {
    const target = event.target as HTMLElement;
    const casesListEl =
      (target.closest(".cases-list") as HTMLElement) || target;
    const html = casesListEl.innerHTML;

    // Guardar SIEMPRE el html crudo en el modelo para no perder tabulaciones o contenido tipeado
    if (
      this.documentData &&
      this.documentData.pages &&
      this.documentData.pages[pageIndex]
    ) {
      this.documentData.pages[pageIndex].casesHtml = html;
    }

    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] = html;
    }

    // Disparar paginación debouncada para no interrumpir el tipeo del usuario ni congelar la interfaz
    this.casesInput$.next();
  }

  onCasesListBlur(event: Event, pageIndex: number) {
    const target = event.target as HTMLElement;
    const casesListEl =
      (target.closest(".cases-list") as HTMLElement) || target;
    const html = casesListEl.innerHTML;

    // Al salir del input (blur), SÍ guardamos los cambios en el modelo de datos
    if (
      this.documentData &&
      this.documentData.pages &&
      this.documentData.pages[pageIndex]
    ) {
      this.documentData.pages[pageIndex].casesHtml = html;
      this.documentData.pages[pageIndex].casesHtmlSafe =
        this.sanitizer.bypassSecurityTrustHtml(html || "");
    }

    // Y luego disparamos la paginación dinámica, ya que el usuario dejó de escribir
    this.casesInput$.next();
    this.casesBlur.emit();
  }

  getClosestBlock(node: Node | null): HTMLElement | null {
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (["p", "li", "h1", "h2", "h3", "div"].includes(tag)) {
          return el;
        }
      }
      node = node.parentNode;
    }
    return null;
  }

  isCaretAtStartOfBlock(range: Range, block: HTMLElement): boolean {
    try {
      const preRange = range.cloneRange();
      preRange.selectNodeContents(block);
      preRange.setEnd(range.startContainer, range.startOffset);
      return preRange.toString().length === 0;
    } catch {
      return false;
    }
  }

  onKeydownCases(event: KeyboardEvent, pageIndex: number) {
    if (event.key === "Tab") {
      event.preventDefault();

      const inList =
        document.queryCommandState("insertUnorderedList") ||
        document.queryCommandState("insertOrderedList");

      if (event.shiftKey) {
        // Shift + Tab (Reducir Sangría / Outdent hacia el margen)
        if (inList) {
          document.execCommand("outdent", false, "");
        } else {
          this.decreaseIndentLeft();
        }
      } else {
        // Normal Tab (Aumentar Sangría / Indent)
        if (inList) {
          document.execCommand("indent", false, "");
        } else {
          const selection = window.getSelection();
          if (selection && !selection.isCollapsed) {
            this.increaseIndentLeft();
          } else {
            const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
            const block = range ? this.getClosestBlock(range.startContainer) : null;
            if (block && range && this.isCaretAtStartOfBlock(range, block)) {
              this.increaseIndentLeft();
            } else {
              document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
            }
          }
        }
      }

      this.onCasesListInput(event, pageIndex);
      return;
    }

    // Control de retroceso (Backspace) para liberar tabulaciones/sangrías condenadas
    if (event.key === "Backspace") {
      const sel = window.getSelection();
      if (sel && sel.isCollapsed && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const block = this.getClosestBlock(range.startContainer);
        if (block && this.isCaretAtStartOfBlock(range, block)) {
          const pl = parseFloat(block.style.paddingLeft) || 0;
          const ml = parseFloat(block.style.marginLeft) || 0;
          const ti = parseFloat(block.style.textIndent) || 0;

          if (pl > 0 || ml > 0 || ti > 0) {
            event.preventDefault();
            if (pl > 0) {
              const newPl = Math.max(0, pl - 5);
              block.style.paddingLeft = newPl > 0 ? `${newPl}mm` : "";
            }
            if (ml > 0) {
              const newMl = Math.max(0, ml - 5);
              block.style.marginLeft = newMl > 0 ? `${newMl}mm` : "";
            }
            if (ti > 0) {
              block.style.textIndent = "";
            }
            this.syncDOMToModel();
            this.casesInput$.next();
            return;
          }
        }
      }
    }
  }

  // --- CONTROL Y MANEJO DE IMÁGENES ---
  @HostListener("window:scroll")
  onWindowScroll() {
    if (this.showImageToolbar && this.selectedImage) {
      this.updateImageToolbarPos();
    }
  }

  onCanvasClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target &&
      target.tagName.toLowerCase() === "img" &&
      !target.classList.contains("wet-stamp-layer") &&
      !target.classList.contains("signature-layer")
    ) {
      this.selectImage(target as HTMLImageElement);
    } else if (!target.closest(".floating-image-toolbar") && !target.closest(".image-resize-overlay")) {
      this.deselectImage();
    }
  }

  selectImage(img: HTMLImageElement) {
    if (this.selectedImage && this.selectedImage !== img) {
      this.selectedImage.classList.remove("selected-doc-image");
    }
    this.selectedImage = img;
    img.classList.add("selected-doc-image");
    img.classList.add("resuelto-doc-image");

    const rect = img.getBoundingClientRect();
    this.imageCustomWidth = Math.round(rect.width);
    this.imageCustomHeight = Math.round(rect.height);

    if (img.naturalWidth && img.naturalHeight) {
      this.imageNaturalRatio = img.naturalWidth / img.naturalHeight;
    } else {
      this.imageNaturalRatio =
        this.imageCustomWidth / (this.imageCustomHeight || 1);
    }

    this.updateImageToolbarPos();
    this.showImageToolbar = true;
  }

  deselectImage() {
    if (this.selectedImage) {
      this.selectedImage.classList.remove("selected-doc-image");
      this.selectedImage = null;
    }
    this.showImageToolbar = false;
  }

  updateImageToolbarPos() {
    if (!this.selectedImage) return;
    const rect = this.selectedImage.getBoundingClientRect();
    this.imageCustomWidth = Math.round(rect.width);
    this.imageCustomHeight = Math.round(rect.height);

    this.imageToolbarPos = {
      x: Math.max(10, rect.left + rect.width / 2 - 200),
      y: rect.top > 65 ? rect.top - 52 : rect.bottom + 12,
    };

    this.imageOverlayPos = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * Determina el ancho máximo permitido para la imagen:
   * Si no hay texto cerca (bloque independiente), permite agrandar hasta el ancho completo disponible del canvas.
   * Si hay texto al lado (float), limita el tamaño para respetar el tope de texto.
   */
  getMaxAvailableWidth(): number {
    if (!this.selectedImage) return 800;
    const canvas = this.selectedImage.closest(".a4-canvas") as HTMLElement;
    if (!canvas) return 800;

    const parent = this.selectedImage.parentElement;
    const hasInlineText =
      parent && parent.textContent && parent.textContent.trim().length > 0;
    const isFloating =
      this.selectedImage.style.float === "left" ||
      this.selectedImage.style.float === "right";

    const canvasWidth = canvas.clientWidth;
    const margins = this.documentData?.styles?.margins || {
      left: 20,
      right: 20,
    };
    // Margen físico en px (~3.78px/mm)
    const marginsPx = ((margins.left || 20) + (margins.right || 20)) * 3.78;
    const printableWidth = Math.max(200, canvasWidth - marginsPx);

    // Si tiene float y hay texto contiguo, limitamos al 65% para no aplastar el texto
    if (isFloating && hasInlineText) {
      return Math.round(printableWidth * 0.65);
    }

    // Si está aislada o centrada sin tope de texto contiguo, puede expandirse hasta el ancho útil completo
    return Math.round(printableWidth);
  }

  setImageSize(percent: number) {
    if (!this.selectedImage) return;
    const maxWidth = this.getMaxAvailableWidth();
    const targetWidth = Math.round((maxWidth * percent) / 100);

    this.selectedImage.style.maxWidth = `${maxWidth}px`;
    this.selectedImage.style.width = `${targetWidth}px`;
    if (this.keepAspectRatio) {
      this.selectedImage.style.height = "auto";
    }

    this.syncDOMToModel();
    this.casesInput$.next();

    setTimeout(() => {
      this.updateImageToolbarPos();
    }, 50);
  }

  setImageWidthPx(widthPx: any) {
    const val = parseFloat(widthPx);
    if (!this.selectedImage || isNaN(val) || val <= 20) return;
    const maxWidth = this.getMaxAvailableWidth();
    const clampedWidth = Math.min(maxWidth, Math.max(30, val));

    this.selectedImage.style.maxWidth = `${maxWidth}px`;
    this.selectedImage.style.width = `${clampedWidth}px`;
    if (this.keepAspectRatio) {
      this.selectedImage.style.height = `${Math.round(clampedWidth / this.imageNaturalRatio)}px`;
    }

    this.syncDOMToModel();
    this.casesInput$.next();
    setTimeout(() => this.updateImageToolbarPos(), 50);
  }

  setImageHeightPx(heightPx: any) {
    const val = parseFloat(heightPx);
    if (!this.selectedImage || isNaN(val) || val <= 20) return;
    this.selectedImage.style.height = `${Math.max(30, val)}px`;

    if (this.keepAspectRatio) {
      const newWidth = Math.round(val * this.imageNaturalRatio);
      const maxWidth = this.getMaxAvailableWidth();
      const clampedWidth = Math.min(maxWidth, Math.max(30, newWidth));
      this.selectedImage.style.maxWidth = `${maxWidth}px`;
      this.selectedImage.style.width = `${clampedWidth}px`;
    }

    this.syncDOMToModel();
    this.casesInput$.next();
    setTimeout(() => this.updateImageToolbarPos(), 50);
  }

  toggleAspectRatio() {
    this.keepAspectRatio = !this.keepAspectRatio;
  }

  adjustImageWidth(delta: number) {
    if (!this.selectedImage) return;
    const currentW =
      this.imageCustomWidth ||
      Math.round(this.selectedImage.getBoundingClientRect().width) ||
      100;
    this.setImageWidthPx(currentW + delta);
  }

  startResizeDrag(event: MouseEvent, direction: "br" | "r" | "b") {
    event.preventDefault();
    event.stopPropagation();
    if (!this.selectedImage) return;

    this.isDraggingResize = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    const rect = this.selectedImage.getBoundingClientRect();
    this.dragStartWidth = rect.width;
    this.dragStartHeight = rect.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!this.selectedImage) return;
      const deltaX = moveEvent.clientX - this.dragStartX;
      const deltaY = moveEvent.clientY - this.dragStartY;
      let newWidth = this.dragStartWidth;
      let newHeight = this.dragStartHeight;

      const maxWidth = this.getMaxAvailableWidth();

      if (direction === "br" || direction === "r") {
        newWidth = Math.min(
          maxWidth,
          Math.max(30, this.dragStartWidth + deltaX),
        );
      }
      if (direction === "br") {
        if (this.keepAspectRatio) {
          newHeight = Math.round(newWidth / this.imageNaturalRatio);
        } else {
          newHeight = Math.max(30, this.dragStartHeight + deltaY);
        }
      } else if (direction === "b") {
        newHeight = Math.max(30, this.dragStartHeight + deltaY);
        if (this.keepAspectRatio) {
          newWidth = Math.min(
            maxWidth,
            Math.max(30, Math.round(newHeight * this.imageNaturalRatio)),
          );
        }
      }

      this.selectedImage.style.maxWidth = `${maxWidth}px`;
      this.selectedImage.style.width = `${newWidth}px`;
      this.selectedImage.style.height = `${newHeight}px`;
      this.updateImageToolbarPos();
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      this.isDraggingResize = false;
      this.syncDOMToModel();
      this.casesInput$.next();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  setImageAlign(align: "left" | "center" | "right") {
    if (!this.selectedImage) return;
    if (align === "center") {
      this.selectedImage.style.display = "block";
      this.selectedImage.style.margin = "8px auto";
      this.selectedImage.style.float = "none";
    } else if (align === "left") {
      this.selectedImage.style.display = "block";
      this.selectedImage.style.margin = "8px auto 8px 0";
      this.selectedImage.style.float = "left";
    } else if (align === "right") {
      this.selectedImage.style.display = "block";
      this.selectedImage.style.margin = "8px 0 8px auto";
      this.selectedImage.style.float = "right";
    }
    this.syncDOMToModel();
    this.casesInput$.next();
    setTimeout(() => this.updateImageToolbarPos(), 50);
  }

  deleteSelectedImage() {
    if (!this.selectedImage) return;
    const parent = this.selectedImage.parentNode;
    this.selectedImage.remove();
    if (parent && parent.childNodes.length === 0) {
      parent.parentNode?.removeChild(parent);
    }
    this.deselectImage();
    this.syncDOMToModel();
    this.casesInput$.next();
  }

  triggerImageUpload() {
    if (this.imageFileInput) {
      this.imageFileInput.nativeElement.click();
    }
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.insertImageToDocument(dataUrl);
        input.value = "";
      };
      reader.readAsDataURL(file);
    }
  }

  insertImageToDocument(dataUrl: string, pageIndex?: number) {
    const imgHtml = `<p style="text-align: center; margin: 8px 0;"><img src="${dataUrl}" class="resuelto-doc-image" style="width: 50%; max-width: 100%; height: auto; display: block; margin: 8px auto; border-radius: 2px; cursor: pointer;" /></p>`;

    const sel = window.getSelection();
    let inserted = false;
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;
      if (this.el.nativeElement.contains(container)) {
        try {
          range.deleteContents();
          const div = document.createElement("div");
          div.innerHTML = imgHtml;
          const frag = document.createDocumentFragment();
          while (div.firstChild) {
            frag.appendChild(div.firstChild);
          }
          range.insertNode(frag);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
          inserted = true;
        } catch (e) {
          console.warn("Error inserting image via range:", e);
        }
      }
    }

    if (!inserted) {
      const pIdx =
        pageIndex !== undefined
          ? pageIndex
          : (this.documentData.pages.length - 1);
      const canvases = Array.from(
        this.el.nativeElement.querySelectorAll(".a4-canvas"),
      ) as HTMLElement[];
      const targetCanvas = canvases[pIdx] || canvases[canvases.length - 1];
      const casesList = targetCanvas?.querySelector(".cases-list") as HTMLElement;
      if (casesList) {
        casesList.insertAdjacentHTML("beforeend", imgHtml);
      } else if (this.documentData.pages[pIdx]) {
        this.documentData.pages[pIdx].casesHtml =
          (this.documentData.pages[pIdx].casesHtml || "") + imgHtml;
        this.documentData.pages[pIdx].casesHtmlSafe =
          this.sanitizer.bypassSecurityTrustHtml(
            this.documentData.pages[pIdx].casesHtml,
          );
      }
    }

    this.syncDOMToModel();
    this.saveHistoryState();
    this.casesInput$.next();
  }

  onPasteCases(event: ClipboardEvent, pageIndex: number) {
    // 1. Detectar si viene una imagen en el portapapeles
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          event.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              this.insertImageToDocument(dataUrl, pageIndex);
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    }

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

    const cleanHtml = this.formatCedulasInHtml(doc.body.innerHTML);
    const target =
      (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
    const casesListEl =
      (target.closest(".cases-list") as HTMLElement) || target;

    // Intentar insertar en la selección usando Range API para evitar duplicados y fallos en vacíos
    const sel = window.getSelection();
    let inserted = false;
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (casesListEl.contains(range.commonAncestorContainer)) {
        try {
          range.deleteContents();
          const el = document.createElement("div");
          el.innerHTML = cleanHtml;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = el.firstChild)) {
            frag.appendChild(node);
          }
          range.insertNode(frag);
          inserted = true;
          // Mover cursor al final de lo insertado
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {
          console.warn(
            "Fallo insertNode manual en pegar, usando execCommand:",
            e,
          );
        }
      }
    }

    if (!inserted) {
      // Fallback si no hay selección válida o está vacío
      if (
        casesListEl.innerHTML.trim() === "" ||
        casesListEl.innerHTML === "<br>"
      ) {
        casesListEl.innerHTML = cleanHtml;
      } else {
        const el = document.createElement("div");
        el.innerHTML = cleanHtml;
        while (el.firstChild) {
          casesListEl.appendChild(el.firstChild);
        }
      }
    }

    // Guardar cambios manualmente
    if (
      this.documentData &&
      this.documentData.pages &&
      this.documentData.pages[pageIndex]
    ) {
      this.documentData.pages[pageIndex].casesHtml = casesListEl.innerHTML;
    }

    if (this.documentData && this.documentData.bodyData) {
      this.documentData.bodyData["_pageCasesHtml_" + pageIndex] =
        casesListEl.innerHTML;
    }

    this.saveHistoryState();
    this.casesInput$.next();
  }

  // --- SISTEMA DE RESTAURACIÓN DE PUNTERO (CARET) ---
  // --- SISTEMA DE RESTAURACIÓN DE PUNTERO (CARET) ---
  savedCaretPosition: { section: string; start: number; end: number } | null =
    null;

  saveCaret() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);

      // Encontrar el contenedor contenteditable más cercano
      let editableEl: HTMLElement | null = null;
      let node: Node | null = range.startContainer;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (
            el.hasAttribute("contenteditable") ||
            el.classList.contains("cases-list")
          ) {
            editableEl = el;
            break;
          }
        }
        node = node.parentNode;
      }

      if (editableEl) {
        const section = editableEl.getAttribute("data-section") || "cases";
        let start = 0;
        let end = 0;

        if (section === "cases") {
          // Si es cases, sumamos los textos de todos los cases-list anteriores en el DOM
          const allCasesLists = Array.from(
            this.el.nativeElement.querySelectorAll(".cases-list"),
          ) as HTMLElement[];
          const activeListIdx = allCasesLists.indexOf(editableEl);

          for (let i = 0; i < activeListIdx; i++) {
            start += allCasesLists[i].textContent?.length || 0;
          }

          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(editableEl);
          preCaretRange.setEnd(range.startContainer, range.startOffset);
          start += preCaretRange.toString().length;
          end = start + range.toString().length;
        } else {
          // Si es otra sección, calculamos relativo a ese elemento individual
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(editableEl);
          preCaretRange.setEnd(range.startContainer, range.startOffset);
          start = preCaretRange.toString().length;
          end = start + range.toString().length;
        }

        this.savedCaretPosition = { section, start, end };
      }
    }
  }

  restoreCaret() {
    if (this.savedCaretPosition !== null) {
      const saved = this.savedCaretPosition;
      const section = saved.section;
      let targetEl: HTMLElement | null = null;

      if (section === "cases") {
        const allCasesLists = Array.from(
          this.el.nativeElement.querySelectorAll(".cases-list"),
        ) as HTMLElement[];
        let totalTextLen = 0;
        allCasesLists.forEach(
          (list) => (totalTextLen += list.textContent?.length || 0),
        );

        // Clampear offsets para evitar problemas con espacios colapsados por render de innerHTML
        const clampedStart = Math.min(saved.start, totalTextLen);
        const clampedEnd = Math.min(saved.end, totalTextLen);

        let remainingStart = clampedStart;
        let remainingEnd = clampedEnd;

        for (const list of allCasesLists) {
          const textLen = list.textContent?.length || 0;
          if (remainingStart <= textLen) {
            targetEl = list;
            break;
          }
          remainingStart -= textLen;
          remainingEnd -= textLen;
        }

        if (!targetEl && allCasesLists.length > 0) {
          targetEl = allCasesLists[allCasesLists.length - 1];
          remainingStart = targetEl.textContent?.length || 0;
          remainingEnd = remainingStart;
        }

        if (targetEl) {
          this.restoreCaretInElement(targetEl, remainingStart, remainingEnd);
        }
      } else {
        targetEl = this.el.nativeElement.querySelector(
          `[data-section="${section}"]`,
        ) as HTMLElement;
        if (targetEl) {
          const textLen = targetEl.textContent?.length || 0;
          const clampedStart = Math.min(saved.start, textLen);
          const clampedEnd = Math.min(saved.end, textLen);
          this.restoreCaretInElement(targetEl, clampedStart, clampedEnd);
        }
      }

      this.savedCaretPosition = null;
    }
  }

  private restoreCaretInElement(el: HTMLElement, start: number, end: number) {
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
        if (!foundStart && start >= charIndex && start <= nextCharIndex) {
          range.setStart(node, start - charIndex);
          foundStart = true;
        }
        if (!foundEnd && end >= charIndex && end <= nextCharIndex) {
          range.setEnd(node, end - charIndex);
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

    // Fallback: Si no se encontró un nodo de texto pero el elemento tiene nodos hijos (ej. <p><br></p>)
    if (!foundStart) {
      const editables = el.querySelectorAll("p, li, div, span");
      if (editables.length > 0) {
        const lastEditable = editables[editables.length - 1] as HTMLElement;
        range.setStart(lastEditable, 0);
        range.collapse(true);
      } else {
        range.setStart(el, el.childNodes.length);
        range.collapse(true);
      }
    }

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  isPaginating = false;

  paginateDOM() {
    if (!this.documentData || !this.documentData.pages) return;

    this.isPaginating = true;

    // Guardar cursor y posición de scroll del visor
    this.saveCaret();
    const scrollContainer =
      this.containerRef?.nativeElement?.parentElement || this.el.nativeElement;
    const prevScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

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

    const sandboxEl = this.sandboxContainerRef?.nativeElement;
    if (!sandboxEl) {
      this.isPaginating = false;
      return;
    }

    sandboxEl.innerHTML = "";

    const margins = this.documentData?.styles?.margins || {
      top: 25,
      right: 20,
      bottom: 5,
      left: 20,
    };
    const lineHeights = this.documentData?.styles?.lineHeights || {};

    const createSandboxPage = (
      pageIdx: number,
    ): { pageEl: HTMLElement; casesListEl: HTMLElement } => {
      const pageEl = document.createElement("div");
      pageEl.className = "a4-canvas";
      pageEl.style.width = "215.9mm";
      pageEl.style.height = "355.6mm";
      pageEl.style.overflow = "hidden";
      pageEl.style.boxSizing = "border-box";
      pageEl.style.paddingTop = `${margins.top || 25}mm`;
      pageEl.style.paddingRight = `${margins.right || 20}mm`;
      pageEl.style.paddingBottom = `${margins.bottom || 5}mm`;
      pageEl.style.paddingLeft = `${margins.left || 20}mm`;
      pageEl.style.position = "relative";
      pageEl.style.display = "flex";
      pageEl.style.flexDirection = "column";
      pageEl.style.fontFamily = "'Tahoma', sans-serif";
      pageEl.style.fontSize = "13pt";

      if (pageIdx === 0) {
        const headerEl = document.createElement("header");
        headerEl.className = "doc-header";
        headerEl.style.textAlign = "center";
        headerEl.style.lineHeight = "1";
        headerEl.innerHTML = `
          <p class="m-resolucion-membrete" style="font-weight: bold; text-transform: uppercase; text-align: center; line-height: ${lineHeights.header || 1.75}; margin: 0;">REPÚBLICA BOLIVARIANA DE VENEZUELA</p>
          <p class="m-resolucion-membrete" style="font-weight: bold; text-transform: uppercase; text-align: center; line-height: ${lineHeights.header || 1.75}; margin: 0;">MINISTERIO DEL PODER POPULAR PARA LA DEFENSA</p>
          <p class="m-resolucion-membrete" style="font-weight: bold; text-transform: uppercase; text-align: center; line-height: ${lineHeights.header || 1.75}; margin: 0;">DESPACHO DEL MINISTRO</p>
          <div class="dynamic-row"><p class="m-resolucion-lugar-fecha" style="font-weight: bold; text-align: left; margin-top: 13pt; line-height: 1.15;">Caracas, ${this.documentData.header?.date || ""}</p></div>
          <div class="dynamic-row"><p class="m-resolucion-data" style="font-weight: bold; text-align: right; line-height: 1.15;">${this.documentData.header?.anniversaries || ""}</p></div>
          <div class="dynamic-row"><p class="m-resolucion-denominacion" style="font-weight: bold; text-transform: uppercase; text-align: center; margin-top: 13pt; line-height: 1.15;">RESOLUCIÓN N° ${this.documentData.header?.resolutionNum || ""}</p></div>
        `;
        pageEl.appendChild(headerEl);

        const mainEl = document.createElement("main");
        mainEl.className = "doc-body";
        mainEl.style.textAlign = "justify";
        mainEl.style.fontSize = "13pt";

        const basamentoHtml =
          this.documentData.body?.basamentoLegal ||
          this.documentData.body?.preamble ||
          "";
        const basamentoP = document.createElement("p");
        basamentoP.className = "m-resolucion-basamento";
        basamentoP.style.textAlign = "justify";
        basamentoP.style.lineHeight = `${lineHeights.basamento || 1.75}`;
        basamentoP.style.marginTop = "13pt";
        basamentoP.style.textIndent = "1cm";
        basamentoP.innerHTML = basamentoHtml;
        mainEl.appendChild(basamentoP);

        const resuelveP = document.createElement("p");
        resuelveP.className = "m-resolucion-resuelve";
        resuelveP.style.fontWeight = "bold";
        resuelveP.style.textTransform = "uppercase";
        resuelveP.style.textAlign = "center";
        resuelveP.style.marginTop = "13pt";
        resuelveP.style.marginBottom = "13pt";
        resuelveP.style.lineHeight = "1.35";
        resuelveP.textContent = this.documentData.body?.action || "RESUELVE";
        mainEl.appendChild(resuelveP);

        const unicoHtml = this.documentData.body?.unicoParrafo || "";
        const unicoP = document.createElement("p");
        unicoP.className = "m-resolucion-unico";
        unicoP.style.textAlign = "justify";
        unicoP.style.lineHeight = `${lineHeights.unico || 1.35}`;
        unicoP.style.marginTop = "13pt";
        unicoP.innerHTML = unicoHtml;
        mainEl.appendChild(unicoP);

        const casesListEl = document.createElement("div");
        casesListEl.className = "cases-list";
        casesListEl.style.minHeight = "20px";
        casesListEl.style.lineHeight = `${lineHeights.cases || 1.35}`;
        mainEl.appendChild(casesListEl);

        pageEl.appendChild(mainEl);
        sandboxEl.appendChild(pageEl);
        return { pageEl, casesListEl };
      } else {
        const headerEl = document.createElement("header");
        headerEl.className = "doc-header";
        headerEl.style.textAlign = "center";
        headerEl.style.marginBottom = "20px";
        headerEl.innerHTML = `
          <p class="m-resolucion-membrete" style="font-weight: bold; text-transform: uppercase; text-align: center; line-height: 1.75; margin: 0;">
            CONTINUACIÓN DE LA RESOLUCIÓN N° <u>${this.documentData.header?.resolutionNum || ""}</u> DE FECHA <u>${this.documentData.header?.date || ""}</u>
          </p>
        `;
        pageEl.appendChild(headerEl);

        const mainEl = document.createElement("main");
        mainEl.className = "doc-body";
        mainEl.style.textAlign = "justify";
        mainEl.style.fontSize = "13pt";

        const casesListEl = document.createElement("div");
        casesListEl.className = "cases-list";
        casesListEl.style.minHeight = "20px";
        casesListEl.style.lineHeight = `${lineHeights.cases || 1.35}`;
        mainEl.appendChild(casesListEl);

        pageEl.appendChild(mainEl);
        sandboxEl.appendChild(pageEl);
        return { pageEl, casesListEl };
      }
    };

    const newPages: {
      pageIndex: number;
      headerHtml: string;
      casesHtml: string;
      casesHtmlSafe: SafeHtml;
    }[] = [];
    let currentPageIdx = 0;
    let currentSandbox = createSandboxPage(currentPageIdx);

    for (let p of paragraphs) {
      const tempWrapper = document.createElement("div");
      tempWrapper.innerHTML = p;
      const child = tempWrapper.firstElementChild || document.createTextNode(p);
      currentSandbox.casesListEl.appendChild(child);

      const canvasRect = currentSandbox.pageEl.getBoundingClientRect();
      const listRect = currentSandbox.casesListEl.getBoundingClientRect();
      const isOverflow =
        canvasRect.bottom - listRect.bottom < 76 ||
        currentSandbox.pageEl.scrollHeight >
          currentSandbox.pageEl.clientHeight + 2;

      if (isOverflow && currentSandbox.casesListEl.childNodes.length > 1) {
        currentSandbox.casesListEl.removeChild(child);
        const htmlForPage = currentSandbox.casesListEl.innerHTML;
        newPages.push({
          pageIndex: currentPageIdx,
          headerHtml: "",
          casesHtml: htmlForPage,
          casesHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(htmlForPage),
        });

        currentPageIdx++;
        currentSandbox = createSandboxPage(currentPageIdx);
        currentSandbox.casesListEl.appendChild(child);
      }
    }

    const finalHtml = currentSandbox.casesListEl.innerHTML;
    newPages.push({
      pageIndex: currentPageIdx,
      headerHtml: "",
      casesHtml: finalHtml,
      casesHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(finalHtml),
    });

    // Evaluar desbordamiento del pie de página
    const footerClone = document.createElement("footer");
    footerClone.className = "doc-footer";
    footerClone.style.marginTop = "0.5cm";
    footerClone.style.minHeight = "35mm";
    footerClone.innerHTML = `
      <p class="m-resolucion-comuniquese" style="margin-left: 1cm; margin-bottom: 13pt;">Comuníquese y publíquese.</p>
      <p class="m-resolucion-ejecutivo" style="margin-left: 1cm;">Por el Ejecutivo Nacional,</p>
      <div class="m-resolucion-firma-container" style="margin-top: 20pt; margin-left: 35%; width: 65%; text-align: center;">
        <div class="signatory-info">
          <p class="m-resolucion-firma-text" style="font-weight: bold; line-height: 2.05;">${this.documentData.signatures?.mainSignatory || ""}</p>
          <p class="m-resolucion-firma-text" style="font-weight: bold; line-height: 2.05;">${this.documentData.signatures?.signatoryTitle || ""}</p>
          <p class="m-resolucion-firma-text" style="font-weight: bold; line-height: 2.05;">${this.documentData.signatures?.signatoryRole || ""}</p>
        </div>
      </div>
    `;
    currentSandbox.pageEl.appendChild(footerClone);

    if (
      currentSandbox.pageEl.scrollHeight >
      currentSandbox.pageEl.clientHeight + 2
    ) {
      newPages.push({
        pageIndex: newPages.length,
        headerHtml: "",
        casesHtml: "",
        casesHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(""),
      });
    }

    sandboxEl.innerHTML = "";

    const hasLengthChanged = newPages.length !== this.documentData.pages.length;
    const hasContentChanged = newPages.some(
      (np, idx) =>
        !this.documentData.pages[idx] ||
        np.casesHtml !== this.documentData.pages[idx].casesHtml,
    );

    if (hasLengthChanged || hasContentChanged) {
      this.documentData.pages = newPages;
      this.updateSafeHtmls();
      this.cdr.detectChanges();

      if (scrollContainer) {
        scrollContainer.scrollTop = prevScrollTop;
      }

      setTimeout(() => {
        this.restoreCaret();
        if (scrollContainer) {
          scrollContainer.scrollTop = prevScrollTop;
        }
      }, 0);
    } else {
      setTimeout(() => {
        this.restoreCaret();
      }, 0);
    }

    this.isPaginating = false;
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
      "IMG",
    ];

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      if (el.tagName === "IMG") {
        const src = el.getAttribute("src");
        const width = el.style.width || el.getAttribute("width");
        const height = el.style.height || el.getAttribute("height");
        const display = el.style.display;
        const margin = el.style.margin;
        const float = el.style.float;

        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }

        if (src) el.setAttribute("src", src);
        el.className = "resuelto-doc-image";
        el.style.maxWidth = "100%";
        if (width) el.style.width = width;
        if (height) el.style.height = height;
        if (display) el.style.display = display;
        if (margin) el.style.margin = margin;
        if (float) el.style.float = float;
        return;
      }

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
        const paddingLeft = el.style.paddingLeft;
        const paddingRight = el.style.paddingRight;
        const fontFamily = el.style.fontFamily;
        const fontSize = el.style.fontSize;
        const lineHeight = el.style.lineHeight;
        const marginTop = el.style.marginTop;
        const marginBottom = el.style.marginBottom;

        const isUnderline =
          el.style.textDecoration &&
          el.style.textDecoration.includes("underline");
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
        if (paddingLeft) el.style.paddingLeft = paddingLeft;
        if (paddingRight) el.style.paddingRight = paddingRight;
        if (fontFamily) el.style.fontFamily = fontFamily;
        if (fontSize) el.style.fontSize = fontSize;
        if (lineHeight) el.style.lineHeight = lineHeight;
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
    this.activeSection = target.getAttribute("data-section") || "";

    // Registrar estado antes de que el usuario comience a editar
    this.saveHistoryState();

    if (
      this.activeSection &&
      this.documentData?.styles?.lineHeights?.[this.activeSection]
    ) {
      this.currentLineSpacing =
        this.documentData.styles.lineHeights[this.activeSection];
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
        this.unicoParrafoChange.emit(target.innerHTML || "");
      }
    }

    if (target.classList.contains("m-resolucion-basamento")) {
      if (this.documentData && this.documentData.body) {
        const text = target.innerHTML;
        this.documentData.body.basamentoLegal = text;
        this.documentData.body.preamble = text;
        this.basamentoLegalChange.emit(text || "");
      }
    }

    // Registrar estado al perder foco para almacenar los cambios realizados
    this.saveHistoryState();
  }

  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          event.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              this.insertImageToDocument(dataUrl);
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    }

    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    const target = event.target as HTMLElement;

    // Insertar en la selección activa con Range API para evitar duplicados
    const sel = window.getSelection();
    let inserted = false;
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (target.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        inserted = true;
      }
    }

    if (!inserted) {
      target.innerText = text;
    }

    if (target.classList.contains("m-resolucion-basamento")) {
      if (this.documentData && this.documentData.body) {
        const html = target.innerHTML;
        this.documentData.body.basamentoLegal = html;
        this.documentData.body.preamble = html;
        this.basamentoLegalChange.emit(html || "");
      }
    }

    this.saveHistoryState();
  }
}
