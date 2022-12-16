import { UserService } from '../../../user/services/user/user.service';
import { RegisterGuard } from './register.guard';

describe('RegisterGuard', () => {
  it('should be defined', () => {
    let userService: UserService;
    expect(new RegisterGuard(userService)).toBeDefined();
  });
});
