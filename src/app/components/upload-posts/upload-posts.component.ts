import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfoResponse } from 'src/app/interfaces/user-info';
import { UserPosts, UserPostsResponse } from 'src/app/interfaces/user-posts';
import { PostUserInfoComponent } from 'src/app/post-user-info/post-user-info.component';
import { UserInfoService } from 'src/app/services/user-info.service';
import { PostContentFormComponent } from '../post-content-form/post-content-form.component';

@Component({
  selector: 'app-upload-posts',
  templateUrl: './upload-posts.component.html',
  styleUrls: ['./upload-posts.component.scss'],
})
export class UploadPostsComponent implements OnInit {
  userInfo!: UserInfoResponse | null | undefined;
  token!: Auth | null;
  userPost!: UserPostsResponse | null;

  @ViewChild('fileInput') fileInput: any;
  file: File = new File([''], '');
  previewUrl: string | ArrayBuffer | null = null;
  mainImg: string | undefined;
  id: string | undefined;

  constructor(
    private authSrv: AuthService,
    private userSrv: UserInfoService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.getUserInfo();
    }
  }

  getToken() {
    this.authSrv.token$.subscribe((_token) => {
      this.token = _token;
    });
  }
  getUserInfo(): void {
    if (this.userInfo !== null) {
      this.userSrv.getLoggedUserInfo().subscribe(
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

  uploadUserPost(form: NgForm): void {
    if (this.userInfo) {
      const title = form.value.title;
      const publicationDate = form.value.publicationDate;
      const postData = {
        title: title,
        publicationDate: publicationDate,
      };
      console.log(postData);

      this.userSrv
        .postUserPost(postData)
        .subscribe((response: UserPostsResponse | null) => {
          this.userPost = response;
          this.id = response?.id;

          console.log(this.file);
          if (this.file.size > 0) {
            this.postMailImg(this.file, response!.id);
          }
        });
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

  postMailImg(file: File, id: string) {
    const formData = new FormData();
    formData.append('img', file);

    this.userSrv.uploadMainImgPost(formData, id).subscribe({
      next: (responseUrl: any) => {
        this.mainImg = responseUrl;
      },
    });
  }
  popupPostContent() {
    const dialogRef = this.dialog.open(PostContentFormComponent);
  }
}
