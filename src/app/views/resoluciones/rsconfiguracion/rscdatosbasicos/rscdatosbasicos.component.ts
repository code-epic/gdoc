import { Component, OnInit } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';



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
  public forigen: any

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
    otros_estudios: ''
  }


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService, public formatter: NgbDateParserFormatter) { }

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
    this.xAPI.funcion = 'MPPD_CDatosBasicos'
    this.xAPI.parametros = this.DBasico.cedula
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DBasico = data.Cuerpo[0]
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }

    )

  }
  guardar() { }

}
