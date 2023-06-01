import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-rsconsulta',
  templateUrl: './rsconsulta.component.html',
  styleUrls: ['./rsconsulta.component.scss']
})
export class RsconsultaComponent implements OnInit {

  public cedula : string = ""
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }
  
  consultar(e) {
    if (e.keyCode == 13) {

      this.xAPI.funcion = "MPPD_CUnidad"
      this.xAPI.parametros = this.cedula
      this.xAPI.valores = ''

      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          console.log(data)
          //this.lstEstructura = data.Cuerpo
        },
        (err) => {
          console.error(err)
        }
      )
    }

  }

}
