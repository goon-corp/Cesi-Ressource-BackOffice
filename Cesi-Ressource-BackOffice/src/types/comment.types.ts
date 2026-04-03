export interface Comment {
  id: string;
  content: string;
  ressourceId: string;
  userId: string;
  commentId?: string;
  creationTime: string;
  updateTime?: string;
}

export interface UpdateCommentDto {
  content: string;
}
