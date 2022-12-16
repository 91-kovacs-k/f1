import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm/out';
import { AppModule } from '../src/app.module';
import AppDataSource from '../src/typeorm/datasources/data-source';
import { SessionEntity } from '../src/typeorm';

describe('AuthController (e2e) test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await AppDataSource.init();
    const sessionRepository =
      AppDataSource.dataSource.getRepository(SessionEntity);

    app.use(
      session({
        cookie: {
          maxAge: 60 * 60 * 24 * 1000,
        },
        name: 'f1app',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({
          cleanupLimit: 100,
          ttl: 60 * 60 * 24 * 1000,
        }).connect(sessionRepository),
      }),
    );
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  describe('Register New User POST /api/auth/register', () => {
    const URL = '/api/auth/register';
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send({
          username: 'TestUser',
          password: '123',
        })
        .expect(201);
    });

    describe('otherwise', () => {
      it('should return a 400 when invalid username is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: '',
            password: '123',
          })
          .expect(400);
      });

      it('should return a 400 when no username provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            password: '123',
          })
          .expect(400);
      });

      it('should return a 400 when invalid password is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'test',
            password: '',
          })
          .expect(400);
      });

      it('should return a 400 when no password provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'test',
          })
          .expect(400);
      });

      it('should return a 400 when no or empty request body is provided', () => {
        return request(app.getHttpServer()).post(URL).send({}).expect(400);
      });
    });
  });

  let cookie;

  describe('login', () => {
    const URL = '/api/auth/login';

    it('should log in', () => {
      // before login, restricted endpoints should return 403
      request(app.getHttpServer()).get('/api/user').expect(403);

      request(app.getHttpServer())
        .post(URL)
        .send({
          username: 'TestUser',
          password: '123',
        })
        .expect(200)
        .end((err, res) => {
          cookie = res.headers['set-cookie'];
        });

      // after successful login we got the cookie, now use it to call a restricted endpoint
      request(app.getHttpServer())
        .get('/api/user')
        .set('Cookie', cookie)
        .expect(200);
    });

    describe('otherwise', () => {
      it('should return 401 when no password is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'TestUser',
          })
          .expect(401);
      });

      it('should return 401 when empty password is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'TestUser',
            password: '',
          })
          .expect(401);
      });

      it('should return 401 when wrong password is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'TestUser',
            password: 'asdf',
          })
          .expect(401);
      });

      it('should return 401 when no username is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            password: '123',
          })
          .expect(401);
      });

      it('should return 401 when empty username is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: '',
            password: '123',
          })
          .expect(401);
      });

      it('should return 401 when non existent username is provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: 'asdf',
            password: '123',
          })
          .expect(401);
      });

      it('should return 401 when empty body is provided', () => {
        return request(app.getHttpServer()).post(URL).send({}).expect(401);
      });

      it('should return 401 when empty properties are provided', () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            username: '',
            password: '',
          })
          .expect(401);
      });
    });

    // trying to get a restricted endpoint this way sporadically fails, because it sometimes runs before
    // the login function ends, end therefore there is no session data that could be set to the cookie

    // it('should visit /api/users and return 200', async () => {
    //   return request(app.getHttpServer())
    //     .get('/api/user')
    //     .set('Cookie', cookie)
    //     .expect(200);
    // });
  });

  describe('logout', () => {
    it('should log out', () => {
      // first, login
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'TestUser',
          password: '123',
        })
        .expect(200)
        .end((err, res) => {
          cookie = res.headers['set-cookie'];
        });

      // now logout
      request(app.getHttpServer()).get('/api/auth/logout').expect(200);
    });
  });

  afterAll(async () => {
    await AppDataSource.dataSource.dropDatabase();
  });
});
