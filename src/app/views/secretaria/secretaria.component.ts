import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/seguridad/login.service';

export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-secretaria',
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.scss']
})
export class SecretariaComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public rdocumento: string = "none"
  public rtarjetas: string = ""
  public rlistado: string = "none"

  public paginador = 10
  public focus;
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
  };


  public SubMenu = []

  constructor(private apiService: ApiService,
    public dialog: MatDialog,
    public loginService: LoginService,
    public ruta: Router) { }

  async ngOnInit() {
    // await this.loginService.Iniciar()
    // console.log(this.loginService.Aplicacion)
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)

  }










}









