import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-instrumentos-financieros',
  templateUrl: './instrumentos-financieros.component.html',
  styleUrls: ['./instrumentos-financieros.component.scss']
})
export class InstrumentosFinancierosComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
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


}
