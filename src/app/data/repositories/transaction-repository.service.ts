import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from '@angular/fire/firestore';
import { Transaction } from '../models/transaction.model';
import { BelvoApiService } from '../api/belvo-api.service';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionRepositoryService {
  private firestore = inject(Firestore);
  private belvoApi = inject(BelvoApiService);
  private authService = inject(AuthService);
  
  private transactionsCollection = collection(this.firestore, 'transactions');
  private userTransactionsCollection = collection(this.firestore, 'user_transactions');

  private getDateRange(days = 90): { fromDate: string, toDate: string } {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    return {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0]
    };
  }

  getTransactions(linkId: string, days = 90, forceRefresh = false): Observable<Transaction[]> {
    const { fromDate, toDate } = this.getDateRange(days);
    
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        return from(getDocs(
          query(
            this.userTransactionsCollection, 
            where('userId', '==', user.uid),
            where('linkId', '==', linkId)
          )
        )).pipe(
          switchMap(snapshot => {
            const transactionIds = snapshot.docs.map(doc => doc.data()['transactionId']);
            
            if (transactionIds.length > 0 && !forceRefresh) {
              const transactionPromises = transactionIds.map(txId => 
                getDocs(query(this.transactionsCollection, where('id', '==', txId)))
                  .then(snap => {
                    const doc = snap.docs[0];
                    return doc ? { id: doc.id, ...doc.data() } as Transaction : null;
                  })
              );
              
              return from(Promise.all(transactionPromises)).pipe(
                map(transactions => transactions.filter(tx => tx !== null) as Transaction[]),
                map(transactions => this.sortTransactions(transactions))
              );
            }
            
            return this.belvoApi.getTransactions(linkId, fromDate, toDate).pipe(
              switchMap(transactions => {
                const formattedTransactions = transactions.map(tx => ({
                  ...tx,
                  date: new Date(tx.value_date || tx.collected_at).toLocaleDateString()
                }));
                
                const saveTransactions = formattedTransactions.map(tx => {
                  const txRef = doc(this.transactionsCollection, tx.id);
                  return setDoc(txRef, tx, { merge: true });
                });
                
                const saveUserTransactions = formattedTransactions.map(tx => {
                  const userTxRef = doc(this.userTransactionsCollection);
                  return setDoc(userTxRef, {
                    userId: user.uid,
                    transactionId: tx.id,
                    linkId,
                    accountId: tx.account?.id,
                    date: tx.value_date || tx.collected_at,
                    addedAt: new Date().toISOString()
                  });
                });
                
                return from(Promise.all([...saveTransactions, ...saveUserTransactions])).pipe(
                  map(() => this.sortTransactions(formattedTransactions))
                );
              })
            );
          })
        );
      })
    );
  }

  getTransactionsByAccount(accountId: string, days = 90): Observable<Transaction[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        return from(getDocs(
          query(
            this.userTransactionsCollection, 
            where('userId', '==', user.uid),
            where('accountId', '==', accountId)
          )
        )).pipe(
          switchMap(snapshot => {
            const transactionIds = snapshot.docs.map(doc => doc.data()['transactionId']);
            
            if (transactionIds.length === 0) return of([]);
            
            const transactionPromises = transactionIds.map(txId => 
              getDocs(query(this.transactionsCollection, where('id', '==', txId)))
                .then(snap => {
                  const doc = snap.docs[0];
                  return doc ? { id: doc.id, ...doc.data() } as Transaction : null;
                })
            );
            
            return from(Promise.all(transactionPromises)).pipe(
              map(transactions => transactions.filter(tx => tx !== null) as Transaction[]),
              map(transactions => this.sortTransactions(transactions))
            );
          })
        );
      })
    );
  }

  private sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const dateA = new Date(a.value_date || a.collected_at);
      const dateB = new Date(b.value_date || b.collected_at);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getFinancialSummary(transactions: Transaction[]): { 
    balance: number; 
    income: number; 
    expenses: number;
    categories: Record<string, number>;
  } {
    const income = transactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const expenses = transactions
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const balance = income + expenses;
    
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      if (!tx.category) return;
      
      if (!categories[tx.category]) {
        categories[tx.category] = 0;
      }
      
      categories[tx.category] += tx.amount;
    });
    
    return { balance, income, expenses, categories };
  }
}