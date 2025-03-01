import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WhatsappService } from '../../../services/whatsapp/whatsapp.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registerwhatsapp',
  templateUrl: './registerwhatsapp.component.html',
  styleUrls: ['./registerwhatsapp.component.css']
})
export class RegisterwhatsappComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    qrCode: new FormControl(null),
    statusOfQr: new FormControl(null)
  });

  userId!: string | null;

  constructor(
    private whatsappService: WhatsappService,
    private loggedUserService: LoggeduserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.loggedUserService.getUserId();

    this.whatsappService.getQRCodeObservable().subscribe(qr => {
      if (qr) {
        this.formGroup.controls['qrCode'].setValue(qr);
      }
    });
    
    this.whatsappService.getStatusObservable().subscribe(status => {
      if (status) {
        this.formGroup.controls['statusOfQr'].setValue(status);
        if(this.formGroup.controls['statusOfQr'].value === "WhatsApp registered successfully!") {
          this.router.navigate(['/']);
        }
      }
    });
  }

  generateQR() {
    if (!this.userId) {
      Swal.fire("Error", "User ID is missing.", "error");
      return;
    }

    try {
      this.whatsappService.generateQR(this.userId);
    }
    catch(error) {
      Swal.fire("Error", "Error while getting QR from BackEnd", "error");
    }
  }
}
