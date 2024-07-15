import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IDataStatic } from 'src/app/core/type/common';
import { ChartType } from 'src/app/core/type/chart-types.enum';
import { CtrlEstadisticasService } from './service/ctrlestadisticas.service';

@Component({
  selector: 'app-ctrlestadisticas',
  templateUrl: './ctrlestadisticas.component.html',
  styleUrls: ['./ctrlestadisticas.component.scss', '../control.component.scss']
})
export class CtrlestadisticasComponent implements OnInit {
  public form!: FormGroup;
  public listMonthWeek: any[] = [];
  public staticsPanel = [
    { label: 'Documentos Plazo:', status: 'EN PROCESO', color: 'bg-c-green', icon: 'fa fa-inbox', class: 'f-left' },
    { label: 'Documentos Vencida:', status: 'VENCIDO', color: 'bg-red', icon: 'fa fa-share', class: 'f-left' },
    { label: 'Documentos Total:', status: 'TOTAL', color: 'bg-purple', icon: 'fa fa-search', class: 'f-left' }
  ];
  public body: any[] = [];
  
  lstAreas = [];
  lstAreasFilter = [];
  lstEstatus = [
    { 'id': 'PENDIENTE' },
    { 'id': 'VENCIDO' },
    { 'id': 'EN PROCESO' },
  ];
  public rtarjetas = '';
  response1: IDataStatic[] = [];
  response2: IDataStatic[] = [];
  data1: any[] = [];
  data2: any[] = [];
  chartType = ChartType;
  labels1 = [];
  labels2 = [];
  dataSets1 = [];
  dataSets2 = [];
  background:string[];
  border:string[];

  options = {
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
    },
  }

  constructor(private fb: FormBuilder,
    private ctrlStaticService: CtrlEstadisticasService,
    private ngxService: NgxUiLoaderService,

    ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.ctrlStaticService.getStaticsPanel('5').subscribe({
      next: (value) => {
        this.body = value.Cuerpo;
      }
    });

    this.ctrlStaticService.getAllAreasList().subscribe({
      next: (value) => {
        this.lstAreas = value.Cuerpo;
        this.lstAreasFilter = this.filterAreaList();
      }
    });
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
      monthWeek: new FormControl(null),
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
      // datesDays = this.getDaysByStartAndEnd();
    } else {
      //alertar si falta una fecha
    }

    this.getDataByMonth();
    this.getDataByWeek();
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

  getDataByMonth() {
    this.ctrlStaticService.getDataByMonth(this.listMonthWeek).subscribe({
      next: (value) => {
        console.log("MONTH RESPONSE =>", value);
        
        if(this.dataSets1.length != 0) this.dataSets1.length = 0;

        this.response1 = value.Cuerpo;
        this.labels1 = this.listMonthWeek;

        let procesados = this.response1.filter(x => x.id == "PROCESADOS");
        this.data1 = procesados.map((item, i) => item.cantidad);
        let backgroundColorProcesados= procesados.map((item, i) => item.backgroundColor);
        let borderColorProcesados = procesados.map((item, i) => item.borderColor);
        this.dataSets1.push({ data: this.data1, backgroundColor:backgroundColorProcesados, borderColor:borderColorProcesados });

        let pendientes = this.response1.filter(x => x.id == "PENDIENTES");
        this.data1 = pendientes.map((item, i) => item.cantidad);
        let backgroundPendientes = pendientes.map((item, i) => item.backgroundColor);
        let borderPendientes = pendientes.map((item, i) => item.borderColor);
        this.dataSets1.push({ data: this.data1, backgroundColor:backgroundPendientes, borderColor:borderPendientes });

        let vencidos = this.response1.filter(x => x.id == "VENCIDOS");
        this.data1 = vencidos.map((item, i) => item.cantidad);
        let backgroundVencidos = vencidos.map((item, i) => item.backgroundColor);
        let borderVencidos = vencidos.map((item, i) => item.borderColor);
        this.dataSets1.push({ data: this.data1, backgroundColor: backgroundVencidos, borderColor: borderVencidos });

        this.ngxService.stopLoader("loader-progress");
      }
    });
  }

  getDataByWeek() {
    this.ctrlStaticService.getDataByWeek(this.listMonthWeek).subscribe({
      next: (value) => {
        console.log("WEEK RESPONSE =>", value);
        this.response2 = value.Cuerpo;
      }
    });
    
    this.form.get('monthWeek').valueChanges.subscribe(
      (valueSelected:string) =>{
        if(valueSelected != null) {
          this.ngxService.startLoader("loader-progress");
          
          if(this.dataSets2.length != 0) this.dataSets2.length = 0;
          
          let filterByMonth = this.response2.filter( x => x.yearsMonth == valueSelected);
          
          // para calcular los labels de la la estadistica
          let labelsRepeated = filterByMonth.map((item, i) => `SEMANA ${item.week}`);
          this.labels2 = labelsRepeated.filter((element, index) => {
            return labelsRepeated.indexOf(element) === index;
          });

          // para la data
          let procesados = filterByMonth.filter(x => x.id == "PROCESADOS");
          this.data2 = procesados.map((item, i) => item.cantidad);
          this.background = procesados.map((item, i) => item.backgroundColor);
          this.border = procesados.map((item, i) => item.borderColor);
          this.dataSets2.push({ data: this.data2, backgroundColor:this.background, borderColor:this.border });


          let pendientes = filterByMonth.filter(x => x.id == "PENDIENTES");
          this.data2 = pendientes.map((item, i) => item.cantidad);
          this.background = pendientes.map((item, i) => item.backgroundColor);
          this.border = pendientes.map((item, i) => item.borderColor);
          this.dataSets2.push({ data: this.data2, backgroundColor:this.background, borderColor:this.border });


          let vencidos = filterByMonth.filter(x => x.id == "VENCIDOS");
          this.data2 = vencidos.map((item, i) => item.cantidad);
          this.background = vencidos.map((item, i) => item.backgroundColor);
          this.border = vencidos.map((item, i) => item.borderColor);
          this.dataSets2.push({ data: this.data2, backgroundColor:this.background, borderColor:this.border });
          
          this.ngxService.stopLoader("loader-progress");
        }
      });
  }
  
}
