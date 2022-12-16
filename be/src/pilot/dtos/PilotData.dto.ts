import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TeamDataDto } from '../../team/dtos/TeamData.dto';

export class PilotDataDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TeamDataDto)
  team?: TeamDataDto;
}
