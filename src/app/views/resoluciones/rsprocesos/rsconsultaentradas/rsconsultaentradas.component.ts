import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rsconsultaentradas',
  templateUrl: './rsconsultaentradas.component.html',
  styleUrls: ['./rsconsultaentradas.component.scss']
})
export class RsconsultaentradasComponent implements OnInit {

  fechaRango: FormGroup
  selected = new FormControl(0)
  lstEntradas = []

  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public Estados: any
  public Carpetas: any
  public OrdenNumero: any
  public TipoResoluciones: any

  estatus = '%'
  asunto = ''
  observacion = ''
  tipo = '%'
  numero = ''

  bEntradas = false

  xAPI : IAPICore = {
    funcion: '',
    valores : '',
    parametros : ''
  }

  cuenta = ''
  digital = ''
  documento = ''
  responsable_entrada = ''
  registrado_entrada = ''

  modificado_entrada = ''
  carpeta_entrada = ''
  acto = 'RESOLUCION'
  estatus_entrada: any
  tipo_entrada = ''
  asunto_entrada = ''
  observacion_entrada = ''
  opttodos = "0"


  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    public formatter: NgbDateParserFormatter,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    this.fechaRango = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    })
  

    this.Componentes = sessionStorage.getItem(environment.funcion.COMPONENTE_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.COMPONENTE_CONSULTAR))) : []
    this.Grados = sessionStorage.getItem(environment.funcion.GRADO_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.GRADO_CONSULTAR))) : []
    this.Categorias = sessionStorage.getItem(environment.funcion.CATEGORIAS_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.CATEGORIAS_CONSULTAR))) : []
    this.Clasificaciones = sessionStorage.getItem(environment.funcion.CLASIFICACION_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.CLASIFICACION_CONSULTAR))) : []
    this.TipoEntradas = sessionStorage.getItem(environment.funcion.TIPO_ENTRADA_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.TIPO_ENTRADA_CONSULTAR))) : []
    this.TipoResoluciones = sessionStorage.getItem(environment.funcion.TIPO_RESOLUCION_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.TIPO_RESOLUCION_CONSULTAR))) : []
    this.Estados = sessionStorage.getItem(environment.funcion.ESTADO_RESOLUCION_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.ESTADO_RESOLUCION_CONSULTAR))) : []
    this.Carpetas = sessionStorage.getItem(environment.funcion.CARPETA_ENTRADA_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.CARPETA_ENTRADA_CONSULTAR))) : []
    this.OrdenNumero = sessionStorage.getItem(environment.funcion.ORDEN_ENTRADA_CONSULTAR) != undefined ? JSON.parse(atob(sessionStorage.getItem(environment.funcion.ORDEN_ENTRADA_CONSULTAR))) : []

    
  
  }


  convertirFecha(fecha: string): string {
    return fecha != '' ? this.utilService.ConvertirFechaHumana(fecha) : ''
  }

  Consultar(){

    this.ngxService.startLoader("loader-buscar");
   
    let codigo = this.tipo== ''? '%': this.tipo
    let ncarpeta = this.numero==''?'%':this.numero
    let asunto = this.asunto ==''?'%':'%' +  this.asunto + '%'
    let observacion = this.observacion ==''?'%': '%' + this.observacion + '%'

    let desde = this.utilService.ConvertirFechaDia(this.fechaRango.value.start);
    let hasta = this.utilService.ConvertirFechaDia(this.fechaRango.value.end);
    let estatus = this.estatus === '' ? '%' : this.estatus

    
    this.xAPI.funcion = environment.funcion.ENTRADAS_RESOLUCIONES
    this.xAPI.parametros = `${estatus},${desde},${hasta},${codigo},${asunto},${observacion},${ncarpeta}`
    this.xAPI.valores = ''
    console.log(this.xAPI.parametros)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lstEntradas = data.Cuerpo
        this.ngxService.stopLoader("loader-buscar");
        this.bEntradas = true
      },
      error => {

      }
    )
  }

  volverFrm(){
    this.bEntradas = false
    this.lstEntradas = []
  }


  detalleEntrada(content, e) {

    this.modalService.open(content, { size: "lg" })


    this.documento = e.cod_acto == 0 ? 'RESOLUCIÓN' : 'ORDEN GENERAL'
    this.responsable_entrada = e.des_responsable
    this.registrado_entrada = e.des_registrado
    this.numero = e.numero_carpeta
    this.cuenta = e.cuenta_oficio
    this.digital = e.digital
    this.modificado_entrada = e.f_modificado
    this.estatus_entrada = e.estatus_descripcion

    // console.log(new Date(e.f_modificado))
    // console.log(new Date('2024-09-01 00:00:00'))

    if ( new Date(e.f_modificado) < new Date('2024-09-01 00:00:00')){
      this.tipo_entrada = e.des_tipo_entrada
      // console.log('ENTRADA')
    } else {
      this.tipo_entrada = e.des_tipo_resol
      // console.log('RESOLUCION')

    }

    this.asunto_entrada = e.asunto
    this.observacion_entrada = e.observacion
    this.carpeta_entrada = e.des_carpeta

  }

  ConsultarFecha(){
    this.ngxService.startLoader("loader-buscar");
   
    let codigo = this.tipo== ''? '%': this.tipo
    let ncarpeta = this.numero==''?'%':this.numero
    let asunto = this.asunto ==''?'%':'%' +  this.asunto + '%'
    let observacion = this.observacion ==''?'%': '%' + this.observacion + '%'

    let desde = new Date().getFullYear()  +'-01-01'
    let hasta = new Date().getFullYear()  +'-12-31'
    let estatus = this.estatus === '' ? '%' : this.estatus

    
    this.xAPI.funcion = environment.funcion.CONSULTAR_ENTRADAS_RESOLUCIONES
    this.xAPI.parametros = `${estatus},${desde},${hasta},${codigo},${asunto},${observacion},${ncarpeta}`
    this.xAPI.valores = ''
    console.log(this.xAPI.parametros)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lstEntradas = data.Cuerpo
        this.ngxService.stopLoader("loader-buscar");
        this.bEntradas = true
      },
      error => {

      }
    )
  }

  dwUrlEntrada(e){
    this.utilService.contenido$.emit( e.cedula_entrada );
  }

}