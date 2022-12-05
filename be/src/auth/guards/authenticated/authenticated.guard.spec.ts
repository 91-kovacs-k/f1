import { Reflector } from '@nestjs/core';
import { AuthenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();
    expect(new AuthenticatedGuard(reflector)).toBeDefined();
  });
});
