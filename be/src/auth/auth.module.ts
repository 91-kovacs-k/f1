import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm';
import { UserService } from '../user/services/user/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthenticatedGuard } from './guards/authenticated/authenticated.guard';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './utils/session-serializer';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    LocalStrategy,
    SessionSerializer,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AuthModule {}
