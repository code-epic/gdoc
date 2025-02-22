import { Component, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rstranscripcion',
  templateUrl: './rstranscripcion.component.html',
  styleUrls: ['./rstranscripcion.component.scss']
})
export class RstranscripcionComponent implements OnInit {






  public estadoActual = 3
  public estadoOrigen = 2
  public estatusAcutal = 1
  fecha_desde = '-09-01'
  fecha_hasta = '-09-30'
  xyear = '2024'
  public lstMeses = []
  public lstYear = []
  public xmeses = ''

  public extender_plazo: any
  public clasificacion = false
  public vrecibido = true
  public vprocesados = false
  public vpendientes = false
  public cmbDestino = ''

  public posicion = 10
  public focus;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public selNav = 0
  public lengthOfi = 0;
  public pageSizeOfi = 10;
  public pageEvent: PageEvent;
  public idd: string = ''
  public cuenta: string = ''


  public pageSizeOptions: number[] = [5, 10, 25, 100]
  public lstResponsable = []


  public cmbAcciones = [
    { 'valor': '0', 'texto': 'ACEPTAR', 'visible': '0' },
    { 'valor': '1', 'texto': 'RECHAZAR', 'visible': '0' },
    { 'valor': '2', 'texto': 'ELABORAR OFICIO DE OPINION', 'visible': '1' },
    { 'valor': '3', 'texto': 'EN MANOS DEL DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '4', 'texto': 'EN MANOS DEL SUB DIRECTOR DEL DESPACHO', 'visible': '1' },
    { 'valor': '5', 'texto': 'ARCHIVAR', 'visible': '1' },
    { 'valor': '6', 'texto': 'REDISTRIBUCION', 'visible': '1' },
    { 'valor': '7', 'texto': 'SALIDA', 'visible': '2' }]

  public lstAcciones = []
  public bzOriginal = []
  public bzSubDocumentos = []
  public bzRecibido = []
  public bzProcesados = []
  public bzPendientes = []
  public lst = []
  public lstEstados = [] //Listar Estados
  public buzon = []


  public estilocheck = 'none'
  public estiloclasificar = 'none'

  public allComplete: boolean = false
  public numControl = ''
  public Observacion = ''
  public xresponsable: string = '0'

  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }


  public lstFecha = [
    { id: '2023-12-01,2023-12-31,2023-11-30', value: 'DICIEMBRE' },
    { id: '2024-01-01,2024-01-31,2023-12-31', value: 'ENERO' },
    { id: '2024-02-01,2024-02-28,2024-01-31', value: 'FEBRERO' },
    { id: '2024-03-01,2024-03-31,2024-02-28', value: 'MARZO' },
    { id: '2024-04-01,2024-04-30,2024-03-31', value: 'ABRIL' },
    { id: '2024-05-01,2024-05-31,2024-04-30', value: 'MAYO' },
    { id: '2024-06-01,2024-06-30,2024-05-31', value: 'JUNIO' },
    { id: '2024-07-01,2024-07-31,2024-06-30', value: 'JULIO' },
    { id: '2024-08-01,2024-08-31,2024-07-31', value: 'AGOSTO' },
    { id: '2024-09-01,2024-09-30,2024-08-31', value: 'SEPTIEMBRE' },
    { id: '2024-10-01,2024-10-31,2024-09-30', value: '0CTUBRE' },
    { id: '2024-11-01,2024-11-30,2024-10-31', value: 'NOVIEMBRE' },
    { id: '2024-12-01,2024-12-31,2024-11-30', value: 'DICIEMBRE' },
  ]

  longitud = 0;
  pageSize = 10;

  public codigo_carpeta = ''
  public componente = ''
  public fecha_entrada = ''


  constructor(
    private apiService: ApiService,
    private ruta: Router,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private utilService: UtilService,
    private modalService: NgbModal) {


    this.lstMeses = this.apiService.Xmeses
    this.lstYear = this.apiService.Xyear

  }

  ngOnInit(): void {
    this.xmeses = new Date().getMonth().toString()
    this.xyear = new Date().getFullYear().toString()
    this.listarResponsables()
    this.listarEstados()
    this.listarBuzon()
  }

  entrada_open(id, cuenta) {

    if (cuenta != undefined) {
      const xid = btoa('4,2,' + id)
      const xcuenta = btoa(cuenta)
      this.ruta.navigate(['/rsentradas', xid, xcuenta])
      return
    }
    const xid = btoa(id)
    this.ruta.navigate(['/rsentradas', xid])

  }
  open(content, carpeta, componente, posicion, fecha) {
    this.posicion = posicion
    this.codigo_carpeta = carpeta
    this.fecha_entrada = fecha
    this.componente = componente
    this.modalService.open(content)
  }



  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '%'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter((e) => { return e.esta == 1 && e.id != 3 || e.id == 1 })

      },
      (error) => { }
    )
  }

  async listarBuzon() {
    let user = this.loginService.Usuario.cedula

    this.xAPI.funcion = 'MPPD_CCarpertasResponsable'
    this.xAPI.parametros = '36,' + user// '30574644/ 12096976' //16473700
    this.xAPI.valores = ''
    console.log(this.xAPI)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.buzon = data.Cuerpo
      },
      (error) => {

      }
    )
  }





  //Consultar un enlace
  constancia(id: string) {
    const estado = 1
    const estatus = 1
    return btoa(estado + ',' + estatus + ',' + id)
    //this.ruta.navigate(['/constancia', base])
  }


  pageChangeEvent(e) {
    this.pageSize = e.pageSize
    this.recorrerElementos(e.pageIndex)
  }


  //recorrerElementos para paginar listados
  recorrerElementos(pagina: number) {
    let pag = this.pageSize * pagina
    this.buzon = this.bzOriginal.slice(pag, pag + this.pageSize)
  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo
    this.WAlerta.documento = parseInt(this.numControl)
    this.WAlerta.estado = this.estadoActual
    this.WAlerta.estatus = this.selNav + 1
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = this.Observacion.toUpperCase()
    this.WAlerta.fecha = fecha

    this.xAPI.funcion = 'WKF_AAlertas'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }



  getText(e): string {
    let texto = 'EJERCITO'
    // console.log(e)
    switch (parseInt(e)) {
      case 100:
        texto = 'EJERCITO'
        break
      case 200:
        texto = 'ARMADA'
        break
      case 300:
        texto = 'AVIACION'
        break
      case 400:
        texto = 'GUARDIA'
        break
      case 602:
        texto = 'MIXTO'
        break
      default:
        break;
    }
    return texto
  }

  async listarResponsables() {
    this.xAPI.funcion = 'MPPD_ListarResponsables'
    this.xAPI.parametros = 'Resoluciones'
    this.xAPI.valores = null

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        if (data.msj == undefined) {
          data.forEach(e => {
            this.lstResponsable.push({
              'cedula': e.cedula,
              'nombre': e.nombre
            })
          });
        }
      },
      err => { }
    )
  }

  Trasnferir() {
    let user = this.loginService.Usuario.cedula

    let cadena = `${this.xresponsable},${this.Observacion},${this.codigo_carpeta},${this.componente},${this.fecha_entrada}`
    this.xAPI.funcion = 'MPPD_UCarpetaResponsable'
    this.xAPI.parametros = cadena
    this.xAPI.valores = null
    
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.reducirVector()
        this.toastrService.info(
          "La carpeta ha sido actualizada",
          `GDoc Resoluciones`
        )
      },
      err => {
        console.log(err)
      }
    )


  }

  reducirVector() {
    this.buzon.splice(this.posicion, 1);
    console.log('Control de datos ');

}


}


