import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Avance } from 'src/app/services/ayudantia/proyecto.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-rsprocesos',
  templateUrl: './rsprocesos.component.html',
  styleUrls: ['./rsprocesos.component.scss']
})
export class RsprocesosComponent implements OnInit {

  // xobser: Editor = new Editor;
  public id : string = ''

  public lstProyectos = []
  public lstCotizaciones = []
  public bzBusqueda = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }



  public placement = 'bottom'

  public buscar = ''

  public favance : NgbDate | null

  public posicionPagina = 0

  public focus = true

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor( private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService) { }

  ngOnInit(): void {

  }

  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;

  }

  



  open(content, id) {
    this.id = id
    this.modalService.open(content, { size: 'lg' });

  }




  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina : number){
    let pag = this.pageSize
    pag = pag * pagina

    // if(this.posicionPagina == 0 ){
    //   this.bzAlertas =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }else{
    //   this.bzSeguimiento =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }
   
   
  }

  editar(ruta: string, id: string){
    const base = btoa(id)
    this.ruta.navigate(['/' + ruta, base])
  }
  

}
