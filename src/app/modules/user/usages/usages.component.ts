import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MessageServiceService } from '../../../services/message/message-service.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usages',
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.css']
})
export class UsagesComponent {
  messages: Message[] = []; 
  subscriptions: Subscription[] = [];
  userId: string | null = null;
  page = 0;
  size = 5;
  totalPages = 0;

  constructor(
    private messageService: MessageServiceService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.userId = this.authService.getLoggedUserId();

    this.fetchMessages();
  }

  fetchMessages() {
    this.subscriptions.push(
      this.messageService.getTotalPagesCount(this.userId, this.size).subscribe(
        (response: APIResponsePageCount) => {
          if(response.code === 200) {
            this.totalPages = response.response.page || 1;
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        }
      )
    );
    
    this.subscriptions.push(
      this.messageService.getMessagesByUser(this.userId, this.page, this.size).subscribe(
        (response: APIResponse) => {
          if(response.code === 200) {
            this.messages = response.response || [];  
          }
          else {
            Swal.fire("Error!", response.message, "error");
          }
        },
        (error) => {
          this.messages = []; 
          Swal.fire("Error!", error.message, "error");
        }
      )
    );
  }

  formatTime(timestampOrNull: string | null): String {
    if(timestampOrNull !== null) {
      return `${new Date(timestampOrNull).toLocaleDateString('en-US', { hour12: false })}  ${new Date(timestampOrNull).toLocaleTimeString('en-US', { hour12: false })}`;  
    }
    else {
      return "No time found";
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchMessages();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchMessages();
    }
  }

  isErrorStatus(status: string): string {
    return status?.toLowerCase() === 'failed'? "error" : "success";
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
  }
}

interface Message {
  id: string;
  userId: string;
  recipient: string;
  message: string;
  status: string;
  statusMessage: string;
  timestamp: string;
}


interface APIResponse {
  message: string;
  response: Message[];
  code: number;
}

interface APIResponsePageCount {
  message: string;
  response: {page: number};
  code: number;
}