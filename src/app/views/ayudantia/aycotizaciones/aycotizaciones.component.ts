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
  garantia: number
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



  editor: Editor = new Editor;

  xeditor: Editor = new Editor;

  xobser: Editor = new Editor;


  fecha: NgbDate | null

  vigencia: NgbDate | null

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
    garantia: 0,
    moneda: '',
    lapso: '',
    modalidad: '',
    forma_pago: '',
    responsable: '',
    cargo_responsable: '',
    usuario: '',
    obseravacion: ''
  }
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
  }

  async guardar() {
    console.log(this.Cotizaciones);
    this.xAPI.funcion = 'MPPD_ICotizaciones'
    this.xAPI.parametros = ''
    this.Cotizaciones.usuario = this.loginService.Usuario.id

    this.Cotizaciones.fecha = this.utilService.ConvertirFecha(this.Cotizaciones.fecha)

    this.Cotizaciones.vigencia = this.utilService.ConvertirFecha(this.Cotizaciones.vigencia)

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
    this.Cotizaciones.garantia = 0
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
