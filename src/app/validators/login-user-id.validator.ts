import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Injectable({ providedIn: 'root' })
export class loginUserIdValidator {
    constructor(private userService: UserService ) { }

    checkUserId(userType: string): AsyncValidatorFn {
        if(userType === "admin") {
            return (control: AbstractControl): Observable<ValidationErrors | null> => {
                if (!control.value) {
                    return of(null); 
                }
    
                return of(control.value).pipe(
                    debounceTime(5000),
                    switchMap(userId => 
                        this.userService.checkAdminIdAvailability(userId).pipe(
                            // tap((response) => {console.log(response)}),
                            map(response =>  (response ? null : { userIdTaken: true })), 
                            catchError(() => of(null)) 
                        )
                    )
                );
            };
        }
        else {
            return (control: AbstractControl): Observable<ValidationErrors | null> => {
                if (!control.value) {
                    return of(null); 
                }
    
                return of(control.value).pipe(
                    debounceTime(5000),
                    switchMap(userId => 
                        this.userService.checkUserIdAvailability(userId).pipe(
                            // tap((response) => {console.log(response)}),
                            map(response => response.available ? null : { userIdTaken: true }),
                            catchError(() => of(null)) 
                        )
                    )
                );
            };
        }
        
    }
}

interface APIResponse {
    message: string;
    response: {data: boolean};
    code: number;
}