import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal,NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { Editor } from 'ngx-editor'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import Swal from 'sweetalert2'

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service'
import { IWKFAlerta, IDocumento, IWKFDocumento } from 'src/app/services/control/documentos.service'
import { LoginService } from 'src/app/services/seguridad/login.service'
import { UtilService } from 'src/app/services/util/util.service'


@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})

export class DocumentoComponent implements OnInit, OnDestroy {


  masterSelected:boolean;
  checklist:any;
  checkedList:any;

  closeResult = '';
  

  title = 'Documentos';
  placement = 'bottom';

  lineCountCache :number = 0; 
  editor: Editor = new Editor;
  xeditor: Editor = new Editor;

  public fcreacion : any 
  public forigen : any

  public fcreacionDate : NgbDate | null 
  public forigenDate : NgbDate | null

  public fplazo : any

  public WkDoc : IWKFDocumento = {
    nombre :  '',
    estado : 0,
    estatus : 0,
    workflow : 0,
    observacion :  '',
    usuario :  ''
  }


  public Doc : IDocumento = {
    ncontrol : '',
    wfdocumento : 0,
    fcreacion : '',
    forigen : '',
    norigen : '',
    salida : '',
    tipo : '0',
    remitente : '0',
    unidad : '0',
    contenido : '',
    instrucciones : '',
    codigo : '',
    nexpediente : '',
    creador : '',
    archivo : '',
    privacidad : 0
  } 

  public WAlerta : IWKFAlerta = {
    documento : 0,
    estado : 0,
    estatus : 0,
    activo : 0,
    fecha : '',
    usuario: '',
    observacion : ''   
  }

  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstU = [] //Objeto Unidad


  public xAPI : IAPICore = {
    funcion: ''

  };
  routerDoc : { numc : string }

  constructor(private apiService : ApiService,  
              private modalService: NgbModal, 
              private utilService: UtilService,
              private toastrService: ToastrService,
              private rutaActiva: ActivatedRoute,
              private loginService: LoginService,
              private ngxService: NgxUiLoaderService,
              public formatter: NgbDateParserFormatter,
              private ruta: Router ) {

    
  }
  
  ngOnInit(): void {
    
    this.editor = new Editor()
    this.xeditor = new Editor()
    this.listarConfiguracion()

    if (this.rutaActiva.snapshot.params.id != undefined ) {
      this.consultarDocumento (this.rutaActiva.snapshot.params.id)

    }else{
      this.limpiarDoc()
      
    }

   
    
  }


  listarConfiguracion(){
    this.xAPI.funcion = 'MD_CConfiguracion'
    this.xAPI.parametros = '%'
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        
        data.Cuerpo.forEach(e => {
          switch (e.tipo) {
            case "1":
              this.lstT.push(e) 
              break
            case "2":
              this.lstR.push(e) 
              break
            case "3":
              this.lstU.push(e) 
              break
          }
        });
      },
      error => {
        console.error('Fallo consultando los datos de Configuraciones')
      }
    )
  }



  limpiarDoc(){
    var dia = this.utilService.FechaActual()
    
    this.forigen = ''
    this.fplazo = ''
    this.Doc.ncontrol = ''
    this.Doc.norigen = ''
    this.Doc.contenido = ''
    this.Doc.instrucciones = ''
    this.Doc.nexpediente = ''
    this.Doc.codigo = ''
    this.Doc.salida = ''
    this.Doc.tipo = '0'
    this.Doc.remitente = '0'
    this.Doc.unidad = '0'
    this.Doc.creador = ''
    this.fcreacionDate = NgbDate.from( this.formatter.parse( dia  ))
    this.fcreacion = dia
  }

  consultarDocumento(numControl : string){
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = numControl 
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          this.Doc = e
          this.fcreacionDate = NgbDate.from( this.formatter.parse( this.Doc.fcreacion.substring(0,10) ))
          this.forigenDate = NgbDate.from( this.formatter.parse( this.Doc.forigen.substring(0,10) ))
        });
      },
      (error) => {
        console.error(error)
      }
    )
  }


 
  open(content) {
    this.modalService.open(content);
  }

  //obtenerWorkFlow Permite generar los primeros valores de la red del documento
  obtenerWorkFlow(){
    this.WkDoc = {
      "nombre" : "Control de Gestion",
      "workflow" : 2,
      "estado" : 1,
      "estatus" : 1,
      "observacion" : "Iniciando Documento",
      "usuario" : this.loginService.Usuario.id
    }
    this.xAPI.funcion = 'WKF_IDocumento'
    this.xAPI.valores = JSON.stringify(this.WkDoc)
  }

  //registrar Un documento pasando por el WorkFlow
  registrar(){

    if (this.rutaActiva.snapshot.params.id != undefined ) {
      this.actualizarDocumentos()
      return
    }
    this.ngxService.startLoader("loader-aceptar")
    this.obtenerWorkFlow() //Obtener valores de una API
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.obtenerDatos(data)      
        this.apiService.Ejecutar(this.xAPI).subscribe(
           (xdata)=>{ 
              if (this.fplazo.year != undefined){
                this.obtenerAlertaWorkFlow(xdata)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                  (ydata)=>{
                    console.info(ydata)
                    this.ngxService.stopLoader("loader-aceptar")
                  },
                  (errot)=>{
                   this.toastrService.error(data.msj,`GDoc Wkf.Alerta`)
                   this.ngxService.stopLoader("loader-aceptar")
                 }
               )
              }
              this.aceptar(this.Doc.ncontrol)
              this.limpiarDoc()
           },
           (errot)=>{
            this.toastrService.error(data.msj,`GDoc Wkf.Documento.Detalle`)
            this.ngxService.stopLoader("loader-aceptar")
          }
        )

      }, //En caso de fallar Wkf
      (errot)=>{
        var mensaje = errot + ' - ' + this.xAPI.funcion
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`)
        this.ngxService.stopLoader("loader-aceptar")
          
        
      }
    )


   
  }


  actualizarDocumentos(){
    this.toastrService.error('Pendiente por Desarrollar',`GDoc Wkf.Documento`);
    console.log('Actualizar Documento')
  }


  obtenerDatos(data : any){
    if (data.tipo == 0) {
      var mensaje = data.msj + ' - ' + this.xAPI.funcion
      this.toastrService.error(mensaje,`GDoc Wkf.Documento`);
      return false
    }
    this.xAPI.funcion = 'WKF_IDocumentoDetalle'
    this.Doc.ncontrol = this.utilService.Semillero(data.msj)
    this.Doc.wfdocumento = parseInt(data.msj)
    this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion)
    this.Doc.forigen = this.utilService.ConvertirFecha(this.forigen)
    this.Doc.creador = this.loginService.Usuario.id

    this.xAPI.valores = JSON.stringify(this.Doc)
  }

  obtenerAlertaWorkFlow(data : any){
    if (data.tipo == 0) {
      this.toastrService.error(data.msj ,`GDoc Wkf.Alerta`);
      return false
    }
    this.WAlerta.activo = 1
    this.WAlerta.documento = this.Doc.wfdocumento
    this.WAlerta.estado = this.WkDoc.estado
    this.WAlerta.estatus = this.WkDoc.estatus
    this.WAlerta.usuario = this.WkDoc.usuario
    this.WAlerta.fecha = this.utilService.ConvertirFecha(this.fplazo)
    this.xAPI.funcion = 'WKF_IAlerta'
    this.xAPI.valores = JSON.stringify(this.WAlerta)
  }

  protected aceptar(msj : string){
    Swal.fire({
      title: 'El Documento Registrado es # ' + msj,
      text: "¿Desea registar otro documento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        
      }else{
        this.ruta.navigate( ['/registrar'] );
      }
    })    
  }  
  
  
  ngOnDestroy(): void {
    this.editor.destroy()
    this.xeditor.destroy()
  }


}

