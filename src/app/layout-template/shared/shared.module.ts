import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SuccessAlertComponent } from './alerts/success-alert/success-alert.component';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmSaveComponent } from './dialogs/confirm-save/confirm-save.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SidebarNavComponent,
    HeaderComponent,
    ConfirmDeleteComponent,
    SuccessAlertComponent,
    ConfirmSaveComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    NgApexchartsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SidebarNavComponent,
    HeaderComponent,
    MatMenuModule,
    MatButtonModule,
    NgApexchartsModule,
  ],
})
export class SharedModule {}
