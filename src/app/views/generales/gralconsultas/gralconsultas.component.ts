import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-gralconsultas',
  templateUrl: './gralconsultas.component.html',
  styleUrls: ['./gralconsultas.component.scss']
})

export class GralconsultasComponent implements OnInit {

  selected = new FormControl(0);
  componente = '0'
  Componentes = [] 
  lstGenerales = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private ruta: Router,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    private rutaActiva: ActivatedRoute,
    private utilService: UtilService) { }

  ngOnInit(): void {
    this.Componentes =
    sessionStorage.getItem("MPPD_CComponente") != undefined
      ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
      : [];
  }

  ConsultarListado(){
    this.xAPI.funcion = 'MPPD_CLibroGenerales'
    this.xAPI.parametros = this.componente.split('|')[0];
    this.xAPI.valores = ''
    this.ngxService.startLoader("loader-gennerales");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       
        // console.log(data)
        
        this.lstGenerales = data.Cuerpo.length > 0? data.Cuerpo: []
        this.ngxService.stopLoader("loader-gennerales");

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )
  }

  filtrarNombramiento(e): string {
    let nmb = JSON.parse(e).filter(e => {
        return e.tipo != 13;
    }).sort( (a, b) => {
        if (a.fecha > b.fecha) {
            return -1;
        } else if (a.fecha < b.fecha) {
            return 1;
        } else {
            return 0;
        }
    });

    let texto = '';
    if (nmb.length !== 0) {
        if (nmb[0].asunto === undefined ) {
            texto = '';
        } else {
            texto = nmb[0].asunto + `<br> RESOL. <br> ${nmb[0].numero} <br> ${nmb[0].fecha}<br>`  +
            nmb[1].asunto + `<br> RESOL. <br> ${nmb[1].numero} <br> ${nmb[1].fecha}<br>`
        }
    } else {
        texto = 'SIN NOMBRAMIENTO';
    }
    return texto;
}

filtrarAscenso(e) {
    let asc = JSON.parse(e).filter(e => {
        return e.tipo == 13;
    }).sort((a, b) => {
        if (a.fecha > b.fecha) {
            return -1;
        } else if (a.fecha < b.fecha) {
            return 1;
        } else {
            return 0;
        }
    });
    let texto = ''
    if (asc.length !== 0) {
        let pos = asc[0].orden == 0 ? '1 DE 1' : asc[0].orden + ' DE ' + asc[0].cantidad
        texto =  `RESOL. <br> ${asc[0].numero} <br> ${asc[0].fecha}<br><br> ${pos}`
    } else {
        texto = 'SIN RESUELTO'
    }
    return texto
}

  
  
}
