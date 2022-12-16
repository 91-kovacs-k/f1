import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pilot, Team } from '../../../typeorm/index';
import { Like } from 'typeorm';
import { TeamService } from './team.service';
import {
  createMockRepository,
  MockRepository,
} from '../../../utils/createMockRepository';
import { BackendError, ErrorType } from '../../../utils/error';

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepository: MockRepository;
  let pilotRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Pilot),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    teamRepository = module.get<MockRepository>(getRepositoryToken(Team));
    pilotRepository = module.get<MockRepository>(getRepositoryToken(Pilot));
  });

  it('teamService should be defined', () => {
    expect(teamService).toBeDefined();
  });

  it('teamRepsoitory should be defined', () => {
    expect(teamRepository).toBeDefined();
  });

  describe('findTeams', () => {
    it('should return an array of Team objects', async () => {
      const teamsFromFakeDb: Team[] = [
        {
          id: '1',
          name: 'ferrari',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
        {
          id: '2',
          name: 'mercedes',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
        {
          id: '3',
          name: 'alpine',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
      ];
      jest.spyOn(teamRepository, 'find').mockResolvedValue(teamsFromFakeDb);

      const response = await teamService.findTeams({});
      expect(response).toBe(teamsFromFakeDb);
    });

    it('should return an array of Team object based on query parameters', async () => {
      const teamsFromFakeDb: Team[] = [
        {
          id: '1',
          name: 'ferrari',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
        {
          id: '2',
          name: 'mercedes',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
        {
          id: '3',
          name: 'alpine',
          createdAt: new Date(),
          pilots: [new Pilot()],
        },
      ];
      jest.spyOn(teamRepository, 'findBy').mockResolvedValue(teamsFromFakeDb);
      const query = { name: 'e', limit: 3 };

      const response = await teamService.findTeams(query);
      expect(teamRepository.findBy).toHaveBeenCalledWith({
        name: Like(`%${query.name}%`),
      });
      expect(response).toStrictEqual(teamsFromFakeDb);
      expect(response).toHaveLength(query.limit);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "NoRecords" when no record is found and no query provided', async () => {
        jest.spyOn(teamRepository, 'find').mockResolvedValue([]);

        try {
          const response = await teamService.findTeams({});
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NoRecords);
        }
      });

      it('should throw "BackendError" with ErrorType of "NotFound" when no record is found and there is a name in query provided', async () => {
        jest.spyOn(teamRepository, 'findBy').mockResolvedValue([]);

        try {
          const response = await teamService.findTeams({ name: 'porshe' });
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });

  describe('findTeamById', () => {
    it('should return the team object based in id provided', async () => {
      const id = '2';
      const teamFromFakeDb = {
        id,
        name: 'alfa romeo',
        createdAt: new Date(),
        pilots: [new Pilot()],
      };
      jest
        .spyOn(teamRepository, 'findOneBy')
        .mockResolvedValueOnce(teamFromFakeDb);

      const result = await teamService.findTeamById(id);
      expect(result).toBe(teamFromFakeDb);
    });

    describe('otherwise', () => {
      it('should throw a "BackendError" with ErrorType of "NotFound"', async () => {
        const id = '2';
        jest.spyOn(teamRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const result = await teamService.findTeamById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });

  describe('insertTeam', () => {
    it('should create new Team in database and return void', async () => {
      const newTeam = {
        name: 'ferrari',
      };

      const result = await teamService.insertTeam(newTeam);
      expect(teamRepository.create).toHaveBeenCalledWith(newTeam);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should thorw "BackendError" with ErrorType of "AlreadyExists" when provied a team name that already exists in database', async () => {
        const newTeam = {
          name: 'ferrari',
        };
        const teamFromFakeDb = {
          ...newTeam,
          id: '3',
          createdAt: new Date(),
          pilots: [],
        };
        jest
          .spyOn(teamRepository, 'findOneBy')
          .mockResolvedValueOnce(teamFromFakeDb);

        try {
          const result = await teamService.insertTeam(newTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.AlreadyExists);
        }
      });
    });
  });

  describe('modifyTeam', () => {
    it('should modify team and return void', async () => {
      const id = '5';
      const modifiedTeam = {
        id,
        name: 'alpha tauri',
      };
      const teamFromFakeDb = {
        id: '5',
        name: 'alpha',
        createdAt: new Date(),
        pilots: [],
      };
      jest
        .spyOn(teamRepository, 'findOneBy')
        .mockResolvedValueOnce(teamFromFakeDb);
      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValueOnce(null);

      const response = await teamService.modifyTeam(id, modifiedTeam);
      expect(response).toBe(undefined);
    });

    it('should modify team even when the team name provided is already in database but associated with the current team, and return void', async () => {
      const id = '5';
      const modifiedTeam = {
        id,
        name: 'alpha tauri',
      };
      const teamFromFakeDb = {
        id: '5',
        name: 'alpha',
        createdAt: new Date(),
        pilots: [],
      };
      jest
        .spyOn(teamRepository, 'findOneBy')
        .mockResolvedValueOnce(teamFromFakeDb);
      jest
        .spyOn(teamRepository, 'findOneBy')
        .mockResolvedValueOnce(teamFromFakeDb);

      const response = await teamService.modifyTeam(id, modifiedTeam);
      expect(response).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "NotFound" when no record associated with the provided id', async () => {
        const id = '5';
        const modifiedTeam = {
          id,
          name: 'alpha tauri',
        };
        jest.spyOn(teamRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const response = await teamService.modifyTeam(id, modifiedTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });

      it('should throw "BackendError" with ErrorType of "AlreadyExists" when provided a team name that already associated with other team in database', async () => {
        const id = '5';
        const modifiedTeam = {
          id,
          name: 'alpha tauri',
        };
        const teamFromFakeDb = {
          id: '5',
          name: 'alpha',
          createdAt: new Date(),
          pilots: [],
        };
        const otherTeamFromFakeDb = {
          id: '6',
          name: 'alpha tauri',
          createdAt: new Date(),
          pilots: [],
        };
        jest
          .spyOn(teamRepository, 'findOneBy')
          .mockResolvedValueOnce(teamFromFakeDb);
        jest
          .spyOn(teamRepository, 'findOneBy')
          .mockResolvedValueOnce(otherTeamFromFakeDb);

        try {
          const response = await teamService.modifyTeam(id, modifiedTeam);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.AlreadyExists);
        }
      });
    });
  });

  describe('removeTeam', () => {
    it(`should remove the team from database (and set its pilots's team to null) and return null`, async () => {
      const id = '5';
      const teamFromFakeDb = {
        id: '5',
        name: 'alpha',
        createdAt: new Date(),
        pilots: [],
      };
      jest
        .spyOn(teamRepository, 'findOneBy')
        .mockResolvedValueOnce(teamFromFakeDb);
      const teamsPilots = [
        {
          id: '1',
          name: 'alonso',
          createdAt: new Date(),
          team: teamFromFakeDb,
        },
        {
          id: '2',
          name: 'tsunoda',
          createdAt: new Date(),
          team: teamFromFakeDb,
        },
      ];
      jest.spyOn(pilotRepository, 'find').mockResolvedValueOnce(teamsPilots);

      const response = await teamService.removeTeam(id);
      expect(response).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "NotFound" when there is no record associated with the provided id', async () => {
        const id = '5';
        jest.spyOn(teamRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const response = await teamService.removeTeam(id);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });
});
