import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IncidentsModule } from './incidents/incidents.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, IncidentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
