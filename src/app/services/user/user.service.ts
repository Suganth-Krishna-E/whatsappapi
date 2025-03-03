import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUserUrl = "http://localhost:5004/api/whatsapp/user/"

  constructor(private http: HttpClient) {}

  searchUsers(searchText: string): Observable<any[]> {
    return this.http.get<String[]>(`${this.baseUserUrl}search?query=${searchText}`);
  }
}
