import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ControlComponent } from '../../views/control/control.component';
import { RegistrarComponent } from '../../views/control/registrar/registrar.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'control', component: ControlComponent },
    { path: 'registrar', component: RegistrarComponent },
];
