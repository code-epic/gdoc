import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'

import Swal from 'sweetalert2'
import { IDocumento, IWKFAlerta, IWKFCuenta, Resolucion } from 'src/app/services/control/documentos.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


export interface ITipoResolucion {
  cod_tipo_resol: string
  des_resol: string

}



@Component({
  selector: 'app-rsentradas',
  templateUrl: './rsentradas.component.html',
  styleUrls: ['./rsentradas.component.scss']
})

export class RsentradasComponent implements OnInit {

  public id: string = ''

  // editor: Editor = new Editor

  // xeditor: Editor = new Editor

  // xobser: Editor = new Editor

  public estadoActual = 1
  public estadoOrigen = 1


  public fecha: any
  public vigencia: any

  placement = 'bottom'

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }


  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    unidad: '',
    fecha_doc: '',
    tipo: '0',
    cedula: '',
    nombres: '',
    fecha_nacimiento: '',
    componente: '',
    categoria: '',
    clasificacion: '',
    grado: '',
    carpeta: '0',
    estatus: '0',
    entrada: '0',
    asunto: '',
    observacion: '',
    responsable: '',
    cargo_responsable: '',
    situacion: '',
    sexo: '',
    numero: '0',
    gran_comando: '',
    unidad_comando: '',
    instrucciones: '',
    n_componente: 0,
    n_grado: 0
  }

  //Lista de sobrecargas
  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public TipoResoluciones: any
  public Estados: any
  public Carpetas: any
  public OrdenNumero: any
  public fcreacion: any
  public forigen: any
  public fplazo: any

  public fcreacionDate: NgbDate | null
  public forigenDate: NgbDate | null

  public WkCuenta: IWKFCuenta = {
    documento: 0,
    cuenta: '',
    estado: 0,
    estatus: 0,
    detalle: '',
    resumen: '',
    fecha: '',
    usuario: '',
    activo: 0
  }

  public cuenta: string = ''

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
    subdocumento: ''
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

  public lstResoluciones: any
  public lstEntradas: any
  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstU = [] //Objeto Unidad
  public lstCuenta = [] //Objeto Unidad

  public lstHzAdjunto = [] //Historico de documentos adjuntos
  public lstTraza = []
  public lstHistorial = []
  public lstImg = []
  public titulo = 'Documento'

  public bHistorial = false
  public bPDF = false

  public nControl = ''

  public value = ''

  public download: any

  public bHist = false
  public unidad: string = ''
  public asunto: string = ''
  public nombramiento : string = ''
  public xasunto : string = ''

  filteredOptions: Observable<ITipoResolucion[]>;
  myControl = new FormControl();
  public CuentaGenera: any


  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private ruta: Router) { }

  ngOnInit(): void {


    // this.editor = new Editor()
    // this.xeditor = new Editor()
    // this.xobser = new Editor()
    if (this.rutaActiva.snapshot.params.id != undefined) {
      const id = this.rutaActiva.snapshot.params.id
      const cnt = this.rutaActiva.snapshot.params.cuenta
      this.consultarDocumento(id, cnt)
    }
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : []
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : []
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : []
    this.TipoEntradas = sessionStorage.getItem("MPPD_CTipoEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada"))) : []
    this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []
    this.Estados = sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion"))) : []
    this.Carpetas = sessionStorage.getItem("MPPD_CCarpetaEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetaEntrada"))) : []
    this.OrdenNumero = sessionStorage.getItem("MPPD_COrdenEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_COrdenEntrada"))) : []


    

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filter(name) : this.TipoResoluciones.slice())),
    );


  }

  /**
  * Consultar Documento al mismo tiempo que selecciona el plazo o la alerta del mismo segun su estado
  * @param numBase64  : base64
  */
  async consultarDocumento(numBase64: string, cntBase64: string) {
    const base = atob(numBase64)
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = base
    this.xAPI.valores = ''
    console.log(this.xAPI);

    this.apiService.Ejecutar(this.xAPI).subscribe(
      async data => {
        console.log(data);
        data.Cuerpo.forEach(e => {
          console.log(e);
          this.Doc = e
          this.fcreacionDate = NgbDate.from(this.formatter.parse(this.Doc.fcreacion.substring(0, 10)))
          this.forigenDate = NgbDate.from(this.formatter.parse(this.Doc.forigen.substring(0, 10)))
          if (e.alerta != null) {
            this.fplazo = NgbDate.from(this.formatter.parse(e.alerta.substring(0, 10)))
            this.WAlerta.activo = 1
            this.WAlerta.documento = this.Doc.wfdocumento
            this.WAlerta.estado = this.estadoActual
            this.WAlerta.estatus = this.estadoOrigen
            this.WAlerta.usuario = this.loginService.Usuario.id
          }

        });

        

        //this.selTipoDocumento()
        const punto_cuenta = this.Doc.subdocumento != null ? JSON.parse(this.Doc.subdocumento) : []
        this.lstCuenta = punto_cuenta.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const traza = this.Doc.traza != null ? JSON.parse(this.Doc.traza) : []
        this.lstTraza = traza.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const historial = this.Doc.historial != null ? JSON.parse(this.Doc.historial) : []
        this.lstHistorial = historial.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        const hz_adjunto = this.Doc.hz_adjunto != null ? JSON.parse(this.Doc.hz_adjunto) : []
        this.lstHzAdjunto = hz_adjunto.map(e => { return typeof e == 'object' ? e : JSON.parse(e) })

        //Carga de Documentos
        this.bPDF = this.Doc.archivo != "" ? true : false
        this.download = this.apiService.Dws(btoa("D" + this.Doc.ncontrol) + '/' + this.Doc.archivo)
        this.nControl = this.Doc.ncontrol
        this.unidad = this.Doc.unidad
        if (cntBase64 != undefined) {
          this.cuenta = atob(cntBase64)

          this.CuentaGenera = this.lstCuenta.filter(e => {
            return e.cuenta = this.cuenta
          });
          console.log(this.CuentaGenera);
          this.asunto = this.CuentaGenera[0].resumen
          this.fecha = this.CuentaGenera[0].detalle
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }
  /**
   * Consultar datos generales del militar 
   */
  consultarCedula() {
    if(this.Resolucion.cedula == '') return false
    this.ngxService.startLoader("loader-buscar")
    this.xAPI.funcion = 'MPPD_CDatosBasicos'
    this.xAPI.parametros = this.Resolucion.cedula
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data.Cuerpo[0])
        this.Resolucion = data.Cuerpo[0]

        this.Resolucion.componente = this.Componentes.filter(e => {return e.cod_componente ==  this.Resolucion.componente })[0].nombre_componente
        this.Resolucion.categoria = this.Categorias.filter(e => {return e.cod_categoria ==  this.Resolucion.categoria })[0].nombre_categoria
        this.Resolucion.clasificacion = this.Clasificaciones.filter(e => {return e.cod_clasificacion ==  this.Resolucion.clasificacion })[0].des_clasificacion
        this.Resolucion.grado = this.Grados.filter(e => {return e.cod_grado ==  this.Resolucion.grado })[0].nombres_grado
        
        if (data.Cuerpo[0].resoluciones != undefined && data.Cuerpo[0].resoluciones != ''){
          this.lstResoluciones =  JSON.parse(data.Cuerpo[0].resoluciones).reverse()
          this.filtrarNombramiento()
        }
        if (data.Cuerpo[0].entradas != undefined && data.Cuerpo[0].entradas != ''){
          this.lstEntradas = JSON.parse(data.Cuerpo[0].entradas).reverse()
        }
       

        this.ngxService.stopLoader("loader-buscar")
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }

    )

  }

  filtrarNombramiento () {

    console.log(this.lstResoluciones)
    const nombramiento =  this.lstResoluciones[0]

    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0,100)
    
  }
  verHistorialMilitar(){

  }

  displayFn(tr: ITipoResolucion): string {
    return tr && tr.des_resol ? tr.des_resol : '';
  }

  private _filter(name: string): ITipoResolucion[] {
    const filterValue = name.toLowerCase();

    return this.TipoResoluciones.filter(option => option.des_resol.toLowerCase().includes(filterValue));
  }


  verHistorial() {
    const estado = 1
    const estatus = 1

    this.ruta.navigate(['/constancia', btoa(estado + ',' + estatus + ',' + this.nControl)])
  }

  limpiarFrm() {

  }

  open(content) {
    this.modalService.open(content);
  }



  guardar() {

  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: 'lg' })

  }

}
