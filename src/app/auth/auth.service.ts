import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';
import { LoginComponent } from './login/login.component';
import { LoginResponse } from '../interfaces/login-response';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  URL = environment.apiURL;
  private authSbj = new BehaviorSubject<null | Auth>(null);
  token$ = this.authSbj.asObservable();
  token!: Auth;

  constructor(private http: HttpClient, private router: Router) {}

  register(user: { username: string; email: string; password: string }) {
    return this.http.post(`${this.URL}/auth/register`, user).pipe(
      tap(() => {
        this.router.navigate(['/login']), catchError(this.errors);
      })
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<Auth>(`${this.URL}/auth/login`, data).pipe(
      tap((loggedIn) => {
        this.authSbj.next(loggedIn);
        this.token = loggedIn;
        localStorage.setItem('accessToken', JSON.stringify(loggedIn));
        alert('Login effettuato');
        this.router.navigate(['/']);
        console.log(loggedIn);
      }),
      catchError(this.errors)
    );
  }

  logout() {
    this.authSbj.next(null);
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(`${this.URL}/user/me`);
  }

  restore() {
    const user = localStorage.getItem('accessToken');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const UserData: Auth = JSON.parse(user);

    if (this.jwtHelper.isTokenExpired(UserData.accessToken)) {
      this.router.navigate(['/login']);
    }
    this.authSbj.next(UserData);
  }

  private errors(err: any) {
    console.log(err);
    switch (err.error) {
      case 'Username è obbligatorio':
        return throwError(() => new Error('Username è obbligatorio'));
        break;

      case 'Email è obbligatoria per la registrazione':
        return throwError(
          () => new Error('Email è obbligatoria per la registrazione')
        );
        break;

      case 'Email non valida':
        return throwError(() => new Error('Email non valida'));
        break;

      case 'La password è obbligatoria':
        return throwError(() => new Error('La password è obbligatoria'));
        break;

      case 'La password deve contenere almeno 3 caratteri':
        return throwError(
          () => new Error('La password deve contenere almeno 3 caratteri')
        );
        break;

      default:
        return throwError('Errore');
        break;
    }
  }
}
