import {
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { BackendError, ErrorType } from 'src/utils/error';
import { LocalAuthGuard } from '../local-auth/local-auth.guard';

@Injectable()
export class RegisterGuard extends LocalAuthGuard {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      await this.userService.insertUser(request.body);
    } catch (error) {
      if ((error as BackendError).type === ErrorType.AlreadyExists) {
        throw new ConflictException(
          `username '${request.body.username}' already exists.`,
        );
      }
    }
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
