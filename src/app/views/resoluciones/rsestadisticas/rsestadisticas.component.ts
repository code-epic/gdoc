import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExcelService } from 'src/app/services/util/excel.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsestadisticas',
  templateUrl: './rsestadisticas.component.html',
  styleUrls: ['./rsestadisticas.component.scss']
})
export class RsestadisticasComponent implements OnInit {


  lstTitulos = [
    { 'id': 1, 'codigo': 4, 'valor': 'PS C' },
    { 'id': 2, 'codigo': 4, 'valor': 'PS T' },
    { 'id': 3, 'codigo': 4, 'valor': 'PS OT' },
    { 'id': 4, 'codigo': 4, 'valor': 'CE A' },
    { 'id': 5, 'codigo': 7, 'valor': 'SMD' },
    { 'id': 6, 'codigo': 5, 'valor': 'RAIAP' },
    { 'id': 7, 'codigo': 3, 'valor': 'PMAX' },
    { 'id': 8, 'codigo': 1, 'valor': 'TSC' },
    { 'id': 9, 'codigo': 4, 'valor': 'SUB' }
  ]

  lstGrados = [
    { 'id': 1, 'grado': 'GENERAL EN JEFE', 'codigo': 'GJ', 'n_codigo': '10' },
    { 'id': 3, 'grado': 'MAYOR GENERAL', 'codigo': 'MG', 'n_codigo': '15' },
    { 'id': 5, 'grado': 'GENERAL DE DIVISIÓN', 'codigo': 'GD', 'n_codigo': '20' },
    { 'id': 7, 'grado': 'GENERAL DE BRIGADA', 'codigo': 'GB', 'n_codigo': '30' },
    { 'id': 9, 'grado': 'CORONEL', 'codigo': 'CNEL', 'n_codigo': '1040' },
    { 'id': 11, 'grado': 'TENIENTE CORONEL', 'codigo': 'TCNEL', 'n_codigo': '1050' },
    { 'id': 13, 'grado': 'MAYOR', 'codigo': 'MY', 'n_codigo': '1060' },
    { 'id': 15, 'grado': 'CAPITAN', 'codigo': 'CAP', 'n_codigo': '2070' },
    { 'id': 17, 'grado': 'PRIMER TENIENTE', 'codigo': '1TTE', 'n_codigo': '2080' },
    { 'id': 19, 'grado': 'TENIENTE', 'codigo': 'TTE', 'n_codigo': '2090' }
  ]

  public lstGlobal = [
    { 'id': '100', 'nombre': 'EJB', 'data': [] },
    { 'id': '200', 'nombre': 'AMB', 'data': [] },
    { 'id': '300', 'nombre': 'AVB', 'data': [] },
    { 'id': '400', 'nombre': 'GNB', 'data': [] },
  ]

  public subTotal = 0
  public total = 0

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  @ViewChild('tblEjercitos') table!: ElementRef;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.consultarBajas()
  }


  consultarBajas() {
    this.xAPI.funcion = environment.funcion.ESTADISTICAS_BAJAS
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        let db = data.Cuerpo
        db.forEach(e => {
          this.lstGlobal[this.validarComponente(parseInt(e.componente))].data.push(e)
        });
       
      },
      error => {

      }
    )
  }

  validarComponente(id): number {
    let cod = 0
    switch (id) {
      case 100:
        cod = 0
        break;
      case 200:
        cod = 1
        break;
      case 300:
        cod = 2
        break;
      case 400:
        cod = 3
        break;

    }
    return cod
  }


  encontrarPosicion(componente: number, cod_reserva: number, grado: string): number {
    if (!this.lstGlobal[componente]?.data) return 0;
    let total = this.lstGlobal[componente].data
      .filter(e =>
        parseInt(e.cod_reserva) == cod_reserva &&
        e.n_codigo == grado
      )
      .reduce((sum, e) => sum + (parseInt(e.cantidad, 10) || 0), 0);
    this.subTotal += total;
    return total;
  }

  getSubTotal(): number {
    let valor = this.subTotal;
    this.subTotal = 0;
    this.total += valor;
    return valor;
  }

  getTotalGlobal(): number {
    let valor = this.total;
    this.total = 0;
    return valor;
  }

  printTable(): void {
    const printWindow = window.open('', '', 'width=1000,height=700');
    if (!printWindow) return;
    
    const table = document.getElementById('tbl-ejercitos');
    if (!table) return;
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const currentYear = currentDate.getFullYear();
    const title = `ESTADÍSTICAS DE BAJAS - AÑO ${currentYear}`;
    const author = 'SISTEMA DE GESTIÓN DE RESOLUCIONES';
    
    const styles = `
      <style>
        @page {
          size: landscape;
          margin: 1.5cm 1cm;
        }
        
        body { 
          font-family: Arial, sans-serif; 
          font-size: 12px;
          margin: 0;
          padding: 0;
        }
        
        .print-header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        
        .print-header h1 {
          font-size: 18px;
          margin: 5px 0;
          text-transform: uppercase;
        }
        
        .print-header .subtitle {
          font-size: 14px;
          margin: 5px 0;
        }
        
        .print-header .info {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-top: 10px;
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0;
          page-break-inside: auto;
        }
        
        th, td { 
          border: 1px solid #000; 
          padding: 6px 8px; 
          text-align: left; 
          font-size: 11px;
        }
        
        th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
          text-align: center;
        }
        
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .celda-grado { 
          font-weight: bold; 
          background-color: #f8f9fa !important; 
        }
        
        .header-principal { 
          background-color: #e9ecef !important; 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .legend-container {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          font-size: 11px;
        }
        
        .legend-title {
          font-weight: bold;
          margin-bottom: 5px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 3px;
        }
        
        .legend-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 5px;
        }
        
        .legend-items div {
          padding: 2px 0;
        }
        
        /* Style for sub column */
        td:nth-child(2), th:nth-child(2) {
          background-color: #f8f9fa !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-weight: bold;
        }
        
        @media print {
          .no-print, .no-print * { 
            display: none !important; 
          }
          
          body { 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          table { 
            page-break-inside: auto;
          }
          
          tr { 
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      </style>
    `;
    
    const legend = `
      <div class="legend-container">
        <div class="legend-title">Leyenda:</div>
        <div class="legend-items">
          <div><strong>PS C:</strong> Propia solicitud Comando</div>
          <div><strong>PS T:</strong> Propia solicitud técnico</div>
          <div><strong>PS OT:</strong> Propia solicitud Oficial de tropa</div>
          <div><strong>CE A:</strong> Cese de empleo asimiliado</div>
          <div><strong>SMD:</strong> Separación por medidas disciplinarias</div>
          <div><strong>RAIAP:</strong> Reserva Activa por Invalidez absoluta y permanente</div>
          <div><strong>PMAX:</strong> Permanencia Máxima en el grado</div>
          <div><strong>TSC:</strong> Tiempo de Servicio Cumplido</div>
        </div>
      </div>
    `;
    
    const header = `
      <div class="print-header">
        <h1>${title}</h1>
        <div class="subtitle">${author}</div>
        <div class="info">
          <span>Fecha: ${formattedDate}</span>
          <span>Página: <span class="page-number"></span></span>
        </div>
      </div>
    `;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${styles}
        </head>
        <body>
          ${header}
          <div class="table-container">
            ${table.outerHTML}
          </div>
          ${legend}
          <script>
            // Update page numbers
            window.onload = function() {
              // Add page numbers
              const pageCount = Math.ceil(document.body.scrollHeight / (29.7 * 28.35)); // A4 height in cm to px
              const pageNumbers = document.querySelectorAll('.page-number');
              pageNumbers.forEach((el, index) => {
                el.textContent = (index + 1) + ' de ' + pageCount;
              });
              
              // Trigger print after a short delay
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { 
                  setTimeout(function() { window.close(); }, 100);
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  exportToExcel(): void {
    try {
      const table = document.getElementById('tbl-ejercitos') as HTMLTableElement;
      if (table) {
        const data: any[] = [];
        const headers: string[] = [];
        
        // Get headers
        table.querySelectorAll('thead th').forEach((th: any) => {
          headers.push(th.innerText.trim());
        });
        
        // Get rows data
        table.querySelectorAll('tbody tr').forEach((tr: any) => {
          const row: any = {};
          tr.querySelectorAll('td').forEach((td: any, index: number) => {
            row[headers[index] || `Col${index}`] = td.innerText.trim();
          });
          data.push(row);
        });
        
        // Export to Excel using the correct method
        this.excelService.exportToExcel(data, 'estadisticas');
      } else {
        console.error('No se pudo encontrar la tabla para exportar');
      }
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    }
  }
}

