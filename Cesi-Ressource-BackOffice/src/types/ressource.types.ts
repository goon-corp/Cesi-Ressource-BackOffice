import type { PaginationParams } from './common.types';

export interface Ressource {
  id: string;
  title: string;
  description: string;
  thumbnailId?: string;
  status?: string;
  confidentialityType?: string;
  type?: string;
  tags?: RessourceTag[];
  creationTime?: string;
  viewCount?: number;
}

export interface RessourceTag {
  id: string;
  label: string;
}

export interface RessourceQuery extends PaginationParams {
  ressourceTitle?: string;
  ressourceType?: string;
  isDeleted?: boolean;
}
