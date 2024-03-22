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

  public rdocumento : string = "none"
  public rtarjetas  : string = ""
  public rlistado : string = "none"

  public paginador = 10
  public focus;
  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
  };


  public SubMenu = [{
    url: "/sbuzon",
    js: "",
    descripcion: "Documentos en Buzon",
    icono: "fa fa-envelope",
    nombre: "Buzon",
    accion: "CargarUrl('control', 'buzon')",
    clase: "f-left",
    color: "bg-blue",
    
  },
  {
    url: "/sministerial",
    js: "",
    descripcion: "Ministerial",
    icono: "fa fa-building",
    nombre: "Ministeriales",
    accion: "CargarUrl('control', 'salidas')",
    clase: "f-left",
    color: "bg-green",
  },
  {
    url: "/spresidencial",
    js: "",
    descripcion: "Presidencial",
    icono: "fa fa-landmark",
    nombre: "Presidenciales",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-red",
    
  },
  {
    url: "/sbuscador",
    js: "",
    descripcion: "Buscador",
    icono: "fa fa-compass",
    nombre: "Buscador",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-purple",
    
    },
    {
    url: "/consulta-general",
    js: "",
    descripcion: "Consulta General",
    icono: "fa fa-search",
    nombre: "Consulta",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-orange",
    
  }]

  constructor(private apiService: ApiService, 
    public dialog: MatDialog,
    public loginService : LoginService,
    public ruta : Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    console.log(this.loginService.Aplicacion)
    //this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
   
  }










  }



  
      
    



