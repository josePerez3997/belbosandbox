import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit 
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  private firestore = inject(Firestore);

  saveDocument<T extends { id?: string }>(
    collectionName: string, 
    data: T, 
    customId?: string
  ): Observable<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docId = customId || data.id || doc(collectionRef).id;
    const docRef = doc(collectionRef, docId);
    
    const docData = { ...data, id: docId };
    
    return from(setDoc(docRef, docData)).pipe(
      map(() => docId),
      catchError(error => throwError(() => 
        new Error(`Error saving document in ${collectionName}: ${error.message}`)
      ))
    );
  }

  getDocument<T>(
    collectionName: string,
    docId: string
  ): Observable<T | null> {
    const docRef = doc(this.firestore, collectionName, docId);
    
    return from(getDoc(docRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as T;
        }
        return null;
      }),
      catchError(error => throwError(() => 
        new Error(`Error getting document from ${collectionName}: ${error.message}`)
      ))
    );
  }

  queryDocuments<T>(
    collectionName: string,
    whereConditions: Array<{ field: string; operator: '=='; value: any }> = [],
    orderByField?: string,
    limitCount?: number,
    direction: 'asc' | 'desc' = 'asc'
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    
    let queryRef = query(collectionRef);
    
    whereConditions.forEach(condition => {
      queryRef = query(queryRef, where(condition.field, condition.operator, condition.value));
    });
    
    if (orderByField) {
      queryRef = query(queryRef, orderBy(orderByField, direction));
    }
    
    if (limitCount) {
      queryRef = query(queryRef, limit(limitCount));
    }
    
    return from(getDocs(queryRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
      ),
      catchError(error => throwError(() => 
        new Error(`Error querying documents in ${collectionName}: ${error.message}`)
      ))
    );
  }

  updateDocument<T>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Observable<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    
    return from(updateDoc(docRef, data as any)).pipe(
      catchError(error => throwError(() => 
        new Error(`Error updating document in ${collectionName}: ${error.message}`)
      ))
    );
  }

  deleteDocument(
    collectionName: string,
    docId: string
  ): Observable<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    
    return from(deleteDoc(docRef)).pipe(
      catchError(error => throwError(() => 
        new Error(`Error deleting document in ${collectionName}: ${error.message}`)
      ))
    );
  }
}