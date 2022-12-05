import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
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
