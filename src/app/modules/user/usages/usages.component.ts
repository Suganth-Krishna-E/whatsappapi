import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MessageServiceService } from '../../../services/message/message-service.service';

@Component({
  selector: 'app-usages',
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.css']
})
export class UsagesComponent {
  messages: Message[] = [];  // Ensures it's always an array
  userId: string | null = null;
  page = 0;
  size = 5;
  totalPages = 0;

  constructor(
    private messageService: MessageServiceService,
    private loggedUserService: LoggeduserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.loggedUserService.getUserId();
    if (!this.userId) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      this.fetchMessages();
    }
  }

  fetchMessages() {
    this.messageService.getTotalPagesCount(this.userId, this.size).subscribe(
      (response: any) => {
        this.totalPages = response || 1;
      }
    );
    this.messageService.getMessagesByUser(this.userId, this.page, this.size).subscribe(
      (response: any) => {
        this.messages = response || []; 
      },
      (error) => {
        this.messages = []; 
      }
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
