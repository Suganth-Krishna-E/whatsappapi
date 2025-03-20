import { Component } from '@angular/core';
import { PointsService } from '../../../services/points/points.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-getpoints',
  templateUrl: './getpoints.component.html',
  styleUrl: './getpoints.component.css'
})
export class GetpointsComponent {
  qrCode: String | null = null;
  orderId: String | null = null;
  paymentStatus: String | null = null;
  pointsFormGroup: FormGroup;
  paymentType: String = "upi";
  underPayment: boolean = false;
  subscriptions: Subscription[] = [];
  requests: PointRequest[] = [];
  private userId: String | null;
  page = 0;
  size = 5;
  totalPages = 0;

  constructor(
    private pointService: PointsService, 
    private authService: AuthService,
  ) {
    this.pointsFormGroup = new FormGroup({
      point: new FormControl('', [Validators.required, Validators.min(100)]),
      paymenttype: new FormControl('upi')
    });

    this.userId = this.authService.getLoggedUserId();

    this.fetchRequests();

    this.subscriptions.push(
      this.pointsFormGroup.controls['paymenttype'].valueChanges.subscribe(() => {
        this.fetchRequests();
      })
    );
  }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.subscriptions.push(
      this.pointsFormGroup.controls['paymenttype'].valueChanges.subscribe((newValue: String) => {
        this.paymentType = newValue;
      })
    );

    this.subscriptions.push(
      this.pointService.getStatusObservable().subscribe(status => {
        if (status) {
          this.paymentStatus = status;
        }
      })
    );

    this.subscriptions.push(
      this.pointService.statusSubject.subscribe(newValue => {
        this.checkPaymentStatus(newValue);
      })
    );
  }


  fetchRequests() {
    this.subscriptions.push(
      this.pointService.getTotalPagesCount(this.userId, this.size).subscribe(
        (response: APIResponsePages) => {
          if(response.code === 200) {
            this.totalPages = response.response || 1;
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
      this.pointService.getAllRequestsByUserId(this.userId, this.page, this.size).subscribe(
        (response: APIResponsePointRequests) => {
          if(response.code === 200) {
            this.requests = response.response || [];
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        },
        (error) => {
          this.requests = [];
          Swal.fire("Error!", error.message, "error");
        }
      )
    );
  }

  requestQr() {
    console.log(this.pointsFormGroup);
    if(!this.pointsFormGroup.valid) {
      Swal.fire("Fill the data", "Points must not be empty or lesser than 100", "warning");
      return;
    }
    this.paymentStatus = "Creating QR";
    this.underPayment = true;
    this.subscriptions.push(
      this.pointService.requestQr(this.pointsFormGroup.controls['point'].value).subscribe(
        (response: APIResponseQrCodeData) => {
          if(response.code === 200) {
            this.paymentStatus = null;
            this.qrCode = response.response.qr_code_url;
            this.orderId = response.response.order_id;
            this.pointService.setOrderId(this.orderId);
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        },
        (error) => {
          Swal.fire("Error", error.message, "error");
        }
      )
    );
  }

  requestPoints() {
    if(!this.pointsFormGroup.valid) {
      Swal.fire("Fill the data", "Points must not be empty or lesser than 100", "warning");
      return;
    }
    this.subscriptions.push(
      this.pointService.requestPoints(this.pointsFormGroup.controls['point'].value).subscribe(
        (response:  APIResponse) => {
          if(response.code === 200) {
            Swal.fire("Success", "Payment requested, once approved by admin it will be added", "success");
            this.clearPaymentData();
            this.fetchRequests();
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

  clearPaymentData() {
    this.pointsFormGroup.controls['point'].setValue(null);
    this.pointsFormGroup.controls['paymenttype'].setValue('upi');

    this.qrCode = null;
  }

  checkPaymentStatus(value: String | null) {
    if (value === "SUCCESS") {
      this.underPayment = false;
      this.paymentStatus = "Successful";
      this.clearPaymentData();
    }
    else if (value === "FAILED") {
      this.underPayment = false;
      this.paymentStatus = "Failed, Please retry";
      this.clearPaymentData();
    }
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

    this.pointService.closeWebSocket();
  }
}

interface QrCodeData {
  order_id: string;
  qr_code_url: string;
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

interface APIResponsePointRequests {
  message: string;
  response: PointRequest[];
  code: number;
}

interface APIResponsePages {
  message: string;
  response: number;
  code: number;
}

interface APIResponseQrCodeData {
  message: string;
  response: QrCodeData;
  code: number;
}

interface APIResponse {
  message: string;
  response: object;
  code: number;
}