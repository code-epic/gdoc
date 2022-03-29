import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatListModule } from '@angular/material/list'
import { MatPaginatorModule } from '@angular/material/paginator';
import { ControlComponent } from './views/control/control.component';
import { SecretariaComponent } from './views/secretaria/secretaria.component';
import { ResolucionesComponent } from './views/resoluciones/resoluciones.component';
import { AyudantiaComponent } from './views/ayudantia/ayudantia.component';
import { TimonelComponent } from './views/timonel/timonel.component';
import { AcamiComponent } from './views/acami/acami.component';
import { PersonalComponent } from './views/personal/personal.component';
import { RegistrarComponent } from './views/control/registrar/registrar.component';
import { DocumentoComponent } from './views/control/documento/documento.component';
import { BuzonComponent } from './views/control/buzon/buzon.component';
import { SalidasComponent } from './views/control/salidas/salidas.component';
import { NgxEditorModule } from 'ngx-editor';
import { ProyectoComponent } from './views/ayudantia/proyecto/proyecto.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ConfiguracionComponent } from './views/control/configuracion/configuracion.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';


NgxEditorModule.forRoot({
  locals: {
    // ...
  },
});

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.arrows
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatListModule,
    MatPaginatorModule,
    NgWizardModule.forRoot(ngWizardConfig),
    NgxEditorModule,
    MatDialogModule,
    ToastContainerModule,
    MatToolbarModule,
    ToastrModule.forRoot({
      closeButton: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false    }),

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ControlComponent,
    SecretariaComponent,
    ResolucionesComponent,
    AyudantiaComponent,
    TimonelComponent,
    AcamiComponent,
    PersonalComponent,
    RegistrarComponent,
    DocumentoComponent,
    BuzonComponent,
    SalidasComponent,
    ProyectoComponent,
    ConfiguracionComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
