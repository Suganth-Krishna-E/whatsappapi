import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { ComplaintService } from '../../../services/complaint/complaint.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-viewcomplaints',
  templateUrl: './viewcomplaints.component.html',
  styleUrl: './viewcomplaints.component.css'
})
export class ViewcomplaintsComponent {
  complaintResolveForm: FormGroup;
  complaints: Complaint[] = [];
  viewSelector: string;
  userId: string | null = null;
  page = 0;
  size = 5;
  totalPages = 0;
  userList: String[] = [];
  userSearchControl = new FormControl('');
  filteredUsers: String[] | null = [];
  selectedUser: string | null = null;


  constructor(
    private loggedUserService: LoggeduserService,
    private complaintService: ComplaintService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.complaintResolveForm = this.fb.group({
      id: [''],
      userId: [''],
      userName: [''],
      category: [''],
      message: [''],
      adminMessage: ['', Validators.required],
      status: [''],
      adminId: [this.loggedUserService.getUserId()]
    });
    this.viewSelector = "resolve";
  }

  ngOnInit() {
    if (!this.loggedUserService.getUserId()) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    }

    this.userSearchControl.valueChanges
      .pipe(
        debounceTime(5000)
      )
      .subscribe(users => {
        this.selectedUser = users;
        this.fetchComplaints();
      });
  }

  fetchComplaints() {
    if (!this.selectedUser) return;

    this.complaintService.getTotalPagesCount(this.selectedUser, this.size).subscribe(
      (response: any) => {
        this.totalPages = response || 1;
      }
    );
    this.complaintService.getAllComplaintsByUserId(this.selectedUser, this.page, this.size).subscribe(
      (response: any) => {
        this.complaints = response || [];
      },
      (error) => {
        this.complaints = [];
      }
    );
  }

  submitResolvedComplaint() {
    if (this.complaintResolveForm.valid) {
      this.complaintResolveForm.controls['adminId'].setValue(this.loggedUserService.getUserId());
      this.complaintService.resolveComplaint(this.complaintResolveForm.value).subscribe(
        () => {
          Swal.fire('Success', 'Complaint resolved successfully!', 'success');
          this.complaintResolveForm.reset();
          this.userSearchControl.reset();
        },
        (error) => {
          if (error.status === 200) {
            Swal.fire("Success", "Complaint resolved sucessfully", "success");
            this.complaintResolveForm.reset();
            this.userSearchControl.reset();
          }
          else if (error.status === 701) {
            Swal.fire("Failed", "The complaint data is invalid", "warning");
          }
          else {
            Swal.fire('Error', 'Failed to register complaint', 'error');
          }
        }
      );
    }
  }


  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchComplaints();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchComplaints();
    }
  }

  resolvedStatus(status: string): string {
    return status?.toLowerCase() === 'resolved' ? "resolved" : "pending";
  }

  changeSelectedUser(user: String) {
    this.selectedUser = user.toString();
    this.fetchComplaints();
    this.filteredUsers = null;
  }

  changeToResolveComplaint(complaint: Complaint | null | undefined): void {
    if (complaint !== null && complaint !== undefined) {
      this.complaintResolveForm.controls['id'].setValue(complaint.id);
      this.complaintResolveForm.controls['userId'].setValue(complaint.userId);
      this.complaintResolveForm.controls['category'].setValue(complaint.category);
      this.complaintResolveForm.controls['message'].setValue(complaint.message);
      this.complaintResolveForm.controls['status'].setValue(complaint.status);
    }

    this.viewSelector = "resolve";
  }

  changeToViewComplaints(): void {
    this.viewSelector = "view";
    this.fetchComplaints();
  }

  formatTime(timestampOrNull: string | null): string {
    if (timestampOrNull !== null) {
      return `${new Date(timestampOrNull).toLocaleDateString('en-US', { hour12: false })}  ${new Date(timestampOrNull).toLocaleTimeString('en-US', { hour12: false })}`;
    }
    else {
      return "";
    }
  }
}

interface Complaint {
  id: string;
  userId: string;
  category: string;
  status: string;
  message: string;
  adminMessage: string;
  adminId: string;
  registeredTimestamp: string;
  resolvedTimestamp: string;
}
