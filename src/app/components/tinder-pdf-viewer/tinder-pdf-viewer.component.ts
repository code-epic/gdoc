import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  selector: 'app-tinder-pdf-viewer',
  templateUrl: './tinder-pdf-viewer.component.html',
  styleUrls: ['./tinder-pdf-viewer.component.scss'],
})
export class TinderPdfViewerComponent implements OnChanges, OnDestroy {

  /* ── Inputs ──────────────────────────────────────────── */
  @Input() documents: TinderDocument[] = [];
  @Input() startIndex = 0;
  @Input() jwtData: JwtUserData = { userId: '', userName: '', userRole: '' };
  @Input() loading = false;
  @Input() approveLabel = 'Aprobar y Firmar';
  @Input() rejectLabel = 'Rechazar';
  @Input() approveIcon = 'fas fa-signature';
  @Input() rejectIcon = 'fas fa-times-circle';

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
  @Output() navigate = new EventEmitter<{ doc: TinderDocument; index: number }>();
  @Output() pdfLoadError = new EventEmitter<string>();

  /* ── Estado interno ──────────────────────────────────── */
  public currentIndex = 0;
  public pdfSrc: SafeResourceUrl | null = null;
  public rawPdfUrl: string | null = null;
  public loadingPdf = false;
  public actionExecuting = false;
  public executingType: 'approve' | 'reject' | '' = '';
  public observations = '';
  public pdfError = false;
  public pdfErrorMsg = '';
  public swipeDir: '' | 'left' | 'right' = '';
  public isSafari = false;
  public objectFailed = false;

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
    const isIOS = /ipad|iphone|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafariUA = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua);
    this.isSafari = isSafariUA || isIOS;
    console.log('[TinderPdfViewer] isSafari=', this.isSafari, 'UA=', navigator.userAgent);
  }

  /* ── Lifecycle ───────────────────────────────────────── */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documents || changes.startIndex) {
      if (this.documents.length > 0) {
        const idx = changes.startIndex
          ? changes.startIndex.currentValue
          : this.currentIndex;
        this.currentIndex = Math.max(0, Math.min(idx, this.documents.length - 1));
        this.loadCurrentPdf();
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeAll();
    if (this.timer) { clearTimeout(this.timer); }
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

  /* ── Navegación ──────────────────────────────────────── */

  nextDocument(): void {
    if (this.isLast || this.actionExecuting) { return; }
    this.swipeDir = 'right';
    setTimeout(() => {
      this.currentIndex++;
      this.cleanState();
      this.swipeDir = '';
      const doc = this.activeDoc;
      if (doc) {
        this.navigate.emit({ doc, index: this.currentIndex });
      }
      this.loadCurrentPdf();
    }, 300);
  }

  prevDocument(): void {
    if (this.isFirst || this.actionExecuting) { return; }
    this.swipeDir = 'left';
    setTimeout(() => {
      this.currentIndex--;
      this.cleanState();
      this.swipeDir = '';
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
    if (!this.rawPdfUrl) { return; }
    console.log('[TinderPdfViewer] openPdfInNewTab', this.rawPdfUrl.substring(0, 80));
    const win = window.open(this.rawPdfUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Popup bloqueado: intentar con location.href
      const a = document.createElement('a');
      a.href = this.rawPdfUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /* ── Acciones ────────────────────────────────────────── */

  onApprove(): void {
    if (this.actionExecuting || !this.activeDoc) { return; }
    this.actionExecuting = true;
    this.executingType = 'approve';
    this.approve.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  onReject(): void {
    if (this.actionExecuting || !this.activeDoc) { return; }
    if (this.observations.trim() === '') { return; }
    this.actionExecuting = true;
    this.executingType = 'reject';
    this.reject.emit({
      doc: this.activeDoc,
      observations: this.observations.trim(),
      index: this.currentIndex,
    });
  }

  /** El padre llama esto cuando la acción termina (éxito o error) */
  resetAction(): void {
    this.actionExecuting = false;
    this.executingType = '';
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
    if (this.actionExecuting) { return; }
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) > 120 && Math.abs(dy) < 100) {
      dx > 0 ? this.onApprove() : this.onReject();
    }
  }

  /* ── Keyboard ────────────────────────────────────────── */

  onKeyDown(event: KeyboardEvent): void {
    if (this.actionExecuting) { return; }
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === 'TEXTAREA' || tag === 'INPUT') { return; }

    switch (event.key) {
      case 'ArrowLeft':
        this.prevDocument();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.nextDocument();
        event.preventDefault();
        break;
      case ' ':
        this.onApprove();
        event.preventDefault();
        break;
      case 'Escape':
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
    console.log('[TinderPdfViewer] loadPdfFromUrl', url, 'isSafari=', this.isSafari);
    this.loadingPdf = true;
    this.pdfError = false;
    this.pdfErrorMsg = '';
    this.objectFailed = false;
    this.rawPdfUrl = url;
    this.revokeAll();

    const token = sessionStorage.getItem('token') || '';
    const headers: Record<string, string> = {};
    if (token) { headers['Authorization'] = 'Bearer ' + token; }

    fetch(url, { headers })
      .then((res) => {
        const ct = res.headers.get('content-type') || 'unknown';
        console.log('[TinderPdfViewer] fetch status', res.status, 'content-type', ct);
        if (!res.ok) { throw new Error(`HTTP ${res.status} ${res.statusText}`); }
        return res.blob();
      })
      .then((blob) => {
        console.log('[TinderPdfViewer] blob size', blob.size, 'type', blob.type);
        if (blob.size === 0) { throw new Error('PDF vacío (0 bytes)'); }

        if (!blob.type || blob.type === 'application/octet-stream') {
          // Forzar tipo PDF
          blob = new Blob([blob], { type: 'application/pdf' });
        }

        if (this.isSafari) {
          // Safari/iOS: data URL (base64) es el método más confiable.
          // Blob URLs en <embed>/<iframe> a menudo muestran PDF en blanco en Safari.
          console.log('[TinderPdfViewer] Safari → data URL directo');
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
            console.log('[TinderPdfViewer] blob timeout, fallback a data URL');
            this.fallbackDataUrl(blob);
          }
        }, 5000);

        this.cdr.detectChanges();
      })
      .catch((err) => {
        console.error('[TinderPdfViewer] PDF fetch error:', err);
        this.pdfError = true;
        this.pdfErrorMsg = err.message || 'Error cargando PDF';
        this.loadingPdf = false;
        this.pdfLoadError.emit(this.pdfErrorMsg);
        this.cdr.detectChanges();
      });
  }

  /** Fallback: blob → data URL (funciona en Safari y todos los navegadores) */
  private fallbackDataUrl(blob: Blob): void {
    console.log('[TinderPdfViewer] fallbackDataUrl, blob size', blob.size);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const dataUrl = reader.result as string;
        this.rawPdfUrl = dataUrl;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        console.log('[TinderPdfViewer] data URL length', dataUrl.length);

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
      console.error('[TinderPdfViewer] FileReader error');
      this.loadingPdf = false;
      this.objectFailed = true;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(blob);
  }

  /** <object> disparó load correctamente */
  onObjectLoad(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.loadingPdf = false;
    this.cdr.detectChanges();
  }

  /** <object> falló al renderizar */
  onObjectError(): void {
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
    this.pdfError = false;
    this.pdfErrorMsg = '';
    this.objectFailed = false;
    this.loadingPdf = true;
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
          this.pdfErrorMsg = 'Sin archivo PDF asociado';
          this.loadingPdf = false;
          this.cdr.detectChanges();
        }
      } catch (err: any) {
        this.pdfError = true;
        this.pdfErrorMsg = err.message || 'Error resolviendo URL del PDF';
        this.loadingPdf = false;
        this.cdr.detectChanges();
      }
    } else {
      // Sin resolver: mostrar placeholder
      this.loadingPdf = false;
      this.pdfError = true;
      this.pdfErrorMsg = 'No se proporcionó resolvedor de URLs';
      this.cdr.detectChanges();
    }
  }

  private cleanState(): void {
    this.observations = '';
    this.pdfError = false;
    this.pdfErrorMsg = '';
    this.objectFailed = false;
  }

  private revokeAll(): void {
    this.blobs.forEach((u) => {
      try { URL.revokeObjectURL(u); } catch (_) {}
    });
    this.blobs = [];
  }

  trackByIndex(i: number): number {
    return i;
  }
}
