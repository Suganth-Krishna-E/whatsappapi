import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  createUser(user: CreateUserRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.baseUserUrl}create`, user, { headers });
  }

  loginUser(user: LoginUserRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.baseUserUrl}login`, user, { headers });
  }

  checkUserIdAvailability(userId: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.baseUserUrl}userIdAvailable/${userId}`);
  }

  checkAdminIdAvailability(adminId: string): Observable<{ available: boolean}> {
    return this.http.get<{ available: boolean }>(`${this.baseUserUrl}adminIdAvailable/${adminId}`);
  }
}

interface CreateUserRequest {
  userId: string;
  userName: string;
  companyName: string;
  gstNumber: string;
  emailId: string;
  mobileNumber: string;
  address: string;
  password: string;
}

interface LoginUserRequest {
  userId: string;
  password: string;
  userType: string;
}