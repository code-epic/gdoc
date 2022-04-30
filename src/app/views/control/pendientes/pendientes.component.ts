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

  public bzAlertas = []

  public bzSeguimiento = []

  public fplazo: any

  public id_alerta = ''

  public xAPI : IAPICore = {
    funcion : '',
    parametros : '',
    valores : ''
  }

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor( 
    private apiService: ApiService, 
    private modalService: NgbModal,
    private utilService : UtilService) { }

  ngOnInit(): void {
    this.ConsultarAlertas()


  }

  async ConsultarAlertas(){
    this.xAPI.funcion = 'WKF_CAlertas'
    this.xAPI.parametros = '1,1'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.bzAlertas = data.Cuerpo.map( ( e ) => {
          e.color = e.contador > 0?'text-red':'text-yellow'
          e.texto = e.contador > 0?`Tiene ${e.contador} Dias vencido`:`Faltan ${e.contador * -1} Dia para vencer`
          //e.priv  = e.contador > 0?true:false
          return e
        }

        )
      },
      (error) => {

      }
    )
  }

  open(content, id) {
    this.id_alerta = id
    this.modalService.open(content);

  }


  selNavegacion(e){

  }

  pageChangeEvent(e) {
    //this.recorrerElementos(e.pageIndex + 1, this.lst)
  }


  insertarObservacion(){

  }
  
}
