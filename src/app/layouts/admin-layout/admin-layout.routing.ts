import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ControlComponent } from '../../views/control/control.component';
import { RegistrarComponent } from '../../views/control/registrar/registrar.component';
import { DocumentoComponent } from '../../views/control/documento/documento.component';
import { BuzonComponent } from '../../views/control/buzon/buzon.component';
import { SalidasComponent } from '../../views/control/salidas/salidas.component';
import { AyudantiaComponent } from '../../views/ayudantia/ayudantia.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'control', component: ControlComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'documento', component: DocumentoComponent },
    { path: 'buzon', component: BuzonComponent },
    { path: 'salidas', component: SalidasComponent },
    { path: 'ayudantia', component: AyudantiaComponent }
];
