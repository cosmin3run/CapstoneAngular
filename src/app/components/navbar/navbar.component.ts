import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  token!: Auth | null;
  user!: User | null;
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
    });
  }

  getUserProfile(): void {
    this.authSrv.getLoggedUser().subscribe(
      (user: User | null) => {
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
