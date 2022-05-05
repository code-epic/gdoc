import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { ProyectoComponent } from './views/ayudantia/procesos/proyecto/proyecto.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxUiLoaderModule,  NgxUiLoaderConfig } from "ngx-ui-loader";

import { MatCommonModule } from '@angular/material/core';

import { ConfiguracionComponent } from './views/control/configuracion/configuracion.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { AuthGuardGuard } from './services/seguridad/auth-guard.guard';
import { HashLocationStrategy, JsonPipe, LocationStrategy } from '@angular/common';

import { AngularFileUploaderModule } from "angular-file-uploader";
import { AuthInterceptorService } from './services/seguridad/auth-interceptor.service';
import { AybuzonComponent } from './views/ayudantia/aybuzon/aybuzon.component';
import { AyreportesComponent } from './views/ayudantia/ayreportes/ayreportes.component';
import { GeneralesComponent } from './views/generales/generales.component';
import { ArchivoComponent } from './views/archivo/archivo.component';
import { AycotizacionesComponent } from './views/ayudantia/procesos/aycotizaciones/aycotizaciones.component';
import { PendientesComponent } from './views/control/pendientes/pendientes.component';
import { ProcesosComponent } from './views/ayudantia/procesos/procesos.component';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#79c680",
  "bgsOpacity": 0.2,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 8,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#1ea24a",
  "fgsPosition": "center-center",
  "fgsSize": 50,
  "fgsType": "ball-spin-clockwise",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.63)",
  "pbColor": "#79c680",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
}


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
    MatCommonModule,
    ToastContainerModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatToolbarModule,
    ToastrModule.forRoot({
      closeButton: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false    }),
    AngularFileUploaderModule

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
    ConfiguracionComponent,
    AybuzonComponent,
    AyreportesComponent,
    GeneralesComponent,
    ArchivoComponent,
    AycotizacionesComponent,
    PendientesComponent,
    ProcesosComponent
  ],
  providers:  [
    {
      provide: [ LocationStrategy, AuthGuardGuard,  JsonPipe],
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
