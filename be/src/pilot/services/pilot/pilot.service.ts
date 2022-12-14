import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pilot } from '../../../typeorm/entities/Pilot';
import { Team } from '../../../typeorm/entities/Team';
import { BackendError, ErrorType } from '../../../utils/error';
import { Like, Repository } from 'typeorm';
import { ModifyPilotDataDto } from '../../dtos/ModifyPilotData.dto';
import { PilotDataDto } from '../../dtos/PilotData.dto';
import { PilotQueryDto } from '../../dtos/PilotQuery.dto';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(Pilot)
    private readonly pilotRepository: Repository<Pilot>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findPilots(query: PilotQueryDto): Promise<Pilot[]> {
    let ret: Pilot[] = [];

    if (query.name) {
      ret = await this.pilotRepository.find({
        where: { name: Like(query.name) },
        relations: { team: true },
      });
    } else {
      ret = await this.pilotRepository.find({ relations: { team: true } });
    }

    if (query.limit > 0) {
      ret = ret.slice(0, query.limit);
    }

    if (ret.length === 0 && query.name) {
      throw new BackendError(ErrorType.NotFound);
    } else if (ret.length === 0 && !query.name) {
      throw new BackendError(ErrorType.NoRecords);
    }

    return ret;
  }

  async findPilotById(pilotId: string): Promise<Pilot> {
    const pilotFromDb = await this.pilotRepository.findOne({
      where: { id: pilotId },
      relations: { team: true },
    });
    if (!pilotFromDb) {
      throw new BackendError(ErrorType.NotFound);
    }

    return pilotFromDb;
  }

  async insertPilot(pilotDataDto: PilotDataDto): Promise<void> {
    if (await this.pilotRepository.findOneBy({ name: pilotDataDto.name })) {
      throw new BackendError(ErrorType.AlreadyExists);
    }

    if (pilotDataDto.team) {
      pilotDataDto.team = await this.searchForTeamByName(
        pilotDataDto.team.name,
      );
    }

    const newPilot = this.pilotRepository.create({ ...pilotDataDto });
    await this.pilotRepository.save(newPilot);
    return;
  }

  async modifyPilot(
    pilotId: string,
    pilotDataDto: ModifyPilotDataDto,
  ): Promise<void> {
    const pilotFromDb = await this.findPilotById(pilotId);

    if (pilotDataDto.team) {
      const teamFromDb = (await this.searchForTeamByName(
        pilotDataDto.team.name,
      )) as Team;
      pilotFromDb.team = teamFromDb;
    } else if (pilotDataDto.team === null) {
      // explicit null value for team -> Pilot's Team should set to null
      pilotFromDb.team = null;
    }

    if (pilotDataDto.name) {
      const exists = await this.pilotRepository.findOneBy({
        name: pilotDataDto.name,
      });
      if (exists && exists.id !== pilotFromDb.id) {
        throw new BackendError(ErrorType.AlreadyExists);
      }
      pilotFromDb.name = pilotDataDto.name;
    }

    await this.pilotRepository.save(pilotFromDb);
  }

  async removePilot(pilotId: string): Promise<void> {
    const pilotFromDb = await this.findPilotById(pilotId);

    await this.pilotRepository.remove(pilotFromDb);
  }

  private async searchForTeamByName(teamName: string): Promise<Team> {
    const teamFromDb = await this.teamRepository.findOneBy({
      name: teamName,
    });
    if (!teamFromDb) {
      throw new BackendError(
        ErrorType.NotFound,
        `can't assign pilot to team because, there is no team with name of '${teamName}'`,
      );
    }
    return teamFromDb;
  }
}
