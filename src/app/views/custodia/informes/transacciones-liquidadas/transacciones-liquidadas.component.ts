import { Component, OnInit } from '@angular/core';
import {  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transacciones-liquidadas',
  templateUrl: './transacciones-liquidadas.component.html',
  styleUrls: ['./transacciones-liquidadas.component.scss']
})
export class TransaccionesLiquidadasComponent implements OnInit {
  desde : NgbDateStruct;
  hasta : NgbDateStruct;
  placement = 'bottom';
  
  constructor() { }

  ngOnInit(): void {
  }

}
