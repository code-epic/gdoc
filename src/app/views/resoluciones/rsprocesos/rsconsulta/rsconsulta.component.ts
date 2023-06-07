import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { IDatosBasicos, IResoluciones } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsconsulta',
  templateUrl: './rsconsulta.component.html',
  styleUrls: ['./rsconsulta.component.scss']
})
export class RsconsultaComponent implements OnInit {

  public cedula: string = ""
  public resolucion: string = ""

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }


  public IDatosBasicos: IDatosBasicos = {
    area: '',
    cedula: '',
    categoria: 0,
    clasificacion: 0,
    componente: 0,
    grado: 0,
    profesion: '',
    profesionx: '',
    reserva: 0,
    solicitud: 0,
    tipo: 0,
    condicion: 0,
    especialidad: '',
    estudios: '',
    nacimiento: '',
    promocion: '',
    fecha_resuelto: '',
    ncomponente: 0,
    ngrado: 0,
    nombre: '',
    observacion: '',
    sexo: ''
  }

  public IResolucion: IResoluciones = {
    grado: 0,
    anio: 0,
    asunto: '',
    cedula: '',
    pais: 0,
    reserva: 0,
    solicitud: 0,
    tipo: 0,
    unidad: 0,
    comando: '',
    comision_fin: '',
    comision_inicio: '',
    creador: '',
    destino: '',
    dia: 0,
    distribucion: '',
    estatus: 0,
    modificado: '',
    fecha_termino: '',
    falta: '',
    registro: '',
    fecha_resolucion: '',
    formato: '',
    ultimo_ascenso: '',
    instrucciones: '',
    mes: 0,
    autor_modificar: '',
    motivo: '',
    numero: '',
    observacion: '',
    orden_merito: 0,
    otro_resuelto: '',
    autor_registro: '',
    termino: 0,
    unidad_texto: '',
    documento: 0,
    causa: 0
  }


  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    unidad: '',
    fecha_doc: '',
    tipo: {},
    cedula: '',
    nombres_apellidos: '',
    fecha_nacimiento: '',
    componente: '',
    categoria: '',
    clasificacion: '',
    grado: '',
    carpeta: '',
    estatus: '',
    entrada: '',
    asunto: '',
    observacion: '',
    responsable: '',
    cargo_responsable: '',
    situacion: '',
    sexo: '',
    numero: '',
    gran_comando: '',
    unidad_comando: '',
    instrucciones: '',
    n_componente: 0,
    n_grado: 0
  }

  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public Estados: any
  public Carpetas: any
  public OrdenNumero: any
  public TipoResoluciones: any
  public UbicacionCarpetas: any

  public GradoIPSFA = [] //Objeto Comando
  public lstResoluciones: any
  public lstResolucionesS: any //Solo resoluciones
  public lstEntradas: any
  public lstIPSFA = [] //Objeto Comando

  public xasunto: string = ''
  public nombramiento: string = ''

  public dbDatos: boolean = false
  public dbResolucion: boolean = false
  public dbTools: boolean = false
  
  public carpeta: string = ''

  constructor(private apiService: ApiService,
    private utilService: UtilService,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private _snackBar: MatSnackBar,
    private ruta: Router) { }

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
    this.GradoIPSFA = sessionStorage.getItem("MPPD_CGradoIPSFA") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGradoIPSFA"))) : []
    this.UbicacionCarpetas = sessionStorage.getItem("MPPD_CCarpetas") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCarpetas"))) : []

  }

  consultar(e) {
    if (e.keyCode == 13) {

      this.xAPI.funcion = "MPPD_CUnidad"
      this.xAPI.parametros = this.cedula
      this.xAPI.valores = ''

      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          //this.lstEstructura = data.Cuerpo
        },
        (err) => {
          console.error(err)
        }
      )
    }

  }

  verificar() {

    this.dbDatos = false
    this.dbResolucion = false
    this.resolucion = ""
    if (this.cedula != '') {
      this.consultarCedula(undefined)
      return false
    }
    if (this.IResolucion.numero != '') {
      this.consultarResolucion(undefined)
      return false
    }

    this._snackBar.open("Debe introducir una cedula o un resuelto", "OK");
    return

  }

  obtenerCedula(id: string) {
    this.cedula = id
    this.dbTools = true
    this.consultarCedula(undefined)

  }

  /**
 * Consultar datos generales del militar 
 */
  consultarCedula(event: any) {

    if (event == undefined || event.charCode == 13) {
      this.dbDatos = false
      this.dbResolucion = false


      if (this.cedula == '') return false

      this.ngxService.startLoader("loader-buscar")
      this.xAPI.funcion = 'MPPD_CDatosBasicos'
      this.xAPI.parametros = this.cedula
      this.xAPI.valores = ''
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          this.cedula = ""
          if (data != undefined && data.Cuerpo.length > 0) {
            this.Resolucion = data.Cuerpo[0]

            this.Resolucion.componente = this.Componentes.filter(e => { return e.cod_componente == this.Resolucion.componente })[0].nombre_componente
            this.Resolucion.categoria = this.Categorias.filter(e => { return e.cod_categoria == this.Resolucion.categoria })[0].nombre_categoria
            this.Resolucion.clasificacion = this.Clasificaciones.filter(e => { return e.cod_clasificacion == this.Resolucion.clasificacion })[0].des_clasificacion
            this.Resolucion.grado = this.Grados.filter(e => { return e.cod_grado == this.Resolucion.grado })[0].nombres_grado

            if (data.Cuerpo[0].resoluciones != undefined && data.Cuerpo[0].resoluciones != '') {
              this.lstResoluciones = JSON.parse(data.Cuerpo[0].resoluciones).reverse()
              this.filtrarNombramiento()

            }
            if (data.Cuerpo[0].entradas != undefined && data.Cuerpo[0].entradas != '') {
              this.lstEntradas = JSON.parse(data.Cuerpo[0].entradas).reverse()
            }
          }
          this.cargarGradosIPSFA(this.Resolucion.n_componente);
          this.IDatosBasicos = data.Cuerpo[0]

          this.ngxService.stopLoader("loader-buscar")
          this.dbDatos = true
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
          this.ngxService.stopLoader("loader-buscar")
        }

      )

    }
  }

  filtrarNombramiento() {
    const nombramiento = this.lstResoluciones[0]
    this.nombramiento = nombramiento.titulo + ' - ' + nombramiento.tipo_descripcion
    this.xasunto = nombramiento.asunto.substring(0, 100)
  }

  async cargarGradosIPSFA(componente: number) {
    this.lstIPSFA = this.GradoIPSFA.filter(e => {
      return parseInt(e.componente_id) == componente
    })
  }

  obtenerTipo(tipo: any) {
    // console.log(tipo, this.TipoResoluciones)
    let texto = ""
    this.TipoResoluciones.forEach(e => {
      if (e.codigo == tipo) {
        texto = e.nombre
      }
    });
    return texto
  }

  obtenerUbicacion(anio: string, codigo: string) {
    anio = anio.substring(0, 4)
    this.UbicacionCarpetas.forEach(e => {
      if (e.anio == anio) {
        // https://10.190.1.160
        this.carpeta = '/cdn/' + e.nombre + '/' + codigo + '.pdf'
      }
    });

    return this.carpeta

  }




  obtenerResuelto() {
    this.IResolucion.numero = this.resolucion
    this.consultarResolucion(undefined)
    this.dbTools = false

  }
  consultarResolucion(event) {

    if (event == undefined || event.charCode == 13) {

      this.dbDatos = false
      this.dbResolucion = false
      if (this.IResolucion.numero == '') return false

      this.ngxService.startLoader("loader-buscar")
      this.xAPI.funcion = 'MPPD_CResoluciones'
      this.xAPI.parametros = this.IResolucion.numero
      this.xAPI.valores = ''
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          this.resolucion = this.IResolucion.numero
          this.IResolucion.numero = ''
          this.ngxService.stopLoader("loader-buscar")
          this.lstResolucionesS = data.Cuerpo
          this.dbResolucion = true
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
          this.ngxService.stopLoader("loader-buscar")
        }


      )
    }

  }




}
