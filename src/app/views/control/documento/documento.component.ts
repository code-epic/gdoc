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

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  open(content) {
    this.modalService.open(content);
    
  }

  registrar(){

    this.xAPI.funcion = 'IDocumento'
    this.xAPI.coleccion = 'documento'
    this.xAPI.valores = this.Doc

   
     
    // this.apiService.Ejecutar(this.xAPI).subscribe(
    //    (data)=>{
    //     console.log(data)
        
    //      //this.toastrService.success(
    //     //    'Tu (API) ha sido registrada codigo: ' + data.InsertedID,
    //     //    `Code-Epic ESB`
    //     //  );
    //     // this.ngxService.stopLoader("loader-registrar")
    //     // this.ngWizardService.reset();
 
    //    },
    //    (errot)=>{
    //    //  this.ngxService.stopLoader("loader-registrar")
    //     //  this.toastrService.error(
    //     //    'Fallo la conexión, con el API',
    //     //    `Code-Epic ESB`
    //     //  );
         
    //    }
    //  )
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.xeditor = new Editor();
    this.masterSelected = false;
    this.checklist = [
      {id:1,value:'CG-00001  ',isSelected:false},
      // {id:2,value:'Caden Kunze',isSelected:false},
      // {id:3,value:'Ms. Hortense Zulauf',isSelected:true},
      // {id:4,value:'Grady Reichert',isSelected:true},
      // {id:5,value:'Dejon Olson',isSelected:true},
      // {id:6,value:'Jamir Pfannerstill',isSelected:false},
      // {id:7,value:'Aracely Renner DVM',isSelected:false},
      // {id:8,value:'Genoveva Luettgen',isSelected:false}
    ];
    this.getCheckedItemList();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.xeditor.destroy();
  }


  // The master checkbox will check/ uncheck all items
 checkUncheckAll() {
  for (var i = 0; i < this.checklist.length; i++) {
    this.checklist[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
}

// Check All Checkbox Checked
isAllSelected() {
  this.masterSelected = this.checklist.every(function(item:any) {
      return item.isSelected == true;
    })
  this.getCheckedItemList();
}

// Get List of Checked Items
getCheckedItemList(){
  this.checkedList = [];
  for (var i = 0; i < this.checklist.length; i++) {
    if(this.checklist[i].isSelected)
    this.checkedList.push(this.checklist[i]);
  }
  this.checkedList = JSON.stringify(this.checkedList);
}
  

}

