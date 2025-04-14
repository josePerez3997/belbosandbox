import { Routes } from '@angular/router';
import { BankListComponent } from './pages/bank-list/bank-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const BANKS_ROUTES: Routes = [
    {
        path: '',
        component: BankListComponent,
        canActivate: [AuthGuard],
    },
];