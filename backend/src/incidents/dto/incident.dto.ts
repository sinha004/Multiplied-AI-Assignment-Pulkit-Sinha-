export class IncidentDto {
  id: string;
  incidentNumber: string;
  incidentDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedIncidentsDto {
  data: IncidentDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class StatItemDto {
  label: string;
  value: number;
  percentage?: number;
}

export class SummaryStatsDto {
  totalIncidents: number;
  bySeverity: StatItemDto[];
  byBehaviorType: StatItemDto[];
  lcvCount: number;
  nonLcvCount: number;
}
