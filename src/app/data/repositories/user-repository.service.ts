import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot 
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  saveUser(user: User): Observable<void> {
    const userRef = doc(this.usersCollection, user.uid);
    return from(setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: user.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }, { merge: true })).pipe(
      catchError(error => throwError(() => new Error(`Error saving user: ${error.message}`)))
    );
  }

  getUserById(uid: string): Observable<User | null> {
    const userRef = doc(this.usersCollection, uid);
    
    return new Observable<User | null>(observer => {
      const unsubscribe = onSnapshot(userRef, snapshot => {
        if (snapshot.exists()) {
          observer.next({ uid, ...snapshot.data() } as User);
        } else {
          observer.next(null);
        }
      }, error => {
        observer.error(error);
      });
      
      return unsubscribe;
    });
  }

  updateUserProfile(uid: string, data: Partial<User>): Observable<void> {
    const userRef = doc(this.usersCollection, uid);
    return from(updateDoc(userRef, { ...data })).pipe(
      catchError(error => throwError(() => new Error(`Error updating user profile: ${error.message}`)))
    );
  }
}