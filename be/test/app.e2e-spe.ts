import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppController } from 'src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  // it('/api (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/api')
  //     .expect(200)
  //     .expect(
  //       'This is the backend API for the F1 app. Visit the frontend at <a href="http://localhost:3000">http://localhost:3000</a>!',
  //     );
  // });
});
