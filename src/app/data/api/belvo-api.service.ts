import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bank } from '../models/bank.model';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class BelvoApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.belvoApi.baseUrl;

  getInstitutions(country?: string): Observable<Bank[]> {
    let url = `${this.baseUrl}/institutions/`;
    if (country) {
      url += `?country=${country}`;
    }
    return this.http.get<Bank[]>(url);
  }

  createLink(institution: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/links/`, {
      institution,
      username,
      password,
      save_data: true
    });
  }

  getLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/links/`);
  }

  getAccounts(link?: string): Observable<Account[]> {
    let url = `${this.baseUrl}/accounts/`;
    if (link) {
      url += `?link=${link}`;
    }
    return this.http.get<Account[]>(url);
  }

  getTransactions(link: string, dateFrom: string, dateTo: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/?link=${link}&date_from=${dateFrom}&date_to=${dateTo}`);
  }
}