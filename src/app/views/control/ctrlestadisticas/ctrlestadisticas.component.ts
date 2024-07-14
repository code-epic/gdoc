import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService, IAPICore } from '../../../services/apicore/api.service';
import { Chart } from "chart.js";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-ctrlestadisticas',
  templateUrl: './ctrlestadisticas.component.html',
  styleUrls: ['./ctrlestadisticas.component.scss', '../control.component.scss']
})
export class CtrlestadisticasComponent implements OnInit {
  public chartMonth: Chart;
  public chartWeek: Chart;
  public chartDay: Chart;
  public form!: FormGroup;
  public listMonthWeek: any[] = [];
  public staticsPanel = [
    { label: 'Documentos Plazo:', status: 'EN PROCESO', color: 'bg-c-green', icon: 'fa fa-inbox', class: 'f-left' },
    { label: 'Documentos Vencida:', status: 'VENCIDO', color: 'bg-red', icon: 'fa fa-share', class: 'f-left' },
    { label: 'Documentos Total:', status: 'TOTAL', color: 'bg-purple', icon: 'fa fa-search', class: 'f-left' }
  ];
  public body: any[] = [];
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
  };
  lstAreas = [];
  lstAreasFilter = [];
  lstEstatus = [
    { 'id': 'PENDIENTE' },
    { 'id': 'VENCIDO' },
    { 'id': 'EN PROCESO' },
  ];
  public rtarjetas = '';
  constructor(private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllStaticsPanelDashboard();
    this.getAllAreasList();
    this.chartMonth = this.buildChartBase(
      'canvas',
      ['ENERO', 'FEBRERO', 'MARZO'],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]);
    this.chartWeek = this.buildChartBase(
      'canvasWeek',
      ['SEMANA 1', 'SEMANA 2', 'SEMANA 3', 'SEMANA 4'],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]);
    this.chartDay = this.buildChartBase(
      'canvasDay',
      ['SEMANA 1', 'SEMANA 2', 'SEMANA 3', 'SEMANA 4'],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]);
  }

  initForm() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.form = this.fb.group({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
      status: new FormControl('0'),
      options: new FormControl('0'),
    });
  }

  getAllStaticsPanelDashboard() {
    this.getStaticsPanel('5').subscribe({
      next: (value) => {
        this.body = value.Cuerpo;
      }
    });
  }

  getAllAreasList() {
    this.xAPI.funcion = 'WKF_CEstados';
    this.xAPI.parametros = '%';
    this.xAPI.valores = '';
    return this.apiService.Ejecutar(this.xAPI).subscribe({
      next: (value) => {
        this.lstAreas = value.Cuerpo;
        this.lstAreasFilter = this.filterAreaList();
      }
    });
  }

  filterAreaList() {
    return this.lstAreas.filter((item) => item.esta === '1');
  }

  getValueStaticsByStatus(status: any) {
    if (status === 'TOTAL') { return this.sumTotalDocs(); }
    const filter = this.body.filter((value: any) => value.estatus === status);
    return filter.length > 0 ? filter[0].cantidad : 0;
  }

  getStaticsPanel(parameter: any) {
    this.xAPI.funcion = 'WKF_CEstatusAlertasCantidad';
    this.xAPI.parametros = parameter;
    return this.apiService.Ejecutar(this.xAPI);
  }

  private sumTotalDocs() {
    return this.body.reduce((a, b) => +a + +b.cantidad, 0);
  }

  sendFilter() {
    this.ngxService.startLoader("loader-progress")
    let end = this.form.getRawValue().end;
    let options = this.form.getRawValue().options;
    let start = this.form.getRawValue().start;
    let status = this.form.getRawValue().status;
    let datesDays = [];
    if (end != null && start != null) {
      this.listMonthWeek = this.getYearAndMonthByStartAndEnd();
      this.chartMonth.data.labels = this.listMonthWeek;
      datesDays = this.getDaysByStartAndEnd();
      this.chartDay.data.labels = datesDays;
    } else {
      //alertar 
    }

    /**
    * TODO
    * recordar que debe cambiarse el paramentro '5' por el orden del filtrado.
    */
    this.getStaticsPanel('5').subscribe({
      next: (value) => {
        this.body = value.Cuerpo;
        this.chartMonth.data.datasets[0].data = [];
        this.chartMonth.data.datasets[1].data = [];
        this.chartMonth.data.datasets[2].data = [];
        this.body.forEach(e => {
          this.chartMonth.data.datasets[0].data.push(e.cantidad as number);
          this.chartMonth.data.datasets[1].data.push(e.cantidad as number);
          this.chartMonth.data.datasets[2].data.push(e.cantidad as number);

        });
        this.chartMonth.update();
        this.chartDay.update();
        this.ngxService.stopLoader("loader-progress")
      }
    });
  }

  buildChartBase(id: any, label: any[], data: any[], data1: any[], data2: any[]) {
    return new Chart(id, {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            label: 'plazo',
            data: data,
            borderColor: '#40DBBC',
            backgroundColor: 'rgb(66,220,189, 0.4)',
            borderWidth: 1
          },
          {
            label: 'vencida',
            data: data1,
            borderColor: '#F5365C',
            backgroundColor: 'rgb(245,54,92, 0.4)',
            borderWidth: 1
          },
          {
            label: 'total',
            data: data2,
            borderColor: '#8965E0',
            backgroundColor: 'rgb(137,101,224, 0.4)',
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  private getYearAndMonthByStartAndEnd() {
    let start = new Date(this.form.get('start').value);
    const end = new Date(this.form.get('end').value);
    const dates = [];
    while (start < end) {
      const displayMonth = start.getUTCMonth() + 1;
      dates.push([
        start.getUTCFullYear(),
        start.toLocaleString('es-ES', { month: 'long' }).toUpperCase()
      ].join(' - '));
      start = new Date(start.setUTCMonth(displayMonth));
    }
    return dates;
  }

  /**esta funcion no aplica hay que borrarla, se deja hasta especificar el requerimiento */
  private getDaysByStartAndEnd() {
    let start = new Date(this.form.get('start').value);
    const end = new Date(this.form.get('end').value);
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      dateArray.push(new Date(currentDate).toISOString().slice(0, 10));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dateArray;
  }

}
