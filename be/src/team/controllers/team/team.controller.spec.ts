import { Pilot, Team } from '../../../typeorm';
import { TeamService } from '../../services/team/team.service';
import { TeamController } from './team.controller';
import { Repository } from 'typeorm';
import { BackendError, ErrorType } from '../../../utils/error';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('TeamController', () => {
  let teamController: TeamController;
  let teamService: TeamService;
  let teamRepository: Repository<Team>;
  let pilotRepository: Repository<Pilot>;

  beforeAll(async () => {
    teamService = new TeamService(teamRepository, pilotRepository);
    teamController = new TeamController(teamService);
  });

  it('should be defined', () => {
    expect(teamController).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create new team', async () => {
      const newTeam = { name: 'ferrari' };
      jest.spyOn(teamService, 'insertTeam').mockReturnValueOnce(null);

      const result = await teamController.createTeam(newTeam);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw a "ConflictException" when called with a team that already exists', async () => {
        const teamThatAlreadyExists = { name: 'ferrari' };
        jest
          .spyOn(teamService, 'insertTeam')
          .mockRejectedValueOnce(new BackendError(ErrorType.AlreadyExists));

        try {
          const result = await teamController.createTeam(teamThatAlreadyExists);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const team = { name: 'ferrari' };
        jest
          .spyOn(teamService, 'insertTeam')
          .mockRejectedValueOnce(new Error());

        try {
          const result = await teamController.createTeam(team);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('getTeams', () => {
    it('should return an array of Team elements when no query provided', async () => {
      const teamsFromFakeDb: Team[] = [
        {
          id: '1',
          name: 'ferrari',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'mercedes',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'red bull',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(teamService, 'findTeams')
        .mockResolvedValueOnce(teamsFromFakeDb);

      const result = await teamController.getTeams({});
      expect(result).toBe(teamsFromFakeDb);
    });

    it('should return an array of Team elements based on query provided', async () => {
      const teamsFromFakeDb = [
        {
          id: '1',
          name: 'ferrari',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'mercedes',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'red bull',
          pilots: [new Pilot()],
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(teamService, 'findTeams')
        .mockResolvedValueOnce(teamsFromFakeDb);

      const result = await teamController.getTeams({ name: 'e', limit: 3 });
      expect(teamService.findTeams).toHaveBeenCalledWith({
        name: 'e',
        limit: 3,
      });
      expect(result).toBe(teamsFromFakeDb);
      expect(result).toHaveLength(teamsFromFakeDb.length);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when Team Table is empty and message should be "no team in database."', async () => {
        jest
          .spyOn(teamService, 'findTeams')
          .mockRejectedValueOnce(new BackendError(ErrorType.NoRecords));

        try {
          const result = await teamController.getTeams({});
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('no team in database.');
        }
      });

      it(`should throw "NotFoundException" and message should be "no team that matches '<name from query>' in database." when teams not found based on query provided`, async () => {
        jest
          .spyOn(teamService, 'findTeams')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));

        const query = { name: 'porshe', limit: 3 };
        try {
          const result = await teamController.getTeams(query);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(
            `no team that matches '${query.name}' in database.`,
          );
        }
      });

      it(`should throw "InternalServerErrorException" when other error occours`, async () => {
        jest.spyOn(teamService, 'findTeams').mockRejectedValueOnce(new Error());

        try {
          const result = await teamController.getTeams({});
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('getTeamById', () => {
    it('should return the team belonging to the id provided', async () => {
      const id = '2';
      const expectedTeam: Team = {
        id: id,
        name: 'red bull',
        pilots: [new Pilot()],
        createdAt: new Date(),
      };
      jest
        .spyOn(teamService, 'findTeamById')
        .mockResolvedValueOnce(expectedTeam);
      const result = await teamController.getTeamById(id);
      expect(result).toStrictEqual(expectedTeam);
    });
    describe('otherwise', () => {
      it('should throw "NotFoundException" when no team belongs to the provided id', async () => {
        const id = '2';
        jest
          .spyOn(teamService, 'findTeamById')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));
        try {
          const result = await teamController.getTeamById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it('should throw "InternalServerError" if other error occours', async () => {
        const id = '2';
        jest
          .spyOn(teamService, 'findTeamById')
          .mockRejectedValueOnce(new Error());
        try {
          const result = await teamController.getTeamById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('updateTeam', () => {
    it('should update team', async () => {
      const id = '2';
      const modifiedTeam = { id: 2, name: 'Ferrari' };
      jest.spyOn(teamService, 'modifyTeam').mockReturnValueOnce(null);

      const result = await teamController.updateTeam(id, modifiedTeam);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when no match for id provided', async () => {
        const id = '2';
        const modifiedTeam = { id: 2, name: 'Ferrari' };
        jest
          .spyOn(teamService, 'modifyTeam')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));

        try {
          const result = await teamController.updateTeam(id, modifiedTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it(`should throw "ConflictException" and a message of "team name '<team name>' already exists." when trying to rename a team to a name that already exists`, async () => {
        const id = '2';
        const modifiedTeam = { id: 2, name: 'Williams' };
        jest
          .spyOn(teamService, 'modifyTeam')
          .mockRejectedValueOnce(new BackendError(ErrorType.AlreadyExists));

        try {
          const result = await teamController.updateTeam(id, modifiedTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toEqual(
            `team name '${modifiedTeam.name}' already exists.`,
          );
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const id = '2';
        const modifiedTeam = { id: 2, name: 'Williams' };
        jest
          .spyOn(teamService, 'modifyTeam')
          .mockRejectedValueOnce(new Error());

        try {
          const result = await teamController.updateTeam(id, modifiedTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      const id = '2';
      jest.spyOn(teamService, 'removeTeam').mockReturnValueOnce(null);
      const result = await teamController.deleteTeam(id);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when there is no team belonging to the id provided', async () => {
        const id = '2';
        jest
          .spyOn(teamService, 'removeTeam')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));
        try {
          const result = await teamController.deleteTeam(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const id = '2';
        jest
          .spyOn(teamService, 'removeTeam')
          .mockRejectedValueOnce(new Error());
        try {
          const result = await teamController.deleteTeam(id);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
