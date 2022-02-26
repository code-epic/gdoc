import { Component, OnInit } from '@angular/core';
import {  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-titulos-bloqueos',
  templateUrl: './titulos-bloqueos.component.html',
  styleUrls: ['./titulos-bloqueos.component.scss']
})
export class TitulosBloqueosComponent implements OnInit {
  desde : NgbDateStruct;
  hasta : NgbDateStruct;
  placement = 'bottom';
  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

}
