import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { PostContentResponse } from 'src/app/interfaces/post-content';
import { UserPostsResponse } from 'src/app/interfaces/user-posts';
import { UserInfoService } from 'src/app/services/user-info.service';
import { PostContentFormComponent } from '../post-content-form/post-content-form.component';
import { UserResponse } from 'src/app/interfaces/user';
import { UserInfoResponse } from 'src/app/interfaces/user-info';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  date: string = '2024-12-12';
  id!: string;
  token!: Auth | null;
  postId!: string;
  post?: UserPostsResponse;
  postContent: PostContentResponse[] = [];
  loggedUser?: UserResponse | null;
  userInfoLocal!: UserInfoResponse;
  constructor(
    private authSrv: AuthService,
    private userSrv: UserInfoService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.route.params.subscribe((params) => {
        this.postId = params['id'];
      });
      this.getPostById(this.postId);
      this.getUserProfile();
    }
  }

  getToken() {
    this.authSrv.token$.subscribe((_token) => {
      this.token = _token;
    });
  }

  getUserInfo(id: string): void {
    this.userSrv.getUserInfoById(id).subscribe((userInfo: UserInfoResponse) => {
      this.userInfoLocal = userInfo;
      console.log(this.userInfoLocal);
    });
  }
  getUserProfile(): void {
    this.authSrv.getLoggedUser().subscribe(
      (user: UserResponse | null) => {
        this.loggedUser = user;
      },
      (error) => {
        console.error('Errore nel recupero del profilo utente:', error);
      }
    );
  }
  getPostById(id: string): void {
    this.userSrv.getPostById(id).subscribe((post: UserPostsResponse) => {
      this.post = post;
      console.log(this.post);

      if (this.post.userInfo) {
        this.getUserInfo(this.post.userInfo.id);
      }
      this.getPostContentByPostId(post.id);
    });
  }

  getPostContentByPostId(postId: string): void {
    this.userSrv
      .getPostContentByPostId(postId)
      .subscribe((postContent: PostContentResponse[]) => {
        this.postContent = postContent;
        console.log(this.postContent);
      });
  }
  openImageModal(imageUrl: string): void {
    this.dialog.open(PostContentFormComponent, {
      data: { imageUrl: imageUrl },
      panelClass: 'custom-lightbox',
    });
  }

  deletePostContentById(id: string): void {
    this.userSrv.deletePostContentById(id).subscribe(() => {
      this.postContent = this.postContent.filter(
        (postContent) => postContent.id !== id
      );
      alert('contenuto eliminato');
    });
  }
}
