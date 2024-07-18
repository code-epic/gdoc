import { Component, OnInit } from '@angular/core';
import {InactiveUserService} from '../../core/service/inactivity/InactiveUserService';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isInactive = false;

  constructor(private inactiveUserService: InactiveUserService) { }

  ngOnInit() {
    // setInterval(
    //   this.consultarAlertas, 3000
    // )
    this.inactiveUserService.userInactive.subscribe(isInactive => this.isInactive = isInactive);
  }

  reset() {
    this.isInactive = false;
    this.inactiveUserService.reset();
  }


}
