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
import { Account } from '../models/account.model';
import { BelvoApiService } from '../api/belvo-api.service';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountRepositoryService {
  private firestore = inject(Firestore);
  private belvoApi = inject(BelvoApiService);
  private authService = inject(AuthService);
  
  private accountsCollection = collection(this.firestore, 'accounts');
  private userAccountsCollection = collection(this.firestore, 'user_accounts');

  getAccounts(linkId?: string, forceRefresh = false): Observable<Account[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        return from(getDocs(
          query(this.userAccountsCollection, where('userId', '==', user.uid))
        )).pipe(
          switchMap(snapshot => {
            const userAccountDocs = snapshot.docs;
            const accountIds = userAccountDocs
              .filter(doc => !linkId || doc.data()['linkId'] === linkId)
              .map(doc => doc.data()['accountId']);
            
            if (accountIds.length > 0 && !forceRefresh) {
              const accountPromises = accountIds.map(accountId => 
                getDocs(query(this.accountsCollection, where('id', '==', accountId)))
                  .then(snap => snap.docs[0]?.data() as Account)
              );
              
              return from(Promise.all(accountPromises));
            }
            
            return this.belvoApi.getAccounts(linkId).pipe(
              switchMap(accounts => {
                const saveAccounts = accounts.map(account => {
                  const accountRef = doc(this.accountsCollection, account.id);
                  return setDoc(accountRef, account, { merge: true });
                });
                
                const saveUserAccounts = accounts.map(account => {
                  const userAccountRef = doc(this.userAccountsCollection);
                  return setDoc(userAccountRef, {
                    userId: user.uid,
                    accountId: account.id,
                    linkId: account.link,
                    addedAt: new Date().toISOString()
                  });
                });
                
                return from(Promise.all([...saveAccounts, ...saveUserAccounts])).pipe(
                  map(() => accounts)
                );
              })
            );
          })
        );
      })
    );
  }

  getAccountById(accountId: string): Observable<Account | null> {
    return from(getDocs(
      query(this.accountsCollection, where('id', '==', accountId))
    )).pipe(
      map(snapshot => {
        const doc = snapshot.docs[0];
        return doc ? (doc.data() as Account) : null;
      })
    );
  }

  getAccountsByBank(bankId: string): Observable<Account[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        return from(getDocs(
          query(collection(this.firestore, 'links'), where('institution', '==', bankId))
        )).pipe(
          switchMap(snapshot => {
            const linkIds = snapshot.docs.map(doc => doc.id);
            if (linkIds.length === 0) return of([]);
            
            return this.getAccounts(linkIds[0]);
          })
        );
      })
    );
  }
}