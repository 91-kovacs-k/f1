import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamModule } from './team/team.module';
import { Pilot } from './typeorm/entities/Pilot';
import { Team } from './typeorm/entities/Team';
import { User } from './typeorm/entities/User';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './auth.middleware';
import { PilotModule } from './pilot/pilot.module';

dotenv.config();

let MSSQLHOST: string;
if (process.env.ENVIRONMENT === 'localhost') {
  MSSQLHOST = process.env.NODE_DBHOST_DEV;
} else {
  MSSQLHOST = process.env.NODE_DBHOST;
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: MSSQLHOST,
      port: 1433,
      username: 'SA',
      password: 'notPassword123',
      database: 'F1',
      synchronize: true,
      logging: false,
      entities: [User, Team, Pilot],
      migrations: [],
      subscribers: [],
      options: { encrypt: false },
    }),
    UserModule,
    TeamModule,
    PilotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api');
  }
}
