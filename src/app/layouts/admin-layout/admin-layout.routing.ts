import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ControlComponent } from '../../views/control/control.component';
import { RegistrarComponent } from '../../views/control/registrar/registrar.component';
import { DocumentoComponent } from '../../views/control/documento/documento.component';
import { BuzonComponent } from '../../views/control/buzon/buzon.component';
import { SalidasComponent } from '../../views/control/salidas/salidas.component';
import { AyudantiaComponent } from '../../views/ayudantia/ayudantia.component';
import { ResolucionesComponent } from 'src/app/views/resoluciones/resoluciones.component';
import { ProyectoComponent } from '../../views/ayudantia/procesos/proyecto/proyecto.component';
import { ConfiguracionComponent } from 'src/app/views/control/configuracion/configuracion.component';
import { AuthGuardGuard } from 'src/app/services/seguridad/auth-guard.guard';
import { SecretariaComponent } from 'src/app/views/secretaria/secretaria.component';
import { AcamiComponent } from 'src/app/views/acami/acami.component';
import { TimonelComponent } from 'src/app/views/timonel/timonel.component';
import { PersonalComponent } from 'src/app/views/personal/personal.component';
import { AybuzonComponent } from 'src/app/views/ayudantia/aybuzon/aybuzon.component';
import { AyreportesComponent } from 'src/app/views/ayudantia/ayreportes/ayreportes.component';
import { GeneralesComponent } from 'src/app/views/generales/generales.component';
import { ArchivoComponent } from 'src/app/views/archivo/archivo.component';
import { AycotizacionesComponent } from 'src/app/views/ayudantia/procesos/aycotizaciones/aycotizaciones.component';
import { PendientesComponent } from 'src/app/views/control/pendientes/pendientes.component';
import { ProcesosComponent } from 'src/app/views/ayudantia/procesos/procesos.component';
import { RsprocesosComponent } from 'src/app/views/resoluciones/rsprocesos/rsprocesos.component';
import { RsbuzonComponent } from 'src/app/views/resoluciones/rsbuzon/rsbuzon.component';
import { RsentradasComponent } from 'src/app/views/resoluciones/rsentradas/rsentradas.component';
import { ReportesComponent } from 'src/app/views/reportes/reportes.component';
import { ConstanciaComponent } from 'src/app/views/reportes/constancia/constancia.component';
import { MinisterialComponent } from 'src/app/views/secretaria/ministerial/ministerial.component';
import { FichaproyectoComponent } from 'src/app/views/reportes/fichaproyecto/fichaproyecto.component';
import { CotizacionComponent } from 'src/app/views/reportes/cotizacion/cotizacion.component';
import { RsrevisionComponent } from 'src/app/views/resoluciones/rsrevision/rsrevision.component';
import { RstranscripcionComponent } from 'src/app/views/resoluciones/rstranscripcion/rstranscripcion.component';
import { RsconfiguracionComponent } from 'src/app/views/resoluciones/rsconfiguracion/rsconfiguracion.component';
import { PerfilComponent } from 'src/app/views/perfil/perfil.component';
import { IndiceComponent } from 'src/app/views/reportes/indice/indice.component';
import { BuscadorComponent } from 'src/app/views/buscador/buscador.component';
import { PapeleraComponent } from 'src/app/views/papelera/papelera.component';
import { SbuzonComponent } from 'src/app/views/secretaria/sbuzon/sbuzon.component';
import { SministerialComponent } from 'src/app/views/secretaria/sministerial/sministerial.component';
import { OresolucionesComponent } from 'src/app/views/resoluciones/rsprocesos/oresoluciones/oresoluciones.component';
import { RsconsultaComponent } from 'src/app/views/resoluciones/rsprocesos/rsconsulta/rsconsulta.component';
import { SpresidencialComponent } from 'src/app/views/secretaria/spresidencial/spresidencial.component';
import { ConsultaGeneralComponent } from 'src/app/views/consulta-general/consulta-general.component';
import { SbuscadorComponent } from 'src/app/views/secretaria/sbuscador/sbuscador.component';
import { GrallibroComponent } from 'src/app/views/generales/grallibro/grallibro.component';
import { GralconsultasComponent } from 'src/app/views/generales/gralconsultas/gralconsultas.component';
import { GralestadisticasComponent } from 'src/app/views/generales/gralestadisticas/gralestadisticas.component';
import { GraledicionComponent } from 'src/app/views/generales/graledicion/graledicion.component';
import { ListadosComponent } from 'src/app/views/notas/listados/listados.component';
import { CtrlestadisticasComponent } from 'src/app/views/control/ctrlestadisticas/ctrlestadisticas.component';
import { CtrlreporteComponent } from 'src/app/views/control/ctrlreporte/ctrlreporte.component';
import { CtrlalertasComponent } from 'src/app/views/control/ctrlalertas/ctrlalertas.component';
import { DatosbasicosComponent } from 'src/app/views/control/datosbasicos/datosbasicos.component';
import { RsreportesComponent } from 'src/app/views/resoluciones/rsreportes/rsreportes.component';
import { RsalertasComponent } from 'src/app/views/resoluciones/rsalertas/rsalertas.component';
import { RsestadisticasComponent } from 'src/app/views/resoluciones/rsestadisticas/rsestadisticas.component';


export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'control',
        component: ControlComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'datosbasicos',
        component: DatosbasicosComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'notaentrega',
        component: ListadosComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ctrlestadisticas',
        component: CtrlestadisticasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ctrlreporte',
        component: CtrlreporteComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ctrlalertas',
        component: CtrlalertasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'registrar',
        component: RegistrarComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'documento',
        component: DocumentoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'documento/:id',
        component: DocumentoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'documento/:id/:numc',
        component: DocumentoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'resoluciones',
        component: ResolucionesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsreportes',
        component: RsreportesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsalertas',
        component: RsalertasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'buzon',
        component: BuzonComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'salidas',
        component: SalidasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'secretaria',
        component: SecretariaComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'sbuzon',
        component: SbuzonComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'sministerial/:filtro',
        component: SministerialComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'spresidencial',
        component: SpresidencialComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'sseguimiento',
        component: SecretariaComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'acami',
        component: AcamiComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ayudantia',
        component: AyudantiaComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'aybuzon',
        component: AybuzonComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ayreportes',
        component: AyreportesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'timonel',
        component: TimonelComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'personal',
        component: PersonalComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'proyecto',
        component: ProyectoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'proyecto/:id',
        component: ProyectoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'generales',
        component: GeneralesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'configuracion',
        component: ConfiguracionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'archivo',
        component: ArchivoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'procesos',
        component: ProcesosComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'aycotizaciones',
        component: AycotizacionesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'aycotizaciones/:id',
        component: AycotizacionesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'pendientes',
        component: PendientesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsentradas/:id/:cuenta',
        component: RsentradasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'constancia/:id',
        component: ConstanciaComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'ministerial/:id',
        component: MinisterialComponent,
        canActivate: [AuthGuardGuard],
    },
    {
        path: 'ministerial/agregar',
        component: MinisterialComponent,
        canActivate: [AuthGuardGuard],
    },
    {
        path: 'fichaproyecto/:id',
        component: FichaproyectoComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'cotizaciones/:id',
        component: CotizacionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsbuzon',
        component: RsbuzonComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsentradas',
        component: RsentradasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsentradas/:id',
        component: RsentradasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rstranscripcion',
        component: RstranscripcionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsrevision',
        component: RsrevisionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsprocesos',
        component: RsprocesosComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsprocesos/oresoluciones',
        component: OresolucionesComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsprocesos/rsconsulta',
        component: RsconsultaComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsconfiguracion',
        component: RsconfiguracionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsalertas',
        component: RsalertasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'rsestadisticas',
        component: RsestadisticasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'indice',
        component: IndiceComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'buscador',
        component: BuscadorComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'papelera',
        component: PapeleraComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'sbuscador',
        component: SbuscadorComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'gralibro',
        component: GrallibroComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'gralconsultas',
        component: GralconsultasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'gralestadistica',
        component: GralestadisticasComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'graedicion',
        component: GraledicionComponent,
        canActivate: [AuthGuardGuard]
    },
    {
        path: 'consulta-general',
        component: ConsultaGeneralComponent,
        canActivate: [AuthGuardGuard],
        children: [{
            path: 'cargar-archivo',
            canActivate: [AuthGuardGuard]
        }]
    }
];
