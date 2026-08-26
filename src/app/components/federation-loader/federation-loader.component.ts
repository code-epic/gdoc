import { Component, Input } from '@angular/core';

export interface LoaderStep {
  key: string;
  label: string;
  status: 'pending' | 'in-progress' | 'done' | 'error';
}

@Component({
  selector: 'app-federation-loader',
  templateUrl: './federation-loader.component.html',
  styleUrls: ['./federation-loader.component.scss']
})
export class FederationLoaderComponent {
  @Input() show: boolean = false;
  @Input() steps: LoaderStep[] = [
    { key: 'MAIN_CONN', label: 'Estableciendo conexión principal', status: 'pending' },
    { key: 'SECURE_NODES', label: 'Cargando nodos seguros', status: 'pending' },
    { key: 'FEDERATION', label: 'Estableciendo conexión federada', status: 'pending' },
    { key: 'PREPARE', label: 'Preparando experiencia segura', status: 'pending' }
  ];
  @Input() texto: string = 'Autenticando credenciales y federando nodos';
  @Input() isError: boolean = false;
  @Input() isComplete: boolean = false;

  getStepClass(status: string): string {
    switch (status) {
      case 'pending': return 'pending';
      case 'in-progress': return 'in-progress';
      case 'done': return 'done';
      case 'error': return 'error';
      default: return '';
    }
  }

  getIconClass(status: string): string {
    switch (status) {
      case 'pending': return 'fa fa-circle-thin';
      case 'in-progress': return 'fa fa-circle-o-notch fa-spin';
      case 'done': return 'fa fa-check';
      case 'error': return 'fa fa-times-circle';
      default: return '';
    }
  }

  getTextClass(status: string): string {
    switch (status) {
      case 'pending': return 'text-muted';
      case 'in-progress': return 'text-primary font-weight-bold';
      case 'done': return 'text-success font-weight-bold';
      case 'error': return 'text-danger font-weight-bold';
      default: return '';
    }
  }

  getHeaderIconClass(): string {
    if (this.isError) {
      return 'fa fa-times-circle bounce-icon fa-4x text-danger';
    }
    if (this.isComplete) {
      return 'fa fa-check-circle bounce-icon fa-4x text-success';
    }
    return 'fa fa-key pulse-icon fa-4x text-primary';
  }
}
