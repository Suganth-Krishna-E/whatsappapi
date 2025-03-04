import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserhomeComponent } from './userhome/userhome.component';
import { UserdashboardComponent } from '../admin/userdashboard/userdashboard.component';
import { UsagesComponent } from './usages/usages.component';
import { ApiinterfaceComponent } from './apiinterface/apiinterface.component';
import { GetpointsComponent } from './getpoints/getpoints.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { RegisterwhatsappComponent } from './registerwhatsapp/registerwhatsapp.component';

const routes: Routes = [
  {
    path: '',
    component: UserhomeComponent,
    children: [
      {
        path: 'dashboard/:userId',
        component: UserdashboardComponent
      },
      {
        path: 'usages',
        component: UsagesComponent
      },
      {
        path: 'apiinterface',
        component: ApiinterfaceComponent
      },
      {
        path: 'getpoints',
        component: GetpointsComponent
      },
      {
        path: 'complaint',
        component: ComplaintComponent
      },
      {
        path: 'registerwhatsapp',
        component: RegisterwhatsappComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
