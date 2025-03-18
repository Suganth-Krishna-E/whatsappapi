import { Component } from '@angular/core';
import { PointsService } from '../../../services/points/points.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

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
      point: new FormControl(),
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
    }));
  }


  fetchRequests() {
    this.subscriptions.push(
      this.pointService.getTotalPagesCount(this.userId, this.size).subscribe(
        (response: any) => {
          this.totalPages = response || 1;
        }
      )
    );
    this.subscriptions.push(
      this.pointService.getAllRequestsByUserId(this.userId, this.page, this.size).subscribe(
        (response: any) => {
          this.requests = response || [];
        },
        (error) => {
          this.requests = [];
        }
      )
    );
  }

  requestQr() {
    this.paymentStatus = "Creating QR";
    this.underPayment = true;
    this.subscriptions.push(
      this.pointService.requestQr(this.pointsFormGroup.controls['point'].value).subscribe(
        (response: QrCodeData) => {
          this.paymentStatus = null;
          this.qrCode = response.qr_code_url;
          this.orderId = response.order_id;
          this.pointService.setOrderId(this.orderId);
        },
        (error) => {
          Swal.fire("Error", error.message, "error");
        }
      )
    );
  }

  requestPoints() {
    const result: String = this.pointService.requestPoints(this.pointsFormGroup.controls['point'].value);

    if (result === "Request placed") {
      Swal.fire("Success", "Payment requested, once approved by admin it will be added", "success");
      this.clearPaymentData();
      this.fetchRequests();
    }
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