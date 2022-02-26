import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-oficinas-comerciales',
  templateUrl: './oficinas-comerciales.component.html',
  styleUrls: ['./oficinas-comerciales.component.scss']
})
export class OficinasComercialesComponent implements OnInit {

  public oficina : string;

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
