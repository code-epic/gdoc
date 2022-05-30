import { Component, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor'

import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Avance } from 'src/app/services/ayudantia/proyecto.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'

import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {

  xobser: Editor = new Editor;
  public id : string = ''

  public lstProyectos = []
  public lstCotizaciones = []
  public bzBusqueda = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public Avance : Avance = {
    fecha: '',
    ejecucion: '',
    observacion: '',
    monto: '',
    archivo : '',
    proyecto: 0
  }

  public archivos = []

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
    private toastrService: ToastrService,
    private loginService : LoginService, 
    private ngxService: NgxUiLoaderService,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.ConsultarProyectos()
    this.xobser = new Editor()
   

  }

  seleccionLista(event) {
    this.longitud = 0;
    this.pageSize = 10;
    // const patron = new RegExp(this.convertirCadena(this.buscar))
    // if (event.charCode == 13) {
      
    //   this.longitud = this.bzBusqueda.length
    //   if(this.posicionPagina == 0 ){
    //     this.bzBusqueda = this.bzSeguimientoO.filter((e) => {
    //       return patron.test(this.convertirCadena(e.busqueda))
    //     })
    //     this.bzSeguimiento =  this.bzBusqueda.slice(0, this.pageSize)
    //   }else{
    //     this.bzBusqueda = this.bzAlertasO.filter((e) => {
    //       return patron.test(this.convertirCadena(e.busqueda))
    //     })
    //     this.bzAlertas =  this.bzBusqueda.slice(0, this.pageSize)

    //   }

    //   this.buscar = ''
    // }

  }

  


  async ConsultarProyectos() {
    this.xAPI.funcion = 'MPPD_CProyectos'
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // this.bzAlertasO = data.Cuerpo.map((e) => {
        //   e.color = e.contador >= 0 ? 'text-red' : 'text-yellow'
        //   e.texto = e.contador >= 0 ? `Tiene ${e.contador} Dias vencido` : `Faltan ${e.contador * -1} Dia para vencer`
        //   e.texto = e.contador == 0?'Se vence hoy': e.texto
        //   e.busqueda = this.convertirCadena(
        //     e.ncontrol + e.remitente + e.plazo + e.texto
        //   )
        //   return e
        // }
        // )
        console.log(data.Cuerpo)
        this.bzBusqueda = data.Cuerpo
        this.longitud = this.bzBusqueda.length
        this.lstProyectos = this.bzBusqueda.slice(0, this.pageSize)
      },
      (error) => {

      }
    )
  }

  async ConsultarCotizaciones() {
    this.xAPI.funcion = 'MPPD_CCotizaciones'
    this.xAPI.parametros = ''
    return await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
        this.bzBusqueda = data.Cuerpo
        this.longitud = this.bzBusqueda.length
        this.lstCotizaciones = this.bzBusqueda.slice(0, this.pageSize)

      },
      (error) => {
        console.log('Error en la carga')
      }
    )


  }

  open(content, id) {
    this.id = id
    this.modalService.open(content, { size: 'lg' });

  }


  selNavegacion(e) {
    this.longitud = 0;
    this.pageSize = 10;
    this.posicionPagina = e
    if (e == 1) {
      this.ConsultarCotizaciones()
    }else{
      this.ConsultarProyectos()
    }
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
  
  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async SubirArchivo(e) {
    this.ngxService.startLoader("loader-aceptar")

    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'MPPD_IProyectoAvances'
          this.xAPI.parametros = ''
          this.Avance.proyecto = parseInt( this.id )
          this.Avance.archivo =  'PROY-'  + this.id
          this.Avance.fecha = this.utilService.ConvertirFecha(this.Avance.fecha)
          this.xAPI.valores = JSON.stringify(this.Avance)
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              this.ngxService.stopLoader("loader-aceptar")
              if (xdata.tipo == 1) {
                
                this.toastrService.success(
                  'Tu archivo ha sido cargado con exito ',
                  `GDoc Registro`
                );
              } else {
                this.toastrService.error(xdata.msj, `GDoc Wkf.Documento.Adjunto`);
              }
            },
            (error) => {
              this.ngxService.stopLoader("loader-aceptar")
              this.toastrService.error(error, `GDoc Wkf.Documento.Adjunto`);
            }
          )
        }
      )
    } catch (error) {
      console.error(error)
    }

  }

}
