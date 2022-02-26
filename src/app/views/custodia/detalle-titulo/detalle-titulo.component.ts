import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-titulo',
  templateUrl: './detalle-titulo.component.html',
  styleUrls: ['./detalle-titulo.component.scss']
})
export class DetalleTituloComponent implements OnInit {

  public detalle : boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  open(){
    console.log("preuba si funciona");
    this.detalle = true;
  }


  limpiar(){
    this.detalle = false;
  }

}
