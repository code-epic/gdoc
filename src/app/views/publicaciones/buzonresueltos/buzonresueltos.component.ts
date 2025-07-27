import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-buzonresueltos',
  templateUrl: './buzonresueltos.component.html',
  styleUrls: ['./buzonresueltos.component.scss']
})
export class BuzonresueltosComponent implements OnInit {

  bzRecibidoResumen = []

  public lstMeses = []
  public lstYear = []
  public xmeses = ''
  public fecha_desde = '-09-01'
  public fecha_hasta = '-10-01'
  public xyear = '2025'
  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }
  public lstEstados = [] //Listar Estados

  constructor(private apiService: ApiService) {

    this.lstMeses = this.apiService.Xmeses
    this.lstYear = this.apiService.Xyear
  }

  ngOnInit(): void {
    this.xmeses = new Date().getMonth().toString()
    this.xyear = new Date().getFullYear().toString()
    this.listarEstados()
  }

  getDetalle(e) {

  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '%'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstEstados = data.Cuerpo.filter(e => {
          return e.esta == 1 && e.id != 9
        });
      },
      (error) => {

      }
    )
  }

  seleccionNavegacion(e) {
  
  }

  irAnterior() {
    history.back()
  }

}
