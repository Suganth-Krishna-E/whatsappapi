import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  /**
   * Connect to WebSocket Server
   */
  connectWebSocket() {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      console.log("Connecting to WebSocket...");
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        console.log("WebSocket connected.");
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => this.handleMessage(event.data);
      this.socket.onerror = (error) => this.handleError(error);
      this.socket.onclose = () => this.handleReconnect();
    }
  }
  
  /**
   * Generate QR Code for WhatsApp Registration
   */
  generateQR(userId: string | null) {
    if (!userId) {
      Swal.fire("Error", "User ID is missing.", "error");
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(this.apiUrl, { userId }, { headers }).subscribe(
      (response: any) => {
        console.log("QR Code request sent:", response);
        Swal.fire("QR Code Generated", "Scan the QR code to log in.", "info");
      },
      error => {
        console.error("Error generating QR Code:", error);
        if (error.status === 409) {
          Swal.fire("Warning", "User is already registered with WhatsApp.", "warning");
        } 
        else if (error.status === 400) {
          Swal.fire("Warning", "User is already registered with WhatsApp.", "warning");
        }
        else {
          Swal.fire("Error", "Failed to generate QR Code. Try again later.", "error");
        }
      }
    );
  }

  /**
   * Handle WebSocket Messages
   */
  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      console.log("Received WebSocket Message:", message);

      if (message.type === "QR_CODE") {
        this.qrCodeSubject.next(message.qrCode);
      } else if (message.type === "REGISTRATION_SUCCESS") {
        this.statusSubject.next(message.message);
        Swal.fire("Success", message.message, "success");
      } else if (message.type === "REGISTRATION_FAILED") {
        Swal.fire("Error", message.message, "error");
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  /**
   * Handle WebSocket Auto-Reconnect
   */
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting WebSocket... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connectWebSocket(), 2000);
    } else {
      Swal.fire("Error", "Failed to reconnect WebSocket after multiple attempts.", "error");
    }
  }

  private handleError(error: any) {
    console.error("WebSocket Error:", error);
    this.handleReconnect();
  }

  /**
   * Get QR Code Observable
   */
  getQRCodeObservable() {
    return this.qrCodeSubject.asObservable();
  }

  /**
   * Get WhatsApp Status Observable
   */
  getStatusObservable() {
    return this.statusSubject.asObservable();
  }
}
