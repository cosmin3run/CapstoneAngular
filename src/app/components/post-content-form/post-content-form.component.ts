import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { UserResponse } from 'src/app/interfaces/user';
import { UserInfoResponse } from 'src/app/interfaces/user-info';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-post-content-form',
  templateUrl: './post-content-form.component.html',
  styleUrls: ['./post-content-form.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
  ],
})
export class PostContentFormComponent implements OnInit {
  user!: UserResponse | null;
  token!: Auth | null;
  @ViewChild('fileInput') fileInput: any;
  file: File = new File([''], '');
  previewUrl: string | ArrayBuffer | null = null;
  userInfo!: UserInfoResponse | null | undefined;
  constructor(
    public dialog: MatDialog,
    private authSrv: AuthService,
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
        this.userInfo = user?.userInfo;
      },
      (error) => {
        console.error('Errore nel recupero del profilo utente:', error);
      }
    );
  }
}
