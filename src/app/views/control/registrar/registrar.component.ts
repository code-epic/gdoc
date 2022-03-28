import { Component, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public paginador = 10
  public focus;
  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia : false,
    protocolo: '',
    ruta : '',
    version: '',
    retorna : false,
    migrar : false,
    http : 0,
    https : 0,
    consumidores : '',
    puertohttp : 0,
    puertohttps : 0,
    driver : '',
    query : '',
    metodo : '',
    tipo : '',
    prioridad : '',
    entorno: '',
    logs : false,
    cache: 0,
    estatus: false
  };

  selNav = 0
  oficinas = []
  lst = []

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  masterSelected:boolean;
  checklist:any;
  checkedList:any;


  constructor(private apiService: ApiService, config: NgbModalConfig, private modalService: NgbModal) { 

     // customize default values of modals used by this component tree
     config.backdrop = 'static';
     config.keyboard = false;
  }

 
  open(content) {
    this.modalService.open(content);
    
  }

  
  ngOnInit(): void {
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

  pageChangeEvent(e){
    console.log(e)
    this.recorrerElementos(e.pageIndex+1, this.lst)
  }


  ConsultarOficinas(e){

    this.selNav = e
    this.seleccionNavegacion()
    
    if (this.xAPI.funcion == '') return false;
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lst = data //Registros recorridos como elementos
        this.lengthOfi = data.length
        this.recorrerElementos(1, data)
      },
      (error) => { console.log(error) }
    )
  }


  seleccionNavegacion(){
    switch (this.selNav) {
      case 0:
        this.xAPI.funcion = ''
        break;
      case 1:
        this.xAPI.funcion = 'ConsultarOficinas'
        break;
      case 2:
        this.xAPI.funcion = ''
        break;
      case 3:
        this.xAPI.funcion = ''
        break;
    
      default:
        break;
    }
  }

  //recorrerElementos para paginar listados
  recorrerElementos(posicion : number, lst : any){
    if (posicion > 1) posicion = posicion * 10
    this.oficinas = lst.slice(posicion, posicion + this.pageSizeOfi)
    
    
    console.info(this.oficinas)


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

