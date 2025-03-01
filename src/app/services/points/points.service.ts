import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggeduserService } from '../loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private socket: WebSocket | null = null;
  statusSubject = new BehaviorSubject<string | null>(null);
  private orderId: String | null = null;
  private baseUrl = 'http://localhost:5004/api/whatsapp/points/';
  private pointRequestUrl = 'http://localhost:5004/api/whatsapp/pointrequest/';
  private readonly wsUrl = 'ws://localhost:5007';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 0;


  constructor(private http: HttpClient, private loggedUserService: LoggeduserService) {
    this.connectWebSocket();
  }

  connectWebSocket() {
    try {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.socket = new WebSocket(this.wsUrl);

        this.socket.onopen = () => {
          this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => this.handleMessage(event.data);
        this.socket.onerror = (error) => this.handleError(error);
        this.socket.onclose = () => this.handleReconnect();
      }
    }
    catch (error) {
      Swal.fire("Web Socket Error", "The connection to websocket failed please contact administrator", "warning")
    }
  }


  requestQr(points: Number) {
    return this.http.post<QrCodeData>(`${this.baseUrl}addPoints`, { "userId": this.loggedUserService.getUserId(), "pointsRequested": points });
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get(`${this.pointRequestUrl}getPreviousRequestCount/${userId}?size=${size}`);
  }

  getAllRequestsByUserId(userId: String | null, page: number, size: number) {
    return this.http.get(`${this.pointRequestUrl}getRequestsByUserId/${userId}?page=${page}&size=${size}`);
  }

  requestPoints(points: number): String {
    this.http.post(`${this.pointRequestUrl}requestPoints`, { "userId": this.loggedUserService.getUserId(), "pointsRequested": points }).subscribe(
      (error: any) => {
        if (error.status === 410) {
          Swal.fire("Error", "User not available", "error");
          return "User not avilable";
        }
        else {
          Swal.fire("Error", error.message, "error");
          return error.message;
        }
      }
    );
    return "Request placed";
  }

  setOrderId(orderId: String | null) {
    this.orderId = orderId;
  }

  getPaymentStatus(orderId: String | null) {
    return this.http.get(`${this.baseUrl}status/${orderId}`);
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      if (message.type === "SUCCESS" && message.orderId === this.orderId) {
        this.statusSubject.next("SUCCESS");
        Swal.fire("Success", "The payment is successful and points added to your account", "success");
      } else if (message.type === "FAILED" && message.orderId === this.orderId) {
        this.statusSubject.next("FAILED");
        Swal.fire("Failed", "Payment failed please retry", "warning");
      }
    } catch (error: any) {
      Swal.fire("Error", error, "error");
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connectWebSocket(), 2000);
    } else {
      Swal.fire("Error", "Failed to reconnect WebSocket after multiple attempts.", "error");
    }
  }

  private handleError(error: any) {
    this.handleReconnect();
  }

  getStatusObservable() {
    return this.statusSubject.asObservable();
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

