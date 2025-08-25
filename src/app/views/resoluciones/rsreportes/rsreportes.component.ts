import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ExcelService } from 'src/app/services/util/excel.service';
import { UtilService } from 'src/app/services/util/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rsreportes',
  templateUrl: './rsreportes.component.html',
  styleUrls: ['./rsreportes.component.scss']
})
export class RsreportesComponent implements OnInit {

  titulo: string = 'Reportes'
  bmenu = true
  lst: any[] = []
  xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  }
  



  constructor(
    private excelService: ExcelService,
    private ngxService: NgxUiLoaderService, 
    private utilService: UtilService, 
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.utilService.onChange$.subscribe(e => {
      console.log(e)
      this.bmenu = e
    })
  }

  /**
   * @param n
   * 0: Ninguno
   * 1: Codigos Rojos
   * 2: Bajas
   * 3: Administracion
   * 4: Ascensos
   */
  cambiarFormulario(n: number) {

   
    switch (n) {
      case 1:

        this.titulo = 'Codigos Rojos'
        break
      case 2:
        this.titulo = 'Bajas'
        break
      case 3:
        this.titulo = 'Administración Pública'
        this.consultarAdministracion()
        break
      case 4:
        this.titulo = 'Ascensos'
        break
    }
  }

  consultarAdministracion() {
    this.ngxService.startLoader('lbuscar')
    this.xAPI.funcion = environment.funcion.CONSULTAR_ADMINISTRACION
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lst = data.Cuerpo
        this.ngxService.stopLoader('lbuscar')
        this.bmenu = false
      },
      error => {
        this.ngxService.stopLoader('lbuscar')
        this.bmenu = true
      }
    )
  }

  volver() {
    this.bmenu = true
  }

  exportExcel(): void {
    let xlsx = []
    this.lst.forEach((e) => {
      xlsx.push({
        'Grado': e.ngrado,
        'Componente': e.ncomponente,
        'Nombre': e.nombres_apellidos,
        'Categoria': e.n_categoria,
        'Especialidad': e.especialidad,
        'Cedula': e.cedula,
        'Promocion': e.fecha_promocion,
        'Admin. Dias': e.dias,
        'Admin. Años': e.total,
        'Ente': e.des_reserva,
        'Retorno': e.fecha_fin_periodo,
       
      })
    })
    this.excelService.exportToExcel(xlsx, 'administracion_export');
  }

}
