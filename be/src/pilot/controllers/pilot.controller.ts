import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Pilot } from 'src/typeorm/entities/Pilot';
import { PilotParams } from 'src/utils/types';
import { PilotDataDto } from '../dtos/PilotData.dto';
import { PilotService } from '../services/pilot.service';

@Controller('/api/pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get()
  async getPilots(@Query() queryValues): Promise<Pilot[]> {
    const { name, limit } = queryValues;
    return await this.pilotService.findPilots(name, limit);
  }

  @Get('/:id')
  async getPilot(@Param('id') pilotId: string): Promise<Pilot> {
    return await this.pilotService.findPilotById(pilotId);
  }

  @Post()
  async createPilot(@Body() pilotDetails: PilotDataDto): Promise<void> {
    const [valid, data] = this.checkAndConvertPilotData(pilotDetails, true);
    if (!valid) {
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }

    await this.pilotService.insertPilot(data as PilotParams);
  }

  @Patch('/:id')
  async udpatePilot(
    @Param('id') pilotId: string,
    @Body() pilotDetails: PilotDataDto,
  ): Promise<void> {
    const [valid, data] = this.checkAndConvertPilotData(pilotDetails);

    if (!valid) {
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }
    await this.pilotService.modifyPilot(pilotId, data as PilotParams);
  }

  @Delete('/:id')
  async deletePilot(@Param('id') pilotId: string): Promise<void> {
    await this.pilotService.removePilot(pilotId);
  }

  private checkAndConvertPilotData(
    pilotData: PilotDataDto,
    nameRequired?: boolean,
  ): [boolean, PilotDataDto | undefined] {
    const name = pilotData.name?.toString() || '';
    const team = pilotData.team?.name ? pilotData.team : undefined;

    if (nameRequired) {
      if (name) {
        return [true, { name, team } as PilotDataDto];
      } else {
        return [false, undefined];
      }
    } else {
      if (name || team) {
        return [true, { name, team } as PilotDataDto];
      } else {
        return [false, undefined];
      }
    }
  }
}
