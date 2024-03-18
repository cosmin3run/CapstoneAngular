import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserResponse } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/interfaces/user-info';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  token!: Auth | null;
  user!: UserResponse | null;
  isTokenValid: boolean = false;
  jwtHelper = new JwtHelperService();

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.getUserProfile();
    }
  }

  getToken() {
    this.authSrv.token$.subscribe((_token) => {
      this.token = _token;
      if (this.token) {
        this.isTokenValid = !this.jwtHelper.isTokenExpired(
          this.token.accessToken
        );
        if (this.isTokenValid) {
          this.getUserProfile();
        }
      }
    });
  }

  getUserProfile(): void {
    this.authSrv.getLoggedUser().subscribe(
      (user: UserResponse | null) => {
        this.user = user;
        console.log(user);
      },
      (error) => {
        console.error('Errore nel recupero del profilo utente:', error);
      }
    );
  }

  logout() {
    this.authSrv.logout();
  }
}
