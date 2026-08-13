import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template-normal',
  templateUrl: './template-normal.component.html',
  styleUrls: ['./template-normal.component.scss']
})
export class TemplateNormalComponent implements OnInit {

  @Input() profile: string = 'TRANSCRIPTOR';
  @Input() documentData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
