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

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
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

  async insertTeam(teamDetails: TeamParams): Promise<void> {
    if (await this.teamRepository.findOneBy({ name: teamDetails.name })) {
      throw new ConflictException(
        `team name '${teamDetails.name}' already exists.`,
        {
          description: `team already exists`,
        },
      );
    }
    try {
      const newTeam = await this.teamRepository.create({ ...teamDetails });
      await this.teamRepository.save(newTeam);
    } catch (error) {
      throw error;
    }
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
    this.teamRepository.remove(teamFromDb);
  }
}
