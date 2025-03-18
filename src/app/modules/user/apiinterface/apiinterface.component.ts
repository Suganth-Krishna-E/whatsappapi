import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApikeyService } from '../../../services/apikey/apikey.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apiinterface',
  templateUrl: './apiinterface.component.html',
  styleUrl: './apiinterface.component.css'
})
export class ApiinterfaceComponent {
  apiKey: String | null;
  subscriptions: Subscription[] = [];

  constructor(
    private apiKeyServie: ApikeyService,
    private authService: AuthService,
  ) {
    this.apiKey = null;
  }

  ngOnInit() {
    this.authService.checkLoggedIn();

  }

  getAPIKey() {
    this.fetchKey();
  }

  regenerateAPIKey() {
    this.subscriptions.push(
      this.apiKeyServie.regenerateApiKey(this.authService.getLoggedUserId()).subscribe(
        (response) => {
          if (response)
            this.fetchKey();
        },
        (error) => {
          if(error.status === 200) {
            this.fetchKey();
          }
          else {
            Swal.fire("Error", error.message, "error");
          }
        }
      )
    );
  }

  fetchKey() {
    this.subscriptions.push(
      this.apiKeyServie.getCurrentApiKey(this.authService.getLoggedUserId()).subscribe(
        (response: ApiKeyResponse) => {
          Swal.fire("Success", "API Key fetched", "success");
          this.apiKey = response.apiKey;
        },
        (error) => {
          if (error.status === 200) {
            Swal.fire("Success", "API Key fetched", "success");
            this.apiKey = error.error;
          } else if (error.status === 410) {
            Swal.fire("Failed", "The user is not available in the backend", "warning");
          } else if (error.status === 901) {
            Swal.fire("No Key Found", "Please generate an API key first", "warning");
          } else {
            Swal.fire("Error", error.message, "error");
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
  }

}

interface ApiKeyResponse {
  apiKey: String;
}
