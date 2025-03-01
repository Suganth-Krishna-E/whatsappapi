import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = "http://localhost:5004/api/whatsapp/dashboard/"

  constructor(private http: HttpClient) { }

  getDashboardStatsUser(userId: String | null) {
    console.log(userId);
    // return this.http.get<Object>(`${this.baseUrl}getUserDashboardData/${userId}`);
    return this.http.get<DashboardResponse>(`${this.baseUrl}getUserDashboardData/${userId}`);
  }

}

interface DashboardResponse {
  totalBoughtPoints? : number;
  totalLeftPoints? : number;
  totalRequestedPoints? : number;
  apiKeyLastGeneratedDateTime? : String;
  whatsAppSessionDetail? : String;
  whatsAppLastRegisteredDateTime? : String;
  FAILED?: number;
  SENT?: number;
  ratios: { [key: string]: string }; 
  totalMessages: number;
}
