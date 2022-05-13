import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/apicore/api.service';
import { LoginService } from 'src/app/services/seguridad/login.service';

@Component({
  selector: 'app-ayudantia',
  templateUrl: './ayudantia.component.html',
  styleUrls: ['./ayudantia.component.scss']
})
export class AyudantiaComponent implements OnInit {


  public SubMenu = []

  constructor(private apiService: ApiService, 
    public loginService : LoginService,
    public ruta : Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    //await this.ConsultarCantidades()
  }



}
