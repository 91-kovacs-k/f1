import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pilot } from 'src/typeorm/entities/Pilot';
import { Team } from 'src/typeorm/entities/Team';
import { checkIfValidUUID } from 'src/utils/helper';
import { PilotParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(Pilot)
    private readonly pilotRepository: Repository<Pilot>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findPilots(query?: string, limit: number = 0): Promise<Pilot[]> {
    let ret: Pilot[] = [];

    let items;
    if (query) {
      items = await this.pilotRepository
        .createQueryBuilder('pilot')
        .leftJoinAndSelect('pilot.team', 'team')
        .where('pilot.name like :name', { name: `%${query}%` })
        .getMany();
    } else {
      items = await this.pilotRepository.find({ relations: { team: true } });
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

  async findPilotById(pilotId: string): Promise<Pilot> {
    if (checkIfValidUUID(pilotId)) {
      const pilotFromDb = await this.pilotRepository.findOneBy({ id: pilotId });
      if (!pilotFromDb) {
        throw new NotFoundException();
      }

      return pilotFromDb;
    }
    throw new NotFoundException();
  }

  async insertPilot(pilotParams: PilotParams): Promise<void> {
    if (await this.pilotRepository.findOneBy({ name: pilotParams.name })) {
      throw new ConflictException(
        `pilot name '${pilotParams.name}' already exists.`,
        {
          description: `pilot already exists`,
        },
      );
    }

    if (pilotParams.team) {
      pilotParams.team = await this.searchForTeamByName(pilotParams.team.name);
    }

    const newPilot = await this.pilotRepository.create({ ...pilotParams });
    await this.pilotRepository.save(newPilot);
    return;
  }

  async modifyPilot(pilotId: string, pilotParams: PilotParams): Promise<void> {
    const pilotFromDb = await this.findPilotById(pilotId);

    if (pilotParams.team) {
      const teamFromDb = (await this.searchForTeamByName(
        pilotParams.team.name,
      )) as Team;
      pilotFromDb.team = teamFromDb;
    }

    if (pilotParams.name) {
      const exists = await this.pilotRepository.findOneBy({
        name: pilotParams.name,
      });
      if (exists && exists.id !== pilotFromDb.id) {
        throw new ConflictException(
          `pilot name '${pilotParams.name}' already exists.`,
          {
            description: `pilot already exists`,
          },
        );
      }
      pilotFromDb.name = pilotParams.name;
    }

    await this.pilotRepository.save(pilotFromDb);
  }

  async removePilot(pilotId: string): Promise<void> {
    const pilotFromDb = await this.findPilotById(pilotId);

    if (pilotFromDb) {
      await this.pilotRepository.remove(pilotFromDb);
    }
  }

  private async searchForTeamByName(teamName: string): Promise<Team> {
    const teamFromDb = await this.teamRepository.findOneBy({
      name: teamName,
    });
    if (!teamFromDb) {
      throw new NotFoundException(`no team with name of '${teamName}'`, {
        description: `can't assign team to pilot if the team does'nt exist`,
      });
    }
    return teamFromDb;
  }
}
