import type { PaginationParams } from './common.types';

export interface Report {
  id: string;
  reportTypeId: string;
  userId: string;
  ressourceId: string;
  isCheckedByModerator: boolean;
  creationTime: string;
  updateTime?: string;
}

export interface UpdateReportDto {
  isCheckedByModerator: boolean;
}

export interface ReportQuery extends PaginationParams {
  userId?: string;
  ressourceId?: string;
  reportTypeId?: string;
  isCheckedByModerator?: boolean;
}
