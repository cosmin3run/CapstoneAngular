import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorSrv: ErrorService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // Errore client-side
          errorMessage = `Errore: ${err.error.message}`;
        } else {
          // Errore server-side
          errorMessage = err.error.message || 'Errore non specificato';
        }
        this.errorSrv.setError(errorMessage);
        return of(err);
      })
    );
  }
}
