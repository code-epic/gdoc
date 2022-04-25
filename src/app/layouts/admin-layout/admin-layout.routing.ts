import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ControlComponent } from '../../views/control/control.component';
import { RegistrarComponent } from '../../views/control/registrar/registrar.component';
import { DocumentoComponent } from '../../views/control/documento/documento.component';
import { BuzonComponent } from '../../views/control/buzon/buzon.component';
import { SalidasComponent } from '../../views/control/salidas/salidas.component';
import { AyudantiaComponent } from '../../views/ayudantia/ayudantia.component';
import { ResolucionesComponent } from 'src/app/views/resoluciones/resoluciones.component';
import { ProyectoComponent } from '../../views/ayudantia/proyecto/proyecto.component';
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
];
