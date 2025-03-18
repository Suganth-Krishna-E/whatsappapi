import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginUserIdValidator } from '../../../validators/login-user-id.validator';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordVisible: boolean = false;
  passwordInputType: string = "password";
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private loginUserIdValidator: loginUserIdValidator
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_$]{7,20}$/)]],
      password: ['', [Validators.required, Validators.minLength(8),
                      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)]],
      userType: ['user', [Validators.required]]
    });

    this.loginForm.controls['userId'].addAsyncValidators([this.loginUserIdValidator.checkUserId(this.loginForm.controls['userType'].value)]);

    this.subscriptions.push(
      this.loginForm.controls['userType'].valueChanges.subscribe(
        (newValue) => {
          this.loginForm.controls['userId'].clearAsyncValidators();
          this.loginForm.controls['userId'].addAsyncValidators([this.loginUserIdValidator.checkUserId(newValue)]);
          this.loginForm.controls['userId'].updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
      )
    );
    
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    if(this.passwordInputType === "text") {
      this.passwordInputType = "password";
    }
    else {
      this.passwordInputType = "text";
    }
  }

  loginForm: FormGroup;
  submitted = false;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    } else {
      Swal.fire("Error", "Please enter valid details", "error");
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
  }

}
