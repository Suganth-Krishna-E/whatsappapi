import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes("login")) {
    return next(req);
  }
  else {
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 413 && error.error?.message === "The given JWT token mismatch") {
          Swal.fire("JWT token mismatch", "The given JWT token for current user is invalid", "error");
        }
        else if(error.status === 414 && error.error?.message === "JWT token expired") {
          Swal.fire("JWT token expired", "Clearing session please login again", "error");
          localStorage.clear();
        }
        return throwError(() => error);
      })
    );
  }
};
