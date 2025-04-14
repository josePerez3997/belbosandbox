import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction } from '../../../data/models/transaction.model';
import { BelvoService } from '../../banks/services/belvo.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private belvoService = inject(BelvoService);

    getTransactions(): Observable<Transaction[]> {
        const storedBank = localStorage.getItem('selectedBank');
        const storedAccountId = localStorage.getItem('selectedAccountId');

        if (!storedBank) {
            return throwError(() => ({
                status: 400,
                message: 'No hay banco seleccionado'
            }));
        }

        const bankData = JSON.parse(storedBank);
        const linkId = bankData.linkId;

        if (!linkId) {
            return throwError(() => ({
                status: 400,
                message: 'No hay link establecido para este banco'
            }));
        }

        const today = new Date();
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);

        const dateFrom = ninetyDaysAgo.toISOString().split('T')[0];
        const dateTo = today.toISOString().split('T')[0];

        return this.belvoService.getTransactionsMock(linkId, dateFrom, dateTo).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response as Transaction[];
                } else if (response && response.results && Array.isArray(response.results)) {
                    return response.results as Transaction[];
                }

                throw new Error('Formato de respuesta no reconocido');
            }),
            catchError(error => {
                console.error('Error al obtener transacciones:', error);

                let errorMessage = 'Error al obtener transacciones';

                if (error.error && Array.isArray(error.error)) {
                    errorMessage = error.error[0]?.detail ||
                        error.error[0]?.message ||
                        'Error desconocido en la respuesta de la API';
                } else if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                return throwError(() => ({
                    status: error.status || 500,
                    message: errorMessage
                }));
            })
        );
    }
}