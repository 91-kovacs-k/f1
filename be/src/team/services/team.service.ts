import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from 'src/typeorm/entities/Team';
import { CreateTeamParams } from 'src/utils/types';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}

  findTeams() {
    return;
  }

  async insertTeam(teamDetails: CreateTeamParams) {
    const newTeam = this.teamRepository.create({ ...teamDetails });
    await this.teamRepository.save(newTeam);
    return;
  }
}
