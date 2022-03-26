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


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'control', component: ControlComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'documento', component: DocumentoComponent },
    { path: 'resoluciones', component: ResolucionesComponent },
    { path: 'buzon', component: BuzonComponent },
    { path: 'salidas', component: SalidasComponent },
    { path: 'ayudantia', component: AyudantiaComponent },
    { path: 'proyecto', component: ProyectoComponent },
    { path: 'configuracion', component: ConfiguracionComponent },
];
