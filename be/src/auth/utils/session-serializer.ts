import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/typeorm';
import { UserService } from 'src/user/services/user.service';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: any) => void): any {
    done(null, user);
  }

  async deserializeUser(
    payload: User,
    done: (err: Error, user: any) => void,
  ): Promise<any> {
    const userFromDb = await this.userService.findUserById(payload.id);
    return userFromDb ? done(null, userFromDb) : done(null, null);
    // done(null, payload);
  }
}
