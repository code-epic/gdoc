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

  constructor(private apiService: ApiService, 
    public dialog: MatDialog,
    public loginService : LoginService,
    public ruta : Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
  }

  pageChangeEvent(e){
    this.recorrerElementos(e.pageIndex+1, this.lst)
  }


  ConsultarOficinas(e){

    this.selNav = e
    this.seleccionNavegacion()
    
    if (this.xAPI.funcion == '') return false;
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lst = data //Registros recorridos como elementos
        this.lengthOfi = data.length
        this.recorrerElementos(1, data)
      },
      (error) => { console.log(error) }
    )
  }


  seleccionNavegacion(){
    switch (this.selNav) {
      case 0:
        this.xAPI.funcion = ''
        break;
      case 1:
        this.xAPI.funcion = 'ConsultarOficinas'
        break;
      case 2:
        this.xAPI.funcion = ''
        break;
      case 3:
        this.xAPI.funcion = ''
        break;
    
      default:
        break;
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(posicion : number, lst : any){
    if (posicion > 1) posicion = posicion * 10
    this.oficinas = lst.slice(posicion, posicion + this.pageSizeOfi)    
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogConfigurar, {
      width: '550px',
      data: {name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Cerrar Ventana');
      //this.animal = result;
    });
  }

}

@Component({
  selector: 'dialog-configurar',
  templateUrl: 'dialog-configurar.html',
})
export class DialogConfigurar {
  constructor(
    public dialogRef: MatDialogRef<DialogConfigurar>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ConfigurarGuardar(): void {
    this.dialogRef.close();
  }

}
