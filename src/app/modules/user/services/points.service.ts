import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggeduserService } from './loggeduser.service';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private baseUrl = 'http://localhost:5004/api/whatsapp/points/';

  constructor(private http: HttpClient, private loggedUserService: LoggeduserService) { }


  requestQr(points: Number) {
    return this.http.post<QrCodeData>(`${this.baseUrl}addPoints`, { "userId": this.loggedUserService.getUserId(), "pointsRequested":  points});
  }

  getPaymentStatus(orderId: String) {
    return this.http.get(`${this.baseUrl}status/${orderId}`);
  }
}

interface Payment {
    id: String;
    userId: String;
    pointsRequested: Number;
    orderId: String;
    paymentId: String;
    status: String;
    amount: Number;
    currency: String;
    email: String;
    phone: String;
    createdAt: Date;
}

interface QrCodeData {
  order_id: string;
  qr_code_url: string;
}
