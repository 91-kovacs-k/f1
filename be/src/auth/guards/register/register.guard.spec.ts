import { UserService } from 'src/user/services/user.service';
import { RegisterGuard } from './register.guard';

describe('RegisterGuard', () => {
  it('should be defined', () => {
    let userService: UserService;
    expect(new RegisterGuard(userService)).toBeDefined();
  });
});
