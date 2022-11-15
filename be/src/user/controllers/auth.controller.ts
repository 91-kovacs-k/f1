import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Session,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { UserParams } from 'src/utils/types';
import { UserDataDto } from '../dtos/UserData.dto';
import { UserService } from '../services/user.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body() userData: UserDataDto,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const [valid, data] = this.checkAndConvertUserData(userData);

    if (!valid) {
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }

    session.user = await this.userService.insertUser(data as UserParams);
    return;
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() userData: UserDataDto,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const [valid, data] = this.checkAndConvertUserData(userData);

    if (!valid) {
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }

    session.user = await this.userService.authenticateUser(data as UserParams);
  }

  @Get('/logout')
  @HttpCode(200)
  async logout(
    @Param() userId: string,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    await this.userService.logoutUser(userId);
    session.user = undefined;
  }

  private checkAndConvertUserData(
    userData: UserDataDto,
  ): [boolean, UserParams | undefined] {
    const username = userData.username?.toString() || '';
    const password = userData.password?.toString() || '';

    if (username && password) {
      return [true, { username, password } as UserParams];
    } else {
      return [false, undefined];
    }
  }
}
