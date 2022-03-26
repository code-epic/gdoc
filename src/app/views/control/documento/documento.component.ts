import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';

import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { IDocumento } from 'src/app/services/control/documentos.service';
import { UtilService } from 'src/app/services/util/util.service';



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

  public fcreacion : ''
  public forigen : ''

  public Doc : IDocumento = {
    ncontrol : '',
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
  } 



  public xAPI : IAPICore = {
    funcion: ''

  };

  constructor(private apiService: ApiService, private utilService : UtilService) {
    
    this.xAPI.funcion = 'IDocumento'
    

  }

  registrar(){

    this.xAPI.funcion = 'IDocumento'
    this.Doc.fcreacion = this.utilService.ConvertirFecha(this.fcreacion)
    this.Doc.forigen = this.utilService.ConvertirFecha(this.forigen)
    this.xAPI.valores = JSON.stringify(this.Doc)

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

