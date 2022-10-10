import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'console';


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
  public antes: boolean = false
  public despues: boolean = true
  public paginador: number = 10
  public de: number = 0
  public para: number = 9
  public posicionPagina = 0
  public cantidad = 0
  public blBuscar = false
  public max_paginador: number = 0
  public lstPaginas = []
  public actual : number =  1


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

  seleccionNavegacion(e){

  }


  seleccionLista(event) {
    this.longitud = 0;

    if (event.charCode == 13) {
      const patron = new RegExp(this.utilService.ConvertirCadena(this.buscar))
      this.longitud = this.bzBusqueda.length
      this.bzBusqueda = this.bzSeguimientoO.filter((e) => { return patron.test(e.busqueda) })
      
      this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)
      this.max_paginador = this.bzBusqueda.length / 10
      this.cantidad = this.bzBusqueda.length
      this.MostrarPaginador()
      this.buscar = ''
    }

  }


  async ConsultarSeguimiento() {
    this.xAPI.funcion = 'WKF_CSeguimiento'
    this.xAPI.parametros = ''
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.bzSeguimientoO = data.Cuerpo.map((e) => {
          e.busqueda = this.utilService.ConvertirCadena(e.norigen + ' ' +
            e.ncontrol + ' ' + e.contenido + e.estatus_nombre + ' ' + e.remitente + ' ' + e.nombre
            + ' ' + e.creado + ' ' + e.salida  + ' ' + e.unidad +  ' ' + e.subdocumento
          )
          e.numc = e.ncontrol
          e.existe = e.anom == '' ? true : false;
          e.privado = e.priv == 1 ? true : false;
          e.color = 'green'
          switch (e.tdoc.toLowerCase()) {
            case 'punto de cuenta':
              e.simbolo = "-P"
              e.color = 'green'
              break;
            case 'tramitacion por organo regular':
              e.simbolo = "-T"
              e.color = 'brown'
              break;
            case 'resolucion':
              e.simbolo = "-R"
              e.color = 'orange'
              break;
            default:
              e.simbolo = ''
              break;
          }
          e.resumenl = e.contenido.substring(0,200) 
          e.completed = false;
          return e
        })

        this.bzBusqueda = this.bzSeguimientoO
        this.longitud = this.bzBusqueda.length
        this.bzSeguimiento = this.bzBusqueda.slice(0, this.pageSize)
        this.cantidad = this.longitud
        this.max_paginador = this.cantidad / 10
        this.blBuscar = true
        this.MostrarPaginador()

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
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }

  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.bzSeguimiento = this.bzBusqueda.slice(pag, pag + this.pageSize)
  }

  insertarObservacion() {

  }



  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  MostrarPaginador() {
    this.blBuscar = true
    this.lstPaginas = []
    this.antes = false

    if (this.max_paginador > 10) {
      this.max_paginador = 10
      this.despues = true
    } else {
      this.despues = false
    }
    for (var i = 0; i < this.max_paginador; i++) {
      var color = ''

      if (this.de > 0) {
        color = this.de/10 == i ?  'bg-info text-white' : ''
        this.antes = true
      } 
      if ( this.de == 0 && i == 0) color = 'bg-info text-white'
      this.lstPaginas.push({ 
          "id": i + 1,
          "color": color
      } )
    }
  }

    /**
   * Establecer la posicion del sistema en el buscador
   */
     posicion(pos: number) {
      console.log(pos);
      if (pos != this.actual) {
        this.actual = pos 
        this.de = 10 * (pos - 1)
        this.para = (this.de - 1)+ 10
        this.bzSeguimiento = this.bzBusqueda.slice( this.de, this.para )
        //this.consultarAPIBuscar()
      }
      
      
    }
  

}
