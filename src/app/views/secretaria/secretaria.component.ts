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
    url: "/sministerial/ministeriales",
    js: "",
    descripcion: "Ministerial",
    icono: "fa fa-building",
    nombre: "Ministeriales",
    accion: "CargarUrl('control', 'salidas')",
    clase: "f-left",
    color: "bg-green",
  },
  {
    url: "/sbuscador",
    js: "",
    descripcion: "Buscador de Documentos",
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

  },
  {
    url: "/sministerial/tramitaciones-por-organo-regular",
    js: "",
    descripcion: "Tramitaciones por organo regular",
    icono: "fa fa-book",
    nombre: "TOR",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-info",

  },
  {
    url: "/sministerial/otros-documentos",
    js: "",
    descripcion: "Otros Documentos",
    icono: "fa fa-file",
    nombre: "Otros",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-gray",
  }
  ]

  constructor(private apiService: ApiService,
    public dialog: MatDialog,
    public loginService: LoginService,
    public ruta: Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    // console.log(this.loginService.Aplicacion)
    //this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)

  }










}









