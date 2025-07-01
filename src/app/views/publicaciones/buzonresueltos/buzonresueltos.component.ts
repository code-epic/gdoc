import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buzonresueltos',
  templateUrl: './buzonresueltos.component.html',
  styleUrls: ['./buzonresueltos.component.scss']
})
export class BuzonresueltosComponent implements OnInit {

  bzRecibidoResumen = []
  constructor() { }

  ngOnInit(): void {
  }

  getDetalle(e){

  }

    
  irAnterior() {
    history.back()
  }

}
