import { IsNotEmpty, IsOptional } from 'class-validator';

export class ModifyUserDataDto {
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string;
}
