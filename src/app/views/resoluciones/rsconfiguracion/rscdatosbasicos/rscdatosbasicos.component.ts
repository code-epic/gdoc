import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { UtilService } from 'src/app/services/util/util.service';
import { threadId } from 'worker_threads';



interface DBasico {
  cedula: string
  nombres_apellidos: string
  fecha: string
  sexo: string
  componente: string
  grado: string
  clasificacion: string
  categoria: string
  situacion: string
  promocion: string
  ingreso: string
  otros_estudios: string
  especialidad: string
  estudios: string
  area: string
  condicion: number
  observacion: string
}


@Component({
  selector: 'app-rscdatosbasicos',
  templateUrl: './rscdatosbasicos.component.html',
  styleUrls: ['./rscdatosbasicos.component.scss']
})
export class RscdatosbasicosComponent implements OnInit {

  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public TipoResoluciones: any
  public Estados: any
  public Carpetas: any
  public OrdenNumero: any

  public fcreacionDate: NgbDate | null
  public forigenDate: NgbDate | null
  public fingresoDate: NgbDate | null
  public cedula: string = ''
  public foto: string = 'assets/img/theme/ndisponible.jpeg'
  public unidad: string = ''
  public asunto: string = ''
  public nombramiento: string = ''
  public xasunto: string = ''
  public lstResoluciones: any
  public lstEntradas: any

  placement = 'bottom'

  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    unidad: '',
    fecha_doc: '',
    tipo: '0',
    cedula: '',
    nombres_apellidos: '',
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
    instrucciones: ''
  }

  public DBasico: DBasico = {
    cedula: '',
    nombres_apellidos: '',
    fecha: '',
    sexo: '',
    componente: '',
    grado: '',
    clasificacion: '',
    categoria: '',
    situacion: '',
    otros_estudios: '',
    promocion: '',
    ingreso: '', //Ingreso a las FANB
    especialidad: '',
    estudios: '',
    area: '',
    condicion: 0,
    observacion: ''
  }

  public ipsfa_cedula: string = ''
  public ipsfa_nombres_apellidos: string = ''
  public ipsfa_fechanacimiento: string = ''
  public ipsfa_fechanacimiento_unix: string = ''
  public ipsfa_fechaingreso: string = ''
  public ipsfa_fechaingreso_unix: string = ''
  public ipsfa_fechaultimoascenso: string = ''
  public ipsfa_fechaascenso_unix: string = ''
  public ipsfa_sexo: string = ''
  public ipsfa_componente: string = ''
  public ipsfa_grado: string = ''
  public ipsfa_clasificacion: string = ''
  public ipsfa_categoria: string = ''
  public ipsfa_situacion: string = ''
  public ipsfa_situacion_ab: string = ''
  public ipsfa_otros_estudios: string = ''


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private toastrService: ToastrService,
    public utilService: UtilService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
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


  /**
 * Consultar datos generales del militar 
 */
  consultarCedula() {
    let cedula = this.DBasico.cedula
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'MPPD_CDatosBasicos'
    this.xAPI.parametros = cedula
    this.xAPI.valores = ''
    this.foto = 'assets/img/theme/ndisponible.jpeg'
    this.limpiarDB()
    this.DBasico.cedula = cedula
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        if (data.Cuerpo.length > 0) {
          this.DBasico = data.Cuerpo[0]

          //this.fcreacionDate = NgbDate.from(this.formatter.parse(this.DBasico.fecha.substring(0, 10)))
          //this.fcreacionDate = NgbDate.from(this.formatter.parse(this.DBasico.promocion.substring(0, 10)))
          this.foto = 'https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/' + this.DBasico.cedula + '/foto.jpg'
          this.Resolucion = data.Cuerpo[0]

          // this.Resolucion.componente = this.Componentes.filter(e => {return e.cod_componente ==  this.Resolucion.componente })[0].nombre_componente
          // this.Resolucion.categoria = this.Categorias.filter(e => {return e.cod_categoria ==  this.Resolucion.categoria })[0].nombre_categoria
          // this.Resolucion.clasificacion = this.Clasificaciones.filter(e => {return e.cod_clasificacion ==  this.Resolucion.clasificacion })[0].des_clasificacion
          // this.Resolucion.grado = this.Grados.filter(e => {return e.cod_grado ==  this.Resolucion.grado })[0].nombres_grado

          if (data.Cuerpo[0].resoluciones != undefined && data.Cuerpo[0].resoluciones != '') {
            this.lstResoluciones = JSON.parse(data.Cuerpo[0].resoluciones).reverse()
            this.filtrarNombramiento()
          }
          if (data.Cuerpo[0].entradas != undefined && data.Cuerpo[0].entradas != '') {
            this.lstEntradas = JSON.parse(data.Cuerpo[0].entradas).reverse()
          }
        }


        this.ngxService.stopLoader("loader-aceptar")

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )

  }


  filtrarNombramiento() {


    const nombramiento = this.lstResoluciones[0]

    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0, 100)

  }

  limpiarDB() {
    this.DBasico = {
      cedula: '',
      nombres_apellidos: '',
      fecha: '',
      sexo: '',
      componente: '',
      grado: '',
      clasificacion: '',
      categoria: '',
      situacion: '',
      otros_estudios: '',
      promocion: '',
      ingreso: '', //Ingreso a las FANB
      especialidad: '',
      estudios: '',
      area: '',
      condicion: 0,
      observacion: ''
    }
    this.nombramiento = ''
    this.xasunto = ''

  }
  guardar() { }

  //Consultar datos del IPSFA
  consultarIPSFA(content) {
    if (this.ipsfa_cedula == this.DBasico.cedula) {
      this.modalService.open(content)
      return
    }

    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'IPSFA_CMilitarMPPD'
    this.xAPI.parametros = this.DBasico.cedula
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.info(data)

        if (data.length > 0) {
          const militar = data[0]
          const DB = militar.persona.datobasico
          this.ipsfa_cedula = DB.cedula
          this.ipsfa_nombres_apellidos = DB.nombreprimero + ' ' + DB.apellidoprimero
          this.ipsfa_fechanacimiento = this.utilService.ConvertirFechaHumana(DB.fechanacimiento)

          let ISODate = new Date(DB.fechanacimiento).toISOString();
          this.ipsfa_fechanacimiento_unix = ISODate.substr(0, 10);

          let ISODateIngreso = new Date(militar.fingreso).toISOString();
          this.ipsfa_fechaingreso_unix = ISODateIngreso.substr(0, 10);

          let ISODateAscenso = new Date(militar.fascenso).toISOString();
          this.ipsfa_fechaascenso_unix = ISODateAscenso.substr(0, 10);

          this.ipsfa_sexo = DB.sexo == 'M' ? 'MASCULINO' : 'FEMENINO'
          this.ipsfa_componente = militar.componente.descripcion //+ '(' + militar.componente.abreviatura  + ')'
          this.ipsfa_grado = militar.grado.descripcion // + '(' +  militar.grado.abreviatura + ')'
          this.ipsfa_clasificacion = this.utilService.ConvertirClasificacion(militar.clase)
          this.ipsfa_categoria = this.utilService.ConvertirCategoria(militar.categoria)
          this.ipsfa_situacion = this.utilService.ConvertirSituacion(militar.situacion)
          this.ipsfa_situacion_ab = militar.situacion

          this.ipsfa_fechaingreso = this.utilService.ConvertirFechaHumana(militar.fingreso)
          this.ipsfa_fechaultimoascenso = this.utilService.ConvertirFechaHumana(militar.fascenso)

        }

        // this.ipsfa_otros_estudios = ''

        this.modalService.open(content);
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )
  }

  AceptarCambios() {
    this.DBasico.sexo = this.ipsfa_sexo == 'MASCULINO' ? 'M' : 'F'
    console.log(this.ipsfa_fechaultimoascenso)
    this.DBasico.situacion = this.ipsfa_situacion_ab
    this.DBasico.nombres_apellidos = this.ipsfa_nombres_apellidos
    this.forigenDate = NgbDate.from(this.formatter.parse(this.ipsfa_fechanacimiento_unix))
    //this.DBasico.fecha = this.ipsfa_fechanacimiento_unix
    this.fingresoDate = NgbDate.from(this.formatter.parse(this.ipsfa_fechaingreso_unix))
    //this.DBasico.ingreso = this.ipsfa_fechaingreso_unix
    this.fcreacionDate = NgbDate.from(this.formatter.parse(this.ipsfa_fechaascenso_unix))
    //this.DBasico.promocion = this.ipsfa_fechaascenso_unix
  }

  obtenerDatos(): string {
    let cadena = ''
    let resolucion = '0'
    let solicitud = '0'
    let reserva = '0'
    let fechanacimiento = ''
    let ingreso = ''
    let ascenso = ''
    if (this.DBasico.fecha != undefined) {
      fechanacimiento = typeof this.DBasico.fecha === 'object' ? this.utilService.ConvertirFecha(this.DBasico.fecha): this.ipsfa_fechanacimiento_unix
    } else if (this.forigenDate != undefined) {
      fechanacimiento = this.utilService.ConvertirFecha(this.forigenDate)
    } 
    if (this.DBasico.ingreso != undefined) {
      ingreso = typeof this.DBasico.ingreso === 'object' ? this.utilService.ConvertirFecha(this.DBasico.ingreso): this.ipsfa_fechaingreso_unix
      
    } else if (this.fingresoDate != undefined) {
      ingreso = this.utilService.ConvertirFecha(this.fingresoDate)
    } 
    if (this.DBasico.promocion != undefined) {
      ascenso = typeof this.DBasico.promocion === 'object' ? this.utilService.ConvertirFecha(this.DBasico.promocion): this.ipsfa_fechaascenso_unix
    } else if (this.fcreacionDate != undefined) {
      ascenso = this.utilService.ConvertirFecha(this.fcreacionDate)
    } 


    //this.DBasico.promocion = this.ipsfa_fechaingreso_unix

    cadena = this.DBasico.cedula + ',' + this.DBasico.nombres_apellidos + ','
    cadena += this.DBasico.categoria + ',' + this.DBasico.grado + ',' + this.DBasico.componente + ','
    cadena += this.DBasico.clasificacion + ',' + resolucion + ',' + solicitud + ',' + reserva + ','
    cadena += ascenso + ',' + ingreso + ',' + this.DBasico.sexo + ','
    cadena += fechanacimiento + ',' + this.DBasico.especialidad + ',' + this.DBasico.estudios + ','
    cadena += this.DBasico.area + ',' + this.DBasico.condicion + ',' + this.DBasico.observacion

    return cadena
  }


  Aceptar() {
    console.log(this.obtenerDatos())
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'MPPD_IDatosBasicos'
    this.xAPI.parametros = this.obtenerDatos()
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'Tu archivo ha sido cargado con exito ',
          `MPPD_Insertar`
        );
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
        this.toastrService.error(
          error,
          `MPPD_Insertar`
        );
        this.ngxService.stopLoader("loader-aceptar")
      }
    )
  }
}
