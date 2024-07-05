import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsgenerales',
  templateUrl: './rsgenerales.component.html',
  styleUrls: ['./rsgenerales.component.scss']
})
export class RsgeneralesComponent implements OnInit {

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
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.ngxService.startLoader("loader-gennerales");
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       
        console.log(data)
        
        this.lstGenerales = data.Cuerpo.length > 0? data.Cuerpo: []
        this.ngxService.stopLoader("loader-gennerales");

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )
  }
}
