import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { RegisterGuard } from 'src/auth/guards/register/register.guard';

@Controller('auth')
export class AuthController {
  @Post('/register')
  @Public()
  @UseGuards(RegisterGuard)
  async createUser(): Promise<void> {}

  @Post('/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(): Promise<void> {}

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      }
      // TODO: delete sessison information from REDIS. Currently storing session information in memory
      return res.sendStatus(HttpStatus.OK);
    });
  }
}
