import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { IDocumento, IWKFAlerta } from '../../../services/control/documentos.service'
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';





@Component({
  selector: 'app-constancia',
  templateUrl: './constancia.component.html',
  styleUrls: ['./constancia.component.scss'],

})



export class ConstanciaComponent implements OnInit {


  public estadoActual = 1
  public estadoOrigen = 1
  public bCuentas: boolean = false
  public nexpediente: string = ''

  public Doc: IDocumento = {
    ncontrol: '',
    wfdocumento: 0,
    fcreacion: '',
    forigen: '',
    norigen: '',
    salida: '',
    tipo: '0',
    remitente: '0',
    unidad: '0',
    contenido: '',
    instrucciones: '',
    codigo: '',
    nexpediente: '',
    creador: '',
    archivo: '',
    privacidad: 0,
    historial: '',
    traza: '',
    subdocumento: '',

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

  public xAPI: IAPICore = {
    funcion: ''

  };

  public lstSubDoc = []
  public lstTraza = []
  public lstHistorial = []
  public lstUsuario = []

  public safeHtml: SafeHtml
  public rcuenta = false
  public resumencuenta = ''

  public nCuenta = ''
  public isPunto: boolean = true
  public sCedula: string = 'CEDULA'
  public sGrado: string = 'GRADO /  GERARQUIA'
  public sNombre: string = 'NOMBRES Y APELLIDOS'
  public sAccion: string = 'ACCION TOMADA'
  public btraza: boolean = false

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private loginService: LoginService,
    private rutaActiva: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,) { }

  ngOnInit(): void {
    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
      this.lstUsuario = sessionStorage.getItem("CEP_CUsuario") != undefined ? JSON.parse(atob(sessionStorage.getItem("CEP_CUsuario"))) : []

      this.consultarDocumento(id)
      this.ngxService.startLoader("loader-aceptar")
    }



  }

  setDescripcionContratos() {
    this.sCedula = '# CONTRATO'
    this.sGrado = 'RIF / RAZON SOCIAL'
    this.sNombre = 'MONTO TOTAL'
    // console.log('conectado')
  }

  consultarDocumento(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'

    this.xAPI.parametros = base
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        data.Cuerpo.forEach(async e => {
          this.Doc = e
          this.Doc.contenido = this.Doc.contenido.toUpperCase()
          this.Doc.instrucciones = this.Doc.instrucciones.toUpperCase()
          this.Doc.fcreacion = e.fcreacion.substring(0, 10)
          this.Doc.forigen = e.forigen.substring(0, 10)
          if (e.alerta != null) {
            const fplazo = e.alerta.substring(0, 10)
            this.WAlerta.activo = 1
            this.WAlerta.documento = this.Doc.wfdocumento
            this.WAlerta.estado = this.estadoActual
            this.WAlerta.estatus = this.estadoOrigen
            this.WAlerta.usuario = this.loginService.Usuario.id
          }

          const punto_cuenta = this.Doc.subdocumento != null ? JSON.parse(this.Doc.subdocumento) : []
          this.lstSubDoc = punto_cuenta.map(e => {
            return typeof e == 'object' ? e : JSON.parse(e)
          })

          if (this.lstSubDoc.length > 0) {
            this.resumencuenta = this.lstSubDoc[0].resumen
            this.nCuenta = this.lstSubDoc[0].cuenta
            this.rcuenta = true
          }

          const historial = this.Doc.historial != null ? JSON.parse(this.Doc.historial) : []
          this.lstHistorial = historial.map(e => {
            return typeof e == 'object' ? e : JSON.parse(e)
          })

          // console.log(this.Doc.codigo, this.Doc.nexpediente)
          const codigo = this.Doc.nexpediente != '' ? this.Doc.codigo + ' / ' + this.Doc.nexpediente : ''
          this.nexpediente = codigo.toUpperCase()

          // console.log('Doc:', this.lstUsuario)
          let nombre = this.lstUsuario.filter(ex => {
            return ex.key == this.Doc.creador
          })

          this.Doc.creador = nombre[0] == undefined ? '' : nombre[0].nomb
          //this.safeHtml = this.domSanitizer.bypassSecurityTrustHtml(this.Doc.contenido)
          //console.log(this.safeHtml);
          this.Doc.contenido = this.domSanitizer.sanitize(SecurityContext.HTML, this.Doc.contenido)
          console.log(this.lstTraza);
          if (this.lstSubDoc.length > 0) this.bCuentas = true

          if (this.Doc.tipo.toLocaleLowerCase().indexOf('contratos') >= 0) {
            this.setDescripcionContratos()
          }
          const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : []
          // console.log(traza);

          if (traza.length == 0) {
            this.nexpediente = this.Doc.estado_doc != '' ? this.Doc.estado_doc + ' / ' + this.Doc.estatus_doc : ''
          } else {
            this.btraza = true
            this.lstTraza = await traza.map(e => {
              let el = typeof e == 'object' ? e : JSON.parse(e)
              let nombre = this.lstUsuario.filter(ex => {
                return ex.key == el.usuario
              })

              el.descripcion = nombre[0] == undefined ? '' : nombre[0].nomb
              return el
            })
            this.lstTraza.sort((a, b) => b.id - a.id)
          }

          this.ngxService.stopLoader("loader-aceptar")
        });
      },
      (error) => {
        console.error(error)
      }
    )
  }

  getDetalle(e): string {
    let texto = ''
    let valor = e != '' ? e.split('|')[1] : 'PROCESADO'
    switch (valor) {
      case 'NP':
        texto = 'NO PROCESAR'
        break;
      case 'NPPIDD':
        texto = 'NP POR INT. DEL DIRECTOR'
        break;
      case 'NPPIDJ':
        texto = 'NP POR INT. DEL JEFE DE AREA'
        break;
      case 'CR':
        texto = 'CODIGO ROJO'
        break;
      case 'BD':
        texto = 'NO PROCESAR POR ASCENSO'
        break;
      case 'FR':
        texto = 'FIRMADO'
        break;
      case 'ESP':
        texto = 'EN ESPERA'
        break;
      default:
        texto = 'PROCESAR'
        break;
    }
    return texto
  }

  getDepartamento(e): string {

    return e.toUpperCase() == 'REGISTRAR' ? 'REGISTRO Y ESCANEO' : e.toUpperCase()
  }



}
