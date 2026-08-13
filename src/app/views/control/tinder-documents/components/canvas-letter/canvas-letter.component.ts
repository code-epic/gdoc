import { Component, Input, OnInit, HostListener } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-canvas-letter',
  templateUrl: './canvas-letter.component.html',
  styleUrls: ['./canvas-letter.component.scss']
})
export class CanvasLetterComponent implements OnInit {

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(event: KeyboardEvent) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (isCtrlOrCmd && (event.key === '-' || event.key === '+' || event.key === '=' || event.key === '0')) {
      event.preventDefault();
    }
  }

  @Input() documentData: any;
  @Input() profile: string = 'TRANSCRIPTOR';
  @Input() showSignaturesForPrint: boolean = false;

  public zoomScale: number = 1.0;
  public currentDateTime: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    // Inicializar márgenes y espaciado si no existen
    if (this.documentData) {
      if (!this.documentData.margins) {
        this.documentData.margins = { top: 10, right: 10, bottom: 10, left: 10 };
      }
      if (!this.documentData.lineSpacing) {
        this.documentData.lineSpacing = 1.15;
      }
    }

    // Actualizar fecha/hora cada segundo para visualización en tiempo real
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  zoomIn() {
    this.zoomScale = Math.min(this.zoomScale + 0.1, 2.0);
  }

  zoomOut() {
    this.zoomScale = Math.max(this.zoomScale - 0.1, 0.5);
  }

  autoFit() {
    this.zoomScale = 1.0;
  }

  formatText(command: string, value: string = '') {
    document.execCommand(command, false, value);
  }

  textTransformUppercase() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString();
      document.execCommand('insertText', false, text.toUpperCase());
    }
  }

  updateMargin(side: string, event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(val) && this.documentData) {
      if (!this.documentData.margins) {
        this.documentData.margins = { top: 10, right: 10, bottom: 10, left: 10 };
      }
      this.documentData.margins[side] = val;
    }
  }

  decreaseLineSpacing() {
    if (!this.documentData) return;
    if (!this.documentData.lineSpacing) {
      this.documentData.lineSpacing = 1.15;
    }
    this.documentData.lineSpacing = parseFloat(
      Math.max(0.5, this.documentData.lineSpacing - 0.05).toFixed(2)
    );
  }

  increaseLineSpacing() {
    if (!this.documentData) return;
    if (!this.documentData.lineSpacing) {
      this.documentData.lineSpacing = 1.15;
    }
    this.documentData.lineSpacing = parseFloat(
      Math.min(3.0, this.documentData.lineSpacing + 0.05).toFixed(2)
    );
  }

  applySelectionStyle(property: string, value: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Caso 1: Hay texto seleccionado
    if (!selection.isCollapsed) {
      const span = document.createElement('span');
      span.style[property as any] = value;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        const content = range.extractContents();
        span.appendChild(content);
        range.insertNode(span);
      }
    } 
    // Caso 2: Cursor colapsado, aplicamos al bloque padre contenedor más cercano
    else {
      let node: Node | null = selection.anchorNode;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          if (['p', 'div', 'td', 'li', 'span', 'h1', 'h2', 'h3'].includes(tagName)) {
            el.style[property as any] = value;
            break;
          }
        }
        node = node.parentNode;
      }
    }
  }

  applyBlockStyle(property: string, value: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const parentElement = container.nodeType === Node.ELEMENT_NODE ? container as HTMLElement : container.parentElement;

    if (parentElement) {
      const tagName = parentElement.tagName.toLowerCase();
      if (['p', 'div', 'td', 'li', 'h1', 'h2', 'h3'].includes(tagName)) {
        parentElement.style[property as any] = value;
        return;
      }

      // Si abarca múltiples bloques
      const blocks = parentElement.querySelectorAll('p, div, td, li, h1, h2, h3');
      let applied = false;
      blocks.forEach((block: any) => {
        if (selection.containsNode(block, true)) {
          block.style[property as any] = value;
          applied = true;
        }
      });

      if (!applied) {
        let node: Node | null = range.startContainer;
        while (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tName = el.tagName.toLowerCase();
            if (['p', 'div', 'td', 'li', 'h1', 'h2', 'h3'].includes(tName)) {
              el.style[property as any] = value;
              break;
            }
          }
          node = node.parentNode;
        }
      }
    }
  }

  applyFontSizeSelection(size: string) {
    this.applySelectionStyle('fontSize', size);
  }

  applyLineSpacingSelection(spacing: string) {
    this.applyBlockStyle('lineHeight', spacing);
  }

  applyLetterSpacingSelection(spacing: string) {
    this.applySelectionStyle('letterSpacing', spacing);
  }

  adjustBlockPadding(property: 'paddingLeft' | 'paddingRight', delta: number) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const parentElement = container.nodeType === Node.ELEMENT_NODE ? container as HTMLElement : container.parentElement;

    if (parentElement) {
      const applyToEl = (el: HTMLElement) => {
        const currentVal = parseFloat(window.getComputedStyle(el)[property as any]) || 0;
        const inlineStyle = el.style[property as any];
        let val = 0;
        if (inlineStyle.endsWith('mm')) {
          val = parseFloat(inlineStyle);
        } else if (inlineStyle.endsWith('px')) {
          val = parseFloat(inlineStyle) * 0.264583;
        } else {
          val = currentVal * 0.264583;
        }
        
        const newVal = Math.max(0, val + delta);
        el.style[property as any] = newVal === 0 ? '' : `${newVal}mm`;
      };

      const tagName = parentElement.tagName.toLowerCase();
      if (['p', 'div', 'td', 'li', 'h1', 'h2', 'h3'].includes(tagName)) {
        applyToEl(parentElement);
        return;
      }

      const blocks = parentElement.querySelectorAll('p, div, td, li, h1, h2, h3');
      let applied = false;
      blocks.forEach((block: any) => {
        if (selection.containsNode(block, true)) {
          applyToEl(block);
          applied = true;
        }
      });

      if (!applied) {
        let node: Node | null = range.startContainer;
        while (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tName = el.tagName.toLowerCase();
            if (['p', 'div', 'td', 'li', 'h1', 'h2', 'h3'].includes(tName)) {
              applyToEl(el);
              break;
            }
          }
          node = node.parentNode;
        }
      }
    }
  }

  increaseIndentLeft() { this.adjustBlockPadding('paddingLeft', 5); }
  decreaseIndentLeft() { this.adjustBlockPadding('paddingLeft', -5); }
  increaseIndentRight() { this.adjustBlockPadding('paddingRight', 5); }
  decreaseIndentRight() { this.adjustBlockPadding('paddingRight', -5); }

  widenLine() {
    this.adjustBlockPadding('paddingLeft', -5);
    this.adjustBlockPadding('paddingRight', -5);
  }

  narrowLine() {
    this.adjustBlockPadding('paddingLeft', 5);
    this.adjustBlockPadding('paddingRight', 5);
  }

  public async exportPDF() {
    Swal.fire({
      title: 'Generando PDF...',
      text: 'Por favor espere mientras se crea el archivo.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const originalZoom = this.zoomScale;
    this.zoomScale = 1.0;

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const element = document.querySelector('.letter-canvas') as HTMLElement;
      if (!element) throw new Error('No se encontró el elemento del lienzo');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [215.9, 279.4]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 215.9, 279.4);

      const filename = this.documentData?.numero_control
        ? `${this.documentData.numero_control}.pdf`
        : `documento_${new Date().getTime()}.pdf`;

      pdf.save(filename);
      Swal.close();
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Swal.fire('Error', 'No se pudo generar el archivo PDF.', 'error');
    } finally {
      this.zoomScale = originalZoom;
    }
  }

  public async printPDF() {
    Swal.fire({
      title: 'Preparando Impresión...',
      text: 'Generando el documento para mandar a imprimir.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const originalZoom = this.zoomScale;
    this.zoomScale = 1.0;

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const element = document.querySelector('.letter-canvas') as HTMLElement;
      if (!element) throw new Error('No se encontró el elemento del lienzo');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [215.9, 279.4]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 215.9, 279.4);

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      };

      Swal.close();
    } catch (error) {
      console.error('Error al imprimir PDF:', error);
      Swal.fire('Error', 'No se pudo procesar la impresión.', 'error');
    } finally {
      this.zoomScale = originalZoom;
    }
  }

}
