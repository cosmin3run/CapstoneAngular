export interface PostContent {
  title: string;
  content: string;
  postId: string | undefined;
}

export interface PostContentResponse {
  id: string;
  title: string;
  content: string;
  postId: string;
  image: string;
}
