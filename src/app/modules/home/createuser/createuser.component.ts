import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})

export class CreateuserComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{3,50}$/)]],
      userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{7,20}$/)]],
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

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.valid) {
      console.log('User Data:', this.registerForm.value);
      alert('Registration successful!');
      this.registerForm.reset();
      this.submitted = false;
    }
  }
}
