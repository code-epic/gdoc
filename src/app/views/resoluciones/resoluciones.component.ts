import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';
import * as internal from 'stream';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html',
  styleUrls: ['./resoluciones.component.scss']
})
export class ResolucionesComponent implements OnInit {

  public focus: boolean = true
  public buscar: string = ''
  public lst = []
  public lstMilitar = []

  public lengthOfi = 0;
  public pageSizeOfi = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public cantidad: number = 0


  public blBuscar: boolean = false
  public antes: boolean = false
  public despues: boolean = true
  public paginador: number = 10
  public de: number = 0
  public para: number = 9
  public max_paginador: number = 0
  public lstPaginas = []
  public actual : number =  1
  public slike : string = '%'

  public previaBusqueda : string = ''

  public xApi: IAPICore = {
    funcion: 'MPPD_CGeneral',
    parametros: ''
  }

  public Resolucion: Resolucion = {
    id: '',
    cuenta: '',
    unidad: '',
    fecha_doc: '',
    tipo: '0',
    cedula: '',
    nombres_apellidos: '',
    fecha_nacimiento: '',
    componente: '',
    categoria: '',
    clasificacion: '',
    grado: '',
    carpeta: '0',
    estatus: '0',
    entrada: '0',
    asunto: '',
    observacion: '',
    responsable: '',
    cargo_responsable: '',
    situacion: '',
    sexo: '',
    numero: '0'
  }

  public contador_ponderacion = 0
  public data: any
  public ref: any
  public tipo: any

  public SubMenu = []
  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public TipoResoluciones: any
  public Estados: any
  public selected: number = 0
  

  constructor(private apiService: ApiService,
  
    private modalService: NgbModal,
    public dialog: MatDialog,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public ruta: Router) { }

  async ngOnInit() {
    //this.xApi.funcion = "MPPD_CGeneral"
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
   
    this.Componentes = sessionStorage.getItem("MPPD_CComponente") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente"))) : []
    this.Grados = sessionStorage.getItem("MPPD_CGrado") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))) : []
    this.Categorias = sessionStorage.getItem("MPPD_CCategorias") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias"))) : []
    this.Clasificaciones = sessionStorage.getItem("MPPD_CClasificacion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion"))) : []
    this.TipoEntradas = sessionStorage.getItem("MPPD_CTipoEntrada") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoEntrada"))) : []
    this.TipoResoluciones = sessionStorage.getItem("MPPD_CTipoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CTipoResolucion"))) : []
    this.Estados = sessionStorage.getItem("MPPD_CEstadoResolucion") != undefined ? JSON.parse(atob(sessionStorage.getItem("MPPD_CEstadoResolucion"))) : []
  }


  Consultar(event) {
    if (event.charCode == 13) {
      this.previaBusqueda = ''
      if (this.buscar == '') return false
      this.previaBusqueda = this.buscar
      this.seleccionNavegacion(this.selected)
      
    }
  }

  consultarAPIBuscar( ) {
    this.lstMilitar = []
    this.ngxService.startLoader("loader-buscar")
    
    this.xApi.parametros = this.previaBusqueda + ',' + this.de + ',' + this.paginador + ',' + this.slike
    console.log(this.previaBusqueda + ',' + this.de + ',' + this.para + ',' + this.slike, this.xApi.funcion)
    this.cantidad = 0
    this.contador_ponderacion = 0
    this.lst = []
    this.apiService.Ejecutar(this.xApi).subscribe(
      (data) => {
        console.info(data.Cuerpo)
        if (data.Cuerpo.length != undefined && data.Cuerpo.length > 0) {

          this.lst = data.Cuerpo.map(e => {
            e.meta = JSON.parse(e.meta)
            return e
          })
          this.cantidad = this.lst[0].cantidad;

          this.max_paginador = this.cantidad / 10

        }
        if (this.selected == 3){
          this.lstMilitar = this.lst
        }
        this.ngxService.stopLoader("loader-buscar")
        this.buscar = ""
        this.MostrarPaginador()
       

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
      }
    )
  }



  seleccionNavegacion(e) {
    this.selected = e
    this.xApi.funcion = "MPPD_CGeneral"
    switch (e) {
      case 0:
        
        this.slike = '%'
        this.consultarAPIBuscar()
        break
      case 1:
        this.slike = 'C'
        this.consultarAPIBuscar()
        break
      case 2:
        this.slike = 'R'
        this.consultarAPIBuscar()
        break
      case 3:
        this.xApi.funcion = "MPPD_CMilitar"
        this.slike = 'D'
        this.consultarAPIBuscar()
      break
      default:
        break
    }

  }


  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }


  AgregarView(score, id, content, cedula, referencia, tipo) {
    this.ngxService.startLoader("loader-buscar")
    this.xApi.funcion = this.selected != 3? 'MPPD_UFulltext': 'MPPD_UFulltextMilitar'

    var ponderacion = (score - this.contador_ponderacion)
    this.contador_ponderacion += 0.100
    this.xApi.parametros = ponderacion + ',' + id
    this.ref = referencia
    this.tipo = tipo
    this.apiService.Ejecutar(this.xApi).subscribe(
      (data) => {
        console.log("Actualizando ", data)
        this.consultarCedula(cedula, content)
      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
        this.ngxService.stopLoader("loader-buscar")
      }
    )
  }


  /**
 * Consultar datos generales del militar 
 */
  consultarCedula(cedula: string, content) {
    this.xApi.funcion = 'MPPD_CDatosBasicos'
    this.xApi.parametros = cedula
    this.xApi.valores = ''
    this.apiService.Ejecutar(this.xApi).subscribe(
      (data) => {

        this.data = data.Cuerpo.map(e => {
          e.resoluciones = JSON.parse(e.resoluciones)
          e.entradas = JSON.parse(e.entradas)
          e.componente = this.Componentes.filter(el => { return el.cod_componente == e.componente })[0].nombre_componente
          e.categoria = this.Categorias.filter(el => { return el.cod_categoria == e.categoria })[0].nombre_categoria
          e.clasificacion = this.Clasificaciones.filter(el => { return el.cod_clasificacion == e.clasificacion })[0].des_clasificacion
          e.grado = this.Grados.filter(el => { return el.cod_grado == e.grado })[0].nombres_grado
          return e
        })[0]

        this.ngxService.stopLoader("loader-buscar")
        this.modalService.open(content, { size: 'xl' });

      },
      (error) => {
        console.error("Error de conexion a los datos ", error)
        this.ngxService.stopLoader("loader-buscar")
      }

    )

  }


  MostrarPaginador() {
    this.blBuscar = true
    this.lstPaginas = []
    this.antes = false

    if (this.max_paginador > 10) {
      this.max_paginador = 10
      this.despues = true
    } else {
      this.despues = false
    }
    for (var i = 0; i < this.max_paginador; i++) {
      var color = ''

      if (this.de > 0) {
        color = this.de/10 == i ?  'bg-info text-white' : ''
        this.antes = true
      } 
      if ( this.de == 0 && i == 0) color = 'bg-info text-white'
      this.lstPaginas.push({ 
          "id": i + 1,
          "color": color
      } )
    }
  }
  /**
   * Establecer la posicion del sistema en el buscador
   */
  posicion(pos: number) {
    console.log(pos);
    if (pos != this.actual) {
      this.actual = pos 
      this.de = 10 * (pos - 1)
      this.para = (this.de - 1)+ 10
      this.consultarAPIBuscar()
    }
    
    
  }


}
