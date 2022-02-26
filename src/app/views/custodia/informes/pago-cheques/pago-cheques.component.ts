import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pago-cheques',
  templateUrl: './pago-cheques.component.html',
  styleUrls: ['./pago-cheques.component.scss']
})
export class PagoChequesComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  hasta : NgbDateStruct;
  placement = 'bottom';
  constructor() { }

  ngOnInit(): void {
  }

}
