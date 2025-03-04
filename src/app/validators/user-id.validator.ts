import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Injectable({ providedIn: 'root' })
export class UserIdValidator {
    constructor(private userService: UserService ) { }

    checkUserId(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null); 
            }

            return of(control.value).pipe(
                debounceTime(500),
                switchMap(userId => 
                    this.userService.checkUserIdAvailability(userId).pipe(
                        map(response =>  (response ? { userIdTaken: true } : null)), 
                        catchError(() => of(null)) 
                    )
                )
            );
        };
    }
}
