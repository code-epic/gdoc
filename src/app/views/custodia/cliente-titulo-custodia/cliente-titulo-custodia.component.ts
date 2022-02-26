import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-titulo-custodia',
  templateUrl: './cliente-titulo-custodia.component.html',
  styleUrls: ['./cliente-titulo-custodia.component.scss']
})
export class ClienteTituloCustodiaComponent implements OnInit {

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
    const modalRef = this.modalService.open(content);
  }

  add(content) {
    this.modalService.open(content);
  }

}
