import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/typeorm';
import { BackendError, ErrorType } from 'src/utils/error';
import { ModifyUserDataDto } from '../dtos/ModifyUserData.dto';
import { UserService } from '../services/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userService.findUsers();
    if (users.length === 0) {
      throw new NotFoundException('no user in database.');
    }
    return users;
  }

  @Get('/:id')
  async getUserById(@Param('id', ParseUUIDPipe) userId: string): Promise<User> {
    try {
      return await this.userService.findUserById(userId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) userId: string): Promise<void> {
    try {
      return await this.userService.removeUser(userId);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  @Patch('/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() userData: ModifyUserDataDto,
  ): Promise<void> {
    try {
      return await this.userService.updateUser(userId, userData);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.NotFound) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
