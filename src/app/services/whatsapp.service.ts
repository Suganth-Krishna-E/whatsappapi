import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private stompClient!: Client;
  private qrCodeSubject = new BehaviorSubject<string | null>(null);
  private statusSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  // Generate QR Code for WhatsApp Login
  generateQR(userId: string | null) {
    return this.http.post("http://localhost:5005/api/whatsapp/generateQR", { userId });
  }

  // Connect to WebSocket
  connectWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:5004/ws'),
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to QR Code updates
        this.stompClient.subscribe('/topic/whatsappQR', (message) => {
          this.qrCodeSubject.next(message.body);
        });

        // Subscribe to Status updates
        this.stompClient.subscribe('/topic/whatsappStatus', (message) => {
          this.statusSubject.next(message.body);
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket")
    });

    this.stompClient.activate();
  }

  // Expose QR Code updates as an Observable
  getQRCodeObservable() {
    return this.qrCodeSubject.asObservable();
  }

  // Expose WhatsApp Status updates as an Observable
  getStatusObservable() {
    return this.statusSubject.asObservable();
  }
}
