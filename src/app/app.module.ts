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
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './paginator-intl';
import { SecretariaComponent } from './views/secretaria/secretaria.component';
import { ResolucionesComponent } from './views/resoluciones/resoluciones.component';
import { AyudantiaComponent } from './views/ayudantia/ayudantia.component';
import { TimonelComponent } from './views/timonel/timonel.component';
import { AcamiComponent } from './views/acami/acami.component';
import { PersonalComponent } from './views/personal/personal.component';
import { ProyectoComponent } from './views/ayudantia/procesos/proyecto/proyecto.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatCommonModule, MatNativeDateModule } from '@angular/material/core';
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
import { ProcesosComponent } from './views/ayudantia/procesos/procesos.component';
import { RsprocesosComponent } from './views/resoluciones/rsprocesos/rsprocesos.component';
import { RsbuzonComponent } from './views/resoluciones/rsbuzon/rsbuzon.component';
import { RsentradasComponent } from './views/resoluciones/rsentradas/rsentradas.component';
import { ReportesComponent } from './views/reportes/reportes.component';
import { ConstanciaComponent } from './views/reportes/constancia/constancia.component';
import { MinisterialComponent } from './views/secretaria/ministerial/ministerial.component';
import { FichaproyectoComponent } from './views/reportes/fichaproyecto/fichaproyecto.component';
import { CotizacionComponent } from './views/reportes/cotizacion/cotizacion.component';
import { RstranscripcionComponent } from './views/resoluciones/rstranscripcion/rstranscripcion.component';
import { RsrevisionComponent } from './views/resoluciones/rsrevision/rsrevision.component';
import { RsconfiguracionComponent } from './views/resoluciones/rsconfiguracion/rsconfiguracion.component';
import { RscdatosbasicosComponent } from './views/resoluciones/rsconfiguracion/rscdatosbasicos/rscdatosbasicos.component';
import { RsccargamasivaComponent } from './views/resoluciones/rsconfiguracion/rsccargamasiva/rsccargamasiva.component';
import { RscpublicacionesComponent } from './views/resoluciones/rsconfiguracion/rscpublicaciones/rscpublicaciones.component';
import { RscgeneralComponent } from './views/resoluciones/rsconfiguracion/rscgeneral/rscgeneral.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { IndiceComponent } from './views/reportes/indice/indice.component';
import { ContenidoComponent } from './views/reportes/contenido/contenido.component';
import { BuscadorComponent } from './views/buscador/buscador.component';
import { PapeleraComponent } from './views/papelera/papelera.component';
import { SbuzonComponent } from './views/secretaria/sbuzon/sbuzon.component';
import { SalertaComponent } from './views/secretaria/salerta/salerta.component';
import { SministerialComponent } from './views/secretaria/sministerial/sministerial.component';
import { SpresidencialComponent } from './views/secretaria/spresidencial/spresidencial.component';
import { ChatbotComponent } from './views/chatbot/chatbot.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { OresolucionesComponent } from './views/resoluciones/rsprocesos/oresoluciones/oresoluciones.component';
import { RsconsultaComponent } from './views/resoluciones/rsprocesos/rsconsulta/rsconsulta.component';
import { EresolucionesComponent } from './views/resoluciones/rsprocesos/eresoluciones/eresoluciones.component';
import { RsdatosbasicosmasivosComponent } from './views/resoluciones/rsconfiguracion/rsdatosbasicosmasivos/rsdatosbasicosmasivos.component';
import { RscondecoracionesComponent } from './views/resoluciones/rsconfiguracion/rscondecoraciones/rscondecoraciones.component';
import { RseliminacionesComponent } from './views/resoluciones/rsconfiguracion/rseliminaciones/rseliminaciones.component';
import { ConsultaGeneralComponent } from './views/consulta-general/consulta-general.component';
import { SbuscadorComponent } from './views/secretaria/sbuscador/sbuscador.component';
import { ListadosComponent } from './views/notas/listados/listados.component';
import { GralconsultasComponent } from './views/generales/gralconsultas/gralconsultas.component';
import { GralestadisticasComponent } from './views/generales/gralestadisticas/gralestadisticas.component';
import { GraledicionComponent } from './views/generales/graledicion/graledicion.component';
import { GrallibroComponent } from './views/generales/grallibro/grallibro.component';
import { TableGrallibroModalComponent } from './views/generales/grallibro/modal/table-grallibro-modal/table-grallibro-modal.component';
import {SharedModule} from './shared/shared.module';
import { RecibidosFieldsNavComponent } from './views/resoluciones/rsbuzon/recibidos-fields-nav/recibidos-fields-nav.component';
import { RsconsultaentradasComponent } from './views/resoluciones/rsprocesos/rsconsultaentradas/rsconsultaentradas.component';
import { RsreportesComponent } from './views/resoluciones/rsreportes/rsreportes.component';
import { RsalertasComponent } from './views/resoluciones/rsalertas/rsalertas.component';
import { TableRsreportesModalComponent } from './views/resoluciones/rsreportes/modal/table-rsreportes-modal/table-rsreportes-modal.component';
import { RsestadisticasComponent } from './views/resoluciones/rsestadisticas/rsestadisticas.component';
import { MreportesComponent } from './views/secretaria/mreportes/mreportes.component';
import { PublicarComponent } from './views/publicaciones/publicar/publicar.component';
import {MatStepperModule} from '@angular/material/stepper';
import { BuzonresueltosComponent } from './views/publicaciones/buzonresueltos/buzonresueltos.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { PushService } from './services/util/push.service';
import { environment } from '../environments/environment';
import { SnuevoComponent } from './views/secretaria/snuevo/snuevo.component';
import { AdministracionpublicaComponent } from './views/resoluciones/nomina/administracionpublica/administracionpublica.component';


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
    NgWizardModule.forRoot(ngWizardConfig),

    ToastContainerModule,
    AngularEditorModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatNativeDateModule,
    ToastrModule.forRoot({
      closeButton: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false
    }),
    AngularFileUploaderModule,
    SharedModule,
    MatStepperModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production, //!isDevMode(), // Habilita el Service Worker solo en producción por defecto
      // Registra el ServiceWorker después de 30 segundos (opcional)
      registrationStrategy: 'registerImmediately'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    // ControlComponent,
    SecretariaComponent,
    ResolucionesComponent,
    AyudantiaComponent,
    TimonelComponent,
    AcamiComponent,
    PersonalComponent,
    // RegistrarComponent,
    // DocumentoComponent,
    // BuzonComponent,
    // SalidasComponent,
    ProyectoComponent,
    // ConfiguracionComponent,
    AybuzonComponent,
    AyreportesComponent,
    GeneralesComponent,
    ArchivoComponent,
    AycotizacionesComponent,
    // PendientesComponent,
    ProcesosComponent,
    RsprocesosComponent,
    RsbuzonComponent,
    RsentradasComponent,
    ReportesComponent,
    ConstanciaComponent,
    MinisterialComponent,
    FichaproyectoComponent,
    CotizacionComponent,
    // ConfiguracionComponent,
    RstranscripcionComponent,
    RsrevisionComponent,
    RscdatosbasicosComponent,
    RsccargamasivaComponent,
    RsconfiguracionComponent,
    RscpublicacionesComponent,
    RscgeneralComponent,
    PerfilComponent,
    IndiceComponent,
    ContenidoComponent,
    BuscadorComponent,
    PapeleraComponent,
    SbuzonComponent,
    SalertaComponent,
    SministerialComponent,
    SpresidencialComponent,
    OresolucionesComponent,
    RsconsultaComponent,
    EresolucionesComponent,
    RsdatosbasicosmasivosComponent,
    RscondecoracionesComponent,
    RseliminacionesComponent,
    ConsultaGeneralComponent,
    SbuscadorComponent,
    ListadosComponent,
    GralconsultasComponent,
    GralestadisticasComponent,
    GraledicionComponent,
    GrallibroComponent,
    TableGrallibroModalComponent,
    RecibidosFieldsNavComponent,
    RsconsultaentradasComponent,
    RsreportesComponent,
    RsalertasComponent,
    TableRsreportesModalComponent,
    RsestadisticasComponent,
    MreportesComponent,
    PublicarComponent,
    BuzonresueltosComponent,
    ChatbotComponent,
    SnuevoComponent,
    AdministracionpublicaComponent
  ],
  providers: [
    {
      provide: [LocationStrategy, AuthGuardGuard, JsonPipe],
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useValue: CustomPaginator()
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'
    },
    PushService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
