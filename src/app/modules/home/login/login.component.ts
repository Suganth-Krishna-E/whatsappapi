import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggeduserService } from '../../user/services/loggeduser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router, private loggedUserService: LoggeduserService) {}

  navigateToUser() {
    this.loggedUserService.setUserId('Suganth_Krishna_E');
    this.router.navigate(['/user']);
  }

  navigateToAdmin() {
    this.loggedUserService.setUserId('Suganth_Krishna_E');
    this.router.navigate(['/admin']);
  }

}
