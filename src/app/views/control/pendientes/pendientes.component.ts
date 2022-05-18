import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.scss']
})
export class PendientesComponent implements OnInit {


  public bzBusqueda = []


  public bzSeguimientoO = []
  public bzSeguimiento = []

  public fplazo: any
  public id_alerta = ''

  public buscar = ''
  public posicionPagina = 0

  public focus = true

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  longitud = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.ConsultarSeguimiento()


  }


  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;
    
    if (event.charCode == 13) {
      const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
      this.longitud = this.bzBusqueda.length
      this.bzBusqueda = this.bzSeguimientoO.filter((e) => { return patron.test(e.busqueda)})
      this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)
    }

  }


  async ConsultarSeguimiento() {
    this.xAPI.funcion = 'WKF_CSeguimiento'
    this.xAPI.parametros = ''
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzSeguimientoO = data.Cuerpo.map((e) => {
          e.busqueda = this.utilService.ConvertirCadena( 
            e.ncontrol + ' ' + e.contenido + e.estatus_nombre + ' ' + e.remitente + ' ' + e.nombre
            + ' ' + e.creado
            )
          return e
        } )

        this.bzBusqueda = this.bzSeguimientoO
        this.longitud = this.bzBusqueda.length
        this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)

      },
      (error) => {
        console.log('Error en la carga')
      }
    )


  }

  open(content, id) {
    this.id_alerta = id
    this.modalService.open(content);

  }



  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.bzSeguimiento = this.bzBusqueda.slice(pag, pag + this.pageSize)
  }
  insertarObservacion() {

  }



  //Consultar un enlace
  constancia(id: string){
    const estado = 1
    const estatus = 1
    return  btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }


}
