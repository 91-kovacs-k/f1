import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { TeamParams } from 'src/utils/types';
import { TeamDataDto } from '../dtos/TeamData.dto';
import { TeamService } from '../services/team.service';

@Controller('/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams(@Query() queryValues) {
    const { name, limit } = queryValues;
    return await this.teamService.findTeams(name, limit);
  }

  @Post()
  async createTeam(@Body() createTeamDto: TeamDataDto) {
    const { name } = createTeamDto;
    await this.teamService.insertTeam({ name } as TeamParams);
  }

  @Get('/:id')
  async getTeamById(@Param('id') teamId: string) {
    return await this.teamService.findTeamById(teamId);
  }

  @Patch('/:id')
  async updateTeam(
    @Param('id') teamId: string,
    @Body() teamDetails: TeamDataDto,
  ) {
    const [valid, teamParams] = this.checkAndConvertTeamData(teamDetails);
    if (!valid) {
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }

    await this.teamService.modifyTeam(teamId, teamParams as TeamParams);
  }

  @Delete('/:id')
  async deleteTeam(@Param('id') teamId: string) {
    return await this.teamService.removeTeam(teamId);
  }

  private checkAndConvertTeamData(
    teamData: TeamDataDto,
  ): [boolean, TeamDataDto | undefined] {
    const name = teamData.name?.toString() || '';

    if (name) {
      return [true, { name } as TeamParams];
    } else {
      return [false, undefined];
    }
  }
}
