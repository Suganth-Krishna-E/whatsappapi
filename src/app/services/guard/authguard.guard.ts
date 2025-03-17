import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

export const authguardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = authService.getUserRole();

  if (!userRole || (expectedRole && userRole !== expectedRole)) {
    Swal.fire({
      title: "Error!!",
      text: "Unauthorized data access, Please login again to continue",
      icon: "error",
      confirmButtonText: "OK"
    }).then(() => {
      authService.logout();
    });

    return false;
  }

  return true;
  
};
