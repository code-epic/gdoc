import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-campos-dinamicos',
  templateUrl: './campos-dinamicos.component.html',
  styleUrls: ['./campos-dinamicos.component.scss']
})
export class CamposDinamicosComponent implements OnInit {

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
    const modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  add(content) {
    this.modalService.open(content,{ size: 'lg', backdrop: 'static' });
    
  }

}
