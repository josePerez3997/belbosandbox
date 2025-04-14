import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MOCK_TRANSACTIONS } from '../../../mock/mock-transactions';
import { MOCK_ACCOUNTS } from '../../../mock/mock-accounts';
import { MOCK_LINK } from '../../../mock/mock-link';

@Injectable({
    providedIn: 'root',
})
export class BelvoService {
    private http = inject(HttpClient);
    private belvoApiUrl = environment.belvoApi.baseUrl;

    createLink(institution: string): Observable<any> {
        let credentials: any = { institution };

        credentials.username = 'user_valid';
        credentials.password = 'pass_valid';

        switch (institution) {
            case 'heimdall_co_retail': // MFA
                credentials.username = 'mfa_default';
                credentials.password = 'pass_valid';
                break;

            case 'darkside_mx_retail': // Token
                credentials.username = 'token_valid';
                credentials.password = 'pass_valid';
                credentials.access_token = '123456';
                break;

            case 'ironbank_br_retail': // Advanced login
            case 'ironbank_br_business':
                credentials = {
                    institution,
                    username: 'adv_valid',
                    password: 'pass_valid',
                    username2: 'valid',
                    password2: 'valid',
                    username_type: '003', 
                };
                break;

            case 'ofmockbank_br_retail': // Advanced login
                credentials = {
                    institution,
                    username: 'user_valid',
                    password: 'pass_valid',
                    username_type: '103',
                };
                break;

            case 'planet_mx_employment':
                credentials.username = 'john_doe';
                credentials.password = 'password';
                break;

            case 'safra_br_business': // CPF + CNPJ
                credentials.username = 'cpf_valid';
                credentials.password = 'pass_valid';
                credentials.username2 = 'cnpj_valid';
                credentials.password2 = 'pass_valid';
                break;

            case 'targobank_mx_retail': // OTP
                credentials.username = 'otp_valid';
                credentials.password = 'pass_valid';
                break;

            case 'banxico_mx_retail': // Empty credentials
                delete credentials.username;
                delete credentials.password;
                break;

            default:
                break;
        }

        console.log(`Creando link para: ${institution}`, credentials);
        return this.http.post(`${this.belvoApiUrl}/links/`, credentials);
    }

    getAccounts(linkId: string): Observable<any> {
        return this.http.get(`${this.belvoApiUrl}/accounts/?link=${linkId}`);
    }

    getTransactions(linkId: string, dateFrom: string, dateTo: string): Observable<any> {
        return this.http.get(
            `${this.belvoApiUrl}/transactions/?link=${linkId}&date_from=${dateFrom}&date_to=${dateTo}`
        );
    }

    //mocks:
    getAccountsMock(linkId: string): Observable<any> {
        console.log('[MOCK] Usando cuentas simuladas');
        return of(MOCK_ACCOUNTS);
    }

    getTransactionsMock(linkId: string, dateFrom: string, dateTo: string): Observable<any> {
        console.log('[MOCK] Usando transacciones simuladas');
        return of(MOCK_TRANSACTIONS);
    }

    createLinkMockMock(institution: string): Observable<any> {
        console.log('[MOCK] Creando link simulado para:', institution);
        return of(MOCK_LINK);
    }
}
