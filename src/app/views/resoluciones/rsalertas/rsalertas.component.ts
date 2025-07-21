import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ExcelService } from 'src/app/services/util/excel.service';
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



  constructor(
    private ngxService: NgxUiLoaderService,
    private utilService: UtilService, 
    private msj: MensajeService, 
    private excelService: ExcelService,
    private apiService: ApiService,) { }

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
    this.ngxService.startLoader('loader-buscar')
    this.xAPI.funcion = environment.funcion.MPPD_CAlertasResoluciones
    this.xAPI.valores = ''
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
        this.lstAlertas = data.Cuerpo
        // this.csvHead = data.Cabecera;
        this.ngxService.stopLoader('loader-buscar')
      },
      (error) => {
        console.log(error);
        this.ngxService.stopLoader('loader-buscar')
      }
    )
  }



    exportExcel(): void {
      let xlsx = []
      this.lstAlertas.forEach((e) => {
        xlsx.push({
          'Cedula': e.cedula,
          'Nombre': e.nombres_apellidos,
          'Grado': e.ngrado,
          'Componente': e.ncomponente,
          'Comision': e.inicio_comision,
          'Fin Comision': e.fin_comision,
          'Asunto': e.asunto,
          'Numero Resolucion': e.numero_resol,
          'Dias Restantes': e.dias_restantes, 
         
        })
      })
      this.excelService.exportToExcel(xlsx, 'alertas_export');
    }

}
