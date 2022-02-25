import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ConfiguracionComponent } from 'src/app/views/configuracion/configuracion.component';
import { ClientesComponent } from 'src/app/views/configuracion/clientes/clientes.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'configuracion',   component: ConfiguracionComponent },
    { path: 'clientes',          component: ClientesComponent }
];
