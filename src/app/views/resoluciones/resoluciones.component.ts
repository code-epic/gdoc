import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { Resolucion } from 'src/app/services/control/documentos.service';
import { ResolucionService } from 'src/app/services/resoluciones/resolucion.service';
import { LoginService } from 'src/app/services/seguridad/login.service';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html',
  styleUrls: ['./resoluciones.component.scss']
})
export class ResolucionesComponent implements OnInit {

  public focus: boolean = true
  public buscar: string = ''
  lst = []
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public cantidad : number = 0
  public xApi: IAPICore = {
    funcion: '',
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
  public data : any
  public ref : any
  public tipo : any

  public SubMenu = []
  public Componentes: any
  public Grados: any
  public Categorias: any
  public Clasificaciones: any
  public TipoEntradas: any
  public TipoResoluciones: any
  public Estados: any

  constructor(private apiService: ApiService,
    private resolucionService: ResolucionService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    public loginService: LoginService,
    private ngxService: NgxUiLoaderService,
    public ruta: Router) { }

  async ngOnInit() {
    await this.loginService.Iniciar()
    this.SubMenu = await this.loginService.obtenerSubMenu(this.ruta.url)
    if (sessionStorage.getItem("MPPD_CTipoEntrada") == undefined) {
      for (var i = 0; i < 9; i++) {

        this.resolucionService.Listar(i) //
      }
    }
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
      if ( this.buscar == '') return false
      this.ngxService.startLoader("loader-buscar")
      this.xApi.funcion = "MPPD_CGeneral"
      this.xApi.parametros = this.buscar + ',0,9'
      this.cantidad = 0
      this.contador_ponderacion = 0
      this.lst = []
      this.apiService.Ejecutar(this.xApi).subscribe(
        (data) => {
          
          
          if ( data.Cuerpo.length != undefined) {
            this.lst = data.Cuerpo.map(e => {
              e.meta = JSON.parse(e.meta)
              return e
            })
            this.cantidad = this.lst[0].cantidad;
            console.log(this.lst)
          }
          
          this.ngxService.stopLoader("loader-buscar")
          this.buscar = ""
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
        }
      )
    }
  }


  open(content){
    this.modalService.open(content, { size: 'lg' });
  }


  AgregarView(score, id, content, cedula, referencia, tipo){
    this.ngxService.startLoader("loader-buscar")
    this.xApi.funcion = "MPPD_UFulltext"
    
    var ponderacion = ( score - this.contador_ponderacion )
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
  consultarCedula(cedula : string, content) {
      this.xApi.funcion = 'MPPD_CDatosBasicos'
      this.xApi.parametros = cedula
      this.xApi.valores = ''
      this.apiService.Ejecutar(this.xApi).subscribe(
        (data) => {
          
          this.data = data.Cuerpo.map( e =>{
            e.resoluciones = JSON.parse(e.resoluciones)
            e.entradas = JSON.parse(e.entradas)
            e.componente = this.Componentes.filter(el => {return el.cod_componente ==  e.componente })[0].nombre_componente
            e.categoria = this.Categorias.filter(el => {return el.cod_categoria ==  e.categoria })[0].nombre_categoria
            e.clasificacion = this.Clasificaciones.filter(el => {return el.cod_clasificacion ==  e.clasificacion })[0].des_clasificacion
            e.grado = this.Grados.filter(el => {return el.cod_grado ==  e.grado })[0].nombres_grado
            return e
          } )[0]
         
          this.ngxService.stopLoader("loader-buscar")
          this.modalService.open(content, { size: 'xl' });
          
        },
        (error) => {
          console.error("Error de conexion a los datos ", error)
          this.ngxService.stopLoader("loader-buscar")
        }
  
      )
  
    }

}
