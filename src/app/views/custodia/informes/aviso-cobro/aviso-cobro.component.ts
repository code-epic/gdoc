import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-aviso-cobro',
  templateUrl: './aviso-cobro.component.html',
  styleUrls: ['./aviso-cobro.component.scss']
})
export class AvisoCobroComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  hasta : NgbDateStruct;
  placement = 'bottom';
  constructor() { }

  ngOnInit(): void {
  }

}
