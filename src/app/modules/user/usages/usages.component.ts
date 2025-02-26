import { Component } from '@angular/core';
import { LoggeduserService } from '../services/loggeduser.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MessageServiceService } from '../services/message-service.service';

@Component({
  selector: 'app-usages',
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.css']
})
export class UsagesComponent {
  messages: Message[] = [];  // Ensures it's always an array
  userId: string | null = null;
  page = 0;
  size = 2;
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
    this.messageService.getMessagesByUser(this.userId, this.page, this.size).subscribe(
      (response: any) => {
        console.log("Response:", response);  
        this.messages = response || []; 
        this.page = 1;
        this.totalPages = response?.totalPages || 1; 
      },
      (error) => {
        console.log("Error fetching messages:", error);
        this.messages = []; 
      }
    );
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

  isErrorStatus(status: string): boolean {
    return status?.toLowerCase() === 'error' || status?.toLowerCase() === 'failed';
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
