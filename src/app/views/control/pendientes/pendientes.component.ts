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

  public bzAlertasO = []
  public bzAlertas = []

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
    this.ConsultarAlertas()


  }


  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;
    const patron = new RegExp(this.convertirCadena(this.buscar))
    if (event.charCode == 13) {
      
      this.longitud = this.bzBusqueda.length
      if(this.posicionPagina == 0 ){
        this.bzBusqueda = this.bzSeguimientoO.filter((e) => {
          return patron.test(this.convertirCadena(e.busqueda))
        })
        this.bzSeguimiento =  this.bzBusqueda.slice(0, this.pageSize)
      }else{
        this.bzBusqueda = this.bzAlertasO.filter((e) => {
          return patron.test(this.convertirCadena(e.busqueda))
        })
        this.bzAlertas =  this.bzBusqueda.slice(0, this.pageSize)

      }

      this.buscar = ''
    }

  }


  //convertir cadena a minuscula y sin carateres especiales
  convertirCadena(cadena: string): string {
    return cadena.toLowerCase().replace(/á/g, "a").replace(/ê/g, "i").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
  }


  async ConsultarAlertas() {
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '1,1'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzAlertasO = data.Cuerpo.map((e) => {
          e.color = e.contador >= 0 ? 'text-red' : 'text-yellow'
          e.texto = e.contador >= 0 ? `Tiene ${e.contador} Dias vencido` : `Faltan ${e.contador * -1} Dia para vencer`
          e.texto = e.contador == 0?'Se vence hoy': e.texto
          e.busqueda = this.convertirCadena(
            e.ncontrol + e.remitente + e.plazo + e.texto
          )
          return e
        }
        )
        this.bzBusqueda = this.bzAlertasO
        this.longitud = this.bzBusqueda.length
        this.bzAlertas =  this.bzBusqueda.slice(0, this.pageSize)
      },
      (error) => {

      }
    )
  }

  async ConsultarSeguimiento() {
    this.xAPI.funcion = 'WKF_CSeguimiento'
    this.xAPI.parametros = ''
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
        this.bzSeguimientoO = data.Cuerpo
        this.bzBusqueda = this.bzSeguimientoO
        this.longitud = this.bzBusqueda.length
        this.bzSeguimiento =  this.bzBusqueda.slice(0, this.pageSize)

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


  selNavegacion(e) {
    this.longitud = 0;
    this.pageSize = 10;
    this.posicionPagina = e
    if (e == 1) this.ConsultarSeguimiento()
  }

  pageChangeEvent(e) {
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina : number){
    let pag = this.pageSize
    pag = pag * pagina

    if(this.posicionPagina == 0 ){
      this.bzAlertas =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    }else{
      this.bzSeguimiento =  this.bzBusqueda.slice(pag, pag + this.pageSize)
    }
   
   
  }
  insertarObservacion() {

  }

}
