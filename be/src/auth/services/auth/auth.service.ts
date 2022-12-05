import { Injectable } from '@nestjs/common';
import { UserDataDto } from 'src/user/dtos/UserData.dto';
import { UserService } from 'src/user/services/user.service';
import { comparePasswords } from 'src/utils/helper';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);
    if (user && comparePasswords(password, user.password)) {
      const { password, username, ...rest } = user;
      return rest;
    }
    return null;
  }

  async registerUser(data: UserDataDto) {
    await this.userService.insertUser(data);
  }
}
