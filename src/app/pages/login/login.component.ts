import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import { ILogin, IToken, LoginService } from 'src/app/services/seguridad/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  

  public login : ILogin = {
    nombre: '',
    clave: ''
  }

  iToken : IToken
  
  
  constructor( private router: Router, private loginService: LoginService) {}

  

  ngOnInit() {
  }
  ngOnDestroy() {
  }


  //Ingresar al servicio del Middleware
  async Ingresar(){
    console.info("Entrando en la funcion")
    this.router.navigate(["dashboard"])
    await this.loginService.conectar(this.login).subscribe(
      (data) => {
        this.iToken = data
        console.info(data)
      },
      (error) => {
        console.error("Falla en la conexion")
      }
    );

  }

}
