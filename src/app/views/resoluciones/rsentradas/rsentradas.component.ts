import { Component, Injectable, Input, OnInit } from '@angular/core';
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
import { IEntradas } from 'src/app/services/resoluciones/resolucion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import {
  NgbDateAdapter,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap"
import { MensajeService } from 'src/app/services/util/mensaje.service';


export interface ITipoResolucion {
  codigo: string
  nombre: string
}


/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-"

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER)
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      }
    }
    return null
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : null
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "/"

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER)
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      }
    }
    return null
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : ""
  }
}



@Component({
  selector: 'app-rsentradas',
  templateUrl: './rsentradas.component.html',
  styleUrls: ['./rsentradas.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})

export class RsentradasComponent implements OnInit {

  public id: string = ''
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

  Entradas: IEntradas = {
    id: '',
    cedula: '',
    asunto: '',
    acto: 0,
    carpeta: 0,
    componente: 0,
    tipo_entrada: 0,
    cuenta: '',
    digital: '',
    ecomponente: 0,
    egrado: 0,
    estatus: 0,
    archivo: '',
    formato: '',
    llave: '',
    numero_carpeta: '',
    numero_resol: '',
    observacion: '',
    registrado: '',
    modificado: '',
    responsable: '',
    fecha_entrada: '',
    fecha_resolucion: '',
    detalle: '',
    accion: 0

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
    n_grado: 0,
    codigo_componente: 0,
    codigo_grado: 0
  }

  //Lista de sobrecargas
  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public Estados: any
  public Carpetas: any
  public OrdenNumero: any
  public fcreacion: any
  public forigen: any
  public fplazo: any

  public fecha_resolucion: any

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

  lstResoluciones: any
  lstEntradas: any
  lstT = [] //Objeto Tipo documento
  lstR = [] //Objeto Remitente
  lstU = [] //Objeto Unidad
  lstCuenta = [] //Objeto Unidad

  lstHzAdjunto = [] //Historico de documentos adjuntos
  lstTraza = []
  lstHistorial = []
  lstImg = []
  titulo = 'Documento'

  bHistorial = false
  blAceptar: boolean = true
  bPDF = false

  nControl = ''

  value = ''

  download: any

  bHist = false
  bSecretaria = false
  editar_datos = false
  unidad: string = ''
  asunto: string = ''
  nombramiento: string = ''
  xasunto: string = ''

  filteredOptions: Observable<ITipoResolucion[]>
  myControl = new FormControl()
  TipoResoluciones: any


  CuentaGenera: any

  color = "#e3e6e6"
  hashcontrol = ''
  tipo = '0'
  clasificacion: any
  archivos: any
  responsable = '0'
  componente = '100'
  estatus = ''
  codigo = ''
  xclasificacion = ''
  xcomponente = ''
  bclasificacion = true

  @Input() entradas: any;
  editar: boolean = false




  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private msj: MensajeService,
    private _snackBar: MatSnackBar,
    private ruta: Router) { }

  ngOnInit(): void {

    let alertas = {
      'tipo': 'alerta',
      'valor': true
    }
    this.msj.contenido$.emit(alertas)

    if (this.entradas != undefined) {
      let e = this.entradas.rs;
      console.log(this.entradas)
      this.Entradas.cedula = this.entradas.id
      this.Entradas.acto = parseInt(e.cod_acto.toString())
      this.Entradas.responsable = e.des_responsable
      this.Entradas.registrado = e.des_registrado
      this.Entradas.numero_carpeta = e.numero_carpeta
      this.Entradas.cuenta = e.cuenta_oficio
      this.Entradas.digital = e.digital
      this.Entradas.modificado = e.f_modificado
      this.Entradas.estatus = e.estatus_descripcion
      this.Entradas.tipo_entrada = e.cod_tipo_entrada
      this.Entradas.asunto = e.asunto
      this.Entradas.observacion = e.observacion
      this.Entradas.responsable = e.responsable
      this.Entradas.componente = e.componente
      this.clasificacion = e.cod_tipo_entrada
      this.xclasificacion = e.des_tipo_resol != '' ? e.des_tipo_resol : e.des_tipo_entrada.toString()
      this.fecha_resolucion = this.utilService.ConvertirFechaDia(
        e.fecha_entrada

      )

      this.editar = true
      this.Resolucion.cedula = this.Entradas.cedula
      console.log(this.entradas)
      this.consultarCedula()
      this.estatus = this.entradas.rs.estatus.toString()
      this.codigo = this.entradas.rs.cod_acto.toString()
    }
    this.archivos = []


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
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) => (name ? this._filter(name) : this.TipoResoluciones.slice()))
    )


    this.xcomponente = this.Entradas.componente.toString()



  }

  activar() {
    this.bclasificacion = false
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
    if (this.Resolucion.cedula == "") return false

    if (this.fecha_resolucion == "") {
      this._snackBar.open("Debe seleccionar una fecha para continuar", "OK")
      return
    }


    // this.limpiarFrm()
    this.ngxService.startLoader("loader-entrada")
    this.xAPI.funcion = "MPPD_CDatosBasicos"
    this.xAPI.parametros = this.Resolucion.cedula
    this.xAPI.valores = ''


    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        if (data != undefined && data.Cuerpo.length > 0) {
          this.Resolucion = data.Cuerpo[0]
          console.log(data)

          this.Resolucion.componente = this.Componentes.filter((e) => {
            return e.cod_componente == this.Resolucion.componente
          })[0].nombre_componente
          this.Resolucion.categoria = this.Categorias.filter((e) => {
            return e.cod_categoria == this.Resolucion.categoria
          })[0].nombre_categoria
          this.Resolucion.clasificacion = this.Clasificaciones.filter((e) => {
            return e.cod_clasificacion == this.Resolucion.clasificacion
          })[0].des_clasificacion
          this.Resolucion.gran_comando = this.Grados.filter((e) => {
            return e.cod_grado == this.Resolucion.grado
          })[0].nombres_grado

          if (
            data.Cuerpo[0].resoluciones != undefined &&
            data.Cuerpo[0].resoluciones != ""
          ) {
            this.lstResoluciones = JSON.parse(
              data.Cuerpo[0].resoluciones
            ).reverse()
            this.filtrarNombramiento()
          }
          if (
            data.Cuerpo[0].entradas != undefined &&
            data.Cuerpo[0].entradas != ""
          ) {
            this.lstEntradas = JSON.parse(data.Cuerpo[0].entradas).reverse()
          }
          this.editar_datos = true
          //this.cargarGradosIPSFA(this.Resolucion.n_componente)
          this.hashcontrol = btoa("RE" + this.Resolucion.cedula) //Cifrar documentos
          this.myControl.setValue(this.Entradas.tipo_entrada)

        }


        this.ngxService.stopLoader("loader-entrada")
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )

  }

  filtrarNombramiento() {

    // console.log(this.lstResoluciones)
    const nombramiento = this.lstResoluciones[0]

    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0, 120)

  }
  verHistorialMilitar() {

  }

  displayFn(tr: ITipoResolucion): string {
    return tr && tr.nombre ? tr.nombre : ""
  }

  private _filter(name: string): ITipoResolucion[] {
    const filterValue = name.toLowerCase()

    return this.TipoResoluciones.filter((option) =>
      option.nombre.toLowerCase().includes(filterValue)
    )
  }




  cargarEntrada() {

  }


  verHistorial() {
    const estado = 1
    const estatus = 1

    this.ruta.navigate(['/constancia', btoa(estado + ',' + estatus + ',' + this.nControl)])
  }

  limpiarFrm() {

    this.Resolucion = {
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
      n_grado: 0,
      codigo_componente: 0,
      codigo_grado: 0
    }

    this.Entradas = {
      id: '',
      cedula: '',
      asunto: '',
      acto: 0,
      carpeta: 0,
      componente: 0,
      tipo_entrada: 0,
      cuenta: '',
      digital: '',
      ecomponente: 0,
      egrado: 0,
      estatus: 0,
      archivo: '',
      formato: '',
      llave: '',
      numero_carpeta: '',
      numero_resol: '',
      observacion: '',
      registrado: '',
      modificado: '',
      responsable: '',
      fecha_entrada: '',
      fecha_resolucion: '',
      detalle: '',
      accion: 0
    }

  }

  open(content) {
    this.modalService.open(content);
  }


  validarCampos() {

    if (parseInt(this.codigo) != this.Entradas.acto) {
      this.Entradas.acto = parseInt(this.codigo)
    }

    if (parseInt(this.xcomponente) != this.Entradas.componente) {
      this.Entradas.componente = parseInt(this.xcomponente)
    }

    // console.log(this.xcomponente)

    if (this.clasificacion.codigo != undefined) {
      if (this.Entradas.tipo_entrada != parseInt(this.clasificacion.codigo)) {
        this.Entradas.tipo_entrada = parseInt(this.clasificacion.codigo)
      }
    }



  }

  async SubirArchivo() {
    // Validación antes de continuar
    if (!this.Entradas.cuenta || this.Entradas.cuenta.trim() === '') {
      this.toastrService.error('GDoc MPPD Debe colocar punto cuenta', 'Error');
      return;
    }
    this.validarCampos()
    this.blAceptar = false

    this.ngxService.startLoader("loader-entrada")
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe((data) => {
        this.Entradas.archivo = this.archivos[0] == undefined ? '' : this.archivos[0].name
        if (!this.editar) {

          this.guardar()
        } else {
          this.actualizar()
        }
      })

    } catch (error) {
      this.toastrService.error(error, `GDoc MPPD Insertar resuelto subir el archivo`)
    }

  }


  guardar() {
    if (this.Resolucion.cedula == '') {
      this._snackBar.open("Debe seleccionar una cedula", "OK")
      return
    }
    this.Entradas.cedula = this.Resolucion.cedula
    this.Entradas.egrado = parseInt(this.Resolucion.codigo_grado.toString())
    this.Entradas.ecomponente = parseInt(this.Resolucion.codigo_componente.toString())
    this.Entradas.estatus = parseInt(this.estatus)
    this.Entradas.asunto = this.Entradas.asunto.toUpperCase()
    this.Entradas.observacion = this.Entradas.observacion.toUpperCase()
    this.Entradas.tipo_entrada = parseInt(this.clasificacion.codigo)
    this.Entradas.fecha_entrada = this.utilService.ConvertirFechaDia(
      this.fecha_resolucion
    )
    this.Entradas.modificado = ''
    this.xAPI.funcion = "MPPD_IEntradaResoluciones"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.Entradas)


    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.toastrService.info('Proceso exitoso', `GDoc MPPD Insertar resuelto`);
        this.ngxService.stopLoader("loader-entrada");
        this.blAceptar = false
        this.limpiarFrm()
        //this.utilService.contenido$.emit( this.Entradas.cedula );
      },
      error => {
        console.error(error, 'GDoc Resoluciones entradas')
      }
    );

  }

  actualizar() {
    this.validarCampos()
    console.log(this.Entradas)

    let update = {
      'identificador': this.entradas.rs.id,
      'asunto': this.Entradas.asunto,
      'observacion': this.Entradas.observacion,
      'codigo': this.Entradas.acto,
      'archivo': this.Entradas.archivo,
      'estatus': this.estatus,
      'tipo': this.Entradas.tipo_entrada,
      'modificado': this.loginService.Usuario.cedula,
      'cuenta': this.Entradas.cuenta,
      'componente': this.Entradas.componente
    }

    // console.log(update, this.loginService.Usuario)
    this.xAPI.funcion = "MPPD_AEntradasResolucion"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(update)
    console.log(this.xAPI.valores)


    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.toastrService.info('Proceso exitoso', `GDoc MPPD Insertar resuelto`);
        this.ngxService.stopLoader("loader-entrada");
        this.utilService.contenido$.emit(this.Entradas.cedula);
        this.blAceptar = false
      },
      error => {
        console.error(error, 'GDoc Resoluciones entradas')
      }
    );



  }

  seleccionTipo() {
    // this.desactivarVista()
    if (this.Resolucion.cedula == "") {
      // this._snackBar.open("Debe seleccionar una cedula", "OK")
      return
    }


  }


  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }


  getSituation(valor: String): String {
    switch (valor) {
      case "ACT":
        return "ACTIVO";
      case "RACT":
        return "RESERVA ACTIVA";
      case "CEMP":
        return "CESE DE EMPLEO";
      case "RINC":
        return "REINCORPORADO";
      case "FALL":
        return "FALLECIDO";
      default:
        return ''
    }
  }

}
