import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { PushService } from 'src/app/services/util/push.service';
import { UtilService } from 'src/app/services/util/util.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private utilService: UtilService,
    private router: Router, 
    private loginService: LoginService, 
    private pushService: PushService) { 

  }

  async ngOnInit() {

    // console.log('ENtrando en el menu')
    
    if (ROUTES.length == 0){
      await this.loginService.Iniciar()
      var App = this.loginService.Aplicacion
      
      App.Rol.Menu.forEach(e => {
        ROUTES.push({
          path : e.url,
          title: e.nombre,
          icon : e.icono,
          class : e.clase
        })
      });
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);    
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

 


  subscribe() {
    this.pushService.subscribeToPush(this.utilService.uuidv4()).subscribe({
      next: (data) => {
        console.log('Suscripción exitosa', data);
      },
      error: (err) => {
        console.error('Error al suscribirse a push:', err);
      }
    });
  }
}
