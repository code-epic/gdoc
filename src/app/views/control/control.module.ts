import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

// Tinder Documents Components
import { TinderDocumentsComponent } from './tinder-documents/tinder-documents.component';
import { CanvasLetterComponent } from './tinder-documents/components/canvas-letter/canvas-letter.component';
import { TemplateRadiogramaComponent } from './tinder-documents/components/template-radiograma/template-radiograma.component';
import { TemplateNormalComponent } from './tinder-documents/components/template-normal/template-normal.component';
import { WorkflowPanelComponent } from './tinder-documents/components/workflow-panel/workflow-panel.component';

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
    TinderDocumentsComponent,
    CanvasLetterComponent,
    TemplateRadiogramaComponent,
    TemplateNormalComponent,
    WorkflowPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ControlRoutingModule,
    SharedModule
  ]
})
export class ControlModule { }
