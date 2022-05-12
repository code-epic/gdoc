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



export const AdminLayoutRoutes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate:[AuthGuardGuard]
    },
    { 
        path: 'control', 
        component: ControlComponent,
        canActivate:[AuthGuardGuard]
    },
    { 
        path: 'registrar', 
        component: RegistrarComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'documento', 
        component: DocumentoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'documento/:id', 
        component: DocumentoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'resoluciones', 
        component: ResolucionesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'buzon', 
        component: BuzonComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'salidas', 
        component: SalidasComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'secretaria', 
        component: SecretariaComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'acami', 
        component: AcamiComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'ayudantia', 
        component: AyudantiaComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'aybuzon', 
        component: AybuzonComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'ayreportes', 
        component: AyreportesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'timonel', 
        component: TimonelComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'personal', 
        component: PersonalComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'proyecto', 
        component: ProyectoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'proyecto/:id', 
        component: ProyectoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'generales', 
        component: GeneralesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'configuracion', 
        component: ConfiguracionComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'archivo', 
        component: ArchivoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'procesos', 
        component: ProcesosComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'aycotizaciones', 
        component: AycotizacionesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'aycotizaciones/:id', 
        component: AycotizacionesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'pendientes', 
        component: PendientesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'rsprocesos', 
        component: RsprocesosComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'rsbuzon', 
        component: RsbuzonComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'rsentradas', 
        component: RsentradasComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'reportes', 
        component: ReportesComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'constancia', 
        component: ConstanciaComponent,
        canActivate:[AuthGuardGuard] 
    }
];
