import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blotters',
  templateUrl: './blotters.component.html',
  styleUrls: ['./blotters.component.scss']
})
export class BlottersComponent implements OnInit {

  time = {hour: 13, minute: 30};
  meridian = true;

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

  toggleMeridian() {
    this.meridian = !this.meridian;
}

}
