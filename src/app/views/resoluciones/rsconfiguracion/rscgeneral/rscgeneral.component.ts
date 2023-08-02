import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rscgeneral',
  templateUrl: './rscgeneral.component.html',
  styleUrls: ['./rscgeneral.component.scss']
})
export class RscgeneralComponent implements OnInit {


  selected = new FormControl(0);
  constructor() { }

  ngOnInit(): void {
  }

}
