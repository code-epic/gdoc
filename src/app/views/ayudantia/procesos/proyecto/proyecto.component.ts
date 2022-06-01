import { Component, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Proyecto } from 'src/app/services/ayudantia/proyecto.service';
import { UtilService } from 'src/app/services/util/util.service';

import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { LoginService } from 'src/app/services/seguridad/login.service'



@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit {


  public id : string = ''
  public identificador : number = 0

  editor: Editor = new Editor;

  xeditor: Editor = new Editor;

  public archivos = []




  public fdesde: any
  public fhasta: any
  public flapso: any

  public fdesdeDate: NgbDate | null
  public fhastaDate: NgbDate | null
  public flapsoDate: NgbDate | null
  placement = 'top';

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public aplicasistema = 'none'
  public campos = 6
  public otros = 'none'
  public camposotros = 4

  public sistemaarmas = ''
  public SistemaArmas = [
    { 'id': 'AVIONES', 'nombre': 'AVIONES' },
    { 'id': 'HELICOPTERO', 'nombre': 'HELICOPTERO' },
    { 'id': 'VEHICULOS TACTICOS', 'nombre': 'VEHICULOS TACTICOS' },
    { 'id': 'TANQUES', 'nombre': 'TANQUES' },
    { 'id': 'EMBARCACIONES', 'nombre': 'EMBARCACIONES' },
    { 'id': 'RADARES', 'nombre': 'RADARES' },
    { 'id': 'COMPLEJO MISILISTICO', 'nombre': 'COMPLEJO MISILISTICO' },
    { 'id': 'ARMAMENTO INDIVIDUAL', 'nombre': 'ARMAMENTO INDIVIDUAL' },
  ]

  public Proyecto: Proyecto = {
    identificador : 0,
    nombre: '',
    tipo: '',
    sistema_armas: '',
    estatus: '',
    jefe_proyecto: '',
    telefono_jefe: '',
    ente: '',
    empresa: '',
    pais: '',
    fuente: '',
    otros: '',
    usuario_final: '',
    sistema: '',
    fecha_desde: '',
    fecha_hasta: '',
    numero_contrato: '',
    objeto: '',
    observacion: '',
    fecha_origen: '',
    moneda: '',
    monto_total: 0,
    monto_pagado: 0,
    monto_deuda: 0,
    usuario: ''
  }

  public Paises = []
  monto_total: string;
  modalService: any;

  constructor(
    private apiService: ApiService,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router) { }

  ngOnInit(): void {
    this.editor = new Editor()
    this.xeditor = new Editor()

    this.ConsultarPaises()
    if (this.rutaActiva.snapshot.params.id != undefined) {
      this.id = this.rutaActiva.snapshot.params.id
      this.ObtenerProyecto(this.id)

    }
    

  }


  async ConsultarPaises() {
    this.xAPI.funcion = 'ListarPaises'
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Paises = data.Cuerpo
      },
      (error) => {

      }
    )
  }

  async ObtenerProyecto(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'MPPD_CProyecto'
    this.xAPI.parametros = base
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Proyecto = data.Cuerpo[0]
        this.fdesdeDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_desde.substring(0, 10)))
        this.fhastaDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_hasta.substring(0, 10)))
        this.flapsoDate = NgbDate.from(this.formatter.parse(this.Proyecto.fecha_origen.substring(0, 10)))
      },
      (error) => {

      }
    )
  }

  open(content, id) {

    this.modalService.open(content, { size: 'lg' });

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
          this.toastrService.success(
            'Tu archivo ha sido cargado con exito ',
            `GDoc SubDocumentos`
          );
          this.ngxService.stopLoader("loader-aceptar")
        },
        (error) => {
          this.ngxService.stopLoader("loader-aceptar")
          this.toastrService.error(error, `GDoc Wkf.SubDocumentos.Adjunto`);
        }
      )
    } catch (error) {
      console.error(error)
    }

  }



  async guardar() {
    if (this.Proyecto.nombre == '' || this.Proyecto.tipo == '' || this.fdesde == '' || this.Proyecto.objeto == '' || this.fhasta == '' || this.monto_total == '') {
      this.toastrService.warning('Debe ingresar los campos marcados con (*) ya que son requeridos ', `GDoc MPPD Modificar Proyecto`)
      return
    }
    this.xAPI.funcion = 'MPPD_IProyecto'
    this.xAPI.parametros = ''
    this.Proyecto.usuario = this.loginService.Usuario.id
    if (this.rutaActiva.snapshot.params.id != undefined) {
      this.xAPI.funcion = 'MPPD_AProyecto'
    }else {
      this.Proyecto.fecha_desde = this.utilService.ConvertirFecha(this.fdesde)
      this.Proyecto.fecha_hasta = this.utilService.ConvertirFecha(this.fhasta)
      this.Proyecto.fecha_origen = this.utilService.ConvertirFecha(this.flapso)
    }
    this.xAPI.valores = JSON.stringify(this.Proyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.aceptar(this.Proyecto.identificador == 0? data.msj:'' + this.Proyecto.identificador )
        this.ngxService.stopLoader("loader-aceptar")
        this.limpiarFrm()
      },
      (errot) => {

        this.toastrService.error(errot, `GDoc MPPD Insertar Proyecto`)
        this.ngxService.stopLoader("loader-aceptar")
        this.ruta.navigate(['/ayudantia']);
      }
    )
  }

  protected aceptar(msj: string) {
    Swal.fire({
      title: 'El Proyecto ha sido  procesado #' + this.utilService.zfill(msj, 4),
      text: "¿Desea registar otro documento?",
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
    this.Proyecto.nombre = ''
    this.Proyecto.tipo = ''
    this.Proyecto.empresa = ''
    this.Proyecto.fuente = ''
    this.Proyecto.usuario_final = ''
    this.Proyecto.objeto = ''
    this.Proyecto.observacion = ''
    this.Proyecto.moneda = ''
    this.Proyecto.monto_total = 0.00
    this.Proyecto.monto_pagado = 0.00
    this.Proyecto.monto_deuda = 0.00
    this.Proyecto.usuario = ''
    this.Proyecto.fecha_desde = ''
    this.Proyecto.fecha_hasta = ''

  }

  restar() {
    this.Proyecto.monto_deuda = this.Proyecto.monto_total - this.Proyecto.monto_pagado
  }

  selSistemaArmas() {

    this.aplicasistema = this.Proyecto.tipo == 'Sistema' ? '' : 'none'
    this.campos = this.Proyecto.tipo == 'Sistema' ? 3 : 6

  }
  selFondo() {

    this.otros = this.Proyecto.fuente == 'Otros' ? '' : 'none'
    this.camposotros = this.Proyecto.fuente == 'Otros' ? 3 : 4

  }
}
