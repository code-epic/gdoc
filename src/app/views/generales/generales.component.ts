import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';


@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.scss']
})
export class GeneralesComponent implements OnInit {

  public SubMenu = []
  public Componentes: any
  public rtarjetas  : string = ""


  constructor(private apiService: ApiService,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public ruta: Router){

  }


  async ngOnInit() {
    
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
   
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
  
  }

}