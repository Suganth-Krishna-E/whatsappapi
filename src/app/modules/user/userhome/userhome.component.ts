import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent {
  userName: string | null = null;
  
    constructor(private loggedUserService: LoggeduserService, private router: Router, private activatedRoute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.userName = this.loggedUserService.getUserId();
      
      if (!this.userName) {
        Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
          this.router.navigate(['/login']);
        });
      }
    }

    loadUserDashboard() {
      this.router.navigate([`./dashboard/${this.loggedUserService.getUserId()}`], { relativeTo: this.activatedRoute });
    }

    logout() {
      this.loggedUserService.setUserId(null);
      this.router.navigate(['/login']);
    }
}
