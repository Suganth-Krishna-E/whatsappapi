import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    if (this.authService.getLoginStatus()) {
      Swal.fire({
        title: 'User already logged in!!',
        text: 'Do you want to use the existing login data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, use it!',
        cancelButtonText: 'No, logout',
      }).then((result) => {
        if (result.isConfirmed) {
          let role = this.authService.getUserRole();

          if(role === "ROLE_USER") {
            this.router.navigate(["/user"]);
          }
          else if(role === "ROLE_ADMIN") {
            this.router.navigate(["/admin"]);
          }
        }
        else {
          this.authService.logout();
        }
      });
    }
  }

}
