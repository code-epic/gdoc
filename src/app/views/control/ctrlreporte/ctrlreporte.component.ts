import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-ctrlreporte',
  templateUrl: './ctrlreporte.component.html',
  styleUrls: ['./ctrlreporte.component.scss']
})
export class CtrlreporteComponent implements OnInit {

  estatus = "0"

  lstEstatus = [
    {'id': "PENDIENTE" },
    {'id': "VENCIDO" },
    {'id': "EN PROCESO" },
  ]

  lstHead = []

  timonel = false
  control = false
  resolucion = false

  lstTimonel = [
    {'id': "Nro." },
    {'id': "FECHA DE ENVIO" },
    {'id': "ASUNTO" },
    {'id': "DEPENDENCIA" },
    {'id': "CONTEO DE DIAS" },
  ]

  lstDocumentos = []
  lstDocumentosAux = []

  areas = '0'
  lstAreas = []
  fechaRango: FormGroup

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
  };

  constructor(private apiService: ApiService, private ngxService: NgxUiLoaderService) { }


  ngOnInit(): void {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    this.fechaRango = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    })

    this.listarEstados()
  }

  listarEstados() {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = '%'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.lstAreas = data.Cuerpo.filter(e => { return e.esta == 1 });
      },
      (error) => {

      }
    )
  }


  Consultar(){
    this.ngxService.startLoader("loader-estatus");
    this.xAPI.funcion = 'WKF_CEstatusAlertas'
    this.xAPI.parametros = '5'
    this.apiService.Ejecutar(this.xAPI).subscribe( 
     async data => {
        this.lstDocumentos = data.Cuerpo
        this.lstDocumentosAux = this.lstDocumentos
        this.ngxService.stopLoader("loader-estatus");
      },
      err => {

      }
    )
  }


  selArea(){
    console.log(this.areas)
    this.ocultar()
    switch (this.areas) {
      case "6":
        this.Consultar()
        this.lstHead = this.lstTimonel
        this.timonel = true
        break;
    
      default:
        break;
    }
  }
  ocultar(){
    this.timonel = false
    this.control = false
    this.resolucion = false
  }
  Reporte(){}

}
