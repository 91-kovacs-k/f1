import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { PilotModule } from './pilot/pilot.module';
import { entities } from './typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

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
      // entities: [User, Team, Pilot],
      // entities: ['/src/typeorm/entities/*.ts'],
      entities: entities,
      migrations: [],
      subscribers: [],
      options: { encrypt: false },
    }),
    UserModule,
    TeamModule,
    PilotModule,
    PassportModule.register({ session: true }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
