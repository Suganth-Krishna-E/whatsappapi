import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WhatsappService } from '../services/whatsapp.service';
import { LoggeduserService } from '../services/loggeduser.service';

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
    private loggedUserService: LoggeduserService
  ) {}

  ngOnInit() {
    this.userId = this.loggedUserService.getUserId();

    // Subscribe to QR Code updates
    this.whatsappService.getQRCodeObservable().subscribe(qr => {
      if (qr) {
        this.formGroup.controls['qrCode'].setValue(qr);
      }
    });

    // Subscribe to WhatsApp status updates
    this.whatsappService.getStatusObservable().subscribe(status => {
      if (status) {
        console.log("Status:", status);
        this.formGroup.controls['statusOfQr'].setValue(status);
      }
    });
  }

  generateQR() {
    this.whatsappService.generateQR(this.userId);
  }
}
