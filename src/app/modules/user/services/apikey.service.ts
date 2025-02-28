import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApikeyService {
  private baseUrl = 'http://localhost:5004/api/whatsapp/key/';

  constructor(private http: HttpClient) { }

  getCurrentApiKey(userId: String | null) {
    return this.http.get<ApiKeyResponse>(`${this.baseUrl}getApiKey/${userId}`, { responseType: 'json'});
  }

  regenerateApiKey(userId: String | null) {
    return this.http.get(`${this.baseUrl}regenerateApiKey/${userId}`);
  }
}

interface ApiKeyResponse {
  apiKey: String;
}
