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
    if (!this.lineChart) return;
    const data =
      this.viewMode === "month" ? this.mockDataMonths : this.mockDataWeeks;
    this.lineChart.data.labels = data.labels;
    this.lineChart.data.datasets[0].data = data.data;
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
        const labels: string[] = [];
        const values: number[] = [];

        data.Cuerpo.forEach((item: any) => {
          const count = parseInt(item.numero_resuelto, 10) || parseInt(item.numero, 10) || 0;
          totalFirmados += count;
          labels.push(item.tipo || item.des_resol || "OTRO");
          values.push(count);
        });

        this.kpis.firmados = totalFirmados;
        this.recalcularTotal();
        this.actualizarGraficoBarras(labels, values);
      }
    } catch (error) {
      console.error("Error en FirmadosPorDia:", error);
    }
  }

  public async Rechazados(): Promise<void> {
    // Extensible para futuros servicios de rechazados
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
          const count = parseInt(item.numero, 10) || parseInt(item.numero_resuelto, 10) || 0;
          totalEnProceso += count;
          labels.push(item.tipo || item.des_resol || "OTRO");
          values.push(count);
        });

        this.kpis.enProceso = totalEnProceso;
        this.recalcularTotal();
        this.actualizarGraficoBarras(labels, values);
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
          const count = parseInt(item.numero, 10) || parseInt(item.numero_resuelto, 10) || 0;
          totalEnProcesoMinistro += count;
        });

        this.kpis.enProcesoMinistro = totalEnProcesoMinistro;
        this.recalcularTotal();
      }
    } catch (error) {
      console.error("Error en EnProcesoMinistro:", error);
    }
  }
}
