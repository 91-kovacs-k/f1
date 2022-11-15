import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Team } from 'src/typeorm/entities/Team';
import { TeamParams } from 'src/utils/types';
import { checkIfValidUUID } from 'src/utils/helper';
import { Pilot } from 'src/typeorm/entities/Pilot';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(Pilot)
    private readonly pilotRepository: Repository<Pilot>,
  ) {}

  async findTeams(query?: string, limit: number = 0): Promise<Team[]> {
    let ret: Team[] = [];
    let items;
    if (query) {
      items = await this.teamRepository.findBy({ name: Like(`%${query}%`) });
    } else {
      items = await this.teamRepository.find();
    }

    if (limit > 0) {
      ret = items.slice(0, limit);
    } else {
      ret = items;
    }

    if (ret.length === 0 && query) {
      throw new NotFoundException();
    } else if (ret.length === 0 && !query) {
      throw new NotFoundException();
    }

    return ret;
  }

  async findTeamById(teamId: string): Promise<Team> {
    if (checkIfValidUUID(teamId)) {
      const teamFromDb = await this.teamRepository.findOneBy({ id: teamId });
      if (!teamFromDb) {
        throw new NotFoundException();
      }

      return teamFromDb;
    }
    throw new NotFoundException();
  }

  async insertTeam(teamParams: TeamParams): Promise<void> {
    if (await this.teamRepository.findOneBy({ name: teamParams.name })) {
      throw new ConflictException(
        `team name '${teamParams.name}' already exists.`,
        {
          description: `team already exists`,
        },
      );
    }
    const newTeam = await this.teamRepository.create({ ...teamParams });
    await this.teamRepository.save(newTeam);
    return;
  }

  async modifyTeam(teamId: string, teamDetails: TeamParams): Promise<void> {
    const teamFromDb = await this.findTeamById(teamId);

    if (teamDetails.name) {
      const exists = await this.teamRepository.findOneBy({
        name: teamDetails.name,
      });

      if (exists && exists.id !== teamFromDb.id) {
        throw new ConflictException(
          `team name '${teamDetails.name}' already exists.`,
          {
            description: `team already exists`,
          },
        );
      }
      teamFromDb.name = teamDetails.name;
    }

    this.teamRepository.save(teamFromDb);
  }

  async removeTeam(teamId: string) {
    const teamFromDb = await this.findTeamById(teamId);
    const pilotsWithTeam = await this.pilotRepository.find({
      where: { team: teamFromDb },
    });
    pilotsWithTeam.forEach((pilot) => (pilot.team = null));
    await this.pilotRepository.save(pilotsWithTeam);
    await this.teamRepository.remove(teamFromDb);
  }
}
