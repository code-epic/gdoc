import { Component, Input, Output, EventEmitter, OnInit, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-resuelto-canvas',
  templateUrl: './resuelto_canvas.component.html',
  styleUrls: ['./resuelto_canvas.component.scss']
})
export class ResueltoCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;
  
  public zoomScale: number = 1.0;
  
  // Recibimos la data estructurada (el mapeo de Golang/Base de datos)
  @Input() documentData: any = {
    header: {
      resolutionNum: '060768',
      date: '2025-07-24',
      anniversaries: '215°, 166° y 26°'
    },
    body: {
      preamble: 'Por disposición del Ciudadano Presidente...',
      action: 'RESUELVE',
      content: '<p><strong>ÚNICO:</strong> Efectuar el siguiente nombramiento...</p>'
    },
    signatures: {
      initials: 'GELP/RMRA/b.l.s.',
      mainSignatory: 'VLADÍMIR PADRINO LÓPEZ',
      signatoryTitle: 'General en Jefe',
      signatoryRole: 'Ministro del Poder Popular para la Defensa',
      wetStampImageUrl: 'assets/stamps/min-defensa-stamp.png',
      signatureImageUrl: 'assets/signatures/vp-firma.png'
    }
  };

  @Output() zoneSelected = new EventEmitter<string>();
  @Output() preambleChange = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Retardo mínimo para asegurar que el DOM está renderizado
    setTimeout(() => this.autoFit(), 100);
  }

  @HostListener('window:resize')
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
    
    if (targetWidth < a4WidthPx) {
      this.zoomScale = targetWidth / a4WidthPx;
    } else {
      this.zoomScale = 1; // Tamaño natural
    }
  }

  // Función para activar el panel de edición lateral según el área clickeada
  editMode(zone: string) {
    this.zoneSelected.emit(zone);
  }

  onPreambleEdit(event: Event) {
    const target = event.target as HTMLElement;
    this.preambleChange.emit(target.innerText || '');
  }

  onFocusEditable(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'rgba(142, 202, 230, 0.15)'; // Un azul muy suave
  }

  onBlurEditable(event: Event) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'transparent';
  }

  onPaste(event: ClipboardEvent) {
    // Evitar que el navegador pegue HTML con estilos (colores, fuentes, etc)
    event.preventDefault();
    
    // Extraer solo texto plano del portapapeles
    const text = event.clipboardData?.getData('text/plain') || '';
    
    // Insertarlo en el cursor usando execCommand para mantener el historial de Deshacer
    document.execCommand('insertText', false, text);
    
    // Emitir el cambio hacia arriba
    const target = event.target as HTMLElement;
    this.preambleChange.emit(target.innerText || '');
  }
}
