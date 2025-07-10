import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsestadisticas',
  templateUrl: './rsestadisticas.component.html',
  styleUrls: ['./rsestadisticas.component.scss']
})
export class RsestadisticasComponent implements OnInit {


  lstTitulos = [
    { 'id': 1, 'codigo': 4 , 'valor': 'PS C' },
    { 'id': 2, 'codigo': 4 , 'valor': 'PS T' },
    { 'id': 3, 'codigo': 4 , 'valor': 'PS OT' },
    { 'id': 4, 'codigo': 4 , 'valor': 'CE A' },
    { 'id': 5, 'codigo': 7 , 'valor': 'SMD' },
    { 'id': 6, 'codigo': 5 , 'valor': 'RAIAP' },
    { 'id': 7, 'codigo': 3 , 'valor': 'PMAX' },
    { 'id': 8, 'codigo': 1 , 'valor': 'TSC' },
    { 'id': 9, 'codigo': 4 , 'valor': 'SUB' }
  ]

  lstGrados = [
    { 'id': 1, 'grado': 'GENERAL EN JEFE', 'codigo': 'GJ', 'n_codigo': '10' },
    { 'id': 3, 'grado': 'MAYOR GENERAL', 'codigo': 'MG', 'n_codigo': '15' },
    { 'id': 5, 'grado': 'GENERAL DE DIVISIÓN', 'codigo': 'GD', 'n_codigo': '20' },
    { 'id': 7, 'grado': 'GENERAL DE BRIGADA', 'codigo': 'GB', 'n_codigo': '30' },
    { 'id': 9, 'grado': 'CORONEL', 'codigo': 'CNEL', 'n_codigo': '1040' },
    { 'id': 11, 'grado': 'TENIENTE CORONEL', 'codigo': 'TCNEL', 'n_codigo': '1050' },
    { 'id': 13, 'grado': 'MAYOR', 'codigo': 'MY', 'n_codigo': '1060' },
    { 'id': 15, 'grado': 'CAPITAN', 'codigo': 'CAP', 'n_codigo': '2070' },
    { 'id': 17, 'grado': 'PRIMER TENIENTE', 'codigo': '1TTE', 'n_codigo': '2080' },
    { 'id': 19, 'grado': 'TENIENTE', 'codigo': 'TTE', 'n_codigo': '2090' }
  ]

  public lstGlobal = [
    { 'id': '100', 'nombre': 'EJB', 'data': [] },
    { 'id': '200', 'nombre': 'AMB', 'data': [] },
    { 'id': '300', 'nombre': 'AVB', 'data': [] },
    { 'id': '400', 'nombre': 'GNB', 'data': [] },
  ]

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.consultarBajas()
  }


  consultarBajas() {
    this.xAPI.funcion = environment.funcion.ESTADISTICAS_BAJAS
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        let db = data.Cuerpo
        db.forEach(e => {
          this.lstGlobal[ this.validarComponente(parseInt(e.componente)) ].data.push(e) 
        });
        //console.log(this.lstGlobal)
        //console.log(this.encontrarPosicion(0, '1', '5'), 'cant')
      },
      error => {

      }
    )
  }

  validarComponente(id): number {
    let cod = 0
    switch (id) {
      case 100:
        cod = 0
        break;
      case 200:
        cod = 1
        break;
      case 300:
        cod = 2
        break;
      case 400:
        cod = 3
        break;

    }
    return cod
  }

  encontrarPosicionCat( componente, cod_reserva, grado, cat ){
    // console.log(componente, cod_reserva, grado)
    let valor = 0
    let data = this.lstGlobal[componente].data
    //console.log(data)
    data.forEach(e => {
      if(e.cod_reserva == cod_reserva && e.grado == grado) valor += parseInt(e.cantidad)
    });

    return valor
  }
  encontrarPosicion( componente, cod_reserva, grado ){
    // console.log(componente, cod_reserva, grado)
    let valor = 0
    let data = this.lstGlobal[componente].data
    //console.log(data)
    data.forEach(e => {
      if(e.cod_reserva == cod_reserva && e.grado == grado) valor += parseInt(e.cantidad)
    });

    return valor
  }
}