import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GDoc MPPD';
  updateAvailable = false;

  constructor(private swUpdate: SwUpdate) { }

  ngOnInit() {
    // Si las notificaciones de Service Worker están habilitadas
    if (this.swUpdate.isEnabled) {
      // Nos suscribimos para saber si hay una actualización lista
      this.swUpdate.available.subscribe(event => {
        console.log('Nueva actualización disponible:', event);
        this.updateAvailable = true;
      });

      // Forzar una revisión al iniciar la aplicación
      this.swUpdate.checkForUpdate().then(() => {
        console.log('Revisión de actualización completada.');
      }).catch(err => {
        console.error('Error revisando actualizaciones:', err);
      });
    }
  }

  reloadPage() {
    this.swUpdate.activateUpdate().then(() => {
      document.location.reload();
    });
  }
}
