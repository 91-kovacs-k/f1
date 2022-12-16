import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';
import { BackendError, ErrorType } from '../../../utils/error';
import { LocalAuthGuard } from '../local-auth/local-auth.guard';

@Injectable()
export class RegisterGuard extends LocalAuthGuard {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;
    if (!(username && password)) {
      throw new BadRequestException('username and password must be provided!');
    }
    try {
      await this.userService.insertUser({ username, password });
    } catch (error) {
      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `username '${request.body.username}' already exists.`,
        );
      }
      throw error;
    }
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
