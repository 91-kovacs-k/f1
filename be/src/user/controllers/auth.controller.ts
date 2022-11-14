import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Session,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserDataDto } from '../dtos/UserData.dto';
import { UserService } from '../services/user.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body() userData: UserDataDto,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const [valid, data] = this.checkAndConvertUserData(userData);

    if (valid) {
      session.user = await this.userService.insertUser(data);
      return;
    }

    throw new HttpException('Insufficient arguments', HttpStatus.BAD_REQUEST);
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() userData: UserDataDto,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const [valid, data] = this.checkAndConvertUserData(userData);

    if (!valid) {
      throw new HttpException('Insufficient arguments', HttpStatus.BAD_REQUEST);
    }

    session.user = await this.userService.authenticateUser(data);
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
  ): [boolean, UserDataDto | undefined] {
    const username = userData.username?.toString() || '';
    const password = userData.password?.toString() || '';

    if (username && password) {
      return [true, { username, password } as UserDataDto];
    } else {
      return [false, undefined];
    }
  }
}
