import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class ApikeyService {
  private baseUrl;

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) { 
    this.baseUrl = this.apiAddressHolder.whatsAppKeyUrl;
  }

  getCurrentApiKey(userId: String | null) {
    return this.http.get<APIResponse>(`${this.baseUrl}getApiKey/${userId}`, { responseType: 'json'});
  }

  regenerateApiKey(userId: String | null) {
    return this.http.get<APIResponse>(`${this.baseUrl}regenerateApiKey/${userId}`);
  }
}

interface ApiKeyResponse {
  apiKey: String;
}

interface APIResponse {
  message: string;
  response: ApiKeyResponse;
  code: number;
}
