import { Component, OnInit } from '@angular/core';
import { IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsalertas',
  templateUrl: './rsalertas.component.html',
  styleUrls: ['./rsalertas.component.scss']
})
export class RsalertasComponent implements OnInit {

  bxls = false
  dbDatosNombre = false
  bFrm = false

  lstNombres = []

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


  
  constructor(private utilService: UtilService,) { }

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

  }

  ConsultarAlertas(){}


  async downloadCSVEx() {
    // await this.relfexion(true)
    let head = this.csvHead.map((e) => {
      console.log(e.nombre);
      return e.nombre;
    });
    this.utilService.downloadFile(
      head,
      this.lstNombres,
      "RC-" + this.utilService.GenerarUnicId(),
      this.delimitador
    );
  }

}
