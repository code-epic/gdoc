import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlComponent } from './control.component';
import { BuzonComponent } from './buzon/buzon.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DocumentoComponent } from './documento/documento.component';
import { PendientesComponent } from './pendientes/pendientes.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { SalidasComponent } from './salidas/salidas.component';

const routes: Routes = [
  {
    path: '',
    component: ControlComponent
  },
  {
    path: 'buzon',
    component : BuzonComponent
  },
  {
    path: 'configuracion',
    component : ConfiguracionComponent
  },
  {
    path: 'documento',
    component : DocumentoComponent
  },
  {
    path: 'pendientes',
    component : PendientesComponent
  },
  {
    path: 'registrar',
    component : RegistrarComponent
  },
  {
    path: 'salidas',
    component : SalidasComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
