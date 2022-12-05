import { IsNotEmpty } from 'class-validator';

export class UserDataDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
