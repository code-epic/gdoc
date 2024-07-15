import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material/material.module';
import { ChartBarComponent } from './components/chart-bar/chart-bar.component';



@NgModule({
  declarations: [
    ChartBarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ChartBarComponent
  ]
})
export class SharedModule { }
