import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import Swal from 'sweetalert2';

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
  public observacion = ''
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

MPPD_CCarpetasGroup
  public Estados: any

  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService,
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
    this.xcomponente = e.nomb.toString()
    this.xnumCarpeta = e.obse.toString()

    this.componente = e.nomb.toString()
    this.numCarpeta = e.obse.toString()
    this.OpcionesCarpetas()


  }
  async OpcionesCarpetas() {
    if (this.xnumCarpeta != '' || this.xcomponente != ''){
      this.xAPI.funcion = environment.funcion.CARPETAS_GROUP
      this.xAPI.parametros = `${this.xnumCarpeta},${this.xcomponente}`
      this.xAPI.valores = null
      await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
              if (data.Cuerpo != undefined ){
                  data.Cuerpo.forEach(e => {
                    let rp = e.responsable.toString()
                      this.xtipo = e.cod_acto.toString()
                      this.xestatus = e.estatus.toString()
                      this.xprioridad = e.accion.toString()
                      this.xclasificacion = e.cod_tipo_entrada.toString()
                      this.xresponsable = rp!=''?rp:'0'
                  })
                }
          },
          err => { }
      )
  }
}

  close() {
    this.closeEvent.emit(false);
  }

  ActualizarCarpeta(){

    Swal.fire({
      title: 'GDoc Resoluciones',
      text: "¿Está seguro que desea acualizar la carpeta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        let cadena = `${this.xtipo},${this.xclasificacion},${this.xestatus},${this.xresponsable},${this.xprioridad},${this.xnumCarpeta},${this.xcomponente},`
        let where = `${this.numCarpeta},${this.componente}`
        this.xAPI.funcion = environment.funcion.CARPETAS_GROUP_UPDATE
        this.xAPI.parametros = cadena + where
        this.xAPI.valores = null
    
         this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              this.toastrService.info(
                "La carpeta ha sido actualizada",
                `GDoc Resoluciones`
              )
              this.close()
            },
            err => { 
              console.log(err)
            }
        )
    
       
      
      }
    })    
    
   
  }
    

  async listarResponsables() {
    this.xAPI.funcion = environment.funcion.LISTAR_RESPONSABLES
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
    
  
  }

  AplicarCambios(){}
}
