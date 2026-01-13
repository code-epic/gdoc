import { Component, OnInit } from '@angular/core';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public Menu = []


  constructor(
    public loginService : LoginService,
    private resolucionService: ResolucionService){}

  async ngOnInit() {
    this.Menu =  this.loginService.obtenerMenu().filter(
      e => { 
        return e.url != '/principal'
      }
    )

    if (sessionStorage.getItem("CEP_CUsuario") == undefined) {
      for (var i = 0; i < 14; i++) {
        this.resolucionService.Listar(i) //
      }
    }
  }




}
