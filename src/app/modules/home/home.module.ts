import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    CreateuserComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule, 
    RouterLink,
    RouterOutlet,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent,
    CreateuserComponent,
    HomeComponent
  ]
})
export class HomeModule { }
