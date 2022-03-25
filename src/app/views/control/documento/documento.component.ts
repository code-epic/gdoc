import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';

import { ApiService, IAPICore, ceDocumento } from 'src/app/services/apicore/api.service';
import { IDocumento } from 'src/app/services/control/documentos.service';



@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})

export class DocumentoComponent implements OnInit, OnDestroy {

  title = 'Documentos';
  fechaCreacion : NgbDateStruct;
  fechaOrigen : NgbDateStruct;
  placement = 'bottom';

  lineCountCache :number = 0; 
  editor: Editor = new Editor;
  xeditor: Editor = new Editor;

  public Doc : IDocumento = {
    id : '',
    ncontrol : '',
    fcreacion : '',
    salida : '',
    forigen : '',
    norigen : '',
    tipo : '',
    remitente : '',
    unidad : '',
    contenido : '',
    instrucciones : '',
    codigo : '',
    nexpediente : ''    
  } 

  public xDoc : ceDocumento = {
    id: ''
  };



  public xAPI : IAPICore = {
    funcion: ''

  };

  constructor(private apiService: ApiService) {
    
    this.xAPI.funcion = 'IDocumento'
    

  }

  registrar(){

    this.xAPI.funcion = 'IDocumento'
    this.xAPI.coleccion = 'documento'
    this.xAPI.valores = this.Doc

   
     
    this.apiService.Ejecutar(this.xAPI).subscribe(
       (data)=>{
        console.log(data)
        
         //this.toastrService.success(
        //    'Tu (API) ha sido registrada codigo: ' + data.InsertedID,
        //    `Code-Epic ESB`
        //  );
        // this.ngxService.stopLoader("loader-registrar")
        // this.ngWizardService.reset();
 
       },
       (errot)=>{
       //  this.ngxService.stopLoader("loader-registrar")
        //  this.toastrService.error(
        //    'Fallo la conexión, con el API',
        //    `Code-Epic ESB`
        //  );
         
       }
     )
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.xeditor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.xeditor.destroy();
  }
  

}

