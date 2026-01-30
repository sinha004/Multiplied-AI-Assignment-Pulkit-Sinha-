import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  FilterIncidentsDto,
  PaginatedIncidentsDto,
  SummaryStatsDto,
  StatItemDto,
} from './dto';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  // Build dynamic where clause based on filters
  private buildWhereClause(filters: FilterIncidentsDto): Prisma.IncidentWhereInput {
    const where: Prisma.IncidentWhereInput = {};

    if (filters.search) {
      where.OR = [
        { actionCause: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { job: { contains: filters.search, mode: 'insensitive' } },
        { incidentNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.severityLevel && filters.severityLevel.length > 0) {
      where.severityLevel = { in: filters.severityLevel };
    }

    if (filters.region) {
      where.region = { contains: filters.region, mode: 'insensitive' };
    }

    if (filters.gbu) {
      where.gbu = { contains: filters.gbu, mode: 'insensitive' };
    }

    if (filters.behaviorType) {
      where.behaviorType = { contains: filters.behaviorType, mode: 'insensitive' };
    }

    if (filters.actionCause) {
      where.actionCause = { contains: filters.actionCause, mode: 'insensitive' };
    }

    if (filters.year) {
      where.year = filters.year;
    }

    if (filters.month && filters.month.length > 0) {
      where.month = { in: filters.month };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.incidentDate = {};
      if (filters.dateFrom) {
        where.incidentDate.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.incidentDate.lte = new Date(filters.dateTo);
      }
    }

    if (filters.primaryCategory) {
      where.primaryCategory = { contains: filters.primaryCategory, mode: 'insensitive' };
    }
    if (filters.nearMissSubCategory) {
      where.nearMissSubCategory = { contains: filters.nearMissSubCategory, mode: 'insensitive' };
    }
    if (filters.unsafeConditionOrBehavior) {
      where.unsafeConditionOrBehavior = { contains: filters.unsafeConditionOrBehavior, mode: 'insensitive' };
    }
    if (filters.companyType) {
      where.companyType = { contains: filters.companyType, mode: 'insensitive' };
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.job) {
      where.job = { contains: filters.job, mode: 'insensitive' };
    }
    if (filters.craftCode) {
      where.craftCode = { contains: filters.craftCode, mode: 'insensitive' };
    }
    if (filters.isLcv !== undefined) {
      where.isLcv = filters.isLcv;
    }

    return where;
  }

  // Get distinct values for a field
  async getAttributes(field: string): Promise<string[]> {
    // Whitelist allowed fields to prevent arbitrary query injection
    const allowedFields = [
      'severityLevel', 'region', 'gbu', 'behaviorType', 'actionCause',
      'primaryCategory', 'nearMissSubCategory', 'unsafeConditionOrBehavior',
      'companyType', 'location', 'job', 'craftCode', 'year', 'month'
    ];

    if (!allowedFields.includes(field)) {
      return [];
    }

    // Use groupBy to get distinct values efficiently
    // Dynamic access using $queryRaw is cleaner for dynamic columns but groupBy handles types better
    // But since field is dynamic, we need to map or use raw
    // For simplicity and safety with Prisma types:
    
    // Using distinct with findMany is often easier for simple lists
    const results = await this.prisma.incident.findMany({
      distinct: [field as Prisma.IncidentScalarFieldEnum],
      select: {
        [field]: true,
      },
      orderBy: {
        [field]: 'asc',
      },
    });

    // Extract values and filter null/empty
    return results
      .map(r => r[field])
      .filter(v => v !== null && v !== '')
      .map(v => String(v));
  }

  // Get paginated incidents with filters
  async findAll(filters: FilterIncidentsDto): Promise<PaginatedIncidentsDto> {
    const { page = 1, limit = 20, sortBy = 'incidentDate', sortOrder = 'desc' } = filters;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.incident.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // Get single incident by ID
  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  // Create new incident
  async create(data: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        ...data,
        incidentDate: new Date(data.incidentDate),
      },
    });
  }

  // Update existing incident
  async update(id: string, data: UpdateIncidentDto) {
    await this.findOne(id); // Throws if not found
    return this.prisma.incident.update({
      where: { id },
      data: {
        ...data,
        incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
      },
    });
  }

  // Delete incident
  async remove(id: string) {
    await this.findOne(id); // Throws if not found
    return this.prisma.incident.delete({ where: { id } });
  }

  // Get summary statistics
  async getSummary(): Promise<SummaryStatsDto> {
    const [totalIncidents, bySeverityRaw, byBehaviorRaw, lcvCount] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.groupBy({
        by: ['severityLevel'],
        _count: { severityLevel: true },
        orderBy: { severityLevel: 'asc' },
      }),
      this.prisma.incident.groupBy({
        by: ['behaviorType'],
        _count: { behaviorType: true },
      }),
      this.prisma.incident.count({ where: { isLcv: true } }),
    ]);

    const bySeverity: StatItemDto[] = bySeverityRaw.map((item) => ({
      label: `Level ${item.severityLevel}`,
      value: item._count.severityLevel,
      percentage: Math.round((item._count.severityLevel / totalIncidents) * 100),
    }));

    const byBehaviorType: StatItemDto[] = byBehaviorRaw
      .map((item) => ({
        label: item.behaviorType || 'Other',
        value: item._count.behaviorType,
        percentage: Math.round((item._count.behaviorType / totalIncidents) * 100),
      }));

    return {
      totalIncidents,
      bySeverity,
      byBehaviorType,
      lcvCount,
      nonLcvCount: totalIncidents - lcvCount,
    };
  }

  // Get incidents grouped by severity
  async getBySeverity(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['severityLevel'],
      _count: { severityLevel: true },
      orderBy: { severityLevel: 'asc' },
    });

    return data.map((item) => ({
      label: `Level ${item.severityLevel}`,
      value: item._count.severityLevel,
      percentage: Math.round((item._count.severityLevel / total) * 100),
    }));
  }

  // Get incidents grouped by region
  async getByRegion(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['region'],
      _count: { region: true },
      orderBy: { _count: { region: 'desc' } },
    });

    return data
      .map((item) => ({
        label: item.region || 'Other',
        value: item._count.region,
        percentage: Math.round((item._count.region / total) * 100),
      }));
  }

  // Get monthly trend data
  async getByMonth(): Promise<{ year: number; month: number; count: number }[]> {
    const data = await this.prisma.incident.groupBy({
      by: ['year', 'month'],
      _count: { id: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    return data.map((item) => ({
      year: item.year,
      month: item.month,
      count: item._count.id,
    }));
  }

  // Get incidents grouped by action cause
  async getByActionCause(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['actionCause'],
      _count: { actionCause: true },
      orderBy: { _count: { actionCause: 'desc' } },
      take: 15, // Top 15 causes
    });

    return data
      .map((item) => ({
        label: item.actionCause || 'Other',
        value: item._count.actionCause,
        percentage: Math.round((item._count.actionCause / total) * 100),
      }));
  }

  // Get incidents grouped by GBU
  async getByGbu(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['gbu'],
      _count: { gbu: true },
      orderBy: { _count: { gbu: 'desc' } },
    });

    return data
      .map((item) => ({
        label: item.gbu || 'Other',
        value: item._count.gbu,
        percentage: Math.round((item._count.gbu / total) * 100),
      }));
  }

  // Get incidents grouped by behavior type
  async getByBehaviorType(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['behaviorType'],
      _count: { behaviorType: true },
      orderBy: { _count: { behaviorType: 'desc' } },
    });

    return data
      .map((item) => ({
        label: item.behaviorType || 'Other',
        value: item._count.behaviorType,
        percentage: Math.round((item._count.behaviorType / total) * 100),
      }));
  }

  // Get detailed action cause breakdown by behavior type with optional filters
  async getByActionCauseDetails(filters?: {
    region?: string;
    year?: number;
    severityLevel?: number[];
  }) {
    // Build where clause from filters
    const where: Prisma.IncidentWhereInput = {};
    
    if (filters?.region) {
      where.region = { contains: filters.region, mode: 'insensitive' };
    }
    if (filters?.year) {
      where.year = filters.year;
    }
    if (filters?.severityLevel && filters.severityLevel.length > 0) {
      where.severityLevel = { in: filters.severityLevel };
    }

    // 1. Get top 10 action causes first to keep chart readable
    const topCauses = await this.prisma.incident.groupBy({
      by: ['actionCause'],
      where,
      _count: { actionCause: true },
      orderBy: { _count: { actionCause: 'desc' } },
      take: 10,
    });

    const validCauses = topCauses
      .filter(c => c.actionCause)
      .map(c => c.actionCause as string);

    // 2. Get breakdown for these causes
    const data = await this.prisma.incident.groupBy({
      by: ['actionCause', 'behaviorType'],
      where: {
        ...where,
        actionCause: { in: validCauses }
      },
      _count: { id: true },
    });

    // 3. Transform for easier frontend consumption
    // Return format: { cause: string, breakdown: { [behavior]: count } }
    const result = validCauses.map(cause => {
      const causeData = data.filter(d => d.actionCause === cause);
      const breakdown: Record<string, number> = {};
      
      causeData.forEach(d => {
        if (d.behaviorType) {
          breakdown[d.behaviorType] = d._count.id;
        }
      });

      return {
        actionCause: cause,
        breakdown
      };
    });

    return result;
  }

  // Get incidents grouped by primary category
  async getByPrimaryCategory(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['primaryCategory'],
      _count: { primaryCategory: true },
      orderBy: { _count: { primaryCategory: 'desc' } },
      take: 10,
    });

    return data
      .map((item) => ({
        label: item.primaryCategory || 'Other',
        value: item._count.primaryCategory,
        percentage: Math.round((item._count.primaryCategory / total) * 100),
      }));
  }

  // Get incidents grouped by location
  async getByLocation(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['location'],
      _count: { location: true },
      orderBy: { _count: { location: 'desc' } },
      take: 10,
    });

    return data
      .map((item) => ({
        label: item.location || 'Other',
        value: item._count.location,
        percentage: Math.round((item._count.location / total) * 100),
      }));
  }

  // Get incidents grouped by job
  async getByJob(): Promise<StatItemDto[]> {
    const total = await this.prisma.incident.count();
    const data = await this.prisma.incident.groupBy({
      by: ['job'],
      _count: { job: true },
      orderBy: { _count: { job: 'desc' } },
      take: 10,
    });

    return data
      .map((item) => ({
        label: item.job || 'Other',
        value: item._count.job,
        percentage: Math.round((item._count.job / total) * 100),
      }));
  }

  // Get available filter options for dropdowns
  async getFilterOptions() {
    const [regions, years, severities] = await Promise.all([
      this.prisma.incident.groupBy({
        by: ['region'],
        orderBy: { region: 'asc' },
      }),
      this.prisma.incident.groupBy({
        by: ['year'],
        orderBy: { year: 'desc' },
      }),
      this.prisma.incident.groupBy({
        by: ['severityLevel'],
        orderBy: { severityLevel: 'asc' },
      }),
    ]);

    return {
      regions: regions.filter(r => r.region).map(r => r.region as string),
      years: years.map(y => y.year),
      severityLevels: severities.map(s => s.severityLevel),
    };
  }
}
