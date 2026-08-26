import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TotpVerifyComponent } from './totp-verify/totp-verify.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FederationLoaderComponent } from './federation-loader/federation-loader.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TotpVerifyComponent,
    FederationLoaderComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TotpVerifyComponent,
    FederationLoaderComponent
  ]
})
export class ComponentsModule { }
