import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ApiAddressHolderService } from '../apiAddress/api-address-holder.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUserUrl;

  constructor(private http: HttpClient, private apiAddressHolder: ApiAddressHolderService) {
    this.baseUserUrl = this.apiAddressHolder.whatsAppUrl;
  }

  createUser(user: CreateUserRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<APIResponse>(`${this.baseUserUrl}create`, user, { headers });
  }

  loginUser(user: LoginUserRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<APIResponse>(`${this.baseUserUrl}login`, user, { headers });
  }

  checkUserIdAvailability(userId: string): Observable<{ available: boolean }> {
    return this.http.get<APIResponse>(`${this.baseUserUrl}userIdAvailable/${userId}`)
    .pipe(
      // tap((response: APIResponse) => {
      //   console.log(response);
      // }),
      map((response: APIResponse) => ({ available: response.response }))
    );
  }

  checkAdminIdAvailability(adminId: string): Observable<{ available: boolean}> {
    return this.http.get<APIResponse>(`${this.baseUserUrl}adminIdAvailable/${adminId}`)
    .pipe(
      // tap((response: APIResponse) => {
      //   console.log(response);
      // }),
      map((response: APIResponse) => ({ available: response.response }))
    );
  }

  getAllUsers( page: number, size: number) {
    return this.http.get<APIResponseUserList>(`${this.baseUserUrl}getAllUsers/${page}/${size}`);
  }

  getTotalPagesCount(size: number) {
    return this.http.get<APIResponsePageCount>(`${this.baseUserUrl}getTotalUsersCount/${size}`);
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

interface APIResponse {
  message: string;
  response: boolean;
  code: number;
}

interface APIResponsePageCount {
  message: string;
  response: {page: number};
  code: number;
}

interface APIResponseUserList {
  message: string;
  response: User[];
  code: number;
}

interface User {
  userId: string;
  userName: string;
  companyName: string;
  mobileNumber: string;
  gstNumber: string;
  address: string;
  points: number;
  createdAt: string;
}