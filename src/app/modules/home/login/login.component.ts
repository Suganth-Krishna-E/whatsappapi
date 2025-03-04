import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { UserService } from '../../../services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIdValidator } from '../../../validators/user-id.validator';
import { loginUserIdValidator } from '../../../validators/login-user-id.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router, 
    private loggedUserService: LoggeduserService,
    private loginUserIdValidator: loginUserIdValidator
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_$]{7,20}$/)]],
      password: ['', [Validators.required, Validators.minLength(8),
                      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)]],
      userType: ['user', [Validators.required]]
    });

    this.loginForm.controls['userId'].addAsyncValidators([this.loginUserIdValidator.checkUserId(this.loginForm.controls['userType'].value)]);

    this.loginForm.controls['userType'].valueChanges.subscribe(
      (newValue) => {
        this.loginForm.controls['userId'].clearAsyncValidators();
        this.loginForm.controls['userId'].addAsyncValidators([this.loginUserIdValidator.checkUserId(newValue)]);
        this.loginForm.controls['userId'].updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    )
  }

  navigateToUser(userId: string) {
    this.loggedUserService.setUserId(userId);
    this.router.navigate(['/user']);
  }

  navigateToAdmin(adminId: string) {
    this.loggedUserService.setUserId(adminId);
    this.router.navigate(['/admin']);
  }

  loginForm: FormGroup;
  submitted = false;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      this.userService.loginUser(this.loginForm.value).subscribe(
        (response) => {
          Swal.fire("Success", response, "success");
        },
        (error) => {
          if(error.status === 200) {
            Swal.fire("Success", "Login Successful!", "success");
            if(this.loginForm.controls['userType'].value === "admin") {
              this.navigateToAdmin(this.loginForm.controls['userId'].value);
            }
            else {
              this.navigateToUser(this.loginForm.controls['userId'].value);
            }
          }
          else {
            Swal.fire("Error", "Invalid UserID or Password", "error");
          }
        }
      );
    } else {
      Swal.fire("Error", "Please enter valid details", "error");
    }
  }

}
