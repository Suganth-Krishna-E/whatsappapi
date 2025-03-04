import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css'
})
export class AdminhomeComponent {
  userName: string | null = null;

  constructor(private loggedUserService: LoggeduserService, private router: Router) {}

  ngOnInit(): void {
    this.userName = this.loggedUserService.getUserId();
    
    if (!this.userName) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  logout() {
    this.loggedUserService.setUserId(null);
    this.router.navigate(['/login']);
  }
  
}
