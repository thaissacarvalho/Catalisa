import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';

export class UpdateSolutionStatusDto {
  @ApiProperty({
    enum: SolutionStatus,
    example: SolutionStatus.REMOVED,
  })
  @IsEnum(SolutionStatus)
  status!: SolutionStatus;

  @ApiProperty({
    example: 'Conteúdo discriminatório',
    required: false,
  })
  @ValidateIf(
    ({ status }: UpdateSolutionStatusDto) => status === SolutionStatus.REMOVED,
  )
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  reason?: string;
}
