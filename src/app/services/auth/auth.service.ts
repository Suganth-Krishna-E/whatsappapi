import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedInUserSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  loggedInUserId = this.loggedInUserSubject.asObservable();
  subscriptions: Subscription[] = [];

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(login: Login) {
    this.subscriptions.push(
      this.http.post<any>('http://localhost:5004/api/whatsapp/user/login', login).subscribe(
        (response) => {
          Swal.fire("Login Successful", "Navigating to home page", "success");
          const token = response.token;
          this.loggedIn.next(true);
          this.loggedInUserSubject.next(login.userId);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', login.userId);
          if (login.userType === "admin") {
            this.router.navigate(['/admin']);
          }
          else {
            this.router.navigate(['/user']);
          }
        },
        (error) => {
          if (error.status === 200) {
            Swal.fire("Login Successful", "Navigating to home page", "success");
            const token = error.token;
            this.loggedIn.next(true);
            this.loggedInUserSubject.next(login.userId);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', login.userId);
            if (login.userType === "admin") {
              this.router.navigate(['/admin']);
              return;
            }
            else {
              this.router.navigate(['/user']);
              return;
            }
          }
          Swal.fire("Login Unsuccessful", "The entered password is wrong, Please verify", "error");
          this.loggedIn.next(false);
          this.router.navigate(["/login"]);
        }
      )
    );
  }

  logout() {
    Swal.fire({
      title: 'Logout!',
      text: `Are you sure you want to logout from current session?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, Logout`,
      cancelButtonText: 'No, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loggedIn.next(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.router.navigate(["/login"]);
      }
    });

  }

  checkLoggedIn(): boolean {
    if (this.loggedIn.value === true) {
      return true;
    }
    else {
      Swal.fire("Error", "User not logged in please login to continue", "error").then(() => {
        this.router.navigate(["/login"]);
      });
      return false;
    }
  }

  getLoginStatus(): boolean {
    if(this.loggedIn.value === true) {
      return true;
    }
    else {
      return false;
    }
  }

  getLoggedUserId(): string {
    this.checkLoggedIn();

    return this.loggedInUserSubject.value;
  }

  autoLogin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.loggedInUserSubject.next(userId);
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
  }


  getUserRole(): string | null {
    const token = localStorage.getItem('token');

    let tokenNotNull: string = "null";

    if (token != null) {
      tokenNotNull = token;
    }

    let jwtData = tokenNotNull.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)

    return decodedJwtData.roles;
  }
}

interface Login {
  userId: string;
  userType: string;
  password: string;
}

