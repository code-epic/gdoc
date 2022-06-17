import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal, NgbDate, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Editor } from 'ngx-editor'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import { IWKFAlerta } from 'src/app/services/control/documentos.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import Swal from 'sweetalert2'


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
  public lstHzAdjuntoSub = []
  public estadoActual = 4
  public estadoOrigen = 2
  public original = ''
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public codigohash = ''

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
  public cmbDestino = 'S'
  public asunto = ''
  public fecha = ''
  public cuenta = ''
  public unidad = ''
  public titulo = ''
  public archivos = []
  public download: any
  public fcreacion: any
  public creador: any

  public lstRedistribucion = [{ 'valor': '1', 'texto': 'REDISTRIBUCION', 'visible': '1' }]

  public ministerial: any

  editor: Editor = new Editor

  public blUpdate = false
  public bHist = false

  public numControl = ''

  public Observacion = ''

  public AccionTexto: string = '0'

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
  public dwValidate = false
  public dwSub = false

  constructor(private apiService: ApiService,
    config: NgbModalConfig,
    private ruta: Router,
    private toastrService: ToastrService,
    private utilService: UtilService,
    private rutaActiva: ActivatedRoute,
    private loginService: LoginService,
    public formatter: NgbDateParserFormatter,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.editor = new Editor()
    this.fplazo = NgbDate.from(this.formatter.parse(this.utilService.FechaActual()))

    this.extender_plazo = NgbDate.from(this.formatter.parse(this.utilService.FechaActual()))

    if (this.rutaActiva.snapshot.params.id != undefined) {
      try {
        this.original = this.rutaActiva.snapshot.params.id
        this.ministerial = JSON.parse(atob(this.original))
        this.listarDatos()
        //Carga de Documentos
        this.dwValidate = this.ministerial.anom != "" ? true : false
        this.download = this.apiService.Dws(btoa("D" + this.ministerial.numc) + '/' + this.ministerial.anom)
        //console.log(this.download, this.ministerial.anom);
        this.codigohash = btoa(this.ministerial.id + this.ministerial.idd + this.ministerial.cuenta)
        this.cmbDestino = 'S'
        this.creador = this.ministerial.usua
        console.log(this.ministerial);
        this.listarEstados()
      } catch (error) {
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

  open(content, id) {
    this.modalService.open(content, { size: 'lg' });
  }

  activarHistorial() {
    this.bHist = !this.bHist
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
          this.original = btoa(JSON.stringify(data.Cuerpo[0]))
          this.blUpdate = true
        }
        this.dwSub = this.SubDocumento.nombre_archivo != "" ? true : false
        //console.log(this.SubDocumento)
        //this.download = this.apiService.Dws( this.codigohash + '/' + this.SubDocumento.nombre_archivo )
      },
      (error) => {

      }
    )


  }

  selFecha() {
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
    this.extender_plazo = NgbDate.from(this.formatter.parse(this.fecha_alerta))

  }

  aceptar() {
    this.selFecha()
    this.SubDocumento.subdocumento = parseInt(this.ministerial.ids)
    this.SubDocumento.cuenta = this.ministerial.cuenta
    this.SubDocumento.fecha = this.fecha_alerta
    this.SubDocumento.usuario = this.loginService.Usuario.id
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.SubDocumento)

    this.ngxService.startLoader("loader-aceptar")

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
      async data => {
        this.xAPI.funcion = 'WKF_ISubDocumentoAlerta'
        await this.guardarAlerta(90, this.fecha_alerta)
        this.ngxService.stopLoader("loader-aceptar")
        this._aceptar('')
      },
      (error) => {

      }
    )
  }

  actualizar() {
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        this.xAPI.funcion = 'WKF_ASubDocumentoAlerta'
        await this.guardarAlerta(91, this.fecha_alerta)
        this.ngxService.stopLoader("loader-aceptar")
        this._aceptar('')
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
    this.xAPI.valores = JSON.stringify(this.WAlerta)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async alerData => {
        console.log(alerData)
      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.AAlertas`);
      }) //
  }


  protected _aceptar(msj: string) {
    Swal.fire({
      title: 'El punto de cuenta ha sido actualizado con exito ',
      text: "Felicitaciones",
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar'
    }).then((result) => {
      this.ruta.navigate(['/secretaria']);
    })
  }



  _atras() {
    if (this.original != btoa(JSON.stringify(this.SubDocumento))) {
      this.toastrService.warning('Debe guardar los cambios antes de salir de esta pantalla', `GDoc WKF_SubDocumentos`);
    } else {
      this.ruta.navigate(['/secretaria']);
    }
    return
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
          console.log(this.archivos[0].name)
          this.SubDocumento.nombre_archivo = this.archivos[0].name

          this.aceptar()
          this.toastrService.success(
            'Tu archivo ha sido cargado con exito ',
            `GDoc SubDocumentos`
          );
          //this.ngxService.stopLoader("loader-aceptar")

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


  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: 'lg' })
  }



  insertarObservacion() {
    var usuario = this.loginService.Usuario.id
    this.xAPI.funcion = 'WKF_IDocumentoObservacion'
    this.xAPI.valores = JSON.stringify(
      {
        "documento": this.ministerial.idd,
        "estado": this.estadoActual, //Estado que ocupa
        "estatus": 1,
        "observacion": this.Observacion.toUpperCase(),
        "accion": this.AccionTexto,
        "usuario": usuario
      }
    )
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {

        this.redistribuir()

      },
      (errot) => {
        this.toastrService.error(errot, `GDoc Wkf.DocumentoObservacion`);
      }) //
  }


  async redistribuir(destino: number = 0) {
    var dst = destino != 0 ? destino : this.cmbDestino

    this.xAPI.funcion = "WKF_ASubDocumentoRedistribuir"
    this.xAPI.valores = ''
    this.xAPI.parametros = dst + ',1,' + this.loginService.Usuario.id + ',' + this.ministerial.idd + ',' + this.ministerial.cuenta
    console.log(this.xAPI);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        //this.xAPI.funcion = 'WKF_ASubDocumentoAlerta'
        //await this.guardarAlerta(1, this.utilService.ConvertirFecha(this.extender_plazo))
        this.toastrService.success(
          'El documento ha sido redistribuido segun su selección',
          `GDoc Wkf.DocumentoObservacion`
        )
        this.ruta.navigate(['/secretaria']);
      },
      (error) => {
        console.error(error)
      }
    )
  }



}
