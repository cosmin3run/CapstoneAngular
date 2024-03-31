import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { UserResponse } from 'src/app/interfaces/user';
import { UserInfoResponse } from 'src/app/interfaces/user-info';
import { UserPostsResponse } from 'src/app/interfaces/user-posts';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  user!: UserInfoResponse | null;
  userPosts: UserPostsResponse[] = [];
  token!: Auth | null;
  textToCopy: string = '';
  showMore: boolean = false;
  userInfoId!: string;
  constructor(
    private authSrv: AuthService,
    private userSrv: UserInfoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.route.params.subscribe((params) => {
        this.userInfoId = params['id'];
        console.log(this.userInfoId);
      });
      this.getUserInfo(this.userInfoId);
      this.getPostByUserInfoId(this.userInfoId);
    }
  }

  getToken() {
    this.authSrv.token$.subscribe((_token) => {
      this.token = _token;
    });
  }
  getPostByUserInfoId(id: string): void {
    this.userSrv
      .getUserPostByUserInfoId(id)
      .subscribe((post: UserPostsResponse[]) => {
        this.userPosts = post;
        console.log(this.userPosts);
      });
  }

  getUserInfo(id: string): void {
    this.userSrv.getUserInfoById(id).subscribe((userInfo: UserInfoResponse) => {
      this.user = userInfo;
      console.log(this.user);
    });
  }
  copyText(): void {
    navigator.clipboard
      .writeText(this.textToCopy)
      .then(() => alert('Testo copiato!'))
      .catch((err) => console.error('Impossibile copiare il testo:', err));
  }
  toggleShowMore() {
    this.showMore = !this.showMore;
  }
  checkPost(id: string) {
    this.router.navigate(['/post', id]);
  }
}
