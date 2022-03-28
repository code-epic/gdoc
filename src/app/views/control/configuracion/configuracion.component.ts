import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { ToastrService } from 'ngx-toastr';

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

  public lst = [] //Consulta Global de Configuraciones
  public lista = [] //Objeto filtrado
  public tipo = 0
  constructor(private apiService: ApiService, 
    private toastrService: ToastrService,) { 


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
        console.info('cargando datos ')
        console.info(data)
        this.lst = data.Cuerpo
      },
      error => {
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
  }


  selTipo(){
    this.lista = []
    console.log(this.lst)
    this.lst.forEach(e => {
      if ( e.tipo == this.tipo ) this.lista.push(e)
    });
  }

  guardar(){
    if ( this.tipo == 0 || this.nombre == '') {
      this.toastrService.error(
        'Debe seleccionar un tipo de configuracion o completar todos los campos',
        `Code-Epic ESB`
      );
      return false
    }
    var configuracion = {
      "nombre" : this.nombre,
      "tipo" : this.tipo,
      "observacion" : this.observacion,
      "usuario" : this.usuario
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
         
          this.nombre = ""
          this.observacion = ""
          
         
        }else{
          this.toastrService.error(
            data.msj,
            `Code-Epic GDoc`
          );
        }

      },
      error => {
        
        this.toastrService.error(
          'error al insertar los datos de Configuraciones' + error,
          `Code-Epic ESB`
        );
      }
    )

  }


}
