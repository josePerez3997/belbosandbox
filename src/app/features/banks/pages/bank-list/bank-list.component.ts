import { Component, inject, OnInit } from '@angular/core';
import { BanksService } from '../../services/banks.service';
import { BelvoService } from '../../services/belvo.service';
import { Router } from '@angular/router';
import { AsyncPipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { Bank } from '../../../../data/models/bank.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.scss'
})
export class BankListComponent implements OnInit {
  private banksService = inject(BanksService);
  private belvoService = inject(BelvoService);
  private router = inject(Router);

  banks$ = this.banksService.getBanks();
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit() {
    const errorMsg = localStorage.getItem('bankSelectionError');
    if (errorMsg) {
      this.errorMessage = errorMsg;
      localStorage.removeItem('bankSelectionError');
    }
  }

  selectBank(bank: Bank) {
    this.isLoading = true;
    this.errorMessage = null;

    this.belvoService.createLinkMockMock(bank.name)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Link creado exitosamente:', response);

          const bankData = {
            ...bank,
            linkId: response.id
          };

          localStorage.setItem('selectedBank', JSON.stringify(bankData));

          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error al crear link:', error);

          let errorMsg = 'Error al conectar con el banco. ';

          if (error.error && Array.isArray(error.error)) {
            errorMsg += error.error[0]?.detail || error.error[0]?.message || JSON.stringify(error.error);
          } else if (error.error) {
            errorMsg += error.error.message || JSON.stringify(error.error);
          } else {
            errorMsg += error.message || 'Error desconocido';
          }

          this.errorMessage = errorMsg;
        }
      });

    /*this.belvoService.createLink(bank.name)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Link creado exitosamente:', response);

          const bankData = {
            ...bank,
            linkId: response.id
          };

          localStorage.setItem('selectedBank', JSON.stringify(bankData));

          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error al crear link:', error);

          let errorMsg = 'Error al conectar con el banco. ';

          if (error.error && Array.isArray(error.error)) {
            errorMsg += error.error[0]?.detail || error.error[0]?.message || JSON.stringify(error.error);
          } else if (error.error) {
            errorMsg += error.error.message || JSON.stringify(error.error);
          } else {
            errorMsg += error.message || 'Error desconocido';
          }

          this.errorMessage = errorMsg;
        }
      });*/
  }
}