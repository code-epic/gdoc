import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';


@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})

export class DocumentoComponent implements AfterViewInit {

    title = 'Documentos';
    fechaCreacion : NgbDateStruct;
    fechaOrigen : NgbDateStruct;
    placement = 'bottom';

    lineCountCache :number = 0; 
    editor: Editor = new Editor;
    html: string = '';

  @ViewChild('codeEditor', { static: false })
  public codeEditor!: ElementRef;

  @ViewChild('lineCounter', { static: false })
  public lineCounter!: ElementRef;


  ngAfterViewInit() {
    var lineCount = this.codeEditor.nativeElement.value.split('\n').length; 
    var outarr = new Array(); 
      if (this.lineCountCache != lineCount) { 
         for (var x = 0; x < lineCount; x++) { 
            outarr[x] = (x + 1) + '.'; 
         } 
         this.lineCounter.nativeElement.value = outarr.join('\n'); 
      } 
      this.lineCountCache = lineCount;
      console.log(" Prueba => ", this.lineCountCache)
  }  

  counLine():void{
    this.colortexto();
    var lineCount = this.codeEditor.nativeElement.value.split('\n').length; 
    var outarr = new Array(); 
      if (this.lineCountCache != lineCount) { 
         for (var x = 0; x < lineCount; x++) { 
            outarr[x] = (x + 1) + '.'; 
         } 
         this.lineCounter.nativeElement.value = outarr.join('\n'); 
      } 
      this.lineCountCache = lineCount;
  }

  colortexto():void{
   var  texto : string = this.codeEditor.nativeElement.value;
   var arr :any = texto.split("@import");
   var respuesta : any =arr[0]; 
   
    console.log("esperando Color", respuesta);
  }

 
  ngOnInit(): void {
    this.editor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  

}

