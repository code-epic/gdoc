import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss']
})
export class CuponesComponent implements OnInit {

  public visible : boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  buscarCliente():void{
    this.visible = !this.visible
  }

}
