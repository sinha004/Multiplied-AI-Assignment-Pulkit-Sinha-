import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
  @IsString()
  incidentNumber: string;

  @IsDateString()
  incidentDate: string;

  @IsInt()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  severityLevel: number;

  @IsOptional()
  @IsString()
  actionCause?: string;

  @IsOptional()
  @IsString()
  behaviorType?: string;

  @IsOptional()
  @IsString()
  gbu?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  primaryCategory?: string;

  @IsOptional()
  @IsString()
  nearMissSubCategory?: string;

  @IsOptional()
  @IsString()
  unsafeConditionOrBehavior?: string;

  @IsOptional()
  @IsString()
  companyType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  craftCode?: string;

  @IsInt()
  @Type(() => Number)
  year: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;

  @IsInt()
  @Min(1)
  @Max(53)
  @Type(() => Number)
  week: number;

  @IsInt()
  @Min(1)
  @Max(366)
  @Type(() => Number)
  dayOfYear: number;

  @IsBoolean()
  @Type(() => Boolean)
  isLcv: boolean;
}
