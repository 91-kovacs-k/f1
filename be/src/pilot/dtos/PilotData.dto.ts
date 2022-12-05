import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TeamDataDto } from 'src/team/dtos/TeamData.dto';

export class PilotDataDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TeamDataDto)
  team?: TeamDataDto;
}
