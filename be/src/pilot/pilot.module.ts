import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pilot } from '../typeorm/entities/Pilot';
import { Team } from '../typeorm/entities/Team';
import { PilotController } from './controllers/pilot/pilot.controller';
import { PilotService } from './services/pilot/pilot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pilot]),
    TypeOrmModule.forFeature([Team]),
  ],
  controllers: [PilotController],
  providers: [PilotService],
})
export class PilotModule {}
