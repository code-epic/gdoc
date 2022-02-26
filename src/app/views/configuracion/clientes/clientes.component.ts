import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  title = 'Clientes';
  constructor() { }

  ngOnInit(): void {
  }

  tipoCliente(xvalor){
     console.log(xvalor);
     
  }

}
