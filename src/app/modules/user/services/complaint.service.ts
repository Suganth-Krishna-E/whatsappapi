import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private basrUrl = "http://localhost:5004/api/whatsapp/"

  constructor(private http: HttpClient) { }

  getAllComplaintsByUserId(userId: String | null, page: number, size: number) {
    return this.http.get(`${this.basrUrl}getComplaintsByUserId/${userId}?page=${page}&size=${size}`);
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get(`${this.basrUrl}getTotalPageCount/${userId}?size=${size}`);
  }
}