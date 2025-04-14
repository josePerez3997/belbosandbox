import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {
            if (error.status === 401) {
                router.navigate(['/auth/login']);
            }

            if (error.status === 403) {
                router.navigate(['/auth/login']);
            }

            console.error('API Error:', error);

            return throwError(() => error);
        })
    );
};