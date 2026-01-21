import { Component, OnInit } from '@angular/core';
import { IAPICore } from 'src/app/services/apicore/api.service';
import { ApiService } from 'src/app/services/apicore/api.service';
import { ExcelService } from 'src/app/services/util/excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util/util.service';
@Component({
  selector: 'app-codigosrojo',
  templateUrl: './codigosrojo.component.html',
  styleUrls: ['./codigosrojo.component.scss']
})
export class CodigosrojoComponent implements OnInit {

  lstCodigosRojos = []
  titulo: string = 'Reportes'
  bmenu = true
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
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.utilService.onChange$.subscribe(e => {
      this.bmenu = e
    })
    // this.ConsultarCodigosRojos()
  }
  

  ConsultarCodigosRojos(valor: number) {
    this.bmenu = false
    this.ngxService.startLoader('loader-buscar')
    this.xAPI.funcion = environment.funcion.CONSULTAR_CODIGOS_ROJOS
    this.xAPI.valores = ''
    this.xAPI.parametros = `${valor},%,%,%,%,%`
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data: any) => {
        this.lstCodigosRojos = data.Cuerpo
        this.ngxService.stopLoader('loader-buscar')
      },
      (error) => {
        console.log(error);
        this.ngxService.stopLoader('loader-buscar')
      }
    )
  }

  exportExcel() {

    this.lstCodigosRojos.forEach(e => {
      this.dataExcel.push({
        'GRAD': e.gnombre,
        'COMP': e.cnombre,
        'CEDULA': e.cedula,
        'NOMBRES Y APELLIDOS': e.nombres_apellidos.toUpperCase(),
        'MOTIVO': this.limpiarHtml(e.motivo.toUpperCase()),
      });
    });
    this.excelService.exportToExcel(this.dataExcel, 'nombramientos_export');
  }

  volver(){
    this.lstCodigosRojos = []
    this.bmenu = true
  }


  private limpiarHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
