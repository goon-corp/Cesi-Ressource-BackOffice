import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import type { Report, UpdateReportDto, ReportQuery } from '../../types/report.types';
import type { PaginatedResponse } from '../../types/common.types';

export const reportService = {
  getAll: (query?: ReportQuery) =>
    apiClient.get<PaginatedResponse<Report>>(ENDPOINTS.reports.base, query as Record<string, string | number | boolean | undefined>),

  getById: (id: string) =>
    apiClient.get<Report>(ENDPOINTS.reports.byId(id)),

  update: (id: string, dto: UpdateReportDto) =>
    apiClient.put<Report>(ENDPOINTS.reports.byId(id), dto),

  delete: (id: string) =>
    apiClient.delete<void>(ENDPOINTS.reports.byId(id)),
};
