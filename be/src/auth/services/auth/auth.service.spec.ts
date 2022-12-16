import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm/index';
import * as bcryptUtils from '../../../utils/bcryptUtils';
import { UserService } from '../../../user/services/user/user.service';
import {
  createMockRepository,
  MockRepository,
} from '../../../utils/createMockRepository';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let userRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('userRepsoitory should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('registerUser', () => {
    it('should encode password correclty', async () => {
      jest.spyOn(bcryptUtils, 'hashPassword').mockReturnValue('hashed123');
      await authService.registerUser({
        username: 'krisz',
        password: '123',
      });
      expect(bcryptUtils.hashPassword).toHaveBeenCalledWith('123');
    });

    it('should call userRepository.create with correct params', async () => {
      await authService.registerUser({
        username: 'krisz',
        password: '123',
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'krisz',
        password: 'hashed123',
      });
    });

    it('should call userRepository.save with correct params', async () => {
      const dateNow = new Date();
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        id: '1',
        username: 'krisz',
        password: 'hashed123',
        createdAt: dateNow,
      });
      await authService.registerUser({
        username: 'krisz',
        password: '123',
      });

      expect(userRepository.save).toHaveBeenCalledWith({
        id: '1',
        username: 'krisz',
        password: 'hashed123',
        createdAt: dateNow,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if correct username and password is given', async () => {
      const username = 'user';
      const password = 'pass';
      const userFromFakeDb: User = {
        username,
        password: 'hashedPass',
        createdAt: new Date(),
        id: '5',
      };

      jest
        .spyOn(userService, 'findUserByUsername')
        .mockResolvedValueOnce(userFromFakeDb);
      jest.spyOn(bcryptUtils, 'comparePasswords').mockReturnValueOnce(true);

      const response = await authService.validateUser(username, password);

      expect(userService.findUserByUsername).toHaveBeenCalledWith(username);
      expect(bcryptUtils.comparePasswords).toHaveBeenCalledWith(
        password,
        userFromFakeDb.password,
      );
      expect(response).toStrictEqual({
        username: userFromFakeDb.username,
        createdAt: userFromFakeDb.createdAt,
        id: userFromFakeDb.id,
      });
    });

    describe('otherwise', () => {
      it('should return null when wrong password is given', async () => {
        const username = 'user';
        const password = 'pass2';
        const userFromFakeDb: User = {
          username,
          password: 'hashedPass',
          createdAt: new Date(),
          id: '5',
        };

        jest
          .spyOn(userService, 'findUserByUsername')
          .mockResolvedValueOnce(userFromFakeDb);
        jest.spyOn(bcryptUtils, 'comparePasswords').mockReturnValueOnce(false);

        const response = await authService.validateUser(username, password);

        expect(userService.findUserByUsername).toHaveBeenCalledWith(username);
        expect(bcryptUtils.comparePasswords).toHaveBeenCalledWith(
          password,
          userFromFakeDb.password,
        );
        expect(response).toBe(null);
      });

      it('should return null when the given username is not in the database', async () => {
        const username = 'user2';
        const password = 'pass';
        const userFromFakeDb: User = {
          username: 'user',
          password: 'hashedPass',
          createdAt: new Date(),
          id: '5',
        };

        jest
          .spyOn(userService, 'findUserByUsername')
          .mockResolvedValueOnce(null);

        const response = await authService.validateUser(username, password);

        expect(userService.findUserByUsername).toHaveBeenCalledWith(username);
        expect(response).toBe(null);
      });
    });
  });
});
