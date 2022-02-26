import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-posicion-global',
  templateUrl: './posicion-global.component.html',
  styleUrls: ['./posicion-global.component.scss']
})
export class PosicionGlobalComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  placement = 'bottom';
  constructor() { }

  ngOnInit(): void {
  }

}
