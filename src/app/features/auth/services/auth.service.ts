import { Injectable, inject, NgZone } from '@angular/core';
import { 
  Auth, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  authState 
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private zone = inject(NgZone);

  user$: Observable<User | null> = authState(this.auth);
  
  login(email: string, password: string) {
    return from(this.zone.run(() => signInWithEmailAndPassword(this.auth, email, password)))
      .pipe(
        tap(() => {
          console.log('Login successful');
        })
      );
  }

  register(email: string, password: string) {
    return from(this.zone.run(() => createUserWithEmailAndPassword(this.auth, email, password)))
      .pipe(
        tap(() => {
          console.log('Registration successful');
        })
      );
  }

  logout() {
    return from(this.zone.run(() => signOut(this.auth)))
      .pipe(
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      );
  }
}