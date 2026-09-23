import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Renderer2,
  Inject,
  OnDestroy,
} from "@angular/core";
import { Location, DOCUMENT } from "@angular/common";
import Chart from "chart.js";
import { ApiService, IAPICore } from "src/app/services/apicore/api.service";
import { LoginService } from "src/app/services/seguridad/login.service";
import { NgbDateParserFormatter, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "src/app/services/util/util.service";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { firstValueFrom } from "rxjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-rsindicadores",
  templateUrl: "./rsindicadores.component.html",
  styleUrls: ["./rsindicadores.component.scss"],
})
export class RsindicadoresComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("immersivePanel") immersivePanel!: ElementRef;
  @ViewChild("lineChart") lineChartRef!: ElementRef;
  @ViewChild("barChart") barChartRef!: ElementRef;

  public lineChart: any;
  public barChart: any;

  public viewMode: "month" | "week" = "month";

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  };

  public anioActual: number = new Date().getFullYear();

  public kpis = {
    firmados: 0,
    enProceso: 0,
    enProcesoMinistro: 0,
    rechazados: 0,
    total: 0,
  };

  public detallesEnProceso: any[] = [];
  public chartDetalle: any;

  // Mock data temporal
  private mockDataMonths = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"],
    data: [120, 190, 300, 250, 420, 350, 500, 450],
  };

  private mockDataWeeks = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    data: [150, 120, 80, 100],
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private location: Location,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.cargarIndicadores();
  }

  ngAfterViewInit(): void {
    // 🚀 MAGIA: Movemos físicamente el panel al <body> para escapar de mat-sidenav-content
    if (this.immersivePanel) {
      this.renderer.appendChild(
        this.document.body,
        this.immersivePanel.nativeElement,
      );
    }

    setTimeout(() => {
      this.initLineChart();
      this.initBarChart();
    }, 200);
  }

  ngOnDestroy(): void {
    // Limpieza: Devolver el DOM a su estado original al salir
    if (
      this.immersivePanel &&
      this.immersivePanel.nativeElement.parentNode === this.document.body
    ) {
      this.renderer.removeChild(
        this.document.body,
        this.immersivePanel.nativeElement,
      );
    }
  }

  @HostListener("window:keydown.esc", ["$event"])
  onEsc(event: any) {
    this.closePanel();
  }

  public closePanel() {
    this.location.back();
  }

  public toggleViewMode(mode: "month" | "week") {
    this.viewMode = mode;
    this.updateLineChart();
  }

  public exportarGraficoPDF(): void {
    const canvas = document.getElementById("barChart") as HTMLCanvasElement;
    if (!canvas || !this.barChart || !this.barChart.data.labels) {
      this.toastrService.error("No se pudo obtener la gráfica para exportar.", "Error");
      return;
    }

    // Datos para la tabla
    const labels = this.barChart.data.labels as string[];
    const dataValues = this.barChart.data.datasets[0].data as number[];
    const totalCount = dataValues.reduce((acc, val) => acc + val, 0);

    const tableBody = labels.map((label, index) => [
      label,
      dataValues[index]
    ]);
    // Añadimos fila de total al final
    tableBody.push(["TOTAL DE RESOLUCIONES FIRMADAS", totalCount]);

    // Crear un canvas temporal con fondo blanco para evitar fondo negro en PDF
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.drawImage(canvas, 0, 0);
    }

    const imgData = tempCanvas.toDataURL("image/png", 1.0);

    // p = portrait, pt = points, letter = tamaño carta
    const pdf = new jsPDF("p", "pt", "letter");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    const margin = 40;
    const imgWidth = pdfWidth - (margin * 2);
    const ratio = canvas.width / canvas.height;
    const imgHeight = imgWidth / ratio;

    // Título del informe
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont("helvetica", "bold");
    pdf.text("INFORME DE DISTRIBUCIÓN OPERATIVA", pdfWidth / 2, margin + 10, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Tipo de Resolución (Firmados)", pdfWidth / 2, margin + 30, { align: "center" });
    
    // Si la imagen es muy alta, la ajustamos
    const maxImgHeight = 300; 
    const finalHeight = imgHeight > maxImgHeight ? maxImgHeight : imgHeight;
    const finalWidth = finalHeight * ratio;
    const xOffset = (pdfWidth - finalWidth) / 2; // Centrar gráfica

    // Agregar Gráfica
    const chartY = margin + 50;
    pdf.addImage(imgData, "PNG", xOffset, chartY, finalWidth, finalHeight);
    
    // Agregar Tabla de Detalles con autoTable
    const tableStartY = chartY + finalHeight + 30;
    
    autoTable(pdf, {
      startY: tableStartY,
      head: [["TIPO DE RESOLUCIÓN", "CANTIDAD"]],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [45, 206, 137], halign: "center" },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { halign: "center" }
      },
      didParseCell: function(data) {
        // Resaltar la fila de TOTAL
        if (data.row.index === tableBody.length - 1) {
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = [15, 23, 42];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    const fechaStr = new Date().toISOString().split('T')[0];
    pdf.save(`Informe_Distribucion_Resoluciones_${fechaStr}.pdf`);
  }

  public recalcularTotal() {
    this.kpis.total =
      this.kpis.firmados +
      this.kpis.enProceso +
      this.kpis.enProcesoMinistro +
      this.kpis.rechazados;
  }

  public getProgressWidth(value: number): string {
    if (this.kpis.total === 0) return "0%";
    return Math.round((value / this.kpis.total) * 100) + "%";
  }

  public getPercentage(value: number): number {
    if (this.kpis.total === 0) return 0;
    return Math.round((value / this.kpis.total) * 100);
  }

  private crearPayload(funcion: string): IAPICore {
    return {
      funcion,
      parametros: `${this.anioActual}-01-01 00:00:00,${this.anioActual}-12-31 23:59:00`,
      valores: null,
    };
  }

  private actualizarGraficoBarras(labels: string[], values: number[]): void {
    if (this.barChart && labels.length > 0) {
      this.barChart.data.labels = labels;
      this.barChart.data.datasets[0].data = values;

      // Paleta dinámica para ver todos los detalles con mejores colores
      const palette = [
        "#2dce89", "#5e72e4", "#11cdef", "#fb6340", "#f5365c",
        "#8965e0", "#ff6b81", "#7bed9f", "#70a1ff", "#eccc68", 
        "#ff7f50", "#2ed573", "#1e90ff", "#3742fa", "#d1e7dd"
      ];
      const dynamicColors = labels.map((_, i) => palette[i % palette.length]);
      this.barChart.data.datasets[0].backgroundColor = dynamicColors;

      this.barChart.update();
    }
  }

  /**
   * Proceso orquestador principal con Promesas y ejecución asíncrona paralela
   */
  public async cargarIndicadores(): Promise<void> {
    this.ngxService.startLoader("loader-buscar");
    try {
      await Promise.all([
        this.FirmadosPorDia(),
        this.EnProceso(),
        this.EnProcesoMinistro(),
        this.Rechazados(),
      ]);
    } catch (error) {
      console.error("Error al cargar indicadores del panel:", error);
    } finally {
      this.ngxService.stopLoader("loader-buscar");
    }
  }

  private initLineChart() {
    if (!this.lineChartRef) return;
    const ctx = this.lineChartRef.nativeElement.getContext("2d");

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(45, 206, 137, 0.4)"); // Verde Institucional Suave
    gradient.addColorStop(1, "rgba(45, 206, 137, 0)");

    this.lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.mockDataMonths.labels,
        datasets: [
          {
            label: "Resoluciones (Volumen)",
            data: this.mockDataMonths.data,
            backgroundColor: gradient,
            borderColor: "#2dce89",
            borderWidth: 3,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#2dce89",
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            lineTension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFontSize: 13,
          bodyFontSize: 14,
          padding: 10,
        },
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true, padding: 10, fontColor: "#8898aa" },
              gridLines: {
                drawBorder: false,
                color: "#e9ecef",
                zeroLineColor: "#e9ecef",
              },
            },
          ],
          xAxes: [
            { gridLines: { display: false }, ticks: { fontColor: "#8898aa" } },
          ],
        },
      },
    });
  }

  private updateLineChart() {
    // Ya no usamos mock data, el gráfico se actualiza dinámicamente desde FirmadosPorDia
  }

  private actualizarGraficoLineasDinamico(labels: string[], data: number[]) {
    if (!this.lineChart) return;
    this.lineChart.data.labels = labels;
    this.lineChart.data.datasets[0].data = data;
    this.lineChart.update();
  }

  private initBarChart() {
    if (!this.barChartRef) return;
    const ctx = this.barChartRef.nativeElement.getContext("2d");

    this.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Bajas",
          "Ascensos",
          "Condecoraciones",
          "Traslados",
          "Comisiones",
        ],
        datasets: [
          {
            label: "Por Tipo",
            data: [450, 800, 320, 600, 200],
            backgroundColor: [
              "#2dce89",
              "#5e72e4",
              "#11cdef",
              "#fb6340",
              "#f5365c",
            ],
            borderRadius: 4,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: 10,
        },
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true, fontColor: "#8898aa" },
              gridLines: {
                drawBorder: false,
                color: "#e9ecef",
                zeroLineColor: "#e9ecef",
              },
            },
          ],
          xAxes: [
            { gridLines: { display: false }, ticks: { fontColor: "#8898aa" } },
          ],
        },
      },
    });
  }

  public async FirmadosPorDia(): Promise<void> {
    try {
      const payload = this.crearPayload("MPPD_CEFirmadosPorDia");
      const data: any = await firstValueFrom(this.apiService.Ejecutar(payload));
      console.log("Firmados por día:", data?.Cuerpo);
      if (data?.Cuerpo && data.Cuerpo.length > 0) {
        let totalFirmados = 0;
        
        const agrupadoPorTipo: any = {};
        const agrupadoPorFecha: any = {};

        data.Cuerpo.forEach((item: any) => {
          const count =
            parseInt(item.numero_resuelto, 10) ||
            parseInt(item.numero, 10) ||
            0;
          totalFirmados += count;

          // Agrupación para gráfica de barras (Tipos)
          const tipo = item.tipo || item.des_resol || "OTRO";
          if (!agrupadoPorTipo[tipo]) agrupadoPorTipo[tipo] = 0;
          agrupadoPorTipo[tipo] += count;

          // Agrupación para gráfica de líneas (Fechas)
          if (item.ultimo_firmado) {
            // Extraer solo la fecha (YYYY-MM-DD)
            const fechaStr = item.ultimo_firmado.split('T')[0].split(' ')[0];
            if (!agrupadoPorFecha[fechaStr]) agrupadoPorFecha[fechaStr] = 0;
            agrupadoPorFecha[fechaStr] += count;
          }
        });

        // Actualizar Bar Chart
        const labelsTipos = Object.keys(agrupadoPorTipo);
        const valuesTipos = labelsTipos.map(t => agrupadoPorTipo[t]);
        this.actualizarGraficoBarras(labelsTipos, valuesTipos);

        // Actualizar Line Chart
        const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort();
        const labelsFechas = fechasOrdenadas.map(f => {
          // Formatear para mejor lectura (ej. DD/MM)
          const partes = f.split('-');
          if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
          return f;
        });
        const valuesFechas = fechasOrdenadas.map(f => agrupadoPorFecha[f]);
        this.actualizarGraficoLineasDinamico(labelsFechas, valuesFechas);

        this.kpis.firmados = totalFirmados;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en FirmadosPorDia:", error);
    }
  }

  public async Rechazados(): Promise<void> {
    try {
      const payload = this.crearPayload("MPPD_CEPendienteMinistroRechazos");
      const data: any = await firstValueFrom(this.apiService.Ejecutar(payload));
      console.log("Rechazados:", data?.Cuerpo);
      if (data?.Cuerpo && data.Cuerpo.length > 0) {
        let totalRechazados = 0;

        data.Cuerpo.forEach((item: any) => {
          // Cada registro en el JSON es un rechazo individual
          totalRechazados++;
        });

        this.kpis.rechazados = totalRechazados;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en Rechazados:", error);
    }
  }

  //MPPD_CEPendienteEnProceso
  public async EnProceso(): Promise<void> {
    try {
      const payload = this.crearPayload("MPPD_CEPendienteEnProceso");
      const data: any = await firstValueFrom(this.apiService.Ejecutar(payload));
      console.log("Firmados en Proceso:", data?.Cuerpo);
      if (data?.Cuerpo && data.Cuerpo.length > 0) {
        let totalEnProceso = 0;
        const labels: string[] = [];
        const values: number[] = [];

        data.Cuerpo.forEach((item: any) => {
          const count =
            parseInt(item.numero, 10) ||
            parseInt(item.numero_resuelto, 10) ||
            0;
          totalEnProceso += count;
          labels.push(item.tipo || item.des_resol || "OTRO");
          values.push(count);
        });

        this.kpis.enProceso = totalEnProceso;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en EnProceso:", error);
    }
  }

  //MPPD_CEPendienteMinistro
  public async EnProcesoMinistro(): Promise<void> {
    try {
      const payload = this.crearPayload("MPPD_CEPendienteMinistro");
      const data: any = await firstValueFrom(this.apiService.Ejecutar(payload));
      console.log("En Proceso Ministro:", data?.Cuerpo);
      if (data?.Cuerpo && data.Cuerpo.length > 0) {
        let totalEnProcesoMinistro = 0;

        data.Cuerpo.forEach((item: any) => {
          const count =
            parseInt(item.numero, 10) ||
            parseInt(item.numero_resuelto, 10) ||
            0;
          totalEnProcesoMinistro += count;
        });

        this.kpis.enProcesoMinistro = totalEnProcesoMinistro;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en EnProcesoMinistro:", error);
    }
  }

  //MPPD_CEPendienteEnProcesoDetalles
  public async EnProcesoDetalles(): Promise<void> {
    try {
      const payload = this.crearPayload("MPPD_CEPendienteEnProcesoDetalle");
      const data: any = await firstValueFrom(this.apiService.Ejecutar(payload));
      console.log("Firmados en Proceso Detalle:", data?.Cuerpo);
      if (data?.Cuerpo && data.Cuerpo.length > 0) {
        let totalEnProceso = 0;

        // Mapeo de Estatus a Descripciones Legibles
        const mapEstatus: any = {
          36: "ENTRADAS / REDACCIÓN",
          990: "REVISIÓN",
          991: "RESOLUCIÓN (JEFE)",
          930: "SECRETARÍA (JEFE)",
          340: "DIRECCIÓN",
          776: "FIRMADO",
          880: "MINISTRO APROBADOR",
          881: "DEVOLVER / LIBERAR",
          888: "FIRMADO Y PUBLICADO",
        };

        const mapColors: any = {
          36: "#e2f0d9", // Inicio (muy claro)
          340: "#c5e0b4", // Dirección
          776: "#a9d18e", // Firmado
          880: "#70ad47", // Ministro
          930: "#548235", // Secretaría
          990: "#fff2cc", // Revisión (Amarillo pastel)
          991: "#375623", // Resolución (Más oscuro)
          888: "#1e8449", // Publicado (Verde Éxito Fuerte)
          881: "#f8d7da", // Devolver / Liberar (Rojo/Rosa pastel)
        };

        const agrupado: any = {};

        data.Cuerpo.forEach((item: any) => {
          const count =
            parseInt(item.numero, 10) ||
            parseInt(item.numero_resuelto, 10) ||
            0;
          totalEnProceso += count;
          const st = item.estatus;

          if (!agrupado[st]) {
            agrupado[st] = {
              estatus: st,
              descripcion_estatus: mapEstatus[st] || `ESTATUS ${st}`,
              color: mapColors[st] || "#e2e8f0",
              total: 0,
              expanded: false,
              detalles: [],
            };
          }
          agrupado[st].total += count;
          agrupado[st].detalles.push({
            descripcion: item.descripcion || item.tipo || "OTRO",
            numero: count,
          });
        });

        // Convertir el objeto agrupado a array y ordenar por el orden específico solicitado
        const ordenDeseado = [36, 990, 991, 930, 340, 776, 880, 881, 888];

        this.detallesEnProceso = Object.values(agrupado).sort(
          (a: any, b: any) => {
            const idxA = ordenDeseado.indexOf(parseInt(a.estatus));
            const idxB = ordenDeseado.indexOf(parseInt(b.estatus));
            const orderA = idxA !== -1 ? idxA : 999;
            const orderB = idxB !== -1 ? idxB : 999;
            return orderA - orderB;
          },
        );

        this.kpis.enProceso = totalEnProceso;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en EnProcesoDetalles:", error);
    }
  }

  public getPercentageOfProcess(value: number): number {
    if (this.kpis.enProceso === 0) return 0;
    return Math.round((value / this.kpis.enProceso) * 100);
  }

  public async abrirModalEnProceso(content: any): Promise<void> {
    if (this.detallesEnProceso.length === 0) {
      await this.EnProcesoDetalles();
    }

    if (this.kpis.enProceso === 0 || this.detallesEnProceso.length === 0) {
      this.toastrService.info(
        "No hay detalles en proceso para mostrar.",
        "Información",
      );
      return;
    }

    this.modalService
      .open(content, {
        size: "lg",
        centered: true,
        windowClass: "rs-modal-top",
        backdropClass: "rs-modal-backdrop-top",
        scrollable: true,
      })
      .shown.subscribe(() => {
        // Asegurarnos de que ninguno esté expandido por defecto al abrir
        this.detallesEnProceso.forEach((d) => (d.expanded = false));
        this.renderizarGraficoDetalles();
      });
  }

  public toggleDetalle(item: any): void {
    const wasExpanded = item.expanded;
    // Efecto acordeón: cerramos todos
    this.detallesEnProceso.forEach((d) => (d.expanded = false));

    // Si no estaba expandido, lo expandimos
    item.expanded = !wasExpanded;

    // Actualizamos la gráfica
    this.renderizarGraficoDetalles();
  }

  public isDetalleExpandido(): boolean {
    return this.detallesEnProceso.some(d => d.expanded);
  }

  public colapsarTodo(): void {
    this.detallesEnProceso.forEach(d => d.expanded = false);
    this.renderizarGraficoDetalles();
  }

  public renderizarGraficoDetalles(): void {
    if (this.chartDetalle) {
      this.chartDetalle.destroy();
    }

    const canvas = document.getElementById(
      "chartModalDetalle",
    ) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Lógica dinámica: mostrar el desglose si hay alguno expandido
    const itemExpandido = this.detallesEnProceso.find((d) => d.expanded);

    let labels: string[] = [];
    let data: number[] = [];
    let labelTitle = "";
    let bgColor: any = "";

    if (itemExpandido) {
      labels = itemExpandido.detalles.map((d: any) => d.descripcion);
      data = itemExpandido.detalles.map((d: any) => d.numero);
      labelTitle = `Subdetalle: ${itemExpandido.descripcion_estatus}`;
      bgColor = itemExpandido.color; // Mantenemos el color del estatus para sus subdetalles
    } else {
      labels = this.detallesEnProceso.map((item) => item.descripcion_estatus);
      data = this.detallesEnProceso.map((item) => item.total);
      labelTitle = "Cantidad en Proceso";
      bgColor = this.detallesEnProceso.map((item) => item.color); // Array de colores
    }

    this.chartDetalle = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: labelTitle,
            data: data,
            backgroundColor: bgColor, // Color dinámico (string o array)
            borderRadius: 6,
            barThickness: "flex",
            maxBarThickness: 45,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const idx = elements[0].index !== undefined ? elements[0].index : elements[0]._index;
            if (idx !== undefined) {
              if (itemExpandido) {
                // Si estamos en subdetalle, volvemos a la vista global
                setTimeout(() => this.toggleDetalle(itemExpandido), 0);
              } else {
                // Expandimos el estatus clickeado
                const item = this.detallesEnProceso[idx];
                if (item) {
                  setTimeout(() => this.toggleDetalle(item), 0);
                }
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(255,255,255,0.9)",
            titleColor: "#172b4d",
            bodyColor: "#525f7f",
            borderColor: "#e9ecef",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: "#8898aa",
            },
            grid: {
              color: "#e9ecef",
              drawBorder: false,
              borderDash: [5, 5],
            },
          },
          x: {
            ticks: {
              color: "#8898aa",
              maxRotation: 45,
              minRotation: 0,
              callback: function (value: any, index: number, values: any) {
                const label = this.getLabelForValue(value);
                // Si el label es muy largo, lo truncamos
                return label.length > 15
                  ? label.substring(0, 15) + "..."
                  : label;
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
      },
    });
  }
}
