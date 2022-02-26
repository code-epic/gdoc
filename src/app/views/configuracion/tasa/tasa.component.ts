import { Component, OnInit,  QueryList, ViewChildren } from '@angular/core';
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';

import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';

import {Country} from './country';
import {CountryService} from './country.service';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';
import { COUNTRIES } from './countries';

import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-tasa',
  templateUrl: './tasa.component.html',
  styleUrls: ['./tasa.component.scss'],
  providers: [NgbNavConfig, CountryService, DecimalPipe]
})

export class TasaComponent implements OnInit {
  countries$: Observable<Country[]>;
  total$: Observable<number>;
  llenado: Country[];
  public id : number;
  public tipo : string;
  public descripcion : string;
  

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(config: NgbNavConfig, public service: CountryService, private router: Router, private activatedRoute: ActivatedRoute) {
    // customize default values of navs used by this component tree    
    config.destroyOnHide = false;
    config.roles = false;
    this.countries$ = service.countries$;
    this.total$ = service.total$;
   
  }


  ngOnInit(): void {
      
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  Guardar(){    
      COUNTRIES.push({id: this.id, tipo: this.tipo , descripcion:this.descripcion});
      console.log([this.router.url]);   
  }
 
}
