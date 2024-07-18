import {Inject, Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class TemplatePrintService {

    createHtmlSectionForPrint(printContents: any) {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
          <html>
          <style>
          /* adentro del media van los stylos de la hoja que se imprime */
          @media print {
          @page { size: landscape; }
          section { page-break-before: always; }
          .mat-drawer-content {height: auto !important; }
          .mat-drawer-container {overflow: inherit !important; }
          .logo { margin-right: 10px; }
          .logo img { max-height: 50px; }
          .cabecera { font-weight: bold; }
          table {border-collapse: collapse; width: 100%;}
          th, td { border: 1px solid #ddd; background: #fff; padding: 8px 16px; text-align: center; }
          th { background-color: #f0f0f0;  }
          }
          /* aqui va los stylos de la hoja de fondo */
          section { page-break-before: always; }
          .mat-drawer-content {height: auto !important; }
          .mat-drawer-container {overflow: inherit !important; }
          .logo { margin-right: 10px; }
          .logo img { max-height: 50px;}
          .cabecera {font-weight: bold;}
          table {border-collapse: collapse; width: 100%;}
          th, td { border: 1px solid #ddd; background: #fff; padding: 8px 16px; text-align: center; }
          th { background-color: #f0f0f0; }

          </style>
          <head>
              <title>Print</title>
          </head>
          <body>${printContents}</body>
          </html>
      `);
        printWindow?.document.close();
        printWindow?.print();
        printWindow?.close();
    }
}
