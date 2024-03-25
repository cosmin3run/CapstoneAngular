import { UserInfo, UserInfoResponse } from './user-info';

export interface UserPosts {
  title: string;
  publicationDate: Date;
}

export interface UserPostsResponse {
  id: string;
  title: string;
  publicationDate: Date;
  userInfo: UserInfoResponse;
}
