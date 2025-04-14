import { Injectable, inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Account } from '../../../data/models/account.model';
import { BelvoService } from '../../banks/services/belvo.service';

@Injectable({ providedIn: 'root' })
export class AccountsService {
    private belvoService = inject(BelvoService);

    getAccounts(linkId?: string): Observable<Account[]> {
        console.log('Obteniendo cuentas para linkId:', linkId);

        if (!linkId) {
            return throwError(() => ({
                status: 400,
                message: 'Se requiere seleccionar un banco y establecer una conexión para ver las cuentas.'
            }));
        }

        return this.belvoService.getAccountsMock(linkId).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response as Account[];
                } else if (response && response.results && Array.isArray(response.results)) {
                    return response.results as Account[];
                } else if (response && response.id) {
                    return [response] as Account[];
                }
                
                throw new Error('Formato de respuesta no reconocido');
            }),
            catchError(error => {
                console.error('Error al obtener cuentas:', error);
                
                let errorMessage = 'Error al obtener cuentas';
                
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

        
        /*return this.belvoService.getAccounts(linkId).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response as Account[];
                } else if (response && response.results && Array.isArray(response.results)) {
                    return response.results as Account[];
                } else if (response && response.id) {
                    return [response] as Account[];
                }
                
                throw new Error('Formato de respuesta no reconocido');
            }),
            catchError(error => {
                console.error('Error al obtener cuentas:', error);
                
                let errorMessage = 'Error al obtener cuentas';
                
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
        );*/
    }
}