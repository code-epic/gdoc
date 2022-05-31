import { Component, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Proyecto, Avance } from 'src/app/services/ayudantia/proyecto.service';
import { UtilService } from 'src/app/services/util/util.service';

import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { LoginService } from 'src/app/services/seguridad/login.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


interface Cotizaciones {
  nombre: string
  fecha: string
  vigencia: string
  objeto: string
  total: number
  pagado: number
  deuda: number
  garantia: string
  moneda: string
  lapso: string
  modalidad: string
  forma_pago: string //forma de pago
  responsable: string
  cargo_responsable: string
  usuario: string
  obseravacion: string
}





@Component({
  selector: 'app-aycotizaciones',
  templateUrl: './aycotizaciones.component.html',
  styleUrls: ['./aycotizaciones.component.scss']
})

export class AycotizacionesComponent implements OnInit {

  public id : string = ''

  editor: Editor = new Editor;

  xeditor: Editor = new Editor;

  xobser: Editor = new Editor;


  ffecha: NgbDate | null

  fvigencia: NgbDate | null



  public fecha: any
  public vigencia: any

  placement = 'bottom';

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public Cotizaciones: Cotizaciones = {
    nombre: '',
    fecha: '',
    vigencia: '',
    objeto: '',
    total: 0,
    pagado: 0,
    deuda: 0,
    garantia: '',
    moneda: '',
    lapso: '',
    modalidad: '',
    forma_pago: '',
    responsable: '',
    cargo_responsable: '',
    usuario: '',
    obseravacion: ''
  }
  total: string;
  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router) { }

  ngOnInit(): void {
    this.editor = new Editor()

    this.xeditor = new Editor()

    this.xobser = new Editor()

    if (this.rutaActiva.snapshot.params.id != undefined) {
      this.id = this.rutaActiva.snapshot.params.id
      this.ObtenerCotizacion(this.id)

    }
  }


  async ObtenerCotizacion(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'MPPD_CCotizacion'
    this.xAPI.parametros = base
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.Cotizaciones = data.Cuerpo[0]
        this.ffecha = NgbDate.from(this.formatter.parse(this.Cotizaciones.fecha.substring(0, 10)))
        this.fvigencia = NgbDate.from(this.formatter.parse(this.Cotizaciones.vigencia.substring(0, 10)))
        console.log(this.fecha)
      },
      (error) => {

      }
    )
  }
  
  async guardar() {

    if (this.Cotizaciones.nombre == '' || this.Cotizaciones.objeto == '' || this.total == '' || this.fecha == '' || this.vigencia == '') {
      this.toastrService.warning('Debe ingresar los campos marcados con (*) ya que son requeridos', `GDoc MPPD Modificar Cotizaciones`)
      return
    }
    console.log(this.Cotizaciones);
    this.xAPI.funcion = 'MPPD_ICotizaciones'
    this.xAPI.parametros = ''
    this.Cotizaciones.usuario = this.loginService.Usuario.id

    this.Cotizaciones.fecha = this.utilService.ConvertirFecha(this.fecha)
    this.Cotizaciones.vigencia = this.utilService.ConvertirFecha(this.vigencia)

    this.xAPI.valores = JSON.stringify(this.Cotizaciones)
    console.log(this.xAPI)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.limpiarFrm()

        this.aceptar(data.msj)
        this.ngxService.stopLoader("loader-aceptar")

      },
      (errot) => {

        this.toastrService.error(errot, `GDoc MPPD Insertar Cotizaciones`)
        this.ngxService.stopLoader("loader-aceptar")
        this.ruta.navigate(['/ayudantia']);
      }
    )
  }

  protected aceptar(msj: string) {
    Swal.fire({
      title: 'La cotización ha sido  Registrada #' + this.utilService.zfill(msj, 4),
      text: "¿Desea registar otra cotización?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed)
        this.ruta.navigate(['/ayudantia']);

    })
  }

  limpiarFrm() {
    this.Cotizaciones.nombre = ''
    this.Cotizaciones.fecha = ''
    this.Cotizaciones.vigencia = ''
    this.Cotizaciones.objeto = ''
    this.Cotizaciones.total = 0
    this.Cotizaciones.pagado = 0
    this.Cotizaciones.deuda = 0
    this.Cotizaciones.garantia = ''
    this.Cotizaciones.moneda = ''
    this.Cotizaciones.lapso = ''
    this.Cotizaciones.modalidad = ''
    this.Cotizaciones.forma_pago = ''
    this.Cotizaciones.responsable = ''
    this.Cotizaciones.cargo_responsable = ''
    this.Cotizaciones.usuario = ''
    this.Cotizaciones.obseravacion = ''
  }

  restar() {
    this.Cotizaciones.deuda = this.Cotizaciones.total - this.Cotizaciones.pagado
  }

}
