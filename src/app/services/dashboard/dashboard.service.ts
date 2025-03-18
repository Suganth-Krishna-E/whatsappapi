import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl;

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) {
    this.baseUrl = this.apiAddressHolder.dashboardUrl;
   }

  getDashboardStatsUser(userId: String | null) {
    return this.http.get<APIResponse>(`${this.baseUrl}getUserDashboardData/${userId}`);
  }

  getDashboardStatsAdmin() {
    return this.http.get<APIResponseAdmin>(`${this.baseUrl}getAdminDashboardData`);
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

interface DashboardResponseAdmin {
  noOfUsers? : number;
  noOfSessions? : number;
  noOfActiveSessions? : number;
  noOfInactiveSessions? : number;
  noOfUnsolvedComplaints? : number;
  totalNoOfMessages? : number;
  totalNoOfPointRequests? : number;
  ratios: { [key: string]: string }; 
}

interface APIResponse {
  message: string;
  response: DashboardResponse;
  code: number;
}

interface APIResponseAdmin {
  message: string;
  response: DashboardResponseAdmin;
  code: number;
}
