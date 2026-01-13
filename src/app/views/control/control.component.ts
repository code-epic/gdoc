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
    
    
    let prv = this.loginService.obtenerPrivilegiosMenu("/control", this.ruta.url)
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
        await data.Cuerpo.map(e => {
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
        if ( this.pendiente >0 || this.vencidos > 0 ) this.alert()
      },
      err => {

      }
    )
  }


  alert(){
    Swal.fire({
      // background: "#F08080",
      position: "bottom-end",
      backdrop: false,
      //icon: "warning",
      title: "",
      html: `
        <div style="text-align: left; font-family: 'Open Sans', sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="
              min-width: 50px; 
              height: 50px; 
              border-radius: 50%; 
              background: linear-gradient(135deg, #ce9193ff 0%, #fecfef 100%); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
              margin-right: 15px;">
              <i class="fa fa-bell" style="color: #fff; font-size: 24px;"></i>
            </div>
            <div>
              <h5 style="margin: 0; color: #32325d; font-weight: 700;">Alertas Pendientes</h5>
              <small style="color: #8898aa;">Documentación requiere atención</small>
            </div>
          </div>
          
          <div style="background: #f8f9fe; padding: 15px; border-radius: 12px; border: 1px solid #f1f3f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #525f7f; font-size: 14px;"><i class="fa fa-clock-o mr-2" style="color: #fb6340;"></i> Por vencer</span>
              <span style="background: #fff; padding: 2px 12px; border-radius: 20px; font-weight: bold; color: #fb6340; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 13px;">${this.pendiente}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #525f7f; font-size: 14px;"><i class="fa fa-exclamation-triangle mr-2" style="color: #f5365c;"></i> Vencidos</span>
              <span style="background: #fff; padding: 2px 12px; border-radius: 20px; font-weight: bold; color: #f5365c; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 13px;">${this.vencidos}</span>
            </div>
          </div>
        </div>
      `,
      confirmButtonColor: "#d29799ff",
      showConfirmButton: true,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: "Ver detalles",
      timer: 8000
    }).then((result) => {
      if (result.isConfirmed) {
        this.ruta.navigate(['ctrlalertas'])
      }
    })
  }



}
