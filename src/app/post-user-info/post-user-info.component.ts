import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-post-user-info',
  templateUrl: './post-user-info.component.html',
  styleUrls: ['./post-user-info.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
  ],
})
export class PostUserInfoComponent implements OnInit {
  user!: UserResponse | null;
  token!: Auth | null;
  avatarUrl: string | undefined;
  @ViewChild('fileInput') fileInput: any;
  file: File = new File([''], '');
  previewUrl: string | ArrayBuffer | null = null;
  userInfo!: UserInfoResponse | null | undefined;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private userInfoSrv: UserInfoService,
    private dialog: MatDialog
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

  postUserInfoSubmit(postUserInfo: NgForm, clickedButton: string): void {
    if (clickedButton === 'submit') {
      this.userInfoSrv.postUserInfo(postUserInfo.value).subscribe(() => {
        this.postAvatar(this.file);
        // window.location.reload();
      });

      const dialogRef = this.dialog.closeAll();
    } else if (clickedButton === 'updateAvatar') {
      this.postAvatar(this.file);
      if (this.file.size > 0) {
        alert('Immagine aggiornata, aggiorna la pagina.');
      }
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.previewFile(file);
    }
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
  }

  postAvatar(file: File) {
    const formData = new FormData();
    formData.append('img', file);

    this.userInfoSrv.uploadAvatar(formData).subscribe({
      next: (responseUrl: any) => {
        this.avatarUrl = responseUrl;
      },
    });
  }

  getUserInfo(): void {
    if (this.userInfo !== null) {
      this.userInfoSrv.getLoggedUserInfo().subscribe(
        (userInfo: UserInfoResponse | null) => {
          this.userInfo = userInfo;
        },
        (error) => {
          console.error(
            'Errore nel recupero delle informazioni utente:',
            error
          );
        }
      );
    } else {
      this.userInfo = null;
      console.error(
        'userInfo è null. Impossibile recuperare le informazioni utente.'
      );
    }
  }
}
