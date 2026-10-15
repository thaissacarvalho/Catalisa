import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChallengeIdParamDto {
  @ApiProperty({ example: '1' })
  @Type(() => String)
  @IsInt()
  @Min(1)
  challengeId!: string;
}
