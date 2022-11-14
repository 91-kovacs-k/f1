import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDataDto } from '../dtos/UserData.dto';
import { UserService } from '../services/user.service';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findUsers();
  }

  @Get('/:id')
  async findUser(@Param('id') userId: string) {
    return await this.userService.findUserById(userId);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.removeUser(userId);
  }

  @Patch('/:id')
  async updateUser(@Param('id') userId: string, @Body() userData: UserDataDto) {
    const username = userData.username?.toString().trim() || '';
    const password = userData.password?.toString().trim() || '';

    if (!username && !password) {
      throw new HttpException('Insufficient arguments', HttpStatus.BAD_REQUEST);
    }
    return await this.userService.updateUser(userId, {
      username,
      password,
    } as UserDataDto);
  }
}
