import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Team } from '../../../typeorm/entities/Team';
import { Pilot } from '../../../typeorm/entities/Pilot';
import { TeamQueryDto } from '../../dtos/TeamQuery.dto';
import { TeamDataDto } from '../../dtos/TeamData.dto';
import { BackendError, ErrorType } from '../../../utils/error';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(Pilot)
    private readonly pilotRepository: Repository<Pilot>,
  ) {}

  async findTeams(query: TeamQueryDto): Promise<Team[]> {
    let ret: Team[] = [];

    if (query.name) {
      ret = await this.teamRepository.findBy({
        name: Like(`%${query.name}%`),
      });
    } else {
      ret = await this.teamRepository.find();
    }

    if (query.limit && query.limit > 0) {
      ret = ret.slice(0, query.limit);
    }

    if (ret.length === 0 && query.name) {
      throw new BackendError(ErrorType.NotFound);
    } else if (ret.length === 0 && !query.name) {
      throw new BackendError(ErrorType.NoRecords);
    }

    return ret;
  }

  async findTeamById(teamId: string): Promise<Team> {
    const teamFromDb = await this.teamRepository.findOneBy({ id: teamId });
    if (!teamFromDb) {
      throw new BackendError(ErrorType.NotFound);
    }

    return teamFromDb;
  }

  async insertTeam(teamDataDto: TeamDataDto): Promise<void> {
    if (await this.teamRepository.findOneBy({ name: teamDataDto.name })) {
      throw new BackendError(ErrorType.AlreadyExists);
    }
    const newTeam = this.teamRepository.create({ ...teamDataDto });
    await this.teamRepository.save(newTeam);
  }

  async modifyTeam(teamId: string, teamDataDto: TeamDataDto): Promise<void> {
    const teamFromDb = await this.findTeamById(teamId);

    if (teamDataDto.name) {
      const exists = await this.teamRepository.findOneBy({
        name: teamDataDto.name,
      });

      if (exists && exists.id !== teamFromDb.id) {
        throw new BackendError(ErrorType.AlreadyExists);
      }
      teamFromDb.name = teamDataDto.name;
    }

    this.teamRepository.save(teamFromDb);
  }

  async removeTeam(teamId: string): Promise<void> {
    const teamFromDb = await this.findTeamById(teamId);
    const pilotsWithTeam = await this.pilotRepository.find({
      where: { team: teamFromDb },
    });
    if (pilotsWithTeam) {
      pilotsWithTeam.forEach((pilot) => (pilot.team = null));
    }
    await this.pilotRepository.save(pilotsWithTeam);
    await this.teamRepository.remove(teamFromDb);
  }
}
