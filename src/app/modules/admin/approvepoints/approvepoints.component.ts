import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PointsService } from '../../../services/points/points.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { FormControl } from '@angular/forms';

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

  constructor(private pointService: PointsService, private loggedUserService: LoggeduserService) {
    // this.pointsFormGroup = new FormGroup({

    // });

    this.selectedUser = new FormControl('Suganth_Krishna_E');

  }

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    this.pointService.getTotalPagesCount(this.selectedUser.value, this.size).subscribe(
      (response: any) => {
        this.totalPages = response || 1;
      }
    );
    this.pointService.getAllRequestsByUserId(this.selectedUser.value, this.page, this.size).subscribe(
      (response: any) => {
        this.requests = response || [];
      },
      () => {
        this.requests = [];
      }
    );
  }

  changePointRequestState(requestId: string, status: string) {
    Swal.fire({
      title: 'Change status',
      text: `Are you sure you want to ${status} points request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status} it!`,
      cancelButtonText: 'No, continue',
    }).then((result) => {
      // if (result.isConfirmed) {
      //   this.pointService.changeRequestStatus(requestId, status, this.pointsFormGroup.controls['message'].value).subscribe(
      //     (response) => {
      //       Swal.fire("Status changed", `The request for point changes to ${status}`, "success");
      //     },
      //     (error) => {
      //       Swal.fire("Error", error.message, "error");
      //     }
      //   );
      // }
    });
  }

  formatTime(timestampOrNull: string | null): string {
    if(timestampOrNull !== null) {
      return `${new Date(timestampOrNull).toLocaleDateString('en-US', { hour12: false })}  ${new Date(timestampOrNull).toLocaleTimeString('en-US', { hour12: false })}`;  
    }
    else {
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

}


interface PointRequest {
  id: string;
  pointsRequested: number;
  message: string;
  userId: string;
  status: string;
  alloatedBy: string;
  requestedOn: string;
  allocatedOn: string;

}
