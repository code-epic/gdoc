import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitantesComponent } from './visitantes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VisitantedocumentoComponent } from './visitantedocumento/visitantedocumento.component';

const routes: Routes = [
  {
    path: '',
    component: VisitantesComponent
  },
  {
    path: 'configuracion',
    component : ConfiguracionComponent
  },
  {
    path: 'visitantedocumento',
    component : VisitantedocumentoComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
