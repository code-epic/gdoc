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

  public componente = '0'
  public xclasificacion = '0'
  public xprioridad = '0'
  public xresponsable = '0'
  public xtipo = '0'
  public xobservacion = ''
  public xasunto = ''
  public xestatus = ''
  public numCarpeta = '0'

  public xnumCarpeta = '0'
  public xcomponente = '0'


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

  ngOnChanges(){
    let e = this.formSidenav.value
    // console.log('Control de SideBar 2... ', this.formSidenav.value)
    this.xcomponente = e.nomb.toString()
    this.xnumCarpeta = e.obse.toString()

    this.componente = e.nomb.toString()
    this.numCarpeta = e.obse.toString()
    this.OpcionesCarpetas()


  }
  async OpcionesCarpetas() {
    this.xAPI.funcion = 'MPPD_CCarpetasGroup'
    this.xAPI.parametros = `${this.xnumCarpeta},${this.xcomponente}`
    this.xAPI.valores = null

    await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
                data.Cuerpo.forEach(e => {
                  let rp = e.responsable.toString()
                    this.xtipo = e.cod_acto.toString()
                    this.xestatus = e.estatus.toString()
                    this.xprioridad = e.accion.toString()
                    this.xclasificacion = e.cod_tipo_entrada.toString()
                    this.xresponsable = rp!=''?rp:'0'
                })
        },
        err => { }
    )
}

  close() {
    this.closeEvent.emit(false);
  }

  ActualizarCarpeta(){
    let carpet = {
      'xnumero_carpeta': this.xnumCarpeta.toString(), 
      'numero_carpeta': this.numCarpeta.toString(), 
      'xcod_componente': this.xcomponente,
      'cod_componente': this.componente,
      'fecha_entrada': '', 
      'cod_tipo_entrada': this.xclasificacion.toString(), 
      'estatus': this.xestatus, 
      'responsable': this.xresponsable.toString(), 
      'accion': this.xprioridad.toString(), 
      'cod_acto': this.xtipo,
      

    }
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
    // console.log('Control de SideBar... ', this.formSidenav)
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

    // this.formSidenav.get('formSidenav').valueChanges.subscribe((value) => {
    //   console.log("VALUE", value);
    // });
  
  }

  AplicarCambios(){}
}
