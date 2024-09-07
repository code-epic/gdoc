import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core"
import { ApiService, IAPICore } from "src/app/services/apicore/api.service"

import { ActivatedRoute, Router } from "@angular/router"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"

import Swal from "sweetalert2"
import { Resolucion } from "src/app/services/control/documentos.service"
import { FormControl } from "@angular/forms"
import { Observable } from "rxjs"
import { map, startWith } from "rxjs/operators"
import { LoginService } from "src/app/services/seguridad/login.service"
import { UtilService } from "src/app/services/util/util.service"
import { NgxUiLoaderService } from "ngx-ui-loader"

import { AngularEditorConfig } from "@kolkov/angular-editor"
import { MatSnackBar } from "@angular/material/snack-bar"
import {
  IDatosBasicos,
  IResoluciones,
} from "src/app/services/resoluciones/resolucion.service"
import { ToastrService } from "ngx-toastr"

import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap"
import { FormsModule } from "@angular/forms"
import { JsonPipe } from "@angular/common"

export interface ITipoResolucion {
  codigo: string
  nombre: string
}

export interface IConfiguracion {
  id: string
  nomb: string
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
  selector: "app-oresoluciones",
  templateUrl: "./oresoluciones.component.html",
  styleUrls: ["./oresoluciones.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class OresolucionesComponent implements OnInit {

  public id: string = ""

  // editor: Editor = new Editor

  // xeditor: Editor = new Editor

  // xobser: Editor = new Editor

  public estadoActual = 1
  public estadoOrigen = 1

  public fecha: any
  public vigencia: any

  placement = "bottom"

  public xAPI: IAPICore = {
    funcion: "",
    parametros: "",
    valores: "",
  }

  public lstEstructura = []

  public searchView = "none"
  public contentView = ""
  public focus = false

  public IDatosBasicos: IDatosBasicos = {
    area: "",
    cedula: "",
    categoria: 0,
    clasificacion: 0,
    componente: 0,
    grado: 0,
    profesion: "",
    profesionx: "",
    reserva: 0,
    solicitud: 0,
    condicion: 0,
    especialidad: "",
    estudios: "",
    nacimiento: "",
    promocion: "",
    fecha: "",
    n_componente: 0,
    n_grado: 0,
    nombres: "",
    sexo: "",
    resolucion: 0,
    orden: 0,
    anio: 0,
    mes: 0,
    dia: 0,
    ultimo_ascenso: "",
    motivo: "",
    observacion: "",
    situacion: "",
    telefono: "",
    correo: "",
    ubicacion: "",
    cargo: "",
    estadomayor: ""
  }

  public IResolucion: IResoluciones = {
    grado: 0,
    anio: 0,
    asunto: "",
    cedula: "",
    pais: 0,
    reserva: 0,
    solicitud: 0,
    tipo: 0,
    unidad: 0,
    comando: "",
    comision_fin: "",
    comision_inicio: "",
    creador: "",
    destino: "",
    dia: 0,
    distribucion: "0",
    estatus: 0,
    modificado: "",
    fecha_termino: "",
    falta: "",
    registro: "",
    fecha_resolucion: "",
    formato: "",
    ultimo_ascenso: "",
    instrucciones: "",
    mes: 0,
    autor_modificar: "",
    motivo: "",
    numero: "",
    observacion: "",
    orden_merito: 0,
    otro_resuelto: "",
    autor_registro: "",
    termino: 0,
    unidad_texto: "",
    documento: 0,
    causa: 0,
    archivo: ""
  }

  public Resolucion: Resolucion = {
    id: "",
    cuenta: "",
    unidad: "",
    fecha_doc: "",
    tipo: {},
    cedula: "",
    nombres: "",
    fecha_nacimiento: "",
    componente: "",
    categoria: "",
    clasificacion: "",
    grado: "",
    carpeta: "",
    estatus: "",
    entrada: "",
    asunto: "",
    observacion: "",
    responsable: "",
    cargo_responsable: "",
    situacion: "",
    sexo: "",
    numero: "",
    gran_comando: "",
    unidad_comando: "",
    instrucciones: "",
    n_componente: 0,
    n_grado: 0,
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

  public fecha_resolucion: any
  public ultimo_ascenso: any
  public comision_inicio: any
  public comision_fin: any

  public cuenta: string = ""

  public lstResoluciones: any
  public lstEntradas: any
  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstCuenta = [] //Objeto Unidad

  public lstHzAdjunto = [] //Historico de documentos adjuntos
  public lstTraza = []
  public lstHistorial = []
  public lstImg = []
  public titulo = "Documento"

  public bHistorial = false
  public bPDF = false
  public editar_datos = false

  public nControl = ""

  public value = ""

  public download: any

  public bHist = false
  public unidad: string = ""
  public asunto: string = ""
  public nombramiento: string = ""
  public xasunto: string = ""
  public cresolucion = ""
  public fresolucion = ""
  public aresolucion = ""

  public blNombramiento: boolean = false
  public blCorregir: boolean = false
  public blReserva: boolean = false
  public blReservaAux: boolean = false
  public blComision: boolean = false
  public blComisionAux: boolean = false
  public blExtender: boolean = false
  public blAscenso: boolean = false
  public blAscensof: boolean = false
  public blReconocer: boolean = false
  public blCategoria: boolean = false
  public blComponente: boolean = false
  public blAceptar: boolean = true
  public blAlert: boolean = false
  public blCalendar: boolean = false
  public blDbEspecialidad: boolean = false

  public foto_cedula: string = ""

  filteredOptions: Observable<ITipoResolucion[]>
  myControl = new FormControl()
  public TipoResoluciones: any

  public lstCausa: any //Objeto Comando
  public lstMotivo: any //Objeto Comando
  public lstDetalle: any //Objeto Comando
  public lstPais: any //Objeto Comando
  public GradoIPSFA: any //Objeto Comando
  public lstIPSFA: any //Objeto Comando
  public lstC: any //Objeto Comando
  public archivos: any

  public hashcontrol = ''
  public CuentaGenera: any
  public tipo: any

  public ipsfa_cedula: string = ""
  public ipsfa_nombres_apellidos: string = ""
  public ipsfa_fechanacimiento: string = ""
  public ipsfa_fechanacimiento_unix: string = ""
  public ipsfa_fechaingreso: string = ""
  public ipsfa_fechaingreso_unix: string = ""
  public ipsfa_fechaultimoascenso: string = ""
  public ipsfa_fechaascenso_unix: string = ""
  public ipsfa_sexo: string = ""
  public ipsfa_componente: string = ""
  public ipsfa_grado: string = ""
  public ipsfa_clasificacion: string = ""
  public ipsfa_categoria: string = ""
  public ipsfa_situacion: string = ""
  public ipsfa_situacion_ab: string = ""
  public ipsfa_otros_estudios: string = ""

  public buscar: any
  public estructura_detalle = ""

  public Configuracion: any
  filteredUnidad: Observable<ITipoResolucion[]>
  myUnidad = new FormControl()
  public Unidad: any
  public maxCol = "12"
  public maxAscenso = "4"
  public maxColComision = "6"
  public maxCorregir = '3'
  public maxExtender = '6'
  public color = "#e3e6e6"
  public cmbGrado = '0'
  public otro_resuelto = ''
  public lstHistorico: any
  



  model1: string
  model2: string

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private _snackBar: MatSnackBar,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private ruta: Router
  ) { }

  ngOnInit(): void {
    // if (this.rutaActiva.snapshot.params.id != undefined) {
    //   const id = this.rutaActiva.snapshot.params.id
    //   const cnt = this.rutaActiva.snapshot.params.cuenta
    // }



    this.lstHistorico = sessionStorage.getItem("historico") != undefined ? JSON.parse(sessionStorage.getItem("historico")) : []


    console.log(this.lstHistorico)

    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : []
    this.Grados =
      sessionStorage.getItem("MPPD_CGrado") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado")))
        : []
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : []
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : []
    this.TipoEntradas =
      sessionStorage.getItem("MPPD_CTipoEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada")))
        : []
    this.TipoResoluciones =
      sessionStorage.getItem("MPPD_CTipoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion")))
        : []
    this.Estados =
      sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion")))
        : []
    this.Carpetas =
      sessionStorage.getItem("MPPD_CCarpetaEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetaEntrada")))
        : []
    this.OrdenNumero =
      sessionStorage.getItem("MPPD_COrdenEntrada") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_COrdenEntrada")))
        : []
    this.GradoIPSFA =
      sessionStorage.getItem("MPPD_CGradoIPSFA") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGradoIPSFA")))
        : []

    // console.log(this.Categorias)

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) => (name ? this._filter(name) : this.TipoResoluciones.slice()))
    )

    this.filteredUnidad = this.myUnidad.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) =>
        name ? this._filterConfiguracion(name) : this.lstC.slice()
      )
    )
    this.xasunto = ''
    this.archivos = []
    document.forms.namedItem("forma").reset()
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!
  }

  activarCalendar() {
    this.blCalendar = true
  }

  atras() {
    this.searchView = "none"
    this.contentView = ""
  }

  asignar(e) {
    this.IResolucion.unidad = e.oid
    this.IResolucion.unidad_texto = this.validarNivel(e)
    this.searchView = "none"
    this.contentView = ""
    this.lstEstructura = []
  }

  validarNivel(obj: any): string {
    let detalle = ""
    let tab = "   "
    let contenido = ""
    let el = Object.entries(obj)
    let i = 0

    for (let [key, value] of el) {
      if (key.substring(0, 5) == "nivel" && value != "") {
        if (i == 0) this.IResolucion.comando = value + "\n"
        contenido = value + ""
        detalle += tab + "> " + value + "\n"
        tab += "   "
        i++
      }
    }
    this.estructura_detalle = detalle
    return contenido
  }

  Consultar(e) {
    if (e.keyCode == 13) {
      this.xAPI.funcion = "MPPD_CUnidad"
      this.xAPI.parametros = this.buscar
      this.xAPI.valores = ""

      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.lstEstructura = data.Cuerpo
          this.buscar = ""
        },
        (err) => {
          console.error(err)
        }
      )
    }
  }

  viewUnidad() {
    this.searchView = ""
    this.contentView = "none"
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + "/" + archivo)
  }
  /**
   * Consultar datos generales del militar
   */
  consultarCedula() {
    if (this.IResolucion.cedula == "") return false

    this.ngxService.startLoader("loader-buscar")
    this.xAPI.funcion = "MPPD_CDatosBasicos"
    this.xAPI.parametros = this.IResolucion.cedula
    this.xAPI.valores = ''


    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        if (data != undefined && data.Cuerpo.length > 0) {
          this.Resolucion = data.Cuerpo[0]

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
          this.cargarGradosIPSFA(this.Resolucion.n_componente)
          this.hashcontrol = btoa("R" + this.IResolucion.cedula) //Cifrar documentos

        }


        this.ngxService.stopLoader("loader-buscar")
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )
  }

  filtrarNombramiento() {
    const nombramiento = this.lstResoluciones[0]
    this.nombramiento =
      nombramiento.titulo + " - " + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0, 100)
  }

  verHistorialMilitar() { }

  async cargarGradosIPSFA(componente: number) {
    this.lstIPSFA = this.GradoIPSFA.filter((e) => {
      return parseInt(e.componente_id) == componente
    })
  }

  // async seleccionarGradosIPSFA(grado: number, operador : number) {
  //   let i = 0
  //   let pos = 0
  //   this.lstIPSFA.forEach((e) => {
  //     if (parseInt(e.codigo) == grado) {
  //       pos = i
  //       return
  //     }
  //     i++
  //   })
  //   pos = operador==0?pos - 1: pos + 1
  //   this.IResolucion.grado = this.lstIPSFA[pos].codigo
  // }

  displayFn(tr: ITipoResolucion): string {
    return tr && tr.nombre ? tr.nombre : ""
  }

  private _filter(name: string): ITipoResolucion[] {
    const filterValue = name.toLowerCase()

    return this.TipoResoluciones.filter((option) =>
      option.nombre.toLowerCase().includes(filterValue)
    )
  }

  displayFnConfiguracion(tr: IConfiguracion): string {
    return tr && tr.nomb ? tr.nomb : ""
  }

  private _filterConfiguracion(name: string): IConfiguracion[] {
    const filterValue = name.toLowerCase()

    return this.Unidad.filter((option) =>
      option.nomb.toLowerCase().includes(filterValue)
    )
  }

  verHistorial() {
    const estado = 1
    const estatus = 1

    this.ruta.navigate([
      "/constancia",
      btoa(estado + "," + estatus + "," + this.nControl),
    ])
  }

  seleccionTipo() {
    this.desactivarVista()
    if (this.IResolucion.cedula == "") {
      this._snackBar.open("Debe seleccionar una cedula", "OK")
      return
    }

    if (this.fecha_resolucion == "") {
      this._snackBar.open("Debe seleccionar una fecha para continuar", "OK")
      return
    }

    if (typeof this.tipo != "object") return
    this.IResolucion.tipo = this.tipo.codigo
    let rs = this.tipo
    let valor = true
    this.resetearFechas(false)
    this.maxAscenso = '4'
    this.maxCorregir = '3'
    this.maxExtender = '6'
    this.IResolucion.grado = parseInt(this.Resolucion.grado)
    console.log(this.tipo)
    switch (parseInt(rs.tipo)) {
      case 1:
        this.blNombramiento = true
        this.maxCol = "6"
        this.viewUnidad()
        break
      case 2:
        if (this.validarCategoriaCeseReserva(parseInt(rs.codigo))) {
          this.maxCol = "12"
          this.getCausa(rs.codigo)
        } else {
          valor = false
        }

        break
      case 3:
        // console.log(this.tipo, this.IResolucion.tipo)
        this.maxCol = "6"
        this.blCorregir = true
        if (this.IResolucion.tipo == 35) {

          let vGr: any = parseInt(this.Resolucion.grado) + 2
          this.cmbGrado = vGr.toString()
          this.IResolucion.grado = parseInt(this.cmbGrado)
          this.blAscenso = true
          this.maxAscenso = '6'
          this.maxCorregir = '6'
        }
        break

      case 4:
        if (this.fecha_resolucion == "") {
          this._snackBar.open("Debe seleccionar una fecha de resolucion", "OK")
          return
        }
        let fin = this.utilService.SumarAnios(this.fecha_resolucion, 1)
        this.comision_inicio = this.fecha_resolucion
        this.comision_fin = fin
        this.maxCol = "6"
        this.blComision = true
        this.maxColComision = "6"
        this.getAdministracion(rs.codigo)
        break
      case 5:
        this.maxCol = "6"
        this.blCorregir = true
        this.blExtender = true
        break
      case 6:
        this.maxCol = "12"
        this.maxColComision = "4"
        this.blComision = true
        this.blComisionAux = true
        break
      case 7:
        this.maxCol = "4"
        let vGr: any = parseInt(this.Resolucion.grado) - 2
        this.cmbGrado = vGr.toString()
        this.IResolucion.grado = parseInt(this.cmbGrado)
        this.blAscensof = true
        this.blAscenso = true
        break
      case 8:
        this.maxCol = "5"
        this.blReconocer = true
        break
      case 9:
        this.maxCol = "6"
        this.blCategoria = true
        break
      case 10:
        this.maxCol = "6"
        this.blComponente = true
        break
      case 11: //reincorporar
        this.maxCol = "6"
        this.maxExtender = '3'
        this.blExtender = true
        break
      default:
        break
    }

    this.blAceptar = valor
  }

  validarCategoriaCeseReserva(codigo: number) {
    if (codigo == 9 && this.Resolucion.clasificacion == "ASIMILADOS")
      return true
    if (codigo == 10 && this.Resolucion.clasificacion == "EFECTIVO")
      return true
    this.toastrService.error(
      "Error: No coincide el tipo de resolución con la categoría",
      `GDoc Resoluciones`
    )
    return false
  }

  desactivarVista() {
    this.blCorregir = false
    this.blNombramiento = false
    this.blReserva = false
    this.blReservaAux = false
    this.blComision = false
    this.blComisionAux = false
    this.blExtender = false
    this.blAscenso = false
    this.blAscensof = false
    this.blReconocer = false
    this.blCategoria = false
    this.blComponente = false
  }

  getAdministracion(id: string) {
    this.lstCausa = []
    this.xAPI.funcion = "MPPD_CCausaResolucion"
    this.ngxService.startLoader("loader-buscar")
    this.xAPI.parametros = id
    this.xAPI.valores = ""

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstCausa = data.Cuerpo
        this.ngxService.stopLoader("loader-buscar")
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getCausa(id: string) {
    this.lstCausa = []
    this.lstMotivo = []
    this.xAPI.funcion = "MPPD_CCausaResolucion"
    this.ngxService.startLoader("loader-buscar")
    this.xAPI.parametros = id
    this.xAPI.valores = ""

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.lstCausa = data.Cuerpo

        this.blReserva = true
        this.ngxService.stopLoader("loader-buscar")
        //
      },
      (err) => {
        console.error(err)
      }
    )
  }

  getMotivo() {
    this.lstMotivo = []
    this.xAPI.funcion = "MPPD_CMotivoResolucion"
    this.ngxService.startLoader("loader-buscar")
    this.xAPI.parametros = this.IResolucion.solicitud.toString()
    this.xAPI.valores = ""

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstMotivo = data.Cuerpo

        this.blReserva = true
        this.ngxService.stopLoader("loader-buscar")
        if (this.IResolucion.solicitud.toString() == "7") this.blReservaAux = true
      },
      (err) => {
        console.error(err)
      }
    )
  }



  getDetalle() {

  }

  limpiarFrm() {
    this.IResolucion = {
      grado: 0,
      anio: 0,
      asunto: "",
      cedula: "",
      pais: 0,
      reserva: 0,
      solicitud: 0,
      tipo: 0,
      unidad: 0,
      comando: "",
      comision_fin: "",
      comision_inicio: "",
      creador: "",
      destino: "",
      dia: 0,
      distribucion: "0",
      estatus: 0,
      modificado: "",
      fecha_termino: "",
      falta: "",
      registro: "",
      fecha_resolucion: "",
      formato: "",
      ultimo_ascenso: "",
      instrucciones: "",
      mes: 0,
      autor_modificar: "",
      motivo: "",
      numero: "",
      observacion: "",
      orden_merito: 0,
      otro_resuelto: "",
      autor_registro: "",
      termino: 0,
      unidad_texto: "",
      documento: 0,
      causa: 0,
      archivo: ''
    }

  }
  LimpiarDatos() {
    this.IResolucion.cedula = ''
    this.Resolucion.gran_comando = ''
    this.Resolucion.nombres = ''
    this.Resolucion.componente = ''
    this.Resolucion.categoria = ''
    this.Resolucion.clasificacion = ''
    this.nombramiento = ''
    this.xasunto = ''
  }

  vincular() {
    if (this.IResolucion.otro_resuelto != "") {
      this.ngxService.startLoader("loader-buscar")
      this.xAPI.funcion = "MPPD_CResuelto"
      this.xAPI.parametros =
        this.IResolucion.otro_resuelto + "," + this.Resolucion.cedula
      this.xAPI.valores = ""
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          // console.log(data)
          if (data.Cuerpo != undefined) {
            let otro = data.Cuerpo[0]
            this.fresolucion = otro.fecha_resol
            this.aresolucion = otro.asunto

            this.otro_resuelto = this.IResolucion.otro_resuelto + '|' + otro.fecha_resol + '|' + otro.archivo + '|' + otro.formato
          }
          this.ngxService.stopLoader("loader-buscar");
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
          this.ngxService.stopLoader("loader-buscar")
        }
      )
    }
  }

  open(content) {
    this.modalService.open(content)
  }

  resetearFechas(active: boolean) {
    this.fecha_resolucion = active ? "" : this.fecha_resolucion
    this.ultimo_ascenso = ""
    this.comision_inicio = ""
    this.comision_fin = ""
  }

  async evaluarDatos() {
    if (this.IResolucion.cedula == "") {
      this._snackBar.open("Debe seleccionar una cedula", "OK")
      return
    }
    this.ngxService.startLoader("loader-buscar")
    this.IResolucion.fecha_resolucion = this.utilService.ConvertirFechaDia(
      this.fecha_resolucion
    )
    this.IResolucion.ultimo_ascenso = this.utilService.ConvertirFechaDia(
      this.ultimo_ascenso
    )
    this.IResolucion.comision_inicio = this.utilService.ConvertirFechaDia(
      this.comision_inicio
    )
    this.IResolucion.comision_fin = this.utilService.ConvertirFechaDia(
      this.comision_fin
    )
    this.IResolucion.modificado = this.utilService.ConvertirFechaHora()

    this.IResolucion.registro = this.utilService.ConvertirFechaHora()

    this.IResolucion.fecha_termino = this.utilService.ConvertirFechaDia(
      this.comision_fin
    )

    this.IResolucion.asunto = this.IResolucion.asunto.toUpperCase()
    this.IResolucion.instrucciones = this.IResolucion.instrucciones.toUpperCase()
    this.IResolucion.observacion = this.IResolucion.observacion.toUpperCase()
    this.IResolucion.autor_registro = this.loginService.Usuario.cedula


  }

  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }



  async SubirArchivo() {

    this.blAceptar = false
    this.ngxService.startLoader("loader-buscar")
    var frm = new FormData(document.forms.namedItem("forma"))
    //console.log(this.IResolucion)

    try {
      await this.apiService.EnviarArchivos(frm).subscribe((data) => {
        this.evaluarDatos()
        this.IResolucion.archivo = this.archivos[0].name
        this.IResolucion.otro_resuelto = this.otro_resuelto
        this.xAPI.funcion = "MPPD_IResoluciones"
        this.xAPI.parametros = ""
        this.xAPI.valores = JSON.stringify(this.IResolucion)



        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            let tipo = this.IResolucion.tipo.toString()


            this.lstHistorico.push(this.IResolucion)

            sessionStorage.setItem('historico', JSON.stringify(this.lstHistorico))

            if (tipo == '9' || tipo == '10') {
              let datosBasicos = {
                "cedula": this.IResolucion.cedula,
                "situacion": tipo == '9' ? 'CEMP' : 'RACT'
              }
              this.xAPI.funcion = "MPPD_UDatosBasicosSituacion"
              this.xAPI.parametros = ""
              this.xAPI.valores = JSON.stringify(datosBasicos)
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                  this.ngxService.stopLoader("loader-buscar")

                  this.aceptar()
                },
                (errot) => {
                  this.toastrService.error(errot, `GDoc MPPD Insertar resuelto`)
                  this.ngxService.stopLoader("loader-buscar")

                }
              )
            } else if (tipo == '13' || tipo == '35') {
              let datosBasicos = {
                "cedula": this.IResolucion.cedula,
                "grado": this.IResolucion.grado
              }
              this.xAPI.funcion = "MPPD_UDatosBasicosGrado"
              this.xAPI.parametros = ""
              this.xAPI.valores = JSON.stringify(datosBasicos)
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                  this.ngxService.stopLoader("loader-buscar")

                  this.aceptar()
                },
                (errot) => {
                  this.toastrService.error(errot, `GDoc MPPD Insertar resuelto`)
                  this.ngxService.stopLoader("loader-buscar")
                }
              )
            } else {
              this.ngxService.stopLoader("loader-buscar")
              this.aceptar()
            }



          },
          (errot) => {
            this.toastrService.error(errot, `GDoc MPPD Insertar resuelto`)
            this.ngxService.stopLoader("loader-buscar")
          }
        ),
          (errot) => {
            this.toastrService.error(errot, `GDoc MPPD Insertar resuelto`)
          }
      })
    } catch (error) {
      this.toastrService.error(error, `GDoc MPPD Insertar resuelto subir el archivo`)
    }

  }


  Autocompletar() {

    if (typeof this.tipo != "object") return
    this.IResolucion.tipo = this.tipo.codigo
    let rs = this.tipo
    switch (parseInt(rs.tipo)) {
      case 1:
        this.IResolucion.asunto += ', ' + this.IResolucion.unidad_texto
        break
      case 2:
        let solicitud = this.lstCausa.filter(e => { return e.codigo == this.IResolucion.solicitud })[0].nombre
        let reserva = this.lstMotivo.filter(e => { return e.codigo == this.IResolucion.reserva })[0].nombre
        this.IResolucion.asunto += ', ' + solicitud + ' ' + reserva
        break
    }


  }




  aceptar() {
    Swal.fire({
      title: "La resolucion ha sido  procesada con exito ",
      text: "¿Mantener los datos?",
      icon: "info",
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Basicos",
      cancelButtonText: "Resolucion",
      showCancelButton: true,
      // confirmButtonText: 'Botón 1',
      // cancelButtonText: 'Botón 2',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {

      if (result.isConfirmed) {
        this.resetearFechas(true)
        document.forms.namedItem("forma").reset()
        this.xasunto = ''
        this.archivos = []
        this.tipo = ''
        let cedula = this.IResolucion.cedula
        this.limpiarFrm()
        this.IResolucion.cedula = cedula
        this.consultarCedula()
        this.blAceptar = true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.LimpiarDatos()
      } else {
        this.ruta.navigate(["/rsprocesos"]);
      }


    })
  }

  //Listar los archivos asociados al documento
  verArchivos(content) {
    this.modalService.open(content, { size: "lg" })
  }

  AceptarCambios() {

  }
}
