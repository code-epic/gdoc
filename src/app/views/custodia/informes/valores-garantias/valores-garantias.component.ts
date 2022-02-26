import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-valores-garantias',
  templateUrl: './valores-garantias.component.html',
  styleUrls: ['./valores-garantias.component.scss']
})
export class ValoresGarantiasComponent implements OnInit {
  emisionDesde : NgbDateStruct;
  placement = 'bottom';
  
  constructor() { }

  ngOnInit(): void {
  }

}
