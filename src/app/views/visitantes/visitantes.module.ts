import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { VisitantesComponent } from './visitantes.component';
import { BuzonComponent } from './buzon/buzon.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VisitantedocumentoComponent } from './visitantedocumento/visitantedocumento.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { ControlRoutingModule } from './visitantes-routing.module';
import { DatosbasicosComponent } from './datosbasicos/datosbasicos.component';



@NgModule({
  declarations: [
    VisitantesComponent,
    BuzonComponent,
    ConfiguracionComponent,
    VisitantedocumentoComponent,
    RegistrarComponent,
    DatosbasicosComponent,
    
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule
  ]
})
export class ControlModule { }
