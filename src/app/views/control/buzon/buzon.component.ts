import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-buzon',
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent implements OnInit {


  masterSelected:boolean;
  checklist:any;
  checkedList:any;

  constructor(config: NgbModalConfig, private modalService: NgbModal){
     // customize default values of modals used by this component tree
     config.backdrop = 'static';
     config.keyboard = false;

  }

  open(content) {
    this.modalService.open(content);
    
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


}


