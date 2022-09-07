import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';



interface DBasico {
  cedula: string;
  nombres_apellidos: string;
  fecha: string;
  sexo: string;
  componente: string;
  grado: string;
  clasificacion: string;
  categoria: string;
  situacion: string;
  promocion: string;
  otros_estudios: string;
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
  public fcreacion: any
  public fcreacionDate: NgbDate | null
  public forigen: any
  public forigenDate: NgbDate | null
  public cedula : string = ''
  public foto : string = 'assets/img/theme/ndisponible.jpeg'

  placement = 'bottom'

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
    promocion: ''
  }

  public ipsfa_cedula: string = ''
  public ipsfa_nombres_apellidos: string = ''
  public ipsfa_fechanacimiento: string = ''
  public ipsfa_fechaingreso: string = ''
  public ipsfa_fechaultimoascenso: string = ''
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
    public utilService : UtilService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : []
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : []
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : []
  }


  /**
 * Consultar datos generales del militar 
 */
  consultarCedula() {
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'MPPD_CDatosBasicos'
    this.xAPI.parametros = this.DBasico.cedula
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DBasico = data.Cuerpo[0]

        //this.fcreacionDate = NgbDate.from(this.formatter.parse(this.DBasico.fecha.substring(0, 10)))
        this.fcreacionDate = NgbDate.from(this.formatter.parse(this.DBasico.promocion.substring(0, 10)))

        this.foto = 'https://app.ipsfa.gob.ve/sssifanb/afiliacion/temp/' + this.DBasico.cedula +'/foto.jpg'
        console.log (data.Cuerpo[0])
        this.ngxService.stopLoader("loader-aceptar")
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )

  }
  guardar() { }

  //Consultar datos del IPSFA
  consultarIPSFA(content){
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'IPSFA_CMilitarMPPD'
    this.xAPI.parametros = this.DBasico.cedula
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.info( data )
        const militar = data[0]
        const DB = militar.persona.datobasico
        this.ipsfa_cedula = DB.cedula
        this.ipsfa_nombres_apellidos = DB.nombreprimero + ' ' + DB.apellidoprimero
        this.ipsfa_fechanacimiento = this.utilService.ConvertirFechaHumana( DB.fechanacimiento )
        this.ipsfa_sexo = DB.sexo=='M'?'MASCULINO':'FEMENINO'
        this.ipsfa_componente =  militar.componente.descripcion //+ '(' + militar.componente.abreviatura  + ')'
        this.ipsfa_grado  = militar.grado.descripcion // + '(' +  militar.grado.abreviatura + ')'
        this.ipsfa_clasificacion = this.utilService.ConvertirClasificacion( militar.clase )
        this.ipsfa_categoria = this.utilService.ConvertirCategoria( militar.categoria )
        this.ipsfa_situacion = this.utilService.ConvertirSituacion( militar.situacion )
        this.ipsfa_situacion_ab = militar.situacion

        this.ipsfa_fechaingreso = this.utilService.ConvertirFechaHumana( militar.fingreso )
        this.ipsfa_fechaultimoascenso = this.utilService.ConvertirFechaHumana( militar.fascenso )
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
  AceptarCambios(){
    this.DBasico.sexo = this.ipsfa_sexo=='MASCULINO'?'M':'F'
    console.log(this.ipsfa_fechanacimiento)
    this.DBasico.situacion = this.ipsfa_situacion_ab
    this.forigenDate = NgbDate.from(this.formatter.parse(this.ipsfa_fechanacimiento.substring(0, 10)))
  }
}
