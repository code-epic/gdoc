import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ConfiguracionComponent } from 'src/app/views/configuracion/configuracion.component';
import { CustodiaComponent } from 'src/app/views/custodia/custodia.component';
import { InversionComponent } from 'src/app/views/inversion/inversion.component';
import { OrdenesComponent } from 'src/app/views/ordenes/ordenes.component';
import { ClientesComponent } from 'src/app/views/configuracion/clientes/clientes.component';
import { TasaComponent } from 'src/app/views/configuracion/tasa/tasa.component';
import { PortafolioComponent } from 'src/app/views/configuracion/portafolio/portafolio.component';
import { ParametrosComponent } from 'src/app/views/configuracion/parametros/parametros.component';
import { BlottersComponent } from 'src/app/views/configuracion/blotters/blotters.component';
import { DocumentosComponent } from 'src/app/views/configuracion/documentos/documentos.component';
import { AuditoriaComponent } from 'src/app/views/configuracion/auditoria/auditoria.component';
import { CalendarioComponent } from 'src/app/views/configuracion/calendario/calendario.component';
import { BeneficiariosComponent } from 'src/app/views/configuracion/beneficiarios/beneficiarios.component';
import { CamposDinamicosComponent } from 'src/app/views/configuracion/campos-dinamicos/campos-dinamicos.component';
import { IndicadoresComponent} from 'src/app/views/configuracion/indicadores/indicadores.component'
import { PaisesComponent } from 'src/app/views/configuracion/paises/paises.component';
import { OficinasComponent } from 'src/app/views/configuracion/oficinas/oficinas.component';
import { InstrumentosFinancierosComponent } from 'src/app/views/configuracion/instrumentos-financieros/instrumentos-financieros.component';
import { OficinaDetallesComponent } from 'src/app/views/configuracion/oficina-detalles/oficina-detalles.component';
import { FechavalorComponent } from 'src/app/views/configuracion/fechavalor/fechavalor.component';
import { GeneralesComponent } from 'src/app/views/configuracion/generales/generales.component';
import { RecompraComponent } from 'src/app/views/configuracion/recompra/recompra.component';
import { TitulosComponent } from 'src/app/views/configuracion/titulos/titulos.component';
import { TransaccionesfijasComponent } from 'src/app/views/configuracion/transaccionesfijas/transaccionesfijas.component';
import { UsuariosespecialesComponent } from 'src/app/views/configuracion/usuariosespeciales/usuariosespeciales.component';
import { OficinasComercialesComponent } from 'src/app/views/configuracion/oficinas-comerciales/oficinas-comerciales.component';
import { TransaccionComponent } from 'src/app/views/custodia/transaccion/transaccion.component';
import { SalidaTitulosComponent } from 'src/app/views/custodia/salida-titulos/salida-titulos.component';
import { SalidaExternaComponent } from 'src/app/views/custodia/salida-externa/salida-externa.component';
import { EntradaTituloComponent } from 'src/app/views/custodia/entrada-titulo/entrada-titulo.component';
import { GeneracionCuponesComponent } from 'src/app/views/custodia/generacion-cupones/generacion-cupones.component';
import { GeneracionComisionComponent } from 'src/app/views/custodia/generacion-comision/generacion-comision.component';
import { ConsultaEventosComponent } from 'src/app/views/custodia/consulta-eventos/consulta-eventos.component';
import { CargaInicialComponent } from 'src/app/views/custodia/carga-inicial/carga-inicial.component';
import { CargaInicialDosComponent } from 'src/app/views/custodia/carga-inicial-dos/carga-inicial-dos.component';
import { CargaInicialTresComponent } from 'src/app/views/custodia/carga-inicial-tres/carga-inicial-tres.component';
import { CargaInicialCuatroComponent } from 'src/app/views/custodia/carga-inicial-cuatro/carga-inicial-cuatro.component';
import { EstructuraTarifariaComponent } from 'src/app/views/custodia/estructura-tarifaria/estructura-tarifaria.component';
import { TituloComponent } from 'src/app/views/custodia/titulo/titulo.component';
import { DetalleTituloComponent } from 'src/app/views/custodia/detalle-titulo/detalle-titulo.component';
import { MovimientosComponent } from 'src/app/views/custodia/movimientos/movimientos.component';
import { ClienteTituloCustodiaComponent } from 'src/app/views/custodia/cliente-titulo-custodia/cliente-titulo-custodia.component';
import { TituloCustodiaComponent } from 'src/app/views/custodia/titulo-custodia/titulo-custodia.component';
import { CuponesComponent } from 'src/app/views/custodia/cupones/cupones.component';
import { InformesComponent } from 'src/app/views/custodia/informes/informes.component';
import { PosicionGlobalComponent } from 'src/app/views/custodia/informes/posicion-global/posicion-global.component';
import { ListasClientesComponent } from 'src/app/views/custodia/informes/listas-clientes/listas-clientes.component';
import { ValoresGarantiasComponent } from 'src/app/views/custodia/informes/valores-garantias/valores-garantias.component';
import { CertificadoBloqueoComponent } from 'src/app/views/custodia/informes/certificado-bloqueo/certificado-bloqueo.component';
import { CertificadosRecibosComponent } from 'src/app/views/custodia/informes/certificados-recibos/certificados-recibos.component';
import { PagoChequesComponent } from 'src/app/views/custodia/informes/pago-cheques/pago-cheques.component';
import { AvisoCobroComponent } from 'src/app/views/custodia/informes/aviso-cobro/aviso-cobro.component';
import { TitulosBloqueosComponent } from 'src/app/views/custodia/informes/titulos-bloqueos/titulos-bloqueos.component';
import { TransaccionesLiquidadasComponent } from 'src/app/views/custodia/informes/transacciones-liquidadas/transacciones-liquidadas.component';
import { VencimientoInteresesComponent } from 'src/app/views/custodia/informes/vencimiento-intereses/vencimiento-intereses.component';
import { InversionwComponent } from 'src/app/views/inversion/inversionw/inversionw.component';
import { GeneracionDatosOpicsComponent } from 'src/app/views/utilitarios/generacion-datos-opics/generacion-datos-opics.component';
import { ProgramadorTareasComponent } from 'src/app/views/utilitarios/programador-tareas/programador-tareas.component';
import { SesionesComponent } from 'src/app/views/utilitarios/sesiones/sesiones.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'configuracion', component: ConfiguracionComponent },
    { path: 'custodia', component: CustodiaComponent },
    { path: 'inversion', component: InversionComponent },
    { path: 'ordenes', component: OrdenesComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'tasa', component: TasaComponent },
    { path: 'portafolio', component: PortafolioComponent },
    { path: 'parametros', component: ParametrosComponent },
    { path: 'blotters', component: BlottersComponent},
    { path: 'documentos' , component: DocumentosComponent},
    { path: 'auditoria', component: AuditoriaComponent},
    { path: 'calendario', component: CalendarioComponent},
    { path: 'beneficiarios', component: BeneficiariosComponent},
    { path: 'dinamicos', component: CamposDinamicosComponent},
    { path: 'indicadores', component:IndicadoresComponent},
    { path: 'paises', component:PaisesComponent},
    { path: 'oficinas', component:OficinasComponent},
    { path: 'instFinancieros', component:InstrumentosFinancierosComponent},
    { path: 'ofidetalle', component:OficinaDetallesComponent},
    { path: 'fechavalor', component: FechavalorComponent},
    { path: 'generales', component: GeneralesComponent},
    { path: 'recompra', component: RecompraComponent},
    { path: 'titulos', component: TitulosComponent},
    { path: 'transaccionesfijas', component: TransaccionesfijasComponent},
    { path: 'usuariosespeciales', component: UsuariosespecialesComponent},
    { path:'oficinasComerciales', component:OficinasComercialesComponent},
    { path:'transaccion', component:TransaccionComponent},
    { path:'salidaTitulos', component:SalidaTitulosComponent},
    { path:'salidaExterna', component:SalidaExternaComponent},
    { path:'entradaTitulos', component:EntradaTituloComponent},
    { path:'generacionCupones', component:GeneracionCuponesComponent},
    { path:'generacionComision', component:GeneracionComisionComponent},
    { path:'consultaEventos', component:ConsultaEventosComponent},
    { path:'cargaInicial', component:CargaInicialComponent},
    { path:'cargaInicialDos', component:CargaInicialDosComponent},
    { path:'cargaInicialTres', component:CargaInicialTresComponent},
    { path:'cargaInicialCuatro', component:CargaInicialCuatroComponent},
    { path:'estructuraTarifaria', component:EstructuraTarifariaComponent},
    { path:'custodiaTitulo', component:TituloComponent },
    { path:'custodiaDetalleTitulo', component:DetalleTituloComponent},
    { path:'custodiaMovimiento', component: MovimientosComponent},
    { path:'custodiaTituloCustodia', component: ClienteTituloCustodiaComponent},
    { path:'tituloCustodia', component: TituloCustodiaComponent},
    { path: 'custodiaTitulo', component:TituloComponent },
    { path: 'custodiaDetalleTitulo', component:DetalleTituloComponent},
    { path:'custodiaMovimiento', component: MovimientosComponent},
    { path:'custodiaCupones', component: CuponesComponent},
    { path:'custodiaInformes', component: InformesComponent},
    { path:'posicionGlobal', component: PosicionGlobalComponent},
    { path:'listaClientes', component: ListasClientesComponent},
    { path:'valoresGarantias', component: ValoresGarantiasComponent},
    { path:'certificadoBloqueo', component:CertificadoBloqueoComponent },
    { path:'certificadoRecibido', component:CertificadosRecibosComponent},
    { path:'pagoCheques', component:PagoChequesComponent},
    { path:'avisoCobro', component:AvisoCobroComponent},
    { path:'titulosBloqueos', component:TitulosBloqueosComponent},
    { path:'transaccionLiquidadas', component:TransaccionesLiquidadasComponent},
    { path:'vencimientoInteres', component:VencimientoInteresesComponent},
    { path:'inversionw', component:InversionwComponent},
    { path:'generacionOpics', component:GeneracionDatosOpicsComponent},
    { path:'programadorTarea', component:ProgramadorTareasComponent},
    { path:'sesiones', component:SesionesComponent}
    
];
