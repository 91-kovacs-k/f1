import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pilot } from 'src/typeorm/entities/Pilot';
import { BackendError, ErrorType } from 'src/utils/error';
import { ModifyPilotDataDto } from '../dtos/ModifyPilotData.dto';
import { PilotDataDto } from '../dtos/PilotData.dto';
import { PilotQueryDto } from '../dtos/PilotQuery.dto';
import { PilotService } from '../services/pilot.service';

@Controller('/pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get()
  async getPilots(@Query() queryValues: PilotQueryDto): Promise<Pilot[]> {
    try {
      return await this.pilotService.findPilots(queryValues);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException(
          `no pilot that matches '${queryValues.name}' in database.`,
        );
      }

      if ((error as BackendError).type === ErrorType.NoRecords) {
        throw new NotFoundException('no pilot in database.');
      }

      throw error;
    }
  }

  @Get('/:id')
  async getPilotById(@Param('id') pilotId: string): Promise<Pilot> {
    try {
      return await this.pilotService.findPilotById(pilotId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post()
  async createPilot(@Body() pilotDataDto: PilotDataDto): Promise<void> {
    try {
      return await this.pilotService.insertPilot(pilotDataDto);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `pilot name '${pilotDataDto.name}' already exists.`,
        );
      }

      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException((error as BackendError).message);
      }

      throw error;
    }
  }

  @Patch('/:id')
  async udpatePilot(
    @Param('id') pilotId: string,
    @Body() pilotDataDto: ModifyPilotDataDto,
  ): Promise<void> {
    try {
      return await this.pilotService.modifyPilot(pilotId, pilotDataDto);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `pilot name '${pilotDataDto.name}' already exists.`,
        );
      }

      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException((error as BackendError).message);
      }

      throw error;
    }
  }

  @Delete('/:id')
  async deletePilot(@Param('id') pilotId: string): Promise<void> {
    try {
      await this.pilotService.removePilot(pilotId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
