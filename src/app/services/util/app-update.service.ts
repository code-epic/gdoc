import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.checkForUpdates();
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event) => {
        console.log('Nueva actualización disponible:', event);
        Swal.fire({
          title: 'Actualización Disponible',
          text: 'Hay una nueva versión de la aplicación. ¿Desea actualizar ahora?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Más tarde',
          confirmButtonColor: '#2dce89',
          cancelButtonColor: '#f5365c'
        }).then((result) => {
          if (result.isConfirmed) {
            this.forceCacheUpdate(true);
          }
        });
      });
    }
  }

  public async forceCacheUpdate(activateSW = false): Promise<void> {
    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (!isLocal) {
        Swal.fire({
          title: 'Actualizando...',
          text: 'Limpiando la caché y reiniciando la aplicación.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }

      // 1. Limpiar la API de Caché del navegador (Cache Storage)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // 2. Limpiar LocalStorage y SessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Activar actualización de service worker si está habilitado y lo indicamos
      if (activateSW && this.swUpdate.isEnabled) {
        try {
          await this.swUpdate.activateUpdate();
        } catch (swErr) {
          console.warn('No se pudo activar la actualización del Service Worker:', swErr);
        }
      }

      if (!isLocal) {
        // Dar tiempo para ver la animación de carga
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Cerrar el modal de carga anterior
        Swal.close();

        // Yield/pausa de 100ms para permitir que la animación de cierre de SweetAlert se complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mostrar éxito antes de recargar
      await Swal.fire({
        title: 'Proceso Exitoso',
        text: 'La caché ha sido limpiada con éxito. La aplicación se reiniciará ahora.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2dce89'
      });

      // 4. Forzar la recarga de la página para obtener los nuevos archivos
      window.location.reload();
    } catch (error) {
      console.error('Error al limpiar la caché:', error);
      window.location.reload(); // Recargar de todos modos en caso de fallo
    }
  }
}
