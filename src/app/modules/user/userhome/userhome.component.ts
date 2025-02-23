import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggeduserService } from '../../../services/loggeduser.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent {
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
}
