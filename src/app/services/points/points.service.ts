import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggeduserService } from '../loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private socket: WebSocket | null = null;
  statusSubject = new BehaviorSubject<string | null>(null);
  private orderId: String | null = null;
  private baseUrl: string;
  private pointRequestUrl: string;
  private wsUrl: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 1;
  subscriptions: Subscription[] = [];


  constructor(private http: HttpClient, private authService: AuthService, private apiAddressService: ApiAddressHolderService) {
    this.baseUrl = this.apiAddressService.pointsUrl;
    this.pointRequestUrl = this.apiAddressService.pointRequestUrl;
    this.wsUrl = this.apiAddressService.paymentWebSocketUrl;

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
    return this.http.post<APIResponseQrCodeData>(`${this.baseUrl}addPoints`, { "userId": this.authService.getLoggedUserId(), "pointsRequested": points });
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get<APIResponsePages>(`${this.pointRequestUrl}getPreviousRequestCount/${size}?userId=${userId}`);
  }

  getAllRequestsByUserId(userId: String | null, page: number, size: number): Observable<any> {
    return this.http.get<APIResponsePointRequests>(`${this.pointRequestUrl}getRequestsByUserId/?userId=${userId}&page=${page}&size=${size}`);
  }

  requestPoints(points: number): Observable<any> {
    return this.http.post<APIResponse>(`${this.pointRequestUrl}requestPoints`, { "userId": this.authService.getLoggedUserId(), "pointsRequested": points });
  }

  setOrderId(orderId: String | null) {
    this.orderId = orderId;
  }

  getPaymentStatus(orderId: String | null) {
    return this.http.get<APIResponse>(`${this.baseUrl}status/${orderId}`);
  }

  changeRequestStatus(pointRequestId: string, status: string, message: string) {
    const pointRequest: PointRequest = {
      id: pointRequestId,
      status: status,
      message: message,
      allocatedBy: this.authService.getLoggedUserId()
    };

    return this.http.post(`${this.pointRequestUrl}changeStatus`, pointRequest);
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

  closeWebSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

interface PointRequest {
  id: string;
  status: string;
  message: string;
  allocatedBy: string | null;
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