import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolutionIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  solutionId!: string;
}
