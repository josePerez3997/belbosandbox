import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Bank } from '../models/bank.model';
import { BelvoApiService } from '../api/belvo-api.service';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BankRepositoryService {
  private firestore = inject(Firestore);
  private belvoApi = inject(BelvoApiService);
  private authService = inject(AuthService);

  private banksCollection = collection(this.firestore, 'banks');
  private userBanksCollection = collection(this.firestore, 'user_banks');

  getBanks(forceRefresh = false): Observable<Bank[]> {
    return from(getDocs(query(this.banksCollection, orderBy('name')))).pipe(
      map(snapshot => {
        const banks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bank));

        if (banks.length > 0 && !forceRefresh) {
          return banks;
        }

        throw new Error('No cached banks or force refresh requested');
      }),
      catchError(() => {
        return this.belvoApi.getInstitutions().pipe(
          switchMap(banks => {
            const saveBanks = banks.map(bank => {
              const bankRef = doc(this.banksCollection, bank.id);
              return setDoc(bankRef, bank, { merge: true });
            });

            return from(Promise.all(saveBanks)).pipe(
              map(() => banks)
            );
          })
        );
      })
    );
  }

  getUserSelectedBanks(): Observable<string[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);

        return from(getDocs(
          query(this.userBanksCollection, where('userId', '==', user.uid))
        )).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => doc.data()['bankId']);
          })
        );
      })
    );
  }

  saveUserSelectedBank(bankId: string): Observable<void> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return throwError(() => new Error('User not authenticated'));

        const userBankRef = doc(this.userBanksCollection);
        return from(setDoc(userBankRef, {
          userId: user.uid,
          bankId,
          selectedAt: new Date().toISOString()
        }));
      })
    );
  }
}