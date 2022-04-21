import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';


@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.scss']
})
export class GeneralesComponent implements OnInit {

 
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


  CMppd(){
    this.xApi.funcion = "C_Mppd"
    this.xApi.parametros = this.buscar
    
    console.log(10)
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
