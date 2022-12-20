import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm';
// import { getRepository } from 'typeorm';
import { SessionEntity } from './typeorm';
import AppDataSource from './typeorm/datasources/data-source';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 4000;
  // const sessionRepository = getRepository(SessionEntity);
  await AppDataSource.init();
  const sessionRepository =
    AppDataSource.dataSource.getRepository(SessionEntity);

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(
    session({
      cookie: {
        maxAge: 60 * 60 * 24 * 1000,
      },
      name: 'f1app',
      secret: process.env.S_SEC,
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

  await app.listen(PORT);
  console.log(`-->App is listening on http://localhost:${PORT}`);
}
bootstrap();
