import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pilot } from 'src/typeorm/entities/Pilot';
import { Team } from 'src/typeorm/entities/Team';
import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([Pilot]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
