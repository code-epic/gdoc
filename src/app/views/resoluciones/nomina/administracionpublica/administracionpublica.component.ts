import { Component, OnInit } from '@angular/core';
import { IAPICore } from 'src/app/services/apicore/api.service';
import { ApiService } from 'src/app/services/apicore/api.service';
import { ExcelService } from 'src/app/services/util/excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracionpublica',
  templateUrl: './administracionpublica.component.html',
  styleUrls: ['./administracionpublica.component.scss']
})
export class AdministracionpublicaComponent implements OnInit {

  lstNombramientos = []
  xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }
  dataExcel = []

  constructor(
    private apiService: ApiService,
    private ngxService: NgxUiLoaderService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.ConsultarNombramientos()
  }

  ConsultarNombramientos() {
    this.ngxService.startLoader('loader-buscar')
    this.xAPI.funcion = environment.funcion.CONSULTAR_NOMBRAMIENTOS
    this.xAPI.valores = ''
    this.xAPI.parametros = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
        this.lstNombramientos = data.Cuerpo
        this.ngxService.stopLoader('loader-buscar')
      },
      (error) => {
        console.log(error);
        this.ngxService.stopLoader('loader-buscar')
      }
    )
  }

  exportExcel() {

    this.lstNombramientos.forEach(e => {
      this.dataExcel.push({
        'N°': e.nro,
        'GRAD': e.grad,
        'GDO CATEG': e.gdoCateg,
        'ARMA O SERVICIO': e.armaOServicio,
        'COMP': e.comp,
        'PROMOCIÓN': e.promocion,
        'NOMBRES Y APELLIDOS': e.nombresYApellidos,
        'CÉDULA DE IDENTIDAD': e.cedulaDeIdentidad,
        'SITUACIÓN': e.situacion,
        'TIEMPO EN LA ADMINISTRACIÓN PÚBLICA': e.tiempoAdministracionPublica,
        'TIEMPO EN EL CARGO ACTUAL': e.tiempoCargoActual,
        'CONDICIÓN': e.condicion,
        'RECOMENDACIÓN DEL COMPONENTE': e.recomendacionDelComponente,
        'ENTE': e.ente,
        'OBSERVACIONES': e.observaciones,
        'FECHA DE RETORNO': e.fechaDeRetorno,
        'SITUACIÓN2': e.situacion2,
        'Columna2': e.columna2,
        'Columna3': e.columna3,
        'Columna4': e.columna4,
        'ESTATUS': e.estatus,
      });
    });
    this.excelService.exportToExcel(this.dataExcel, 'nombramientos_export');
  }

}
