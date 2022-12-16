import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const requestMock = {
    logOut: jest.fn(),
  } as unknown as Request;

  const requestMockWithLogoutError = {
    logOut: jest.fn().mockImplementation((done: (err: any) => void) => {
      try {
        throw new Error();
      } catch (error) {
        done(error);
      }
    }),
  } as unknown as Request;

  const responseMock = {
    sendStatus: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logout', () => {
    it('should logout', () => {
      const response = controller.logout(requestMock, responseMock);
      expect(requestMock.logOut).toHaveBeenCalled();
      expect(responseMock.sendStatus).toHaveBeenCalledWith(200);
    });

    describe('otherwise', () => {
      it('should throw "InternalServerErrorException"', () => {
        const response = controller.logout(
          requestMockWithLogoutError,
          responseMock,
        );
        expect(requestMock.logOut).toHaveBeenCalled();
        expect(responseMock.sendStatus).toHaveBeenCalledWith(500);
      });
    });
  });
});
