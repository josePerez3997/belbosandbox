import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsService } from '../../services/accounts.service';
import { Observable, catchError, of } from 'rxjs';
import { Account } from '../../../../data/models/account.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-account-list',
  imports: [CommonModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private router = inject(Router);
  
  accounts$!: Observable<Account[]>;
  errorMessage: string | null = null;
  isLoading = true;
  selectedBank: any;

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading = true;
    this.errorMessage = null;
    
    const storedBank = localStorage.getItem('selectedBank');
    this.selectedBank = storedBank ? JSON.parse(storedBank) : null;
    
    if (!this.selectedBank) {
      this.isLoading = false;
      this.errorMessage = 'No se ha seleccionado ningún banco.';
      return;
    }
    
    this.accounts$ = this.accountsService.getAccounts(this.selectedBank.linkId).pipe(
      catchError(error => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al cargar las cuentas';
        return of([]);
      })
    );
    
    const subscription = this.accounts$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }

  goToTransactions(accountId: string) {
    localStorage.setItem('selectedAccountId', accountId); 
    this.router.navigate(['/transactions']); 
  }

}