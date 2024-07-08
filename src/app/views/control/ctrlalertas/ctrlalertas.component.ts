import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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


  constructor(private apiService: ApiService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.Consultar()
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
  async Filtrar(){
    this.ngxService.startLoader("loader-estatus");
    this.lstDocumentosAux = []
    console.log(this.estatus)
    await this.lstDocumentos.map( e => {
      if (e.estatus_alerta == this.estatus) this.lstDocumentosAux.push(e)
    })
    this.ngxService.stopLoader("loader-estatus");
    

  }
}
