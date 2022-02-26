import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generacion-cupones',
  templateUrl: './generacion-cupones.component.html',
  styleUrls: ['./generacion-cupones.component.scss']
})
export class GeneracionCuponesComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  ngOnInit(): void {
  }

  modficar(content){
    const modalRef = this.modalService.open(content,{ size: 'xl', backdrop: 'static' });
  }

}
