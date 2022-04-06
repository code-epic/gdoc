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
        path: 'ayudantia', 
        component: AyudantiaComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'proyecto', 
        component: ProyectoComponent,
        canActivate:[AuthGuardGuard] 
    },
    { 
        path: 'configuracion', 
        component: ConfiguracionComponent,
        canActivate:[AuthGuardGuard] 
    },
];
