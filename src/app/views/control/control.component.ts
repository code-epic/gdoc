import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public paginador = 10
  public focus;
  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia : false,
    protocolo: '',
    ruta : '',
    version: '',
    retorna : false,
    migrar : false,
    http : 0,
    https : 0,
    consumidores : '',
    puertohttp : 0,
    puertohttps : 0,
    driver : '',
    query : '',
    metodo : '',
    tipo : '',
    prioridad : '',
    entorno: '',
    logs : false,
    cache: 0,
    estatus: false
  };

  selNav = 0
  oficinas = []
  lst = []

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    
  }

  pageChangeEvent(e){
    console.log(e)
    this.recorrerElementos(e.pageIndex+1, this.lst)
  }


  ConsultarOficinas(e){

    this.selNav = e
    this.seleccionNavegacion()
    
    if (this.xAPI.funcion == '') return false;
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lst = data //Registros recorridos como elementos
        this.lengthOfi = data.length
        this.recorrerElementos(1, data)
      },
      (error) => { console.log(error) }
    )
  }


  seleccionNavegacion(){
    switch (this.selNav) {
      case 0:
        this.xAPI.funcion = ''
        break;
      case 1:
        this.xAPI.funcion = 'ConsultarOficinas'
        break;
      case 2:
        this.xAPI.funcion = ''
        break;
      case 3:
        this.xAPI.funcion = ''
        break;
    
      default:
        break;
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(posicion : number, lst : any){
    if (posicion > 1) posicion = posicion * 10
    this.oficinas = lst.slice(posicion, posicion + this.pageSizeOfi)
    
    
    console.info(this.oficinas)


  }


}
