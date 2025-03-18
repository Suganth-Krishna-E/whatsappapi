import { Component } from '@angular/core';
import { ComplaintService } from '../../../services/complaint/complaint.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import e from 'express';


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
  subscriptions: Subscription[] = [];


  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private fb: FormBuilder,
  ) {
    this.complaintResolveForm = this.fb.group({
      id: [''],
      userId: [''],
      userName: [''],
      category: [''],
      message: [''],
      adminMessage: ['', Validators.required],
      status: [''],
      adminId: [this.authService.getLoggedUserId()]
    });
    this.viewSelector = "resolve";
  }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.userId = this.authService.getLoggedUserId();

    this.subscriptions.push(
      this.userSearchControl.valueChanges
      .pipe(
        debounceTime(5000)
      )
      .subscribe(users => {
        this.selectedUser = users;
        this.fetchComplaints();
      })
    );
    
  }

  fetchComplaints() {
    if (!this.selectedUser) return;

    this.subscriptions.push(
      this.complaintService.getTotalPagesCount(this.selectedUser, this.size).subscribe(
        (response: APIResponsePageNumber) => {
          this.totalPages = response.response;
        }
      )
    );
    
    this.subscriptions.push(
      this.complaintService.getAllComplaintsByUserId(this.selectedUser, this.page, this.size).subscribe(
        (response: APIResponseComplaints) => {
          this.complaints = response.response;
        },
        (error) => {
          this.complaints = [];
        }
      )
    );
  }

  submitResolvedComplaint() {
    if (this.complaintResolveForm.valid) {
      this.complaintResolveForm.controls['adminId'].setValue(this.authService.getLoggedUserId());
      this.subscriptions.push(
        this.complaintService.resolveComplaint(this.complaintResolveForm.value).subscribe(
          (response: APIResponse) => {
            if(response.code === 200) {
              Swal.fire('Success', 'Complaint resolved successfully!', 'success');
              this.complaintResolveForm.reset();
              this.userSearchControl.reset();
            }
            else if (response.code === 701) {
              Swal.fire("Failed", "The complaint data is invalid", "warning");
            }
            else {
              Swal.fire("Error!", response.message, "error");
            }
          },
          (error) => {
            Swal.fire('Error', error.message, 'error');
          }
        )
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
      const localDate = new Date(timestampOrNull);
      return `${localDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}  
              ${localDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    } else {
      return "";
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
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

interface APIResponsePageNumber {
  message: string;
  response: number;
  code: number;
}

interface APIResponseComplaints {
  message: string;
  response: Complaint[];
  code: number;
}

interface APIResponse {
  message: string;
  response: object;
  code: number;
}