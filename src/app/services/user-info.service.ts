import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { UserInfo, UserInfoResponse } from '../interfaces/user-info';
import { UserPosts, UserPostsResponse } from '../interfaces/user-posts';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  URL = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  getLoggedUserInfo(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.URL}/userInfo/me`);
  }

  postUserInfo(postUserInfo: UserInfo): Observable<UserInfoResponse> {
    return this.http.post<UserInfoResponse>(
      `${this.URL}/userInfo`,
      postUserInfo
    );
  }

  postUserPost(postUserPost: UserPosts): Observable<UserPostsResponse> {
    return this.http.post<UserPostsResponse>(`${this.URL}/post`, postUserPost);
  }

  getAllUserInfo(page: number, size: number, orderBy: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderBy', orderBy);
    return this.http.get<UserInfoResponse>(`${this.URL}/userInfo`, {
      params: params,
    });
  }

  uploadAvatar(img: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(img);

    return this.http.post<any>(`${this.URL}/userInfo/upload`, img, {
      headers: headers,
    });
  }

  uploadMainImgPost(img: FormData, id: string): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    img.append('id', id);
    console.log(img);

    return this.http.post<any>(`${this.URL}/post/upload`, img, {
      headers: headers,
    });
  }
}
