import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { MensajeService } from 'src/app/services/util/mensaje.service';
import { UtilService } from 'src/app/services/util/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rsalertas',
  templateUrl: './rsalertas.component.html',
  styleUrls: ['./rsalertas.component.scss']
})
export class RsalertasComponent implements OnInit {

  bxls = false
  dbDatosNombre = false
  bFrm = false

  lstAlertas = []

  xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }

  csvHead: any
  csvHeadFile: any
  delimitador: string = ','

  Componentes = []
  Grados = []
  Categorias = []
  Clasificaciones = []

  componente = ''
  situacion = ''
  categoria = ''
  clasificacion = ''
  grado = ''

  selected = new FormControl(0);



  constructor(private utilService: UtilService, private msj: MensajeService, private apiService: ApiService,) { }

  ngOnInit(): void {
    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : []

    this.Grados =
      sessionStorage.getItem("MPPD_CGrado") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado")))
        : [];
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : [];
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : [];

    let alertas = {
      'tipo': 'alerta',
      'valor': true
    }
    this.msj.contenido$.emit(alertas)
    this.ConsultarAlertas()

  }

  ConsultarAlertas() { 
    this.xAPI.funcion = environment.funcion.MPPD_CAlertasResoluciones
    this.xAPI.valores = ''
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
      this.lstAlertas = data.Cuerpo
    },
    (error) => {
      console.log(error);
    }
  )  
  }


  async downloadCSVEx() {
    // await this.relfexion(true)
    let head = this.csvHead.map((e) => {
      console.log(e.nombre);
      return e.nombre;
    });
    this.utilService.downloadFile(
      head,
      this.lstAlertas,
      "RC-" + this.utilService.GenerarUnicId(),
      this.delimitador
    );
  }

}
