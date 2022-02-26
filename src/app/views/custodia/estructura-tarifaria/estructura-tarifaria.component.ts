import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estructura-tarifaria',
  templateUrl: './estructura-tarifaria.component.html',
  styleUrls: ['./estructura-tarifaria.component.scss']
})
export class EstructuraTarifariaComponent implements OnInit {

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

  add(content) {
    this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

}
