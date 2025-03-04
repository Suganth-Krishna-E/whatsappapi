import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { ViewusersComponent } from './viewusers/viewusers.component';
import { ViewcomplaintsComponent } from './viewcomplaints/viewcomplaints.component';
import { ApprovepointsComponent } from './approvepoints/approvepoints.component';

const routes: Routes = [
  {
    path: '',
    component: AdminhomeComponent,
    children: [
      {
        path: 'dashboard',
        component: AdmindashboardComponent
      },
      {
        path: 'users',
        component: ViewusersComponent
      },
      {
        path: 'dashboard/:userId',
        component: UserdashboardComponent
      },
      {
        path: 'complaints',
        component: ViewcomplaintsComponent
      },
      {
        path: 'approvepoints',
        component: ApprovepointsComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
