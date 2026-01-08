// src/app/services/push.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Observable, from, throwError, Subject } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/**
 * Define la estructura esperada para el payload de una notificación push.
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  vibrate?: number[];
  data?: any;
}

/**
 * Define la estructura del evento de clic en una notificación.
 */
export interface NotificationEventPayload {
  action: string;
  notification: NotificationOptions & {
    title: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private readonly API_BASE_URL = `${environment.API}/wpush`;

  private messagesSubject = new Subject<PushNotificationPayload>();
  private notificationClicksSubject = new Subject<NotificationEventPayload>();

  /**
   * Observable para suscribirse a los mensajes push recibidos.
   */
  public readonly messages$ = this.messagesSubject.asObservable();

  /**
   * Observable para suscribirse a los clics en notificaciones.
   */
  public readonly notificationClicks$ = this.notificationClicksSubject.asObservable();

  constructor(private http: HttpClient, private swPush: SwPush) { }

  /**
   * Solicita permiso al usuario para recibir notificaciones push.
   * @returns Un Observable que emite `true` si el permiso es concedido, `false` en caso contrario.
   */
  requestPermission(): Observable<boolean> {
    return from(Notification.requestPermission()).pipe(
      map(permission => {
        if (permission === 'granted') {
          console.log('Permiso de notificación concedido.');
          this.listenForPushNotifications(); // Iniciar la escucha una vez que se concede el permiso
          return true;
        }
        console.warn('El usuario denegó los permisos de notificación.');
        return false;
      }),
      catchError(err => {
        console.error('Error al solicitar permiso de notificación:', err);
        return throwError(() => new Error('Error al solicitar permiso de notificación.'));
      })
    );
  }

  /**
   * Obtiene la clave pública VAPID desde el backend.
   * @returns Un Observable que emite la clave pública VAPID como una cadena.
   */
  getVapidPublicKey(): Observable<string> {
    return this.http.get(`${this.API_BASE_URL}/vpk`, { responseType: 'text' });
  }

  /**
   * Suscribe al usuario a las notificaciones push y envía la suscripción al backend.
   * @param userId - El ID del usuario para asociar con la suscripción.
   * @returns Un Observable con la respuesta del servidor.
   */
  subscribeToPush(userId: string): Observable<any> {
    if (!this.swPush.isEnabled) {
      console.error('Service Worker no está habilitado. Las notificaciones push no funcionarán.');
      return throwError(() => new Error('Service Worker no habilitado.'));
    }
    return this.getVapidPublicKey().pipe(
      tap(vapidPublicKey => console.log('Clave pública VAPID obtenida:', vapidPublicKey)),
      switchMap(vapidPublicKey => from(this.swPush.requestSubscription({
        serverPublicKey: vapidPublicKey
      }))),
      switchMap(subscription => this.http.post(`${this.API_BASE_URL}/subscribe`, { userId, subscription })),
      catchError(err => {
        console.error('Error al suscribirse a las notificaciones push:', err);
        return throwError(() => new Error('No se pudo completar la suscripción a las notificaciones push.'));
      })
    );
  }

  /**
   * Envía una notificación de prueba al backend para el usuario actual.
   * @returns Un Observable con la respuesta del servidor.
   */
  sendTestNotification(): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/send`, {}).pipe(
      tap(res => console.log('Notificación de prueba enviada:', res)),
      catchError(err => {
        console.error('Error al enviar notificación de prueba:', err);
        return throwError(() => new Error('Error al enviar notificación de prueba.'));
      })
    );
  }

  /**
   * Inicia la escucha de notificaciones push y clics en notificaciones.
   * Emite los eventos a través de los observables públicos `messages$` y `notificationClicks$`.
   * Este método es privado y se llama internamente cuando se conceden los permisos.
   */
  private listenForPushNotifications(): void {
    this.swPush.messages.subscribe(message => {
      console.log('Notificación push recibida:', message);
      this.messagesSubject.next(message as PushNotificationPayload);
    });

    this.swPush.notificationClicks.subscribe(event => {
      console.log('Clic en notificación:', event);
      this.notificationClicksSubject.next(event as NotificationEventPayload);
    });
  }
}