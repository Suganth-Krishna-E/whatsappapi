import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseUrl: string;


  private categories: string[] = ['Messages', 'Points', 'Registration'];

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) { 
    this.baseUrl = this.apiAddressHolder.complaintUrl;
  }

  getAllComplaintsByUserId(userId: String | null, page: number, size: number) {
    return this.http.get<APIResponseComplaints>(`${this.baseUrl}getComplaintsByUserId/${userId}?page=${page}&size=${size}`);
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get<APIResponsePageNumber>(`${this.baseUrl}getTotalPageCount/${userId}?size=${size}`);
  }

  registerComplaint(complaint: { category: string; message: string }): Observable<any> {
    return this.http.post<APIResponse>(`${this.baseUrl}registerComplaint`, complaint);
  }

  resolveComplaint(complaint: {id: string, message: string, adminId: string}): Observable<any> {
    return this.http.post<APIResponse>(`${this.baseUrl}updateComplaint`, complaint);
  }

  getCategories(): string[] {
    return this.categories;
  }
}

interface APIResponse {
  message: string;
  response: object;
  code: number;
}

interface APIResponsePageNumber {
  message: string;
  response: {page: number};
  code: number;
}

interface APIResponseComplaints {
  message: string;
  response: Complaint[];
  code: number;
}

interface Complaint {
  id: string;
  userId: string;
  category: string;
  status: string;
  message: string;
  adminMessage: string;
  adminId: string;
  registeredTimestamp: string;
  resolvedTimestamp: string;
}