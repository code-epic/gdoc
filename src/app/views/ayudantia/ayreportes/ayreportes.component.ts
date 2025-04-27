import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-ayreportes',
  templateUrl: './ayreportes.component.html',
  styleUrls: ['./ayreportes.component.scss']
})
export class AyreportesComponent implements OnInit {


  public focus : boolean = true
  public buscar : string = ''
  lst = []
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  public xApi : IAPICore = {
    funcion: '',
    parametros: ''
  } 

  constructor(private apiService : ApiService) { }

  ngOnInit(): void {
  }


  CProyectos(){
    this.xApi.funcion = "MPPD_CProyectos"
    this.xApi.parametros = this.buscar
    
   
    this.apiService.Ejecutar(this.xApi).subscribe(
      (data) => {
        console.log(data)
        this.lst = data.Cuerpo
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }

    )

    
   
  }

}
