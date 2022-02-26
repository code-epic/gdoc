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
import { ConfiguracionComponent } from './views/configuracion/configuracion.component';
import { CustodiaComponent } from './views/custodia/custodia.component';
import { InversionComponent } from './views/inversion/inversion.component';
import { OrdenesComponent } from './views/ordenes/ordenes.component';
import { ClientesComponent } from './views/configuracion/clientes/clientes.component';
import { TasaComponent } from './views/configuracion/tasa/tasa.component';
import { PortafolioComponent } from './views/configuracion/portafolio/portafolio.component';
import { ParametrosComponent } from './views/configuracion/parametros/parametros.component';
import { BlottersComponent } from './views/configuracion/blotters/blotters.component';
import { DocumentosComponent } from './views/configuracion/documentos/documentos.component';
import { AuditoriaComponent } from './views/configuracion/auditoria/auditoria.component';
import { CalendarioComponent } from './views/configuracion/calendario/calendario.component';
import { BeneficiariosComponent } from './views/configuracion/beneficiarios/beneficiarios.component';
import { CamposDinamicosComponent } from './views/configuracion/campos-dinamicos/campos-dinamicos.component';
import { IndicadoresComponent } from './views/configuracion/indicadores/indicadores.component';
import { PaisesComponent } from './views/configuracion/paises/paises.component';
import { OficinasComponent } from './views/configuracion/oficinas/oficinas.component';
import { InstrumentosFinancierosComponent } from './views/configuracion/instrumentos-financieros/instrumentos-financieros.component';
import { OficinaDetallesComponent } from './views/configuracion/oficina-detalles/oficina-detalles.component';
import { FechavalorComponent } from './views/configuracion/fechavalor/fechavalor.component';
import { GeneralesComponent } from './views/configuracion/generales/generales.component';
import { RecompraComponent } from './views/configuracion/recompra/recompra.component';
import { TitulosComponent } from './views/configuracion/titulos/titulos.component';
import { TransaccionesfijasComponent } from './views/configuracion/transaccionesfijas/transaccionesfijas.component';
import { UsuariosespecialesComponent } from './views/configuracion/usuariosespeciales/usuariosespeciales.component';
import { OficinasComercialesComponent } from './views/configuracion/oficinas-comerciales/oficinas-comerciales.component';
import { TransaccionComponent } from './views/custodia/transaccion/transaccion.component';
import { SalidaTitulosComponent } from './views/custodia/salida-titulos/salida-titulos.component';
import { SalidaExternaComponent } from './views/custodia/salida-externa/salida-externa.component';
import { EntradaTituloComponent } from './views/custodia/entrada-titulo/entrada-titulo.component';
import { GeneracionCuponesComponent } from './views/custodia/generacion-cupones/generacion-cupones.component';
import { GeneracionComisionComponent } from './views/custodia/generacion-comision/generacion-comision.component';
import { ConsultaEventosComponent } from './views/custodia/consulta-eventos/consulta-eventos.component';
import { EstructuraTarifariaComponent } from './views/custodia/estructura-tarifaria/estructura-tarifaria.component';
import { CargaInicialComponent } from './views/custodia/carga-inicial/carga-inicial.component';
import { CargaInicialDosComponent } from './views/custodia/carga-inicial-dos/carga-inicial-dos.component';
import { CargaInicialTresComponent } from './views/custodia/carga-inicial-tres/carga-inicial-tres.component';
import { CargaInicialCuatroComponent } from './views/custodia/carga-inicial-cuatro/carga-inicial-cuatro.component';
import { TituloComponent } from './views/custodia/titulo/titulo.component';
import { DetalleTituloComponent } from './views/custodia/detalle-titulo/detalle-titulo.component';
import { MovimientosComponent } from './views/custodia/movimientos/movimientos.component';
import { ClienteTituloCustodiaComponent } from './views/custodia/cliente-titulo-custodia/cliente-titulo-custodia.component';
import { TituloCustodiaComponent } from './views/custodia/titulo-custodia/titulo-custodia.component';
import { CuponesComponent } from './views/custodia/cupones/cupones.component';
import { InformesComponent } from './views/custodia/informes/informes.component';
import { PosicionGlobalComponent } from './views/custodia/informes/posicion-global/posicion-global.component';
import { ListasClientesComponent } from './views/custodia/informes/listas-clientes/listas-clientes.component';
import { ValoresGarantiasComponent } from './views/custodia/informes/valores-garantias/valores-garantias.component';
import { CertificadoBloqueoComponent } from './views/custodia/informes/certificado-bloqueo/certificado-bloqueo.component';
import { CertificadosRecibosComponent } from './views/custodia/informes/certificados-recibos/certificados-recibos.component';
import { PagoChequesComponent } from './views/custodia/informes/pago-cheques/pago-cheques.component';
import { AvisoCobroComponent } from './views/custodia/informes/aviso-cobro/aviso-cobro.component';
import { TitulosBloqueosComponent } from './views/custodia/informes/titulos-bloqueos/titulos-bloqueos.component';
import { TransaccionesLiquidadasComponent } from './views/custodia/informes/transacciones-liquidadas/transacciones-liquidadas.component';
import { VencimientoInteresesComponent } from './views/custodia/informes/vencimiento-intereses/vencimiento-intereses.component';
import { InversionwComponent } from './views/inversion/inversionw/inversionw.component';
import { GeneracionDatosOpicsComponent } from './views/utilitarios/generacion-datos-opics/generacion-datos-opics.component';
import { ProgramadorTareasComponent } from './views/utilitarios/programador-tareas/programador-tareas.component';
import { SesionesComponent } from './views/utilitarios/sesiones/sesiones.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatListModule } from '@angular/material/list'
import { MatPaginatorModule } from '@angular/material/paginator';



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
    MatListModule,
    MatPaginatorModule,
    NgWizardModule.forRoot(ngWizardConfig)

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ConfiguracionComponent,
    CustodiaComponent,
    InversionComponent,
    OrdenesComponent,
    ClientesComponent,
    TasaComponent,
    PortafolioComponent,
    ParametrosComponent,
    BlottersComponent,
    DocumentosComponent,
    AuditoriaComponent,
    CalendarioComponent,
    BeneficiariosComponent,
    CamposDinamicosComponent,
    IndicadoresComponent,
    PaisesComponent,
    OficinasComponent,
    InstrumentosFinancierosComponent,
    OficinaDetallesComponent,
    FechavalorComponent,
    GeneralesComponent,
    RecompraComponent,
    TitulosComponent,
    TransaccionesfijasComponent,
    UsuariosespecialesComponent,
    OficinasComercialesComponent,
    TransaccionComponent,
    SalidaTitulosComponent,
    SalidaExternaComponent,
    EntradaTituloComponent,
    GeneracionCuponesComponent,
    GeneracionComisionComponent,
    ConsultaEventosComponent,
    EstructuraTarifariaComponent,
    CargaInicialComponent,
    CargaInicialDosComponent,
    CargaInicialTresComponent,
    CargaInicialCuatroComponent,
    TituloComponent,
    DetalleTituloComponent,
    MovimientosComponent,
    ClienteTituloCustodiaComponent,
    TituloCustodiaComponent,
    CuponesComponent,
    InformesComponent,
    PosicionGlobalComponent,
    ListasClientesComponent,
    ValoresGarantiasComponent,
    CertificadoBloqueoComponent,
    CertificadosRecibosComponent,
    PagoChequesComponent,
    AvisoCobroComponent,
    TitulosBloqueosComponent,
    TransaccionesLiquidadasComponent,
    VencimientoInteresesComponent,
    InversionwComponent,
    GeneracionDatosOpicsComponent,
    ProgramadorTareasComponent,
    SesionesComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
