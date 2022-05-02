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



@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit {



  editor: Editor = new Editor;
  
  xeditor: Editor = new Editor;
  
  xobser: Editor = new Editor;
  

  fdesde : NgbDate | null
  fhasta : NgbDate | null
  flapso : NgbDate | null
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
    { 'id' : 'AVIONES', 'nombre' : 'AVIONES'},
    { 'id' : 'HELICOPTERO', 'nombre' : 'HELICOPTERO'},
    { 'id' : 'VEHICULOS TACTICOS', 'nombre' : 'VEHICULOS TACTICOS'},
    { 'id' : 'TANQUES', 'nombre' : 'TANQUES'},
    { 'id' : 'EMBARCACIONES', 'nombre' : 'EMBARCACIONES'},
    { 'id' : 'RADARES', 'nombre' : 'RADARES'},
    { 'id' : 'COMPLEJO MISILISTICO', 'nombre' : 'COMPLEJO MISILISTICO'},
    { 'id' : 'ARMAMENTO INDIVIDUAL', 'nombre' : 'ARMAMENTO INDIVIDUAL'},
  ]

  public Proyecto: Proyecto = {
    ncontrato : '',
    nombre: '',
    tipo: '0',
    contratante: '',
    empresa: '',
    fuente: '0',
    usuario_final: '0',
    objeto: '',
    observacion: '',
    moneda: '',
   // fdesde: '',
   // fhasta: '',
    lapso: '',
    monto_total: 0.00,
    monto_pagado: 0.00,
    adeuda: 0.00,
    usuario: '',
    estatus: '',
    jefeproyecto: '',
    sistema: '',
  }

  public Avance : Avance = {
    lapso: '',
    ejecucion: '',
    monto: ''
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
    console.log(this.Proyecto);
    this.xAPI.funcion = 'MPPD_IProyecto'
    this.xAPI.parametros = ''
    this.Proyecto.usuario = this.loginService.Usuario.id

    this.xAPI.valores = JSON.stringify(this.Proyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.limpiarFrm()
        this.aceptar(data.msj)
        this.ngxService.stopLoader("loader-aceptar")
       
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
      title: 'El Proyecto ha sido  Registrado #' + this.utilService.zfill(msj, 4),
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
    this.Proyecto.contratante = ''
    this.Proyecto.empresa = ''
    this.Proyecto.fuente = ''
    this.Proyecto.usuario_final = ''
    this.Proyecto.objeto = ''
    this.Proyecto.observacion = ''
    this.Proyecto.moneda = ''
    this.Proyecto.lapso = ''
    this.Proyecto.monto_total = 0.00
    this.Proyecto.monto_pagado = 0.00
    this.Proyecto.adeuda = 0.00
    this.Proyecto.usuario = ''

  }

  restar(){
    this.Proyecto.adeuda = this.Proyecto.monto_total - this.Proyecto.monto_pagado
  }

  selSistemaArmas(){

    this.aplicasistema = this.Proyecto.tipo=='Sistema'?'':'none'
    this.campos = this.Proyecto.tipo=='Sistema'?3:6
    
  }
  selFondo(){

    this.otros = this.Proyecto.fuente=='Otros'?'':'none'
    this.camposotros = this.Proyecto.fuente=='Otros'?3:4
    
  }
}
