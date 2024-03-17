import { UserInfo, UserInfoResponse } from './user-info';

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  userInfo: UserInfoResponse;
}
