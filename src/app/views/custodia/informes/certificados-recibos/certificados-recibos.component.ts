import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-certificados-recibos',
  templateUrl: './certificados-recibos.component.html',
  styleUrls: ['./certificados-recibos.component.scss']
})
export class CertificadosRecibosComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  placement = 'bottom';
  constructor() { }

  ngOnInit(): void {
  }

}
