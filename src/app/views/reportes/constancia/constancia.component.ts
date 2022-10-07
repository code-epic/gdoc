import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { IDocumento, IWKFAlerta } from '../../../services/control/documentos.service'
import { ApiService, IAPICore} from 'src/app/services/apicore/api.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
 




@Component({
  selector: 'app-constancia',
  templateUrl: './constancia.component.html',
  styleUrls: ['./constancia.component.scss'],
  
})



export class ConstanciaComponent implements OnInit {


  public estadoActual = 1
  public estadoOrigen = 1
  public bCuentas : boolean = false
  public nexpediente : string = ''

  public Doc : IDocumento = {
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
    historial : '',
    traza:'',
    subdocumento : ''
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

  public safeHtml : SafeHtml


  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private loginService: LoginService,
    private rutaActiva: ActivatedRoute,
    public formatter: NgbDateParserFormatter,) { }

  ngOnInit(): void {
    if (this.rutaActiva.snapshot.params.id != undefined) {
      var id = this.rutaActiva.snapshot.params.id
        this.consultarDocumento(id)
      }

  }


  consultarDocumento(numBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = base
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          this.Doc = e
          console.log(this.Doc)
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

          const punto_cuenta = this.Doc.subdocumento!=null? JSON.parse(this.Doc.subdocumento): []
          this.lstSubDoc = punto_cuenta.map(e => {
            return typeof e == 'object'?e: JSON.parse(e)
          })
          const traza = this.Doc.traza!=null?JSON.parse(this.Doc.traza):[]
          this.lstTraza = traza.map(e => {
            return typeof e == 'object'?e: JSON.parse(e)
          })
          const historial = this.Doc.historial!=null?JSON.parse(this.Doc.historial):[]
          this.lstHistorial = historial.map(e => {
            return typeof e == 'object'?e: JSON.parse(e)
          })

          const codigo = this.Doc.codigo + ' / ' + this.Doc.nexpediente
          this.nexpediente = codigo.toUpperCase()
          //this.safeHtml = this.domSanitizer.bypassSecurityTrustHtml(this.Doc.contenido)
          //console.log(this.safeHtml);
          this.Doc.contenido = this.domSanitizer.sanitize(SecurityContext.HTML, this.Doc.contenido)
          // console.log(this.lstTraza);
          if ( this.lstSubDoc.length > 0) this.bCuentas = true
          // console.log(this.lstSubDoc)
        });
      },
      (error) => {
        console.error(error)
      }
    )
  }

}
