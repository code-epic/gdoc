import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsconfiguracion',
  templateUrl: './rsconfiguracion.component.html',
  styleUrls: ['./rsconfiguracion.component.scss']
})
export class RsconfiguracionComponent implements OnInit {
  public focus : boolean = true
  public buscar : string = ''
  public dbasico : boolean = false
  public dmasivo : boolean = false 
  public dgeneral : boolean = false
  public dpublicaciones : boolean = false 
  public titulo: string = 'Configuraciones Generales'
  
  lst = []
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  public xApi : IAPICore = {
    funcion: '',
    parametros: ''
  } 

  public SubMenu = []

  constructor(private apiService : ApiService, 
    private resolucionService : ResolucionService,
    public dialog: MatDialog,
    public loginService : LoginService,
    private utilService: UtilService,
    public ruta : Router) { }

  async  ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    this.utilService.titulo$.subscribe((e) => {
     this.titulo = e
    });
  }


  desactivar(titulo : string){
    this.dbasico = false
    this.dmasivo = false
    this.dgeneral = false
    this.dpublicaciones = false
    this.titulo = titulo
  }



}
