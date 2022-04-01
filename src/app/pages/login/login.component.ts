import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IToken, LoginService } from '../../services/seguridad/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  


  redirectDelay: number;
  showMessages: any;
  strategy: string;
  errors: string[];
  messages: string[];
  usuario : string;
  clave: string;

  submitted: boolean;
  rememberMe: boolean;

  loading = false;
  isHidden: boolean = true;
  public iToken: IToken = {
    token: '',
  };

  public itk: IToken;
  private index: number = 0;

  constructor(private router: Router, private loginService: LoginService, private toastrService: ToastrService){
    if (sessionStorage.getItem("token") != undefined ){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {

  }


  async login(){
    await this.loginService.getLogin(this.usuario, this.clave).subscribe(
      (data) => { // Success
        this.itk = data;
        sessionStorage.setItem("token", this.itk.token );
        console.log(this.itk)
        this.router.navigate(['/dashboard']);

      },
      (error) => {
        this.loading = false;
        this.isHidden = false;

        this.toastrService.error(
          'Error al acceder a los datos de conexion',
          `Bus Empresarial`
        );
      }
    );
  }

}
