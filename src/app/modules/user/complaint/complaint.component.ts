import { Component } from '@angular/core';
import { ComplaintService } from '../../../services/complaint/complaint.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent {
  complaintForm: FormGroup;
  complaints: Complaint[] = [];
  categories: string[] = [];
  viewSelector: string;
  userId: string | null = null;
  page = 0;
  size = 5;
  totalPages = 0;
  subscriptions: Subscription[] = [];


  constructor(
    private authService: AuthService, 
    private complaintService: ComplaintService,
    private fb: FormBuilder
    ) {
      this.complaintForm = this.fb.group({
        category: ['', Validators.required],
        message: ['', Validators.required],
        userId: ['']
      });
      this.viewSelector = "register";
     }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.userId = this.authService.getLoggedUserId();

    this.fetchComplaints();
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.complaintService.getCategories(); 
  }

  fetchComplaints() {
    this.subscriptions.push(
      this.complaintService.getTotalPagesCount(this.userId, this.size).subscribe(
        (response: APIResponsePageNumber) => {
          if(response.code === 200) {
            this.totalPages = response.response;
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        },
        (error) => {
          Swal.fire("Error!", error.message, "error");
        }
      )
    );
    
    this.subscriptions.push(
      this.complaintService.getAllComplaintsByUserId(this.userId, this.page, this.size).subscribe(
        (response: APIResponseComplaints) => {
          if(response.code === 200) {
            this.complaints = response.response;
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        },
        (error) => {
          Swal.fire("Error!", error.message, "error");
        }
      )
    );
  }


  submitComplaint() {
    if (this.complaintForm.valid) {
      this.complaintForm.controls['userId'].setValue(this.authService.getLoggedUserId());
      this.subscriptions.push(
        this.complaintService.registerComplaint(this.complaintForm.value).subscribe(
          (response: APIResponse) => {
            if(response.code === 200) {
              Swal.fire('Success', 'Complaint registered successfully!', 'success');
              this.complaintForm.reset();
              this.fetchComplaints(); 
            }
            else if(response.code === 701) {
              Swal.fire("Failed", "The complaint data is invalid", "warning");
            }
            else {
              Swal.fire("Error!", response.message, "error");
            }
            
          },
          (error) => {
            Swal.fire("Error!", error.message, "error");
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
    return status?.toLowerCase() === 'resolved'? "resolved" : "pending";
  }

  changeToRegisterComplaint(): void {
    this.viewSelector = "register";
  }

  changeToViewComplaints(): void {
    this.viewSelector = "view";
    this.fetchComplaints();
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