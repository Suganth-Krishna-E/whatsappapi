import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = "http://localhost:5004/api/whatsapp/message/"

  constructor(private http: HttpClient) { }

  getAllMessagesWithRatio(userId: String | null) {
    return this.http.get(`${this.baseUrl}getAllMessagesRatioByStatus/${userId}`);
  }

}
