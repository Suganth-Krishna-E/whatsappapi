import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ApiinterfaceComponent } from './apiinterface/apiinterface.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { GetpointsComponent } from './getpoints/getpoints.component';
import { RegisterwhatsappComponent } from './registerwhatsapp/registerwhatsapp.component';
import { UsagesComponent } from './usages/usages.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TextAreaResizeDirective } from '../../utils/directives/text-area-resize.directive';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@NgModule({
  declarations: [
    ApiinterfaceComponent,
    ComplaintComponent,
    GetpointsComponent,
    RegisterwhatsappComponent,
    UsagesComponent,
    UserhomeComponent,
    TextAreaResizeDirective
  ],
  imports: [
    CommonModule,
    UserRoutingModule, 
    ReactiveFormsModule,
    RouterOutlet,
    CanvasJSAngularChartsModule,
    HttpClientModule,
  ],
  exports: [
    ApiinterfaceComponent,
    ComplaintComponent,
    GetpointsComponent,
    RegisterwhatsappComponent,
    UsagesComponent,
    UserhomeComponent
  ],
})
export class UserModule { }
