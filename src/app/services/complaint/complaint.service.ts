import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseUrl = "http://localhost:5004/api/whatsapp/complaint/"

  private categories: string[] = ['Messages', 'Points', 'Registration'];

  constructor(private http: HttpClient) { }

  getAllComplaintsByUserId(userId: String | null, page: number, size: number) {
    return this.http.get(`${this.baseUrl}getComplaintsByUserId/${userId}?page=${page}&size=${size}`);
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get(`${this.baseUrl}getTotalPageCount/${userId}?size=${size}`);
  }

  registerComplaint(complaint: { category: string; message: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}registerComplaint`, complaint);
  }

  resolveComplaint(complaint: {id: string, message: string, adminId: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}updateComplaint`, complaint);
  }

  getCategories(): string[] {
    return this.categories;
  }
}