import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrls: ['./indice.component.scss']
})
export class IndiceComponent implements OnInit {
  @Input() data: any
  @Input() ref: any
  @Input() tipo : string 

  public asunto = ''
  public nombramiento = ''

  constructor() { }

  ngOnInit(): void {
    console.log("imprimiendo desde el indice")
    console.info(this.data)
    console.info(this.ref)
    this.data.resoluciones.reverse()
    this.data.entradas.reverse()
    // console.log(this.data.resoluciones.sort())
    this.filtrarNombramiento()
  }

  filtrarNombramiento () {
    const registros =  this.data.resoluciones.length;
    const nombramiento =  this.data.resoluciones[0]
    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.asunto = nombramiento.asunto.substring(0,100)
    
  }

}
