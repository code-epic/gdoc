import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';

@Component({
  selector: 'app-mreportes',
  templateUrl: './mreportes.component.html',
  styleUrls: ['./mreportes.component.scss']
})
export class MreportesComponent implements OnInit {

  vistacontenido = false
  public lstAcciones = [
    { 'valor': '1', 'texto': 'ANALISTA', 'visible': '1' },
    { 'valor': '2', 'texto': 'JEFE DE AREA', 'visible': '1' },
    { 'valor': '3', 'texto': 'BANDEJA DE ESPERA', 'visible': '1' },
    { 'valor': '4', 'texto': 'PRESIDENCIAL', 'visible': '1' },
    { 'valor': '5', 'texto': 'ESPERA DE OPINION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '6', 'texto': 'CONSULTORIA JURIDICA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '7', 'texto': 'DIV. RESOLUCIONES', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '12', 'texto': 'DIV. RESOLUCIONES / URGENTE', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '13', 'texto': 'DIV. RESOLUCIONES / JEFE DEL AR EA SECRETARIA', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '14', 'texto': 'DEVUELTO SIN DECISION', 'visible': '1' }, //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '8', 'texto': 'SUB-DIRECCION', 'visible': '1' },
    { 'valor': '9', 'texto': 'DIRECCION GENERAL', 'visible': '1' },
    { 'valor': '10', 'texto': 'DESPACHO DEL MPPD', 'visible': '1' },  //7/5/3 Asociado a los plazos en las alertas
    { 'valor': '11', 'texto': 'ARCHIVO', 'visible': '1' }
  ]



  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  public lstDatos = []
  Componentes = []
  lstDependecia = []
  public lstC = [] //Objeto Comando
  lstYear = ['2024','2025','2027','2029','2024','2030']
  public Configuracion: any

  componente = '0'
  year = '0'
  public estatus = '0'
  numero = ''
  cuenta = ''
  cedula = ''
  dependencia = '0'
  decision  = '0'
  bdecision = false
 
  public asunto = ''
  public cargador: boolean = true;
  fechaRango: FormGroup;

  



  constructor(private apiService: ApiService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.Componentes =
    sessionStorage.getItem('MPPD_CComponente') != undefined
      ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
      : []

      this.Configuracion = sessionStorage.getItem("MD_CConfiguracion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MD_CConfiguracion"))) : []
      this.listarConfiguracion()

  }


  listarConfiguracion() {
    // console.log(this.Configuracion)
    this.Configuracion.forEach(e => {
      switch (e.tipo) {
        case "4":
          this.lstC.push(e)
          break
      }
    })

  }

  buscarDocumento(): void {
    this.vistacontenido = true;
    this.bdecision = false
    let status = this.estatus=='0'?'%':this.estatus
    let yyyy = this.year=='0'?'%':this.year + '%'
    let cuent = this.cuenta==''?'%':this.cuenta
    let unidad = this.dependencia=='0'?'%':this.dependencia
    let componente = '%'

    if (this.componente != '0'){
      // this.bcomponente = true
      componente = this.componente
    }
    let decision = '%'
    if (this.decision != '0'){
      this.bdecision = true
      decision = this.decision
    }
    console.log(this.estatus)
    this.cargador = false
    
    this.ngxService.startLoader("loader-aceptar")
    this.xAPI.funcion = 'WKF_CSecreatariaReportes'
    this.xAPI.parametros = `PUNTO DE CUENTA,${status},${yyyy},${cuent},${unidad},${componente},${decision}`
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstDatos = data.Cuerpo
        //onsole.log( JSON.parse( this.lstDatos[0].subdocumento ) )
        console.log(this.lstDatos)
        this.ngxService.stopLoader("loader-aceptar")
        
        this.cargador = true
      },
      (error) => {
        console.error("No existe la funcion ", error)
        this.ngxService.stopLoader("loader-aceptar")
      }

    )
    

  }


  getFecha(e) : string {
    let fecha = ''
    if (e == null )  return '2000-01-01'
    let d =  JSON.parse( e ) 
    
    if (d!=null){
      fecha = d[0].fecha 
    }else{
      fecha = '2000-01-01'
    }
    return fecha
  }

   getStatus(status) : string {
    let texto = ''
    this.lstAcciones.forEach(e => {
      if (e.valor == status) {
        texto = e.texto
        return
      }
    });
    
    return texto

  }

  getPrint(codigo) : boolean {
    let valor = false  
     if ( codigo == 'EB' || codigo ==  'AB' || codigo ==  'AMB' || codigo ==  'GNB' || codigo ==  'MB')
      return true
  }


  limpiarBusqueda(){
    this.componente = '0'
    this.dependencia = '0'
    this.year = '0'
    this.cuenta = ''
    this.asunto = ''
    this.cedula = ''
    this.numero = ''
    this.estatus = '0'
    this.decision = '0'


    this.vistacontenido = false
    this.lstDatos = []

    

  }

}
