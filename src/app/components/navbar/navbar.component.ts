import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { LoginService } from 'src/app/services/seguridad/login.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  public nombre : string = 'Analista'

  constructor(location: Location,  
    private element: ElementRef, 
    private router: Router,
    private modalService: NgbModal,
    private loginService : LoginService ) {
    this.location = location;
  }

  ngOnInit() {
    
    this.nombre = this.loginService.Usuario.nombre

    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }

  open(content) {
    this.modalService.open(content);
  } 

  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }
   
    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Principal';
  }

  cerrar(){
    
    Swal.fire({
      title: 'Salir del Sistema',
      text: "¿Está seguro que desea salir?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desconectarme!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear()
        window.location.href = './';
      }
    })    
  }

}
