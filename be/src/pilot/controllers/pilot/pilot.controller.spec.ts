import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PilotService } from '../../../pilot/services/pilot/pilot.service';
import { Pilot, Team } from '../../../typeorm';
import { BackendError, ErrorType } from '../../../utils/error';
import { Repository } from 'typeorm';
import { PilotController } from './pilot.controller';

describe('PilotController', () => {
  let pilotController: PilotController;
  let pilotService: PilotService;
  let pilotRepository: Repository<Pilot>;
  let teamRepository: Repository<Team>;

  beforeAll(async () => {
    pilotService = new PilotService(pilotRepository, teamRepository);
    pilotController = new PilotController(pilotService);
  });

  it('should be defined', () => {
    expect(pilotController).toBeDefined();
  });

  describe('getPilots', () => {
    it('should return an array of pilot elements when no query is provided', async () => {
      const pilotsFromFakeDb: Pilot[] = [
        {
          id: '1',
          name: 'leclerc',
          team: new Team(),
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'hamilton',
          team: new Team(),
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'russell',
          team: new Team(),
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(pilotService, 'findPilots')
        .mockResolvedValueOnce(pilotsFromFakeDb);

      const result = await pilotController.getPilots({});
      expect(result).toBe(pilotsFromFakeDb);
    });

    it('should return an array of pilot elements based on query provided', async () => {
      const pilotsFromFakeDb: Pilot[] = [
        {
          id: '1',
          name: 'leclerc',
          team: new Team(),
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'hamilton',
          team: new Team(),
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'russell',
          team: new Team(),
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(pilotService, 'findPilots')
        .mockResolvedValueOnce(pilotsFromFakeDb);

      const result = await pilotController.getPilots({ name: 'l', limit: 3 });
      expect(pilotService.findPilots).toHaveBeenCalledWith({
        name: 'l',
        limit: 3,
      });
      expect(result).toBe(pilotsFromFakeDb);
      expect(result).toHaveLength(pilotsFromFakeDb.length);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when Pilot Table is empty and message should be "no pilot in database."', async () => {
        jest
          .spyOn(pilotService, 'findPilots')
          .mockRejectedValueOnce(new BackendError(ErrorType.NoRecords));

        try {
          const result = await pilotController.getPilots({});
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('no pilot in database.');
        }
      });

      it(`should throw "NotFoundException" and message should be "no pilot that matches '<name from query>' in database." when pilots not found based on query provided`, async () => {
        jest
          .spyOn(pilotService, 'findPilots')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));

        const query = { name: 'porshe', limit: 3 };
        try {
          const result = await pilotController.getPilots(query);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(
            `no pilot that matches '${query.name}' in database.`,
          );
        }
      });

      it(`should throw "InternalServerErrorException" when other error occours`, async () => {
        jest
          .spyOn(pilotService, 'findPilots')
          .mockRejectedValueOnce(new Error());

        try {
          const result = await pilotController.getPilots({});
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('getPilotById', () => {
    it('should return the pilot belonging to the id provided', async () => {
      const id = '2';
      const expectedPilot: Pilot = {
        id: id,
        name: 'ocon',
        team: new Team(),
        createdAt: new Date(),
      };
      jest
        .spyOn(pilotService, 'findPilotById')
        .mockResolvedValueOnce(expectedPilot);
      const result = await pilotController.getPilotById(id);
      expect(result).toStrictEqual(expectedPilot);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when no pilot belongs to the provided id', async () => {
        const id = '2';
        jest
          .spyOn(pilotService, 'findPilotById')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));
        try {
          const result = await pilotController.getPilotById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it('should throw "InternalServerError" if other error occours', async () => {
        const id = '2';
        jest
          .spyOn(pilotService, 'findPilotById')
          .mockRejectedValueOnce(new Error());
        try {
          const result = await pilotController.getPilotById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('createPilot', () => {
    it('should create new pilot', async () => {
      const newPilot = { name: 'stroll', team: { name: 'aston martin' } };
      // const teamFromFakeDb = {
      //   id: '6',
      //   name: 'aston martin',
      //   createdAt: new Date(),
      //   pilots: [],
      // };

      jest.spyOn(pilotService, 'insertPilot').mockReturnValueOnce(null);

      const result = await pilotController.createPilot(newPilot);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw a "ConflictException" when called with a pilot that already exists', async () => {
        const pilotThatAlreadyExists = { name: 'stroll' };
        jest
          .spyOn(pilotService, 'insertPilot')
          .mockRejectedValueOnce(new BackendError(ErrorType.AlreadyExists));

        try {
          const result = await pilotController.createPilot(
            pilotThatAlreadyExists,
          );
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
        }
      });

      it(`should throw a "NotFoundException" and a message of "can't assign pilot to team because, there is no team with name of '<team name>'" when called with a team name that doesn't exists`, async () => {
        const newPilot = { name: 'stroll', team: { name: 'porshe' } };

        jest
          .spyOn(pilotService, 'insertPilot')
          .mockRejectedValueOnce(
            new BackendError(
              ErrorType.NotFound,
              `can't assign pilot to team because, there is no team with name of '${newPilot.team.name}'`,
            ),
          );

        try {
          const result = await pilotController.createPilot(newPilot);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(
            `can't assign pilot to team because, there is no team with name of '${newPilot.team.name}'`,
          );
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const pilot = { name: 'ferrari' };
        jest
          .spyOn(pilotService, 'insertPilot')
          .mockRejectedValueOnce(new Error());

        try {
          const result = await pilotController.createPilot(pilot);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('updatePilot', () => {
    it('should update pilot', async () => {
      const id = '2';
      const modifiedPilot = { id: 2, name: 'Ferrari' };
      jest.spyOn(pilotService, 'modifyPilot').mockReturnValueOnce(null);

      const result = await pilotController.updatePilot(id, modifiedPilot);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when no match for id provided', async () => {
        const id = '2';
        const modifiedPilot = { id: 2, name: 'Ferrari' };
        jest
          .spyOn(pilotService, 'modifyPilot')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));

        try {
          const result = await pilotController.updatePilot(id, modifiedPilot);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it(`should throw "ConflictException" and a message of "pilot name '<pilot name>' already exists." when trying to rename a pilot to a name that already exists`, async () => {
        const id = '2';
        const modifiedPilot = { id: 2, name: 'Williams' };
        jest
          .spyOn(pilotService, 'modifyPilot')
          .mockRejectedValueOnce(new BackendError(ErrorType.AlreadyExists));

        try {
          const result = await pilotController.updatePilot(id, modifiedPilot);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toEqual(
            `pilot name '${modifiedPilot.name}' already exists.`,
          );
        }
      });

      it(`should throw "NotFoundException" and a message of "can't assign pilot to team because, there is no team with name of '<team name>'" when providing a team name that doesn't exists`, async () => {
        const id = '2';
        const modifiedPilot = {
          id: 2,
          name: 'Albon',
          team: { name: 'porshe' },
        };
        jest
          .spyOn(pilotService, 'modifyPilot')
          .mockRejectedValueOnce(
            new BackendError(
              ErrorType.NotFound,
              `can't assign pilot to team because, there is no team with name of '${modifiedPilot.team.name}'`,
            ),
          );

        try {
          const result = await pilotController.updatePilot(id, modifiedPilot);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(
            `can't assign pilot to team because, there is no team with name of '${modifiedPilot.team.name}'`,
          );
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const id = '2';
        const modifiedPilot = { id: 2, name: 'Williams' };
        jest
          .spyOn(pilotService, 'modifyPilot')
          .mockRejectedValueOnce(new Error());

        try {
          const result = await pilotController.updatePilot(id, modifiedPilot);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });

  describe('deletePilot', () => {
    it('should delete a pilot', async () => {
      const id = '2';
      jest.spyOn(pilotService, 'removePilot').mockReturnValueOnce(null);
      const result = await pilotController.deletePilot(id);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "NotFoundException" when there is no pilot belonging to the id provided', async () => {
        const id = '2';
        jest
          .spyOn(pilotService, 'removePilot')
          .mockRejectedValueOnce(new BackendError(ErrorType.NotFound));
        try {
          const result = await pilotController.deletePilot(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it('should throw "InternalServerErrorException" when other error occours', async () => {
        const id = '2';
        jest
          .spyOn(pilotService, 'removePilot')
          .mockRejectedValueOnce(new Error());
        try {
          const result = await pilotController.deletePilot(id);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
