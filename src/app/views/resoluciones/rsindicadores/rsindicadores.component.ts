import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener, Renderer2, Inject, OnDestroy } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import Chart from 'chart.js';

@Component({
  selector: 'app-rsindicadores',
  templateUrl: './rsindicadores.component.html',
  styleUrls: ['./rsindicadores.component.scss']
})
export class RsindicadoresComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('immersivePanel') immersivePanel!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;

  public lineChart: any;
  public barChart: any;

  public viewMode: 'month' | 'week' = 'month';

  public kpis = {
    firmados: 1542,
    enProceso: 430,
    rechazados: 89,
    total: 2061
  };

  // Mock data temporal
  private mockDataMonths = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    data: [120, 190, 300, 250, 420, 350, 500, 450]
  };

  private mockDataWeeks = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    data: [150, 120, 80, 100]
  };

  constructor(
    private location: Location,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // 🚀 MAGIA: Movemos físicamente el panel al <body> para escapar de mat-sidenav-content
    if (this.immersivePanel) {
      this.renderer.appendChild(this.document.body, this.immersivePanel.nativeElement);
    }

    setTimeout(() => {
      this.initLineChart();
      this.initBarChart();
    }, 200);
  }

  ngOnDestroy(): void {
    // Limpieza: Devolver el DOM a su estado original al salir
    if (this.immersivePanel && this.immersivePanel.nativeElement.parentNode === this.document.body) {
      this.renderer.removeChild(this.document.body, this.immersivePanel.nativeElement);
    }
  }

  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: any) {
    this.closePanel();
  }

  public closePanel() {
    this.location.back();
  }

  public toggleViewMode(mode: 'month' | 'week') {
    this.viewMode = mode;
    this.updateLineChart();
  }

  public getProgressWidth(value: number): string {
    if (this.kpis.total === 0) return '0%';
    return Math.round((value / this.kpis.total) * 100) + '%';
  }

  public getPercentage(value: number): number {
    if (this.kpis.total === 0) return 0;
    return Math.round((value / this.kpis.total) * 100);
  }

  private initLineChart() {
    if (!this.lineChartRef) return;
    const ctx = this.lineChartRef.nativeElement.getContext('2d');

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(45, 206, 137, 0.4)'); // Verde Institucional Suave
    gradient.addColorStop(1, 'rgba(45, 206, 137, 0)');

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.mockDataMonths.labels,
        datasets: [{
          label: 'Resoluciones (Volumen)',
          data: this.mockDataMonths.data,
          backgroundColor: gradient,
          borderColor: '#2dce89',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#2dce89',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          lineTension: 0.4 
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { 
          mode: 'index', 
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFontSize: 13,
          bodyFontSize: 14,
          padding: 10
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, padding: 10, fontColor: '#8898aa' }, gridLines: { drawBorder: false, color: '#e9ecef', zeroLineColor: '#e9ecef' } }],
          xAxes: [{ gridLines: { display: false }, ticks: { fontColor: '#8898aa' } }]
        }
      }
    });
  }

  private updateLineChart() {
    if (!this.lineChart) return;
    const data = this.viewMode === 'month' ? this.mockDataMonths : this.mockDataWeeks;
    this.lineChart.data.labels = data.labels;
    this.lineChart.data.datasets[0].data = data.data;
    this.lineChart.update();
  }

  private initBarChart() {
    if (!this.barChartRef) return;
    const ctx = this.barChartRef.nativeElement.getContext('2d');
    
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Bajas', 'Ascensos', 'Condecoraciones', 'Traslados', 'Comisiones'],
        datasets: [{
          label: 'Por Tipo',
          data: [450, 800, 320, 600, 200],
          backgroundColor: ['#2dce89', '#5e72e4', '#11cdef', '#fb6340', '#f5365c'],
          borderRadius: 4,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 10
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, fontColor: '#8898aa' }, gridLines: { drawBorder: false, color: '#e9ecef', zeroLineColor: '#e9ecef' } }],
          xAxes: [{ gridLines: { display: false }, ticks: { fontColor: '#8898aa' } }]
        }
      }
    });
  }
}
