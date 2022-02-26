import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbModalConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {

  emisionDesde : NgbDateStruct;
  emisionHasta : NgbDateStruct;
  vencimientoDesde :NgbDateStruct;
  vencimientoHasta : NgbDateStruct;
  
  placement = 'bottom';

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  ngOnInit(): void {
  }

  detalle(content){
    const modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

  cliente(content){
    const modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

}
