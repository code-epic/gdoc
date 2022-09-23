import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { Router } from '@angular/router';
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
  constructor(private apiService: ApiService, 
    private toastrService: ToastrService,
    private loginService: LoginService,
    private ruta: Router,
    private ngxService: NgxUiLoaderService) { 


  }

  ngOnInit(): void {
    this.listarConfiguracion()
  }

  listarConfiguracion(){
    this.xApi.funcion = 'MD_CConfiguracion'
    this.xApi.parametros = '%'
    this.xApi.valores = ''
    this.apiService.Ejecutar(this.xApi).subscribe(
      data => {
        this.lst = data.Cuerpo
      },
      error => {
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
  }


  selTipo(){
    this.lista = []
    this.lst.forEach(e => {
      if ( e.tipo == this.tipo ) this.lista.push(e)
    });
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

  eliminar(id : string){
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
        this.ejecutar(id)
      }
    })    
  }



  ejecutar(id : string){
    console.log(id)
    this.ngxService.startLoader("loader-registrar")
    this.xApi.funcion = 'MPPD_EConfiguracion'
    this.xApi.parametros = id
    this.xApi.valores = ''
    this.apiService.Ejecutar(this.xApi).subscribe(
      data => {
        this.toastrService.success(
          'Tu archivo ha sido cargado con exito ',
          `MPPD_EConfiguracion`
        );
        this.ngxService.stopLoader("loader-aceptar")
        this.ruta.navigate(['/principal'])
      },
      error => {
        this.toastrService.error(
          error,
          `MPPD_EConfiguracion`
        );
        this.ngxService.stopLoader("loader-aceptar")
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
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
