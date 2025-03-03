import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { ApprovepointsComponent } from './approvepoints/approvepoints.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { ViewcomplaintsComponent } from './viewcomplaints/viewcomplaints.component';
import { ViewusersComponent } from './viewusers/viewusers.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { TextAreaResizeDirective } from '../../utils/directives/text-area-resize.directive';

@NgModule({
  declarations: [
    AdmindashboardComponent,
    AdminhomeComponent,
    ApprovepointsComponent,
    UserdashboardComponent,
    ViewcomplaintsComponent,
    ViewusersComponent,
    TextAreaResizeDirective
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterLink, 
    RouterOutlet,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    FormsModule,
  ],
  exports: [
    AdmindashboardComponent,
    AdminhomeComponent,
    ApprovepointsComponent,
    UserdashboardComponent,
    ViewcomplaintsComponent,
    ViewusersComponent
  ]
})
export class AdminModule { }
