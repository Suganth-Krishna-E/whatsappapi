import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggeduserService {
  private userId: string | null = null;

  setUserId(id: string | null) {
    this.userId = id;
  }

  getUserId(): string | null {
    return this.userId;
  }
}
