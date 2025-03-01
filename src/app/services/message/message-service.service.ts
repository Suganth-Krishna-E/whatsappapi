import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  private baseUrl = 'http://localhost:5004/api/whatsapp/message/getAllMessagesByUserId';

  constructor(private http: HttpClient) {}

  getMessagesByUser(userId: String | null, page: number, size: number) {
    return this.http.get(`${this.baseUrl}/${userId}?page=${page}&size=${size}`);
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get(`http://localhost:5004/api/whatsapp/message/getTotalPageCount/${userId}?size=${size}`);
  }
}
