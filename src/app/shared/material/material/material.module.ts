import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatListModule } from '@angular/material/list'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_LOCALE, MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioModule } from '@angular/material/radio';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatTreeModule,
    MatRadioModule,

    FormsModule,
    ReactiveFormsModule,

    NgxUiLoaderModule,

    NgbModule,
    
    AngularEditorModule
  ]
})
export class MaterialModule { }
