import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Principal',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/control', title: 'Control y Gestión',  icon:'ni-planet text-blue', class: '' },
    { path: '/secretaria', title: 'Secretaría',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/resoluciones', title: 'Resoluciones',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/ayudantia', title: 'Ayudantía',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/timonel', title: 'Timonel',  icon:'ni-key-25 text-info', class: '' },
    { path: '/acami', title: 'Acami',  icon:'ni-circle-08 text-pink', class: '' },
    { path: '/personal', title: 'Personal',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
