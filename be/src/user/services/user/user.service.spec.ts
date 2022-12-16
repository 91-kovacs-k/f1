import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm/index';
import {
  createMockRepository,
  MockRepository,
} from '../../../utils/createMockRepository';
import { BackendError, ErrorType } from '../../../utils/error';
import * as bcryptUtils from '../../../utils/bcryptUtils';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('userRepsoitory should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findUserByUsername', () => {
    it('should return a user based on provided username', async () => {
      const username = 'user';
      const userFromFakeDb: User = {
        id: '2',
        username,
        password: 'pass',
        createdAt: new Date(),
      };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(userFromFakeDb);

      const response = await userService.findUserByUsername(username);
      expect(response).toStrictEqual(userFromFakeDb);
    });

    describe('otherwise', () => {
      it('should return null', async () => {
        const username = 'user';
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        const response = await userService.findUserByUsername(username);
        expect(response).toBe(null);
      });
    });
  });

  describe('findUsers', () => {
    it('should return an array of user objects', async () => {
      const usersFromFakeDb = [
        {
          id: '1',
          username: 'user1',
          password: 'pass',
          createdAt: new Date(),
        },
        {
          id: '2',
          username: 'user2',
          password: 'pass',
          createdAt: new Date(),
        },
        {
          id: '3',
          username: 'user3',
          password: 'pass',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(usersFromFakeDb);

      const response = await userService.findUsers();
      expect(response).toBe(usersFromFakeDb);
    });

    it('should limit the results array of user objects when limit argument is provided', async () => {
      const usersFromFakeDb = [
        {
          id: '1',
          username: 'user1',
          password: 'pass',
          createdAt: new Date(),
        },
        {
          id: '2',
          username: 'user2',
          password: 'pass',
          createdAt: new Date(),
        },
        {
          id: '3',
          username: 'user3',
          password: 'pass',
          createdAt: new Date(),
        },
      ];
      const limit = 2;
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(usersFromFakeDb);

      const response = await userService.findUsers(limit);
      expect(response).toStrictEqual([usersFromFakeDb[0], usersFromFakeDb[1]]);
      expect(response).toHaveLength(limit);
    });

    describe('otherwise', () => {
      it('should throw a "BackendError" with ErrorType of "NoRecords" and message of "no users in database"', async () => {
        jest.spyOn(userRepository, 'find').mockResolvedValueOnce([]);

        try {
          const response = await userService.findUsers();
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NoRecords);
          expect(error.message).toBe('no users in database');
        }
      });
    });
  });

  describe('findUserById', () => {
    it('should return the user based on the provided id', async () => {
      const id = '2';
      const userFromFakeDb: User = {
        id,
        username: 'user',
        password: 'pass',
        createdAt: new Date(),
      };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(userFromFakeDb);

      const response = await userService.findUserById(id);
      expect(response).toStrictEqual(userFromFakeDb);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "NotFound"', async () => {
        const id = '2';
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const response = await userService.findUserById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });

  describe('removeUser', () => {
    it('should delete the user and return void', async () => {
      const id = '2';
      const userFromFakeDb: User = {
        id,
        username: 'user',
        password: 'pass',
        createdAt: new Date(),
      };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(userFromFakeDb);
      jest
        .spyOn(userRepository, 'remove')
        .mockResolvedValueOnce(userFromFakeDb);

      const response = await userService.removeUser(id);
      expect(userRepository.remove).toHaveBeenCalledWith(userFromFakeDb);
      expect(response).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "NotFound"', async () => {
        const id = '2';
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const response = await userService.removeUser(id);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });

  describe('updateUser', () => {
    it('should update the user and return void', async () => {
      const id = '2';
      const modifiedUser = { id: '2', username: 'user2', password: 'newPass' };
      const userFromDb: User = {
        id: '2',
        username: 'default',
        password: 'hashedDefault',
        createdAt: new Date(),
      };
      const hashedPassword = 'hashedNewPass';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userFromDb);
      jest
        .spyOn(bcryptUtils, 'hashPassword')
        .mockReturnValueOnce(hashedPassword);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...userFromDb,
        username: modifiedUser.username,
        password: hashedPassword,
      });

      const result = await userService.updateUser(id, modifiedUser);
      expect(result).toBe(undefined);
    });

    it('should update the user and return void even if the username already in the database but it associated with the current user', async () => {
      const id = '2';
      const modifiedUser = { id: '2', username: 'user2', password: 'newPass' };
      const userFromDb: User = {
        id: '2',
        username: 'default',
        password: 'hashedDefault',
        createdAt: new Date(),
      };
      const hashedPassword = 'hashedNewPass';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userFromDb);
      jest
        .spyOn(bcryptUtils, 'hashPassword')
        .mockReturnValueOnce(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...userFromDb,
        username: modifiedUser.username,
        password: hashedPassword,
      });

      const result = await userService.updateUser(id, modifiedUser);
      expect(result).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "AlreadyExists" and message of "there is already a user with username of <username>" when the username argument provided is associated with other user', async () => {
        const id = '2';
        const modifiedUser = {
          id: '2',
          username: 'user2',
          password: 'newPass',
        };
        const userFromDb: User = {
          id: '2',
          username: 'default',
          password: 'hashedDefault',
          createdAt: new Date(),
        };
        const hashedPassword = 'hashedNewPass';
        jest
          .spyOn(userRepository, 'findOneBy')
          .mockResolvedValueOnce(userFromDb);

        jest
          .spyOn(userRepository, 'findOneBy')
          .mockResolvedValueOnce({ ...userFromDb, id: '3' });
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
          ...userFromDb,
          username: modifiedUser.username,
          password: hashedPassword,
        });

        try {
          const response = await userService.updateUser(id, modifiedUser);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.AlreadyExists);
          expect(error.message).toBe(
            `there is already a user with username of ${modifiedUser.username}`,
          );
        }
      });

      it('should throw "BackendError" with ErrorType of "NotFound" when there is no match for the id provided', async () => {
        const id = '2';
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
          const response = await userService.removeUser(id);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.NotFound);
        }
      });
    });
  });

  describe('insertUser', () => {
    it('should insert the user and return void', async () => {
      const newUser = { username: 'newUser', password: 'password' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
      const hashedPassword = 'hashedPassword';
      jest
        .spyOn(bcryptUtils, 'hashPassword')
        .mockReturnValueOnce(hashedPassword);

      const response = await userService.insertUser(newUser);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...newUser,
        password: hashedPassword,
      });

      expect(response).toBe(undefined);
    });

    describe('otherwise', () => {
      it('should throw "BackendError" with ErrorType of "AlreadyExists" and message of "`there is already a user with username of <username>" when provided a username that already exists in database', async () => {
        const newUser = { username: 'newUser', password: 'password' };
        const userFromFakeDb: User = {
          ...newUser,
          password: 'hashedPassword',
          id: '1',
          createdAt: new Date(),
        };
        jest
          .spyOn(userRepository, 'findOneBy')
          .mockResolvedValueOnce(userFromFakeDb);

        try {
          const response = await userService.insertUser(newUser);
        } catch (error) {
          expect(error).toBeInstanceOf(BackendError);
          expect(error.type).toBe(ErrorType.AlreadyExists);
          expect(error.message).toBe(
            `there is already a user with username of ${newUser.username}`,
          );
        }
      });
    });
  });
});
