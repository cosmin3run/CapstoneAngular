import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo, UserInfoResponse } from 'src/app/interfaces/user-info';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userInfo?: UserInfoResponse[] = [];
  token!: Auth | null;
  page = 0;
  size = 10;
  orderBy = 'id';

  constructor(
    private authSrv: AuthService,
    private userInfoSrv: UserInfoService
  ) {}

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.getUserInfo();
    }
  }

  getUserInfo(): void {
    this.userInfoSrv
      .getAllUserInfo(this.page, this.size, this.orderBy)
      .subscribe(
        (response) => {
          this.userInfo = response.content;
          console.log(this.userInfo);
        },
        (error) => {
          console.error(
            'Errore nel recupero delle informazioni degli utenti:',
            error
          );
        }
      );
  }

  getToken() {
    this.authSrv.token$.subscribe((_token) => {
      this.token = _token;
    });
  }
}
