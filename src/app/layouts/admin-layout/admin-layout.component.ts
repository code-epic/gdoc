import { Component, OnInit } from '@angular/core';
import {InactiveUserService} from '../../core/service/inactivity/inactive-user.service';
import { PushService } from 'src/app/services/util/push.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isInactive = false;
  public activar = false;
  public opened = true;
  public events: string[] = [];
    // title = 'my-angular-pwa';
    isPushEnabled = false; // Estado para el botón

  constructor(
    private inactiveUserService: InactiveUserService, 
    private pushService: PushService, 
    private swPush: SwPush) { }

  ngOnInit() {
    this.pushService.requestPermission();
    // Escuchar notificaciones tan pronto como la app se inicie
    this.pushService.listenForPushNotifications();
    console.log('Escuchando notificaciones push...')

    // Comprobar si las notificaciones push están soportadas y si ya hay una suscripción
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe(subscription => {
        this.isPushEnabled = !!subscription; // True si hay suscripción, False si no
        console.log('Estado de suscripción push:', subscription ? 'Activa' : 'Inactiva')
       
      });
      
    } 

    this.inactiveUserService.userInactive.subscribe(isInactive => this.isInactive = isInactive);
  }

  reset() {
    this.isInactive = false;
    this.inactiveUserService.reset();
  }

  onChangeSidenav(event: boolean) {
    this.opened = !this.opened;
  }

}
