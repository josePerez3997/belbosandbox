import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Bank, BelvoAPI } from '../../../data/models/bank.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BanksService {
    private http = inject(HttpClient);
    private baseUrl = environment.belvoApi.baseUrl + '/institutions/';

    getBanks(country?: string): Observable<Bank[]> {
        let url = this.baseUrl;
        if (country) {
            url += `?country_code=${country}`;
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        return this.http.get<BelvoAPI.Institution[] | BelvoAPI.PaginatedResponse<BelvoAPI.Institution>>(url, { headers }).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return this.mapInstitutionsToBanks(response);
                } 
                else if (response && 'results' in response && Array.isArray(response.results)) {
                    return this.mapInstitutionsToBanks(response.results);
                }
                
                throw new Error('Respuesta de API con formato inesperado');
            }),
            catchError((error: HttpErrorResponse | Error) => {
                if (error instanceof HttpErrorResponse) {
                    return throwError(() => ({
                        status: error.status,
                        message: this.getErrorMessage(error)
                    }));
                }
                return throwError(() => ({
                    status: 0,
                    message: error.message || 'Error desconocido'
                }));
            })
        );
    }

    private mapInstitutionsToBanks(institutions: BelvoAPI.Institution[]): Bank[] {
        return institutions.map(institution => ({
            id: institution.id || institution.name,
            name: institution.name || '',
            country: institution.country_codes?.[0] || '',
            type: institution.type || 'bank',
            logo: institution.icon_logo || institution.logo || '',
        }));
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 401:
                return 'No autorizado. Verifique sus credenciales de API.';
            case 403:
                return 'Acceso prohibido a este recurso.';
            case 404:
                return 'El recurso solicitado no existe.';
            case 429:
                return 'Demasiadas solicitudes. Intente más tarde.';
            case 500:
            case 502:
            case 503:
            case 504:
                return 'Error del servidor. Intente más tarde.';
            default:
                return error.message || 'Error desconocido en la comunicación con la API.';
        }
    }
}