import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { IDatosBasicos } from 'src/app/services/resoluciones/resolucion.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';



@Component({
  selector: 'app-rscdatosbasicos',
  templateUrl: './rscdatosbasicos.component.html',
  styleUrls: ['./rscdatosbasicos.component.scss']
})
export class RscdatosbasicosComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    enableToolbar: false,
    showToolbar: false,
    placeholder: '',
  };

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

  public DBasico: IDatosBasicos = {
    cedula: '',
    nombres: '',
    categoria: 0,
    grado: 0,
    componente: 0,
    clasificacion: 0,
    resolucion: 0,
    solicitud: 0,
    reserva: 0,
    fecha: '',
    promocion: '',
    sexo: '',
    profesion: '',
    profesionx: '',
    nacimiento: '',
    orden: 0,
    n_grado: 0,
    n_componente: 0,
    especialidad: '',
    area: '',
    estudios: '',
    condicion: 3,
    anio: 0,
    mes: 0,
    dia: 0,
    ultimo_ascenso: '',
    motivo: '',
    observacion: '',
    situacion: ''
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

  public dbActivar: boolean = false
  public nacimiento: any = ''
  public ingreso: any = ''
  public ascenso: any = ''

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
    private _snackBar: MatSnackBar,
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
  consultarCedula(e) {

    if (e.keyCode == 13) {
      if (this.DBasico.cedula == "") {
        this._snackBar.open("Debe seleccionar una cedula", "OK");
        return
      }
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
          console.log(data.Cuerpo)
          if (data.Cuerpo.length > 0) {
            this.DBasico = data.Cuerpo[0]
            this.foto = 'https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/' + this.DBasico.cedula + '/foto.jpg'
            this.Resolucion = data.Cuerpo[0]
            this.nacimiento = NgbDate.from(this.formatter.parse(this.DBasico.nacimiento.substring(0, 10)))
            this.ingreso = NgbDate.from(this.formatter.parse(this.DBasico.promocion.substring(0, 10)))
            this.ascenso = NgbDate.from(this.formatter.parse(this.DBasico.ultimo_ascenso.substring(0, 10)))

            if (data.Cuerpo[0].resoluciones != undefined && data.Cuerpo[0].resoluciones != '') {
              this.lstResoluciones = JSON.parse(data.Cuerpo[0].resoluciones).reverse()
              this.filtrarNombramiento()
            }
            if (data.Cuerpo[0].entradas != undefined && data.Cuerpo[0].entradas != '') {
              this.lstEntradas = JSON.parse(data.Cuerpo[0].entradas).reverse()
            }
            this.dbActivar = true
          }
          
          this.ngxService.stopLoader("loader-aceptar")

        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
          this.ngxService.stopLoader("loader-aceptar")
        }

      )
    }
  }


  filtrarNombramiento() {
    const nombramiento = this.lstResoluciones[0]
    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0, 100)
  }

  limpiarDB() {
    this.DBasico = {
      cedula: '',
      nombres: '',
      categoria: 0,
      grado: 0,
      componente: 0,
      clasificacion: 0,
      resolucion: 0,
      solicitud: 0,
      reserva: 0,
      fecha: '',
      promocion: '',
      sexo: '',
      profesion: '',
      profesionx: '',
      nacimiento: '',
      orden: 0,
      n_grado: 0,
      n_componente: 0,
      especialidad: '',
      area: '',
      estudios: '',
      condicion: 0,
      anio: 0,
      mes: 0,
      dia: 0,
      ultimo_ascenso: '',
      motivo: '',
      observacion: '',
      situacion: ''
    }
    this.nombramiento = ''
    this.xasunto = ''

  }
  guardar() { }

  //Consultar datos del IPSFA
  consultarIPSFA(content) {
    if (this.DBasico.cedula == "") {
      this._snackBar.open("Debe seleccionar una cedula", "OK");
      return
    }
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
    this.DBasico.situacion = this.ipsfa_situacion_ab
    this.DBasico.nombres = this.ipsfa_nombres_apellidos


    this.nacimiento = NgbDate.from(this.formatter.parse(this.ipsfa_fechanacimiento_unix))
    this.ingreso = NgbDate.from(this.formatter.parse(this.ipsfa_fechaingreso_unix))
    this.ascenso = NgbDate.from(this.formatter.parse(this.ipsfa_fechaascenso_unix))

  }

  obtenerDatos() {
    this.DBasico.nacimiento =this.utilService.ConvertirFecha(this.nacimiento)
    this.DBasico.promocion =this.utilService.ConvertirFecha(this.ingreso)
    this.DBasico.ultimo_ascenso = this.utilService.ConvertirFecha(this.ascenso) 
  }


  Aceptar() {

    this.obtenerDatos()
    this.ngxService.startLoader("loader-aceptar")

    this.DBasico.fecha = this.DBasico.fecha!=""?this.DBasico.fecha:"1900-01-01"
    let funcion = 'MPPD_IDatosBasicos'
    if (this.dbActivar) funcion = 'MPPD_UDatosBasicos'
    this.xAPI.funcion = funcion
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.DBasico)
    console.log(this.xAPI)
    console.log(this.DBasico)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.toastrService.success(
          'Los datos han sido actualizados exitosamente ',
          `MPPD.DatosBasicos`
        );
        this.ngxService.stopLoader("loader-aceptar")
        this.dbActivar = false

      },
      (error) => {
        this.toastrService.error(
          error,
          `MPPD_DatosBasicos -> Aceptar`
        );
        this.ngxService.stopLoader("loader-aceptar")
      }
    )
  }
}




