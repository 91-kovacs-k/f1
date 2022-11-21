import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UserParams } from 'src/utils/types';
import { UserDataDto } from '../dtos/UserData.dto';
import { UserService } from '../services/user.service';

@Controller('/user')
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
      throw new BadRequestException(`Insufficient arguments.`, {
        description: `insufficient arguments`,
      });
    }
    return await this.userService.updateUser(userId, {
      username,
      password,
    } as UserParams);
  }
}
