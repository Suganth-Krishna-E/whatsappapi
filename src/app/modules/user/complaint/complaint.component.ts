import { Component } from '@angular/core';
import { LoggeduserService } from '../services/loggeduser.service';
import { ComplaintService } from '../services/complaint.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent {
  complaints: Complaint[] = [];
  userId: String | null = null;
  page = 0;
  size = 5;
  totalPages = 0;


  constructor(
    private loggedUserService: LoggeduserService, 
    private complaintService: ComplaintService,
    private router: Router
    ) { }

  ngOnInit() {
    this.userId = this.loggedUserService.getUserId();
    if (!this.userId) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      this.fetchComplaints();
    }
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
}

interface Complaint {
  id: String;
  userId: String;
  category: String;
  status: String;
  message: String;
  adminMessage: String;
  adminId: String;
  registeredTimestamp: String;
  resolvedTimestamp: String;
}
