import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../interfaces/user';
import { Auth } from '../auth/auth';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserInfo, UserInfoResponse } from '../interfaces/user-info';
import { UserInfoService } from '../services/user-info.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-user-info',
  templateUrl: './post-user-info.component.html',
  styleUrls: ['./post-user-info.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
})
export class PostUserInfoComponent implements OnInit {
  user!: UserResponse | null;
  token!: Auth | null;
  userInfo!: UserInfoResponse | null;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private userInfoSrv: UserInfoService
  ) {}

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
      (user: UserResponse | null) => {
        this.user = user;
      },
      (error) => {
        console.error('Errore nel recupero del profilo utente:', error);
      }
    );
  }

  postUserInfoSubmit(postUserInfo: NgForm): void {
    console.log(postUserInfo.value);
    this.userInfoSrv.postUserInfo(postUserInfo.value).subscribe();
  }

  // patchUserInfoSubmit(id: string, patchUserInfoForm: NgForm): void {
  //   if (patchUserInfoForm.valid) {
  //     this.userInfoSrv.patchUserInfo(id, user);
  //   }
  // }

  getUserInfo(): void {
    this.userInfoSrv
      .getLoggedUserInfo()
      .subscribe((userInfo: UserInfoResponse | null) => {
        this.userInfo = userInfo;
      });
  }
}
