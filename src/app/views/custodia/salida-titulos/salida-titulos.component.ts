import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-salida-titulos',
  templateUrl: './salida-titulos.component.html',
  styleUrls: ['./salida-titulos.component.scss']
})
export class SalidaTitulosComponent implements OnInit {
  
  fechaDesde : NgbDateStruct;
  fechaHasta : NgbDateStruct;
  placement = 'bottom';

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  ngOnInit(): void {
  }

  open(content) {
    this.modalService.open(content);
    
  }

  modficar(content){
    const modalRef = this.modalService.open(content,{ size: 'xl', backdrop: 'static' });
  }

  detalles(content){
    const modalRef = this.modalService.open(content,{ size: 'xl', backdrop: 'static' });
  }

}
