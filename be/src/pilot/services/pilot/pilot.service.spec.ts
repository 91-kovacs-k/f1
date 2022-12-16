import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BackendError, ErrorType } from '../../../utils/error';
import { Pilot, Team } from '../../../typeorm';
import { PilotService } from './pilot.service';
import {
  createMockRepository,
  MockRepository,
} from '../../../utils/createMockRepository';

describe('PilotService', () => {
  let pilotService: PilotService;
  let pilotRepository: MockRepository;
  let teamRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PilotService,
        {
          provide: getRepositoryToken(Pilot),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(Team), useValue: createMockRepository() },
      ],
    }).compile();

    pilotService = module.get<PilotService>(PilotService);
    pilotRepository = module.get<MockRepository>(getRepositoryToken(Pilot));
    teamRepository = module.get<MockRepository>(getRepositoryToken(Team));
  });

  it('pilotService should be defined', () => {
    expect(pilotService).toBeDefined();
  });

  it('pilotRepository should be defined', () => {
    expect(pilotRepository).toBeDefined();
  });

  it('teamRepository should be defined', () => {
    expect(teamRepository).toBeDefined();
  });

  describe('findPilotById', () => {
    it('should return the pilot object', async () => {
      const pilotId = '1';
      const expectedPilot = { id: pilotId, name: 'Albon' };

      pilotRepository.findOne.mockReturnValueOnce(expectedPilot);
      const pilot = await pilotService.findPilotById(pilotId);
      expect(pilot).toEqual(expectedPilot);
    });
    describe('otherwise', () => {
      it('should throw the "BackendError" with ErrorType of "NotFound"', async () => {
        const pilotId = '1';
        pilotRepository.findOne.mockReturnValueOnce(null);

        try {
          await pilotService.findPilotById(pilotId);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
        }
      });
    });
  });

  describe('findPilots', () => {
    it('should return an array of pilot objects', async () => {
      const expectedPilots = [
        { id: '1', name: 'Hamilton' },
        { id: '2', name: 'Russell' },
        { id: '3', name: 'Norris' },
      ];
      const query = {};

      pilotRepository.find.mockReturnValueOnce(expectedPilots);
      const pilots = await pilotService.findPilots(query);
      expect(pilots).toEqual(expectedPilots);
    });
    describe('otherwise', () => {
      it('should throw the "BackendError" with type of "NoRecords"', async () => {
        const query = {};
        pilotRepository.find.mockReturnValueOnce([]);

        try {
          await pilotService.findPilots(query);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NoRecords);
        }
      });
    });

    it('should return an array of pilot objects based on query (name, limit)', async () => {
      const allPilots = [
        { id: '1', name: 'Hamilton' },
        { id: '2', name: 'Russell' },
        { id: '3', name: 'Norris' },
        { id: '4', name: 'Vettel' },
        { id: '5', name: 'Leclerc' },
      ];
      const expectedPilots = [
        { id: '2', name: 'Russell' },
        { id: '4', name: 'Vettel' },
      ];
      const query = { name: 'e', limit: 2 };

      pilotRepository.find.mockReturnValueOnce(expectedPilots);
      const pilots = await pilotService.findPilots(query);
      expect(pilots.length).toBeLessThanOrEqual(query.limit);
      expect(pilots).toEqual(expectedPilots);
    });
    describe('otherwise', () => {
      it('should throw the "BackendError" with type of "NotFound"', async () => {
        const query = { name: 'e', limit: 2 };
        pilotRepository.find.mockReturnValueOnce([]);

        try {
          await pilotService.findPilots(query);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
        }
      });
    });
  });

  describe('insertPilot', () => {
    it('should return void when just Pilot data provided', async () => {
      const newPilot = { name: 'Vettel' };

      pilotRepository.findOneBy.mockReturnValueOnce(null);

      pilotRepository.create.mockReturnValueOnce({ ...newPilot, id: '1' });
      pilotRepository.save.mockReturnValueOnce({ ...newPilot, id: '1' });
      const insert = await pilotService.insertPilot(newPilot);

      expect(insert).toBeUndefined();
    });

    it('should return void when Pilot data and existing Team data are provided', async () => {
      const newPilot = { name: 'Vettel', team: { name: 'Aston Martin' } };

      pilotRepository.findOneBy.mockReturnValueOnce(null);
      const teamFromFakeDb = { id: '1', name: 'Aston Martin' };
      teamRepository.findOneBy.mockReturnValueOnce(teamFromFakeDb);

      pilotRepository.create.mockReturnValueOnce({
        ...newPilot,
        ...teamFromFakeDb,
        id: '1',
      });
      pilotRepository.save.mockReturnValueOnce({
        ...newPilot,
        ...teamFromFakeDb,
        id: '1',
      });
      const insert = await pilotService.insertPilot(newPilot);

      expect(insert).toBeUndefined();
    });

    describe('otherwise', () => {
      it('should throw the "BackendError" with type of "AlreadyExists" when the provided pilot name already exists in database', async () => {
        const newPilot = { name: 'Vettel' };
        pilotRepository.findOneBy.mockReturnValueOnce({ ...newPilot, id: '1' });

        try {
          await pilotService.insertPilot(newPilot);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.AlreadyExists);
        }
      });

      it(`should throw the "BackendError" with type of "NotFound" and message of "can't assign pilot to team because, there is no team with name of 'Aston Martin'"`, async () => {
        const newPilot = { name: 'Vettel', team: { name: 'Aston Martin' } };
        pilotRepository.findOneBy.mockReturnValueOnce(null);
        teamRepository.findOneBy.mockReturnValueOnce(null);

        try {
          await pilotService.insertPilot(newPilot);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
          expect(err.message).toEqual(
            `can't assign pilot to team because, there is no team with name of 'Aston Martin'`,
          );
        }
      });
    });
  });

  describe('modifyPilot', () => {
    it('should return void when PilotId, Pilot data and/or existing Team data are provided', async () => {
      const modifiedPilot = { name: 'Vettel', team: { name: 'Aston Martin' } };

      pilotRepository.findOne.mockReturnValueOnce({
        name: 'Vettel',
        id: '1',
      });
      const teamFromFakeDb = { id: '1', name: 'Aston Martin' };
      teamRepository.findOneBy.mockReturnValueOnce(teamFromFakeDb);

      pilotRepository.create.mockReturnValueOnce({
        ...modifiedPilot,
        ...teamFromFakeDb,
        id: '1',
      });
      pilotRepository.save.mockReturnValueOnce({
        ...modifiedPilot,
        ...teamFromFakeDb,
        id: '1',
      });
      const insert = await pilotService.modifyPilot('1', modifiedPilot);

      expect(insert).toBeUndefined();
    });

    it('should return void when PilotId, Pilot data and/or explicit null for Team data are provided', async () => {
      const modifiedPilot = { team: null };

      const pilotFromFakeDb = { name: 'Vettel', id: '1' };
      pilotRepository.findOne.mockReturnValueOnce(pilotFromFakeDb);

      pilotRepository.create.mockReturnValueOnce({
        ...pilotFromFakeDb,
        team: null,
      });
      pilotRepository.save.mockReturnValueOnce({
        ...pilotFromFakeDb,
        team: null,
      });
      const insert = await pilotService.modifyPilot('1', modifiedPilot);

      expect(insert).toBeUndefined();
    });
    describe('otherwise', () => {
      it(`should throw the "BackendError" with type of "NotFound" when provided a pilotId that doesn't exists`, async () => {
        const modifiedPilot = {
          name: 'Vettel',
          team: { name: 'Aston Martin' },
        };
        pilotRepository.findOne.mockReturnValueOnce(null);

        try {
          await pilotService.modifyPilot('1', modifiedPilot);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
        }
      });

      it(`should throw the "BackendError" with type of "NotFound" and message of "can't assign pilot to team because, there is no team with name of '<team name>'" when provided a team that doesn't exists`, async () => {
        const modifiedPilot = {
          name: 'Vettel',
          team: { name: 'Aston Martin' },
        };
        pilotRepository.findOne.mockReturnValueOnce({
          name: 'Vettel',
          id: '1',
        });
        teamRepository.findOneBy.mockReturnValueOnce(null);

        try {
          await pilotService.modifyPilot('1', modifiedPilot);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
          expect(err.message).toEqual(
            `can't assign pilot to team because, there is no team with name of 'Aston Martin'`,
          );
        }
      });

      it(`should throw the "BackendError" with type of "AlreayExists" when tring to rename a Pilot to a name that already exists`, async () => {
        const modifiedPilot = {
          name: 'Vettel',
        };
        pilotRepository.findOne.mockReturnValueOnce({
          name: 'Vettel',
          id: '1',
        });
        pilotRepository.findOneBy.mockReturnValueOnce({
          id: '5',
          name: 'Vettel',
        });

        try {
          await pilotService.modifyPilot('1', modifiedPilot);
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.AlreadyExists);
        }
      });
    });
  });

  describe('removePilot', () => {
    it('should return void when correct id is provided', async () => {
      pilotRepository.findOne.mockReturnValueOnce({
        name: 'Leclerc',
        id: '3',
      });

      pilotRepository.remove.mockReturnValueOnce({
        name: 'Leclerc',
        id: '3',
      });

      const remove = await pilotService.removePilot('1');

      expect(remove).toBeUndefined();
    });

    describe('otherwise', () => {
      it(`should throw the "BackendError" with type of "NotFound" when provided a pilotId that doesn't exists`, async () => {
        pilotRepository.findOne.mockReturnValueOnce(null);

        try {
          await pilotService.removePilot('1');
        } catch (err) {
          expect(err).toBeInstanceOf(BackendError);
          expect(err.type).toEqual(ErrorType.NotFound);
        }
      });
    });
  });
});
