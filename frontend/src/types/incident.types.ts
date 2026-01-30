export interface Incident {
  id: string;
  incidentNumber: string;
  incidentDate: string;
  severityLevel: number;
  actionCause: string | null;
  behaviorType: string | null;
  gbu: string | null;
  region: string | null;
  primaryCategory: string | null;
  nearMissSubCategory: string | null;
  unsafeConditionOrBehavior: string | null;
  companyType: string | null;
  location: string | null;
  job: string | null;
  craftCode: string | null;
  year: number;
  month: number;
  week: number;
  dayOfYear: number;
  isLcv: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedIncidents {
  data: Incident[];
  meta: PaginationMeta;
}

export interface StatItem {
  label: string;
  value: number;
  percentage?: number;
}

export interface SummaryStats {
  totalIncidents: number;
  bySeverity: StatItem[];
  byBehaviorType: StatItem[];
  lcvCount: number;
  nonLcvCount: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  count: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  severityLevel?: string;
  region?: string;
  gbu?: string;
  behaviorType?: string;
  actionCause?: string;
  year?: number;
  dateTo?: string;
}

export interface ActionCauseDetails {
  actionCause: string;
  breakdown: Record<string, number>;
}
