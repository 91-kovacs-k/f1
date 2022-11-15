import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pilot } from 'src/typeorm/entities/Pilot';
import { Team } from 'src/typeorm/entities/Team';
import { PilotController } from './controllers/pilot.controller';
import { PilotService } from './services/pilot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pilot]),
    TypeOrmModule.forFeature([Team]),
  ],
  controllers: [PilotController],
  providers: [PilotService],
})
export class PilotModule {}
