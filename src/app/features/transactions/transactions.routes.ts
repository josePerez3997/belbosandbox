import { Routes } from '@angular/router';
import { TransactionListComponent } from './pages/transaction-list/transaction-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    component: TransactionListComponent,
    canActivate: [AuthGuard]
  }
];
