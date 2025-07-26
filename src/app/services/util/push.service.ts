// src/app/services/push.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { SwPush } from '@angular/service-worker'; // Importa SwPush
import { Observable, from, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private readonly API_BASE_URL = '/v1/api/sdrwpush'; // O la URL de tu backend Go

  constructor(private http: HttpClient, private swPush: SwPush) { }


  async requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Usuario denegó permisos');
      return;
    }
    console.log('Permiso concedido');
  }

  // Obtener la clave pública VAPID de tu backend Go
  getVapidPublicKey(): Promise<string> {
    return this.http.get(`${this.API_BASE_URL}/vapid-public-key`, { responseType: 'text' }).toPromise();
  }

  // Suscribir al usuario a las notificaciones push
  subscribeToPush(userId: string): Observable<any> {
    return from(this.getVapidPublicKey()).pipe(
      tap(vapidPublicKey => console.log('Clave pública VAPID obtenida:', vapidPublicKey)),
      switchMap(vapidPublicKey => from(this.swPush.requestSubscription({
        serverPublicKey: vapidPublicKey
      }))),
      switchMap(subscription => this.http.post(`${this.API_BASE_URL}/subscribe`, { userId, subscription })),
      catchError(err => {
        console.error('Error al suscribirse a push:', err);
        return throwError(() => err);
      })
    );
  }

  // Manejar la recepción de notificaciones push
  listenForPushNotifications() {
    this.swPush.messages.subscribe(message => {
      console.log('Notificación push recibida:', message);
    });

    this.swPush.notificationClicks.subscribe(event => {
      console.log('Clic en notificación:', event);
      if (event.notification.data && event.notification.data.url) {
        window.open(event.notification.data.url, '_blank');
      }
    });




    
  }


  sendTestNotification() {
    this.http.post(`${this.API_BASE_URL}/send-notification`, {}).toPromise()
      .then(res => console.log('Notificación de prueba enviada:', res))
      .catch(err => console.error('Error al enviar notificación de prueba:', err));
  }
} 