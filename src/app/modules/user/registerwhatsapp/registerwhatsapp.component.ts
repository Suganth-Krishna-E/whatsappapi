import { Component } from '@angular/core';
import { WhatsappService } from '../../../services/whatsapp.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LoggeduserService } from '../../../services/loggeduser.service';

@Component({
  selector: 'app-registerwhatsapp',
  templateUrl: './registerwhatsapp.component.html',
  styleUrl: './registerwhatsapp.component.css'
})
export class RegisterwhatsappComponent {
  formGroup: FormGroup = new FormGroup({
    qrCode: new FormControl([]),
    statusOfQr: new FormControl([])
  });

  userId!: string | null;

  constructor(private whatsappService: WhatsappService, private loggedUserService: LoggeduserService) {}

  ngOnInit() {
    this.whatsappService.connectWebSocket();

    // Subscribe to QR Code updates
    this.whatsappService.getQRCodeObservable().subscribe(qr => {
      if (qr) {
        this.formGroup.controls['qrCode'].setValue(qr);
      }
    });

    // Subscribe to WhatsApp status updates
    this.whatsappService.getStatusObservable().subscribe(status => {
      if (status) {
        console.log(status);
        this.formGroup.controls['statusOfQr'].setValue(status);
      }
    });

    this.userId = this.loggedUserService.getUserId();
  }

  generateQR() {
    this.whatsappService.generateQR(this.userId).subscribe();
  }
}
