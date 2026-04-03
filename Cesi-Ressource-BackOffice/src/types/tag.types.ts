import type { PaginationParams } from './common.types';

export interface Tag {
  id: string;
  label: string;
  creationTime?: string;
}

export interface CreateTagDto {
  label: string;
}

export interface UpdateTagDto {
  label: string;
}

export interface TagQuery extends PaginationParams {
  tagName?: string;
  isDeleted?: boolean;
}
