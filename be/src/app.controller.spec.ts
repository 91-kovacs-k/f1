import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "This is the backend API for the F1 app. Visit the frontend at <a href="http://localhost:3000">http://localhost:3000</a>!"', () => {
      expect(appController.getHello()).toBe(
        'This is the backend API for the F1 app. Visit the frontend at <a href="http://localhost:3000">http://localhost:3000</a>!',
      );
    });
  });
});
