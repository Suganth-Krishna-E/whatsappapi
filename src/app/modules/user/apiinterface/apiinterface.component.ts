import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApikeyService } from '../../../services/apikey/apikey.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { error } from 'console';
import Swal from 'sweetalert2';
import e from 'express';

@Component({
  selector: 'app-apiinterface',
  templateUrl: './apiinterface.component.html',
  styleUrl: './apiinterface.component.css'
})
export class ApiinterfaceComponent {
  apiKey: String | null;

  constructor(private http: HttpClient, private apiKeyServie: ApikeyService, private loggedUserService: LoggeduserService) {
    this.apiKey = null;
  }

  getAPIKey() {
    this.fetchKey();
  }

  regenerateAPIKey() {
    this.apiKeyServie.regenerateApiKey(this.loggedUserService.getUserId()).subscribe(
      (response) => {
        if(response)
        console.log(response);
        this.fetchKey();
      },
      (error) => {
        console.log(error);
        this.fetchKey();
      }
    );
  }

  fetchKey() {
    this.apiKeyServie.getCurrentApiKey(this.loggedUserService.getUserId()).subscribe(
      (response: ApiKeyResponse) => {
        Swal.fire("Success", "API Key fetched", "success");
        this.apiKey = response.apiKey; 
      },
      (error) => {
        console.log("Error Response:", error);
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
    );
  }
  
}

interface ApiKeyResponse {
  apiKey: String;
}
