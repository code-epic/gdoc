import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/seguridad/login.service';
import Swal from 'sweetalert2';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {



  public rdocumento : string = "none"
  public rtarjetas  : string = ""
  public rlistado : string = "none"

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



  public SubMenu = []

  public Configurar : boolean = false

  pendiente : number = 0
  vencidos: number = 0


  constructor(private apiService: ApiService, 
    public loginService : LoginService,
    public ruta : Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    let prv = this.loginService.obtenerPrivilegiosMenu(this.ruta.url)
    if (prv != undefined && prv.Privilegios != undefined) {
      prv.Privilegios.forEach(e => {
        if (e.nombre == "configurar") this.Configurar = true
      });
    }

    this.consultarAlertas()
  }




  consultarAlertas(){
  
    this.xAPI.funcion = 'WKF_CEstatusAlertasCantidad'
    this.xAPI.parametros = '5'
    this.apiService.Ejecutar(this.xAPI).subscribe( 
     async data => {
        console.log(data)
      

        await data.Cuerpo.map(e => {
          console.log(e)
          switch (e.estatus) {
            case "PENDIENTE":
              this.pendiente = e.cantidad
              break;
            case "VENCIDO":
              this.vencidos = e.cantidad
              break
            default:
              break;
          }
        })
        console.log("Alertando")
        if ( this.pendiente >0 || this.vencidos > 0 ) this.alert()
      },
      err => {

      }
    )
  }


  alert(){
    Swal.fire({
      background: "#F08080",
      position: "bottom-end",
      backdrop: false,
      //icon: "warning",
      title: "Alertas pendientes",
      html: `<p align="left" style="color:#fff; font-weight: bold;">
        <table widht="100%" cellpadding="10px">
          <tr>
            <td>
              <i class="fa fa-exclamation-circle" aria-hidden="true" style="font-size:64px"></i>
            </td>
            <td> 
              Documentación con plazo: ( ${this.pendiente} ) <br>
              Documentación vencida: ( ${this.vencidos} ) 
            </td>
          </tr>
        </table>
       
        </p>
      `,
      confirmButtonColor: "#F09090",
      showConfirmButton: true,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: "Ver detalles",
      timer: 5000
    }).then((result) => {
      if (result.isConfirmed) {
        this.ruta.navigate(['ctrlalertas'])
      }
    })
  }



}

