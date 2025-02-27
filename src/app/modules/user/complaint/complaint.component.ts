import { Component } from '@angular/core';
import { LoggeduserService } from '../services/loggeduser.service';
import { ComplaintService } from '../services/complaint.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private loggedUserService: LoggeduserService, 
    private complaintService: ComplaintService,
    private router: Router,
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
    this.userId = this.loggedUserService.getUserId();
    if (!this.userId) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      this.fetchComplaints();
    }
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.complaintService.getCategories(); 
  }

  fetchComplaints() {
    this.complaintService.getTotalPagesCount(this.userId, this.size).subscribe(
      (response: any) => {
        console.log(response);
        this.totalPages = response || 1;
      }
    );
    this.complaintService.getAllComplaintsByUserId(this.userId, this.page, this.size).subscribe(
      (response: any) => {
        console.log("Response:", response);  
        this.complaints = response || []; 
      },
      (error) => {
        console.log("Error fetching messages:", error);
        this.complaints = []; 
      }
    );
  }


  submitComplaint() {
    if (this.complaintForm.valid) {
      this.complaintForm.controls['userId'].setValue(this.loggedUserService.getUserId());
      console.log(this.complaintForm.value);
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
          console.error(error);
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
