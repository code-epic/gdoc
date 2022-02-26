import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listas-clientes',
  templateUrl: './listas-clientes.component.html',
  styleUrls: ['./listas-clientes.component.scss']
})
export class ListasClientesComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  placement = 'bottom';
  constructor() { }

  ngOnInit(): void {
  }

}
