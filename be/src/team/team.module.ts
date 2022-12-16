import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pilot } from '../typeorm/entities/Pilot';
import { Team } from '../typeorm/entities/Team';
import { TeamController } from './controllers/team/team.controller';
import { TeamService } from './services/team/team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([Pilot]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
