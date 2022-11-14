import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateTeamDto } from '../dtos/CreateTeam.dto';
import { TeamService } from '../services/team.service';

@Controller('/api/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  getTeams() {
    return this.teamService.findTeams();
  }

  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    this.teamService.insertTeam(createTeamDto);
  }
}
