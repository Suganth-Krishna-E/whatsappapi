import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PointsService } from '../../../services/points/points.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-approvepoints',
  templateUrl: './approvepoints.component.html',
  styleUrl: './approvepoints.component.css'
})
export class ApprovepointsComponent {
  requests: PointRequest[] = [];
  page = 0;
  size = 5;
  totalPages = 0;
  selectedUser: FormControl;
  selectedRequestId: string | null = null;
  pointsFormGroup: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private pointService: PointsService,
    private authService: AuthService,
  ) {
    this.pointsFormGroup = new FormGroup({
      message: new FormControl('This is approved by admin')
    });

    this.selectedUser = new FormControl('');

  }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.fetchRequests();

    this.subscriptions.push(this.selectedUser.valueChanges.subscribe(
      (newValue) => {
          this.fetchRequests();
        }
      )
    );
  }

  fetchRequests() {
    this.subscriptions.push(
      this.pointService.getTotalPagesCount(this.selectedUser.value, this.size).subscribe(
        (response: any) => {
          this.totalPages = response || 1;
        }
      )
    );
    
    this.subscriptions.push(
      this.pointService.getAllRequestsByUserId(this.selectedUser.value, this.page, this.size).subscribe(
        (response: any) => {
          this.requests = response || [];
        },
        () => {
          this.requests = [];
        }
      )
    );
    
  }

  changePointRequestState(request: PointRequest, status: string) {
    if (request.status === "APPROVED") {
      Swal.fire("No changes allowed", "There is no permission to change already approved requests", "warning");
      return;
    }
    Swal.fire({
      title: 'Change status',
      text: `Are you sure you want to ${status} points request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status} it!`,
      cancelButtonText: 'No, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.push(
          this.pointService.changeRequestStatus(request.id, status, this.pointsFormGroup.controls['message'].value).subscribe(
            (response) => {
              Swal.fire("Status changed", `The request for point changes to ${status}`, "success");
              this.fetchRequests();
            },
            (error) => {
              if (error.status === 805)
                Swal.fire("Error", "Points already approved, Please refresh", "error");
            }
          )
        );
      }
    });
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

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchRequests();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchRequests();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
  }

}


interface PointRequest {
  id: string;
  pointsRequested: number;
  message: string;
  userId: string;
  status: string;
  allocatedBy: string;
  requestedOn: string;
  allocatedOn: string;

}
