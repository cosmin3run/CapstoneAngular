import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { UserInfo, UserInfoResponse } from '../interfaces/user-info';

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

  patchUserInfo(
    id: string,
    patchUserInfo: UserInfo
  ): Observable<UserInfoResponse> {
    return this.http.put<UserInfoResponse>(
      `${this.URL}/userInfo/${id}`,
      patchUserInfo
    );
  }
}
