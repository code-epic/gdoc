import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-rsprocesos',
  templateUrl: './rsprocesos.component.html',
  styleUrls: ['./rsprocesos.component.scss']
})
export class RsprocesosComponent implements OnInit {

  // xobser: Editor = new Editor;
  public id: string = ''

  public lstProyectos = []
  public lstCotizaciones = []
  public bzBusqueda = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }



  public placement = 'bottom'
  public titulo = 'Procesos'

  public buscar = ''

  public favance: NgbDate | null

  public posicionPagina = 0

  public focus = true
  public dbasico = false
  public aresolucion = false
  public lotes = false
  public dpublicaciones = false
  public masivo = false
  public menu = true
  public generales = false
  public entradas = false
  public aentradas = false
  public eliminaciones = false
  public lstHistorico = []
  public blHistorico = false

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService) { }

  ngOnInit(): void {

    if (window.sessionStorage.getItem("historico") != undefined) {
      this.lstHistorico = JSON.parse(
        window.sessionStorage.getItem("historico"))
      this.blHistorico = true
    }

  }

  verHistorico() {

  }

  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;

  }





  open(content) {
    this.lstHistorico = sessionStorage.getItem("historico") != undefined ? JSON.parse(sessionStorage.getItem("historico")) : []
    this.modalService.open(content, { size: 'lg' });
  }

  desactivar(titulo: string) {
    this.dbasico = false
    this.aresolucion = false
    this.lotes = false
    this.menu = false
    this.generales = false
    this.dpublicaciones = false
    this.entradas = false
    this.eliminaciones = false
    this.titulo = titulo
  }


  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize
    pag = pag * pagina

    // if(this.posicionPagina == 0 ){
    //   this.bzAlertas =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }else{
    //   this.bzSeguimiento =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    // }


  }

  editar(ruta: string, id: string) {
    const base = btoa(id)
    this.ruta.navigate(['/' + ruta, base])
  }

  irAnterior() {
    if (this.menu) {
      history.back()
    } else {
      this.menu = true
      this.dbasico = false
      this.aresolucion = false
      this.aentradas = false
      this.masivo = false
      this.lotes = false
      this.generales = false
      this.dpublicaciones = false
      this.eliminaciones = false
      this.titulo = 'Procesos'
    }

  }

}
