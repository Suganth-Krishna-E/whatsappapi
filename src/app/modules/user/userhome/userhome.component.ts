import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent {
  userName: string | null = null;
  
    constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.authService.checkLoggedIn();

      this.userName = this.authService.getLoggedUserId();
    }

    loadUserDashboard() {
      this.router.navigate([`./dashboard/${this.authService.getLoggedUserId()}`], { relativeTo: this.activatedRoute });
    }

    logout() {
      this.authService.logout();
    }
}
