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
  

    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : []
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : []
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : []
    this.TipoEntradas = sessionStorage.getItem("MPPD_CTipoEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada"))) : []
    this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []
    this.Estados = sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion"))) : []
    this.Carpetas = sessionStorage.getItem("MPPD_CCarpetaEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetaEntrada"))) : []
    this.OrdenNumero = sessionStorage.getItem("MPPD_COrdenEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_COrdenEntrada"))) : []


  
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
    let estatus = this.estatus = ''? '%': this.estatus

    
    this.xAPI.funcion = 'MPPD_CEntradasResoluciones'
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


}