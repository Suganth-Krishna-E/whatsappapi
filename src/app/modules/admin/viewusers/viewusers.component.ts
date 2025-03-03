import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewusers',
  templateUrl: './viewusers.component.html',
  styleUrl: './viewusers.component.css'
})
export class ViewusersComponent {
  users: User[] = [];
  page = 0;
  size = 5;
  totalPages = 0;
  userId: string | null = null;

  constructor(
    private loggedUserService: LoggeduserService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.userId = this.loggedUserService.getUserId();
    if (!this.userId) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      this.fetchUsers();
    }
  }

  fetchUsers() {
    this.userService.getTotalPagesCount(this.size).subscribe(
      (response: any) => {
        this.totalPages = response || 1;
      }
    );
    this.userService.getAllUsers(this.page, this.size).subscribe(
      (response: any) => {
        this.users = response || []; 
      },
      () => {
        this.users = []; 
      }
    );
  }

  loadUserDashBoard(userId: string) {
    this.router.navigate([`../dashboard/${userId}`], { relativeTo: this.activatedRoute });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchUsers();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchUsers();
    }
  }

  formatTime(timestampOrNull: string | null): string {
    if(timestampOrNull !== null) {
      return `${new Date(timestampOrNull).toLocaleDateString('en-US', { hour12: false })}  ${new Date(timestampOrNull).toLocaleTimeString('en-US', { hour12: false })}`;  
    }
    else {
      return "";
    }
  }

}

interface User {
  userId: string;
  userName: string;
  companyName: string;
  mobileNumber: string;
  gstNumber: string;
  address: string;
  points: number;
  createdAt: string;
}
