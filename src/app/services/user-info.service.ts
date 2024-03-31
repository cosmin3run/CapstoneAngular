import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { UserInfo, UserInfoResponse } from '../interfaces/user-info';
import { UserPosts, UserPostsResponse } from '../interfaces/user-posts';
import { PostComponent } from '../components/post/post.component';
import { PostContent, PostContentResponse } from '../interfaces/post-content';

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

  postPostContent(postContent: PostContent): Observable<PostContentResponse> {
    return this.http.post<PostContentResponse>(
      `${this.URL}/postContent`,
      postContent
    );
  }

  getUserInfoById(id: string): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.URL}/userInfo/${id}`);
  }

  getUserPostByUserInfoId(id: string): Observable<UserPostsResponse[]> {
    return this.http.get<UserPostsResponse[]>(`${this.URL}/post/user/${id}`);
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

  getAllPosts(page: number, size: number, orderBy: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderBy', orderBy);
    return this.http.get<UserPostsResponse>(`${this.URL}/post`, {
      params: params,
    });
  }

  getLoggedUserPosts(): Observable<UserPostsResponse[]> {
    return this.http.get<UserPostsResponse[]>(`${this.URL}/post/me`);
  }

  getPostById(id: string): Observable<UserPostsResponse> {
    return this.http.get<UserPostsResponse>(`${this.URL}/post/${id}`);
  }
  deletePostById(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/post/${id}`);
  }

  deletePostContentById(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/postContent/${id}`);
  }
  getPostContentByPostId(
    postId: string | undefined
  ): Observable<PostContentResponse[]> {
    return this.http.get<PostContentResponse[]>(
      `${this.URL}/postContent/post/${postId}`
    );
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

  uploadContentImg(img: FormData, id: string): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    img.append('id', id);
    console.log(img);

    return this.http.post<any>(`${this.URL}/postContent/upload`, img, {
      headers: headers,
    });
  }
}
