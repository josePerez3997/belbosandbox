import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes(environment.belvoApi.baseUrl)) {
        const secretId = environment.belvoApi.secretId;
        const secretPassword = environment.belvoApi.secretPassword;

        const credentials = btoa(`${secretId}:${secretPassword}`);

        const authReq = req.clone({
            setHeaders: {
                Authorization: `Basic ${credentials}`
            }
        });

        return next(authReq);
    }

    return next(req);
};