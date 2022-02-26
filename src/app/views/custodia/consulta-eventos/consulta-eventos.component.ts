import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consulta-eventos',
  templateUrl: './consulta-eventos.component.html',
  styleUrls: ['./consulta-eventos.component.scss']
})
export class ConsultaEventosComponent implements OnInit {
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
    const modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

  observation(content){
    this.modalService.open(content);
  }
  add(content){
    const modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

  tipoDocumentos(xvalor){
     console.log(xvalor);
     
  }
  document(this){
    var files = this.files;
    var nombre= this.value;
	 
    
    console.log("nombre "+nombre);
  }


}
