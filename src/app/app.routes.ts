import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'banks',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/banks/banks.routes').then((m) => m.BANKS_ROUTES),
    },
    {
        path: 'accounts',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
    },
    {
        path: 'transactions',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/transactions/transactions.routes').then((m) => m.TRANSACTIONS_ROUTES),
    },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login' },
];
