import { Injectable } from '@nestjs/common';
import { UserDataDto } from '../../../user/dtos/UserData.dto';
import { UserService } from '../../../user/services/user/user.service';
import { comparePasswords } from '../../../utils/bcryptUtils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);
    if (user && comparePasswords(password, user.password)) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async registerUser(data: UserDataDto) {
    await this.userService.insertUser(data);
  }
}
