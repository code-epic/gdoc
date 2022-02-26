import { Component, OnInit } from '@angular/core';
import {  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vencimiento-intereses',
  templateUrl: './vencimiento-intereses.component.html',
  styleUrls: ['./vencimiento-intereses.component.scss']
})
export class VencimientoInteresesComponent implements OnInit {
  desde : NgbDateStruct;
  hasta : NgbDateStruct;
  placement = 'bottom';
  
  constructor() { }

  ngOnInit(): void {
  }

}
