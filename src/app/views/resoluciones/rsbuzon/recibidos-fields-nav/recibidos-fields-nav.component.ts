import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-recibidos-fields-nav',
  templateUrl: './recibidos-fields-nav.component.html',
  styleUrls: ['./recibidos-fields-nav.component.scss']
})
export class RecibidosFieldsNavComponent implements OnInit {

  @Input()
  formSidenav: FormGroup;

  @Input()
  title: any = 'N/A';

  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter<any>();

  public xcomponente = '0'
  public xclasificacion = '0'
  public xprioridad = '0'
  public xresponsable = '0'
  public xtipo = '0'
  public xobservacion = ''
  public xasunto = ''
  public xestatus = ''
  public numCarpeta = '0'

  public Componentes = []
  public lstResponsable = []
  public TipoResoluciones: any

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: '',
  };


  public Estados: any

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.reactiveForm();
    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : []

    this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []
    this.Estados = sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion"))) : []

    this.listarResponsables()
  }

  close() {
    this.closeEvent.emit(false);
  }


  async listarResponsables() {
    this.xAPI.funcion = 'MPPD_ListarResponsables'
    this.xAPI.parametros = 'Resoluciones'
    this.xAPI.valores = null

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.msj == undefined) {
          data.forEach(e => {
            this.lstResponsable.push({
              'cedula': e.cedula,
              'nombre': e.nombre
            })
          });
        }
      },
      err => { }
    )
  }

  reactiveForm() {
    console.log('Control de SideBar... ', this.formSidenav)
    //SI QUIERES INHABILITAR TODO EL FORMULARIO:
    /*
    this.formSidenav.disable();
    */

    //SI QUIERES INHABILITAR SOLO UN INPUT O SELECT
    /*
    this.formSidenav.get('formControlNameAQUI').disable();
    */

    //QUIERES AGREGAR ALGUNA VALIDACION A SOLO UN CAMPO LUEGO DE SLECCIONAR OTRO CAMPO
    /*
    his.formSidenav.get('formControlNameAQUI').setValidators([AQUI VA LA VALIDACION, ANGULAR TE TRAE UNAS CUANTAS POR DEFECTO Validators.required, Validators.regex('a-z')]);
     */

    // QUIERES SABER CUANDO UN USER ESCRIBA EN UN CAMPO ESPECIFICO:
    /*
    this.formSidenav.get('formControlNameAQUI').valueChanges.subscribe((value) => {
      console.log("VALUE", value);
    });
    */
  }

  AplicarCambios(){}
}
