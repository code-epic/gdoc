import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IWKFAlerta, IDocumento, IWKFDocumento } from 'src/app/services/control/documentos.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2'


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

  public fcreacion : ''
  public forigen : ''
  public fplazo : any

  public WkDoc : IWKFDocumento = {
    nombre :  '',
    estado : 0,
    estatus : 0,
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
              private ruta: Router) {

    
  }
  
  ngOnInit(): void {
     
    if (this.rutaActiva.snapshot.params.id != undefined ) {
      this.consultarDocumento (this.rutaActiva.snapshot.params.id)
    }
    // this.coche = {

    // }
    this.editor = new Editor();
    this.xeditor = new Editor();
    this.listarConfiguracion()
    this.limpiarDoc()
  }

  consultarDocumento(numControl : string){
    this.xAPI.funcion = 'WKF_CDocumentoDetalle'
    this.xAPI.parametros = numControl 
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        data.Cuerpo.forEach(e => {
          console.log(e)
          this.Doc = e
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
      "estado" : 1,
      "estatus" : 1,
      "observacion" : "Iniciando Documento",
      "usuario" : "Sistema"
    }
    this.xAPI.funcion = 'WKF_IDocumento'
    this.xAPI.valores = JSON.stringify(this.WkDoc)
  }

  //registrar Un documento pasando por el WorkFlow
  registrar(){
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
                  },
                  (errot)=>{
                   this.toastrService.error(data.msj,`GDoc Wkf.Alerta`);
                 }
               )
              }
              this.aceptar(this.Doc.ncontrol)
              this.limpiarDoc()
           },
           (errot)=>{
            this.toastrService.error(data.msj,`GDoc Wkf.Documento.Detalle`);
          }
        )

      }, //En caso de fallar Wkf
      (errot)=>{
        var mensaje = errot + ' - ' + this.xAPI.funcion
        this.toastrService.error(mensaje, `GDoc Wkf.Documento`);
          
        
      }
    )


   
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



  

  limpiarDoc(){
    this.fcreacion = ''
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
    

  }

  listarConfiguracion(){
    this.xAPI.funcion = 'MD_CConfiguracion'
    this.xAPI.parametros = '%'
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.info(data)
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
  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.xeditor.destroy();
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


}

