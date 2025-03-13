import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { VisitantesComponent } from './visitantes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VisitantedocumentoComponent } from './visitantedocumento/visitantedocumento.component';
import { ControlRoutingModule } from './visitantes-routing.module';
import { DatosbasicosComponent } from './datosbasicos/datosbasicos.component';



@NgModule({
  declarations: [
    VisitantesComponent,
    ConfiguracionComponent,
    VisitantedocumentoComponent,
    DatosbasicosComponent,
    
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule
  ]
})
export class ControlModule { }
