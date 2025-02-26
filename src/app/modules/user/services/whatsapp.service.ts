import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private socket: WebSocket | null = null;
  private qrCodeSubject = new BehaviorSubject<string | null>(null);
  private statusSubject = new BehaviorSubject<string | null>(null);
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 0;

  private readonly wsUrl = 'ws://localhost:5005'; 
  private readonly apiUrl = 'http://localhost:5004/api/whatsapp/generateQR';
  private readonly deleteSessionUrl = 'http://localhost:5004/api/whatsapp/deleteSession';

  constructor(private http: HttpClient, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.connectWebSocket();
  }


  connectWebSocket() {
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

  generateQR(userId: string | null) {
    if (!userId) {
      Swal.fire("Error", "User ID is missing.", "error");
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    try {
      this.http.post(this.apiUrl, { userId }, { headers }).subscribe(
        (response: any) => {
          Swal.fire("QR Code Generated", "Scan the QR code to log in.", "info");
        },
        error => {
          if (error.status === 602) {
            Swal.fire("Warning", "There is session available for the given userId.", "warning");
            Swal.fire({
              title: 'Delete existing session?',
              text: 'Do you want to the existing session from DB?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, continue',
            }).then((result) => {
              if (result.isConfirmed) {
                console.log("Delete called");
                this.http.post(this.deleteSessionUrl, { userId }, { headers }).subscribe(
                  (response: any) => {
                    console.log(response);
                    this.generateQR(userId);
                  },
                  error => {
                    console.log(error);
                  }
                );
              }
            });
          } 
          else if (error.status === 200) {
            Swal.fire("Sucess", "Session saved to DB sucessfully", "success");
            this.router.navigate(["user/dashboard"]);
          }
          else if(error.status === 601) {
            Swal.fire("Warning", "There is no session data found for the given userId", "warning");
          }
          else {
            Swal.fire("Warning", error.message, "warning");
          }
        }
      );  
    }
    catch(error) {
      Swal.fire("Error", "Error from BackEnd", "error");
    }
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);

      if (message.type === "QR_CODE") {
        this.qrCodeSubject.next(message.qrCode);
      } else if (message.type === "REGISTRATION_SUCCESS") {
        this.statusSubject.next(message.message);
        console.log(message);
        Swal.fire("Success", message.message, "success");
      } else if (message.type === "REGISTRATION_FAILED") {
        Swal.fire("Error", message.message, "error");
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

  getQRCodeObservable() {
    return this.qrCodeSubject.asObservable();
  }

  getStatusObservable() {
    return this.statusSubject.asObservable();
  }
}
