import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template-radiograma',
  templateUrl: './template-radiograma.component.html',
  styleUrls: ['./template-radiograma.component.scss']
})
export class TemplateRadiogramaComponent implements OnInit {

  @Input() profile: string = 'TRANSCRIPTOR';
  @Input() documentData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
