import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class PilotQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @Transform((val) => (val.value as string).trimStart())
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform((val) => {
    if (isNaN(+val.value)) {
      return '';
    }
    return Number.parseInt(val.value);
  })
  @IsNumber()
  @Min(1)
  limit?: number;
}
