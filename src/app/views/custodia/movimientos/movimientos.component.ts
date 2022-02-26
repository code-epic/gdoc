import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})


export class MovimientosComponent implements OnInit {

  fechaDesde : NgbDateStruct;
  fechaHasta : NgbDateStruct;
  detalle : boolean = false;
  placement = 'bottom';
  busqueda : boolean = true;
  resp : boolean;
  

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  ngOnInit(): void {
  }


  prueba(){
    
    this.busqueda = !this.busqueda;
    this.resp = !this.resp;
  }

}
