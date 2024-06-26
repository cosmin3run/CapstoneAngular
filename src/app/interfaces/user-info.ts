import { User, UserResponse } from './user';
import { UserPostsResponse } from './user-posts';

export interface UserInfo {
  name: string;
  surname: string;
  linkedin: string;
  github: string;
  instagram: string;
  descriptionTitle: string;
  descriptionBody: string;
}

export interface UserInfoResponse {
  id: string;
  name: string;
  surname: string;
  linkedin: string;
  github: string;
  instagram: string;
  descriptionTitle: string;
  descriptionBody: string;
  avatar: string;
  user: UserResponse;
  post: UserPostsResponse;
}
