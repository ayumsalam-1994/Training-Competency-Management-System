import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
