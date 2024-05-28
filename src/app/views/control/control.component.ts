import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/seguridad/login.service';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public rdocumento : string = "none"
  public rtarjetas  : string = ""
  public rlistado : string = "none"

  public paginador = 10
  public focus;
  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia : false,
    protocolo: '',
    ruta : '',
    version: '',
    retorna : false,
    migrar : false,
    http : 0,
    https : 0,
    consumidores : '',
    puertohttp : 0,
    puertohttps : 0,
    driver : '',
    query : '',
    metodo : '',
    tipo : '',
    prioridad : '',
    entorno: '',
    logs : false,
    cache: 0,
    estatus: false
  };

  selNav = 0
  oficinas = []
  lst = []

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  public SubMenu = []

  public Configurar : boolean = false

  constructor(private apiService: ApiService, 
    public dialog: MatDialog,
    public loginService : LoginService,
    public ruta : Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    this.SubMenu.push(
       {
    url: "/consulta-general",
    js: "",
    descripcion: "Consulta General",
    icono: "fa fa-search",
    nombre: "Consulta",
    accion: "CargarUrl('control', 'pendientes')",
    clase: "f-left",
    color: "bg-orange",
    
  }
    )
    let prv = this.loginService.obtenerPrivilegiosMenu(this.ruta.url)
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach(e => {
        if (e.nombre == "configurar") this.Configurar = true
      });
    }

    await this.ConsultarCantidades()
  }

  ConsultarCantidades(){

    
    this.xAPI.funcion = 'WKF_CCantidadEstado'
 
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       
      },
      (error) => { console.log(error) }
    )
  }
 



}

