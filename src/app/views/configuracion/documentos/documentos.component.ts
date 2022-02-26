import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  title = 'Documentos';
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
