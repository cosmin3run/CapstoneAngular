import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserResponse } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { PostUserInfoComponent } from 'src/app/post-user-info/post-user-info.component';
import { UploadPostsComponent } from '../upload-posts/upload-posts.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: UserResponse | null;
  token!: Auth | null;
  textToCopy: string = '';
  constructor(
    private authSrv: AuthService,
    private router: Router,
    public dialog: MatDialog
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

  copyText(): void {
    navigator.clipboard
      .writeText(this.textToCopy)
      .then(() => alert('Testo copiato!'))
      .catch((err) => console.error('Impossibile copiare il testo:', err));
  }

  popupPostUserInfo() {
    const dialogRef = this.dialog.open(PostUserInfoComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.getUserProfile();
    });
  }
}
