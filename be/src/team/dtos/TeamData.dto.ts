import { IsNotEmpty } from 'class-validator';

export class TeamDataDto {
  @IsNotEmpty()
  name: string;
}
