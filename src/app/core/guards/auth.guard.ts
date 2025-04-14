import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    return authService.user$.pipe(
      map(user => {
        return user ? true : router.createUrlTree(['/auth/login']);
      })
    );
  };
  
