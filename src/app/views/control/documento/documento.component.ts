import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IDocumento } from 'src/app/services/control/documentos.service';
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
  fechaCreacion : NgbDateStruct;
  fechaOrigen : NgbDateStruct;
  placement = 'bottom';

  lineCountCache :number = 0; 
  editor: Editor = new Editor;
  xeditor: Editor = new Editor;

  public fcreacion : ''
  public forigen : ''

  public Doc : IDocumento = {
    ncontrol : '',
    wfdocumento : 0,
    fcreacion : '',
    forigen : '',
    norigen : '',
    salida : '',
    tipo : '',
    remitente : '',
    unidad : '',
    contenido : '',
    instrucciones : '',
    codigo : '',
    nexpediente : '',
    creador : '',
  } 

  public lstT = [] //Objeto Tipo documento
  public lstR = [] //Objeto Remitente
  public lstU = [] //Objeto Unidad


  public xAPI : IAPICore = {
    funcion: ''

  };

  constructor(private apiService : ApiService,  
              private modalService: NgbModal, 
              private utilService: UtilService,
              private toastrService: ToastrService,
              private ruta: Router) {

    
  }

  open(content) {
    this.modalService.open(content);
    
  }

  
  registrar(){
    var WkDoc = {
      "nombre" : "Control de Gestion",
      "estado" : 1,
      "estatus" : 1,
      "observacion" : "Iniciando Documento",
      "usuario" : "Sistema"
    }
    this.xAPI.funcion = 'WKF_IDocumento'
    this.xAPI.valores = JSON.stringify(WkDoc)

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data)=>{
        console.log(data)
        if (data.tipo == 0) {
          this.toastrService.error(data.msj,`Code-Epic Wkf`);
          return false
        }

        this.xAPI.funcion = 'WKF_IDocumentoDetalle'
        this.Doc.ncontrol = this.utilService.Semillero(data.msj)
        this.Doc.wfdocumento = parseInt(data.msj)
        this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion)
        this.Doc.forigen = this.utilService.ConvertirFecha(this.forigen)

        this.xAPI.valores = JSON.stringify(this.Doc)
    
        this.apiService.Ejecutar(this.xAPI).subscribe(
           (data)=>{                     
              this.aceptar(this.Doc.ncontrol)
              this.limpiarDoc()
           },
           (errot)=>{
            this.toastrService.error(data.msj,`Code-Epic GDoc`);
          }
        )

      }, //En caso de fallar Wkf
      (errot)=>{
        this.toastrService.error(errot,`Code-Epic Wkf`);
          
        
      }
    )


   
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.xeditor = new Editor();
    this.listarConfiguracion()
  }


  

  limpiarDoc(){
    this.fcreacion = ''
    this.forigen = ''
    this.Doc.ncontrol = ''
    this.Doc.norigen = ''
    this.Doc.contenido = ''
    this.Doc.instrucciones = ''
    this.Doc.nexpediente = ''
    this.Doc.codigo = ''
    this.Doc.salida = ''
    this.Doc.tipo = ''
    this.Doc.remitente = ''
    this.Doc.unidad = ''
    

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
      title: 'Documento registrado #: ' + msj,
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

