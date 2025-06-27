import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from 'src/app/services/seguridad/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  public xApi : IAPICore = {
    funcion : '',
    parametros : ''
  }

  public nombre : string = ''
  public observacion : string = ''
  public usuario : string = ''

  public registrar : boolean = true

  public lst = [] //Consulta Global de Configuraciones
  public lista = [] //Objeto filtrado
  public tipo = 0
  
  constructor(
    private apiService: ApiService, 
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.listarConfiguracion();
  }

  guardar(){
    this.ngxService.startLoader("loader-registrar")
    this.registrar = !this.registrar
    if ( this.tipo == 0 || this.nombre == '') {
      this.toastrService.error(
        'Debe seleccionar un tipo de configuracion o completar todos los campos',
        `Code-Epic ESB`
      );
      return false
    }
    var configuracion = {
      "nombre" : this.nombre.toUpperCase(),
      "tipo" : this.tipo,
      "observacion" : this.observacion.toUpperCase(),
      "usuario" : this.loginService.Usuario.id
    }

    this.xApi.funcion = 'MD_IConfiguracion'
    this.xApi.valores = JSON.stringify(configuracion)

    this.apiService.Ejecutar(this.xApi).subscribe(
      data => {
        if( data.tipo == 1){
          this.toastrService.success(
            'La configuracion se ha registrado con exito codigo: ' + data.msj,
            `Code-Epic GDoc`
          );
          this.tipo = 0
          this.listarConfiguracion()
          this.limpiar()
          this.ngxService.stopLoader("loader-registrar")
         
        }else{
          this.limpiar()
          this.toastrService.error(
            data.msj,
            `Code-Epic GDoc`
          );
        }

      },
      error => {
        this.limpiar()
        this.toastrService.error(
          'error al insertar los datos de Configuraciones' + error,
          `Code-Epic ESB`
        )
       
      }
    )

  }

  limpiar(){
    this.nombre = ""
    this.observacion = ""
    this.registrar = !this.registrar
    this.ngxService.stopLoader("loader-registrar")
  }

  eliminar(id : string, n : string){
    Swal.fire({
      title: 'Elimiar',
      text: "¿Está seguro que desea eliminar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutar(id, n)
      }
    })    
  }

  ejecutar(id : string, n: string){
    this.xApi.funcion = 'MPPD_EConfiguracion'
    this.xApi.parametros = id
    
    this.xApi.valores = ''
    this.apiService.Ejecutar(this.xApi).subscribe(
      data => {
        this.selTipo(true)

        this.toastrService.success(
          `${n} ha sido eliminado con exito`,
          `MPPD_EConfiguracion`
        );
      },
      error => {
        this.toastrService.error(
          error,
          `MPPD_EConfiguracion`
        );
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
  }

  listarConfiguracion(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.xApi.funcion = 'MD_CConfiguracion';
      this.xApi.parametros = '%';
      this.xApi.valores = '';
      this.apiService.Ejecutar(this.xApi).subscribe(
        data => {
          this.lst = data.Cuerpo;
          resolve(); // Resuelve la promesa cuando los datos se cargan
        },
        error => {
          console.error('Fallo consultando los datos de Configuraciones');
          reject(error); // Rechaza la promesa en caso de error
        }
      );
    });
  }

  async selTipo(consultar: boolean = false) {
    this.ngxService.startLoader("loader-aceptar")

    if (consultar) {
      this.lst = []
      await this.listarConfiguracion();
    }

    this.lista = [];
    this.lst.forEach(e => {
      if (e.tipo == this.tipo) {
        this.lista.push(e);
      }
    });
    this.ngxService.stopLoader("loader-aceptar")
  }

  // testing(){
  //   var configuracion = {
  //     "nombre" : 'Middleware',
  //     "version" : '2.0.0 RC.2',
  //     "identificador" : 1
  //   }

  //   this.xApi.funcion = 'UTech'
  //   this.xApi.valores = JSON.stringify(configuracion)

  //   this.apiService.Ejecutar(this.xApi).subscribe(
  //     data => {
  //       console.info(data)

  //     },
  //     error => {
  //       console.error(error)
      
  //     }
  //   )
  // }

}
