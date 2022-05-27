import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal, NgbDate, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Editor } from 'ngx-editor'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';


export interface SubDocumento {
  subdocumento: number
  cuenta: string
  estatus: string
  decision: string
  accion: string
  comentario: string
  historico: string
  archivo: string
  nombre_archivo: string
  fecha: string
  usuario: string
}

@Component({
  selector: 'app-ministerial',
  templateUrl: './ministerial.component.html',
  styleUrls: ['./ministerial.component.scss']
})
export class MinisterialComponent implements OnInit {



  public lstEstados = [] //Listar Estados

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public lstAcciones = [
    { 'valor': '1', 'texto': 'ANALISTA', 'visible': '1' },
    { 'valor': '2', 'texto': 'JEFE DE AREA', 'visible': '1' },
    { 'valor': '3', 'texto': 'BANDEJA DE ESPERA', 'visible': '1' },
    { 'valor': '4', 'texto': 'PRESIDENCIAL', 'visible': '1' },
    { 'valor': '5', 'texto': 'ESPERA DE OPINION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '6', 'texto': 'CONSULTORIA JURIDICA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '7', 'texto': 'AREA DE RESOLUCIONES', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '8', 'texto': 'SUB-DIRECCION', 'visible': '1' },
    { 'valor': '9', 'texto': 'DIRECCION GENERAL', 'visible': '1' },
    { 'valor': '10', 'texto': 'DESPACHO DEL MPPD', 'visible': '1' },  //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '11', 'texto': 'ARCHIVO', 'visible': '1' }
  ]

  public extender_plazo: any

  public posicionPagina = 0
  public placement = 'bottom'


  public asunto = ''
  public fecha = ''
  public cuenta = ''
  public unidad = ''
  public titulo = ''


  public ministerial: any

  editor: Editor = new Editor;

  public blUpdate = false;


  public SubDocumento: SubDocumento = {
    subdocumento: 0,
    cuenta: '',
    estatus: '',
    decision: '',
    accion: '',
    comentario: '',
    historico: '',
    archivo: '',
    nombre_archivo: '',
    fecha: '',
    usuario: ''
  }


  public WAlerta: IWKFAlerta = {
    documento: 0,
    estado: 0,
    estatus: 0,
    activo: 0,
    fecha: '',
    usuario: '',
    observacion: ''
  }

  public fecha_alerta: any
  public fplazo: any

  constructor(private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.editor = new Editor()
    this.fplazo = NgbDate.from(this.formatter.parse( this.utilService.FechaActual()))

    if (this.rutaActiva.snapshot.params.id != undefined) {
      try {
        var json = atob(this.rutaActiva.snapshot.params.id)
        this.ministerial = JSON.parse(json)
        this.listarDatos()
      } catch (error) {
        console.error('accediendo a un area restringida')
        this.ruta.navigate(['/secretaria', ''])
      }


    }
  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter(e => { return e.esta == 1 });
      },
      (error) => {

      }
    )
  }

  listarDatos() {
    this.unidad = this.ministerial.udep
    this.cuenta = this.ministerial.cuenta
    this.fecha = this.ministerial.detalle
    this.asunto = this.ministerial.resumen

    this.xAPI.funcion = 'WKF_CSubDocVariante'
    this.xAPI.parametros = this.ministerial.ids
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
        if (data.Cuerpo != undefined && data.Cuerpo.length > 0) {
          this.SubDocumento = data.Cuerpo[0];
          this.blUpdate = true
        }
      },
      (error) => {

      }
    )


  }

  selFecha(){
    this.fecha_alerta = this.utilService.FechaActual()
    switch (this.SubDocumento.estatus) {
      case "5":
        this.fecha_alerta = this.utilService.FechaActual(7)
        break;
      case "6":
        this.fecha_alerta = this.utilService.FechaActual(7)
        break;
      case "7":
        this.fecha_alerta = this.utilService.FechaActual(7)
        break;
      case "10":
        this.fecha_alerta = this.utilService.FechaActual(7)
        break;
    }
    this.fplazo = NgbDate.from(this.formatter.parse(this.fecha_alerta))
    
  }

  aceptar() {
    this.selFecha()
    this.SubDocumento.subdocumento = parseInt(this.ministerial.ids)
    this.SubDocumento.cuenta = this.ministerial.cuenta
    this.SubDocumento.fecha = this.fecha_alerta
    this.SubDocumento.usuario = this.loginService.Usuario.id
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.SubDocumento)
    console.log(this.blUpdate)
    if (this.blUpdate == false) {
      this.xAPI.funcion = 'WKF_ISubDocVariante'
      this.registrar()
      this.blUpdate = true
      return
    }
    this.xAPI.funcion = 'WKF_ASubDocVariante'
    this.actualizar()
  }

  registrar() {
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data  => {
        console.log(data);
        this.xAPI.funcion = 'WKF_ISubDocumentoAlerta'
        await this.guardarAlerta(90, this.fecha_alerta)
      },
      (error) => {

      }
    )
  }

  actualizar() {
    console.info('Actualizando informacion ', this.xAPI)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        console.log(data);
        this.xAPI.funcion = 'WKF_ASubDocumentoAlerta'
        await this.guardarAlerta(91, this.fecha_alerta)
      },
      (error) => {

      }
    )

  }

  //Guardar la alerte define el momento y estadus
  guardarAlerta(activo: number, fecha: string) {
    this.WAlerta.activo = activo
    this.WAlerta.documento = parseInt(this.ministerial.ids)
    this.WAlerta.estado = 4
    this.WAlerta.estatus = 3
    this.WAlerta.usuario = this.loginService.Usuario.id
    this.WAlerta.observacion = this.ministerial.cuenta
    this.WAlerta.fecha = fecha


    this.xAPI.parametros = ''
    console.log(this.xAPI.funcion, "Actualizar alertas");
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }



}
