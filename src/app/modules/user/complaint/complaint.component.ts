import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { ComplaintService } from '../../../services/complaint/complaint.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

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

    this.fetchComplaints();
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.complaintService.getCategories(); 
  }

  fetchComplaints() {
    this.complaintService.getTotalPagesCount(this.userId, this.size).subscribe(
      (response: any) => {
        this.totalPages = response || 1;
      }
    );
    this.complaintService.getAllComplaintsByUserId(this.userId, this.page, this.size).subscribe(
      (response: any) => {
        this.complaints = response || []; 
      },
      (error) => {
        this.complaints = []; 
      }
    );
  }


  submitComplaint() {
    if (this.complaintForm.valid) {
      this.complaintForm.controls['userId'].setValue(this.authService.getLoggedUserId());
      this.complaintService.registerComplaint(this.complaintForm.value).subscribe(
        () => {
          Swal.fire('Success', 'Complaint registered successfully!', 'success');
          this.complaintForm.reset();
          this.fetchComplaints(); 
        },
        (error) => {
          if(error.status === 200) {
            Swal.fire("Success", "Complaint registered sucessfully", "success");
            this.complaintForm.reset();
            this.fetchComplaints(); 
          }
          else if(error.status === 701) {
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
