import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  private baseUrl;

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) {
    this.baseUrl = this.apiAddressHolder.getAllMessagesByUserIdUrl;
  }

  getMessagesByUser(userId: String | null, page: number, size: number) {
    return this.http.get<APIResponse>(`${this.baseUrl}/${userId}?page=${page}&size=${size}`);
  }

  getTotalPagesCount(userId: String | null, size: number) {
    return this.http.get<APIResponsePageCount>(`${this.apiAddressHolder.getTotalMessagesCountUrl}/${userId}?size=${size}`);
  }
}

interface APIResponse {
  message: string;
  response: Message[];
  code: number;
}

interface APIResponsePageCount {
  message: string;
  response: {page: number};
  code: number;
}

interface Message {
  id: string;
  userId: string;
  recipient: string;
  message: string;
  status: string;
  statusMessage: string;
  timestamp: string;
}