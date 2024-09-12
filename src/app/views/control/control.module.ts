import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlComponent } from './control.component';
import { BuzonComponent } from './buzon/buzon.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DocumentoComponent } from './documento/documento.component';
import { PendientesComponent } from './pendientes/pendientes.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { SalidasComponent } from './salidas/salidas.component';
import { ControlRoutingModule } from './control-routing.module';
import { CtrlestadisticasComponent } from './ctrlestadisticas/ctrlestadisticas.component';
import { CtrlreporteComponent } from './ctrlreporte/ctrlreporte.component';
import { CtrlalertasComponent } from './ctrlalertas/ctrlalertas.component';
import { DatosbasicosComponent } from './datosbasicos/datosbasicos.component';



@NgModule({
  declarations: [
    ControlComponent,
    BuzonComponent,
    ConfiguracionComponent,
    DocumentoComponent,
    PendientesComponent,
    RegistrarComponent,
    SalidasComponent,
    CtrlestadisticasComponent,
    CtrlreporteComponent,
    CtrlalertasComponent,
    DatosbasicosComponent,
    
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule
  ]
})
export class ControlModule { }
