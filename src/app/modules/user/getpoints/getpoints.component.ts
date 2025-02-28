import { Component } from '@angular/core';
import { PointsService } from '../services/points.service';
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

  constructor(private pointService: PointsService) {
    this.pointService.getStatusObservable().subscribe(status => {
      if (status) {
        this.paymentStatus = status;
      }
    });
  }

  

  requestPoints() {
    this.pointService.requestQr(50).subscribe(
      (response: QrCodeData) => {
        console.log(response);
        this.qrCode = response.qr_code_url;
        this.orderId = response.order_id;
        this.pointService.setOrderId(this.orderId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkPaymentStatus() {
    this.pointService.getPaymentStatus(this.orderId).subscribe(
      (response: any) => {
        console.log('Payment Status:', response);
        if (response.status === 'captured') {
          alert('Payment Successful! Points Added.');
        } else {
          alert('Payment Pending or Failed.');
        }
      },
      (error) => {
        console.log('Error checking payment status:', error);
      }
    );
  }
  
}

interface QrCodeData {
  order_id: string;
  qr_code_url: string;
}