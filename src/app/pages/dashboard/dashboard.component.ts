import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public Menu = []

  public image = [
    { id: '/control', src : 'control' },
    { id: '/secretaria', src : 'secretaria' },
    { id: '/resoluciones', src : 'resoluciones' },
    { id: '/ayudantia', src : 'ayudantia2' },
    { id: '/timonel', src : 'timonel' },
    { id: '/acami', src : 'acami' },
    { id: '/personal', src : 'personal' },
    { id: '/visitantes', src : 'visitantes' },
    { id: '/generales', src : 'generales' },
    { id: '/publicaciones', src : 'generales' },
    { id: '/buzonresueltos', src : 'control' },
  ]

  constructor(
    public loginService : LoginService,
    private resolucionService: ResolucionService,
    public ruta : Router){}

  async ngOnInit() {

    // await this.loginService.Iniciar()
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


  posicion(id : string ) : string {
    const imgSrc = this.image.filter(  e => { return e.id == id } )
    const src = imgSrc.length > 0? imgSrc[0].src: 'documentos'
    return src
  }


}
