import { Routes } from '@angular/router';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const ACCOUNTS_ROUTES: Routes = [
    {
        path: '',
        component: AccountListComponent,
        canActivate: [AuthGuard]
    }
];
