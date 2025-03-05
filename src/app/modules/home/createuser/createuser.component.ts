import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { UserIdValidator } from '../../../validators/user-id.validator';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})

export class CreateuserComponent {
  registerForm: FormGroup;
  submitted = false;
  subscriptions: Subscription[] = [];

  constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private userIdValidator: UserIdValidator,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]{3,50}$/)]],
      userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_$]{7,20}$/)], [this.userIdValidator.checkUserId()]],
      companyName: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      gstNumber: ['', [Validators.pattern(/^[a-zA-Z0-9]{15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      password: ['', [Validators.required, Validators.minLength(8), 
                     Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)]],
      isBusiness: [false]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.subscriptions.push(
        this.userService.createUser(this.registerForm.value).subscribe(
          (response) => {
            Swal.fire("User created", response.message, "success");
          },
          (error) => {
            if(error.status === 200) {
              Swal.fire("User created", "User created successfully, Please login and enjoy", "success");
              this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
              this.registerForm.reset();
            }
            else {
              Swal.fire("User created", "User created successfully, Please login and enjoy", "success");
            }
          }
        )
      );
      this.submitted = false;
    }
    else {
      Swal.fire("Error", "Details are incomplete please make all data align with constraints", "error");
    }
  }
}
