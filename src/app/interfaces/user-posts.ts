import { PostContentResponse } from './post-content';
import { UserInfo, UserInfoResponse } from './user-info';

export interface UserPosts {
  title: string;
  publicationDate: Date;
}

export interface UserPostsResponse {
  id: string;
  title: string;
  mainImg: string;
  imageId: string;
  publicationDate: Date;
  userInfo: UserInfoResponse;
  postsContent: PostContentResponse[];
}
