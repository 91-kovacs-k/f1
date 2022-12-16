import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyUserDataDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;
}
