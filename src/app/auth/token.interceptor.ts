import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  newReq!: HttpRequest<any>;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authSrv.token$.pipe(
      take(1),
      switchMap((token) => {
        if (!token) {
          return next.handle(request);
        }
        this.newReq = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${token.accessToken}`
          ),
        });
        return next.handle(this.newReq);
      })
    );
  }
}
