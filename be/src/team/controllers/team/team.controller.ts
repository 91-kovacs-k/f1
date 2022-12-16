import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Team } from 'src/typeorm';
import { BackendError, ErrorType } from 'src/utils/error';
import { TeamDataDto } from '../../dtos/TeamData.dto';
import { TeamQueryDto } from '../../dtos/TeamQuery.dto';
import { TeamService } from '../../services/team/team.service';

@UsePipes(ValidationPipe)
@Controller('/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: false,
        whitelist: true,
      }),
    )
    queryValues: TeamQueryDto,
  ): Promise<Team[]> {
    try {
      return await this.teamService.findTeams(queryValues);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException(
          `no team that matches '${queryValues.name}' in database.`,
        );
      }

      if ((error as BackendError).type === ErrorType.NoRecords) {
        throw new NotFoundException('no team in database.');
      }

      throw new InternalServerErrorException();
    }
  }

  @Post()
  async createTeam(@Body() teamDataDto: TeamDataDto): Promise<void> {
    try {
      await this.teamService.insertTeam(teamDataDto);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `team name '${teamDataDto.name}' already exists.`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('/:id')
  async getTeamById(@Param('id', ParseUUIDPipe) teamId: string) {
    try {
      return await this.teamService.findTeamById(teamId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  @Patch('/:id')
  async updateTeam(
    @Param('id', ParseUUIDPipe) teamId: string,
    @Body() teamDataDto: TeamDataDto,
  ) {
    try {
      await this.teamService.modifyTeam(teamId, teamDataDto);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }

      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `team name '${teamDataDto.name}' already exists.`,
        );
      }

      throw new InternalServerErrorException();
    }
  }

  @Delete('/:id')
  async deleteTeam(@Param('id', ParseUUIDPipe) teamId: string) {
    try {
      await this.teamService.removeTeam(teamId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }
}
