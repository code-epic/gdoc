import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generacion-comision',
  templateUrl: './generacion-comision.component.html',
  styleUrls: ['./generacion-comision.component.scss']
})
export class GeneracionComisionComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  ngOnInit(): void {
  }

  procesar(content) {
    this.modalService.open(content);
    
  }
}
