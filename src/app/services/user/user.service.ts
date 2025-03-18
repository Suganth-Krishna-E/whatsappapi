import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUserUrl;

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) {
    this.baseUserUrl = this.apiAddressHolder.whatsAppUrl;
  }

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

  getAllUsers( page: number, size: number) {
    return this.http.get(`${this.baseUserUrl}getAllUsers/${page}/${size}`);
  }

  getTotalPagesCount(size: number) {
    return this.http.get(`${this.baseUserUrl}getTotalUsersCount/${size}`);
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