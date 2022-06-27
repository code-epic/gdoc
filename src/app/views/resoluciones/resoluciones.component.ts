import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html',
  styleUrls: ['./resoluciones.component.scss']
})
export class ResolucionesComponent implements OnInit {

  public focus: boolean = true
  public buscar: string = ''
  lst = []
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  public xApi: IAPICore = {
    funcion: '',
    parametros: ''
  }

  public SubMenu = []

  constructor(private apiService: ApiService,
    private resolucionService: ResolucionService,
    public dialog: MatDialog,
    public loginService: LoginService,
    public ruta: Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    if (sessionStorage.getItem("MPPD_CTipoEntrada") == undefined) {
      for (var i = 0; i < 9; i++) {

        this.resolucionService.Listar(i) //
      }
    }
  }


  Consultar(event) {
    if (event.charCode == 13) {
      this.xApi.funcion = "MPPD_CGeneral"
      this.xApi.parametros = this.buscar
      this.apiService.Ejecutar(this.xApi).subscribe(
        (data) => {
          this.lst = data.Cuerpo
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
        }
      )
    }
  }

}
