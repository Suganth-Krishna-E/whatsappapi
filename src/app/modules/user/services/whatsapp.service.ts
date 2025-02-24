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
  private readonly maxReconnectAttempts = 5;

  private readonly wsUrl = 'ws://localhost:5005'; // ✅ WebSocket for real-time updates
  private readonly apiUrl = 'http://localhost:5004/api/whatsapp/generateQR'; // ✅ Spring Boot API

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
   * Generate QR Code for WhatsApp Login (Calls Spring Boot)
   */
  generateQR(userId: string | null) {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.apiUrl, { userId }, { headers }).subscribe(
      response => {
        console.log("QR Code request sent:", response);
      },
      error => {
        console.error("Error generating QR Code:", error);
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
      console.error("Max WebSocket reconnect attempts reached.");
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
