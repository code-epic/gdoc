import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-ctrlalertas',
  templateUrl: './ctrlalertas.component.html',
  styleUrls: ['./ctrlalertas.component.scss']
})
export class CtrlalertasComponent implements OnInit {

  estatus = "EN PROCESO"

  lstEstatus = [
    {'id': "PENDIENTE" },
    {'id': "VENCIDO" },
    {'id': "EN PROCESO" },
  ]

  lstDocumentos = []
  lstDocumentosAux = []

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
  };
  areas = '0'
  lstAreas = []

  constructor(private apiService: ApiService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.listarEstados()
    this.Consultar()
  }

  listarEstados() {
    this.xAPI = {} as IAPICore;
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
    this.xAPI = {} as IAPICore;
    this.xAPI.funcion = 'WKF_CEstatusAlertas'
    this.xAPI.parametros = '5'
    this.apiService.Ejecutar(this.xAPI).subscribe( 
     async data => {
        this.lstDocumentos = data.Cuerpo
        this.lstDocumentosAux = this.lstDocumentos
        
        this.ngxService.stopLoader("loader-estatus");
      },
      err => {
        this.ngxService.stopLoader("loader-estatus");
      }
    )
  }
  
  async Filtrar(){
    this.ngxService.startLoader("loader-estatus");
    this.lstDocumentosAux = []
    // console.log(this.areas)
    await this.lstDocumentos.map( e => {
      if (this.areas == '0') {
        if (e.estatus_alerta == this.estatus) this.lstDocumentosAux.push(e)
      }else{
        if (e.estado == this.areas && e.estatus_alerta == this.estatus) this.lstDocumentosAux.push(e)
      }

      
    })
    this.ngxService.stopLoader("loader-estatus");

  }
}
