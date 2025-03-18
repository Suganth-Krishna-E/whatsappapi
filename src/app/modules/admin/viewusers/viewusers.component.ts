import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

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
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.userId = this.authService.getLoggedUserId();

    this.fetchUsers();
  }

  fetchUsers() {
    this.subscriptions.push(
      this.userService.getTotalPagesCount(this.size).subscribe(
        (response: APIResponsePageCount) => {
          if(response.code === 200) {
            this.totalPages = response.response.page;
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
          
        }
      )
    );
    
    this.subscriptions.push(
      this.userService.getAllUsers(this.page, this.size).subscribe(
        (response: APIResponseUserList) => {
          if(response.code === 200) {
            this.users = response.response; 
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        }
      )
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

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
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

interface APIResponse {
  message: string;
  response: object;
  code: number;
}

interface APIResponseUserList {
  message: string;
  response: User[];
  code: number;
}

interface APIResponsePageCount {
  message: string;
  response: {page: number};
  code: number;
}