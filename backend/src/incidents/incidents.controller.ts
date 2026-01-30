import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto, UpdateIncidentDto, FilterIncidentsDto } from './dto';

@Controller('api/incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  // GET /api/incidents - Paginated list with filters
  @Get()
  findAll(@Query() filters: FilterIncidentsDto) {
    return this.incidentsService.findAll(filters);
  }

  // GET /api/incidents/stats/summary - KPI summary
  @Get('stats/summary')
  getSummary() {
    return this.incidentsService.getSummary();
  }

  // GET /api/incidents/stats/by-severity
  @Get('stats/by-severity')
  getBySeverity() {
    return this.incidentsService.getBySeverity();
  }

  // GET /api/incidents/stats/by-region
  @Get('stats/by-region')
  getByRegion() {
    return this.incidentsService.getByRegion();
  }

  // GET /api/incidents/stats/by-month
  @Get('stats/by-month')
  getByMonth() {
    return this.incidentsService.getByMonth();
  }

  // GET /api/incidents/stats/by-action-cause
  @Get('stats/by-action-cause')
  getByActionCause() {
    return this.incidentsService.getByActionCause();
  }

  // GET /api/incidents/stats/by-action-cause-details
  @Get('stats/by-action-cause-details')
  getByActionCauseDetails() {
    return this.incidentsService.getByActionCauseDetails();
  }

  // GET /api/incidents/stats/by-gbu
  @Get('stats/by-gbu')
  getByGbu() {
    return this.incidentsService.getByGbu();
  }

  // GET /api/incidents/stats/by-behavior-type
  @Get('stats/by-behavior-type')
  getByBehaviorType() {
    return this.incidentsService.getByBehaviorType();
  }

  // GET /api/incidents/:id - Single incident
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  // POST /api/incidents - Create incident
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  // PUT /api/incidents/:id - Update incident
  @Put(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  // DELETE /api/incidents/:id - Delete incident
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
