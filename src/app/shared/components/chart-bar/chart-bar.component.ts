import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements AfterViewInit, OnChanges {
  @Input() idChart: string;
  @Input() type: ChartType;
  @Input() dataSets: ChartDataSets[];
  @Input() labels: string[];
  @Input() options: ChartOptions = {
    responsive: true,
  };
  chart: Chart;

  constructor(private el: ElementRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart != null) {
      if (changes.labels != null) {
        this.chart.data.labels = changes.labels.currentValue;
      }
      this.dataSets.forEach((dataset) => {
        dataset.borderWidth = 3;
      });
      this.chart.update();
    }
  }

  ngAfterViewInit() {
    this.dataSets.forEach((dataset) => {
      dataset.borderWidth = 3;
    });
    var ctx = document.getElementById(this.idChart)
    this.chart = new Chart(ctx, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.dataSets
      },
      options: this.options,
    });
  }
}