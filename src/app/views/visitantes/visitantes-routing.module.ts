import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitantesComponent } from './visitantes.component';
import { BuzonComponent } from './buzon/buzon.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VisitantedocumentoComponent } from './visitantedocumento/visitantedocumento.component';
import { RegistrarComponent } from './registrar/registrar.component';

const routes: Routes = [
  {
    path: '',
    component: VisitantesComponent
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
    path: 'visitantedocumento',
    component : VisitantedocumentoComponent
  },
  {
    path: 'registrar',
    component : RegistrarComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
