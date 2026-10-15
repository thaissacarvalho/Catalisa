import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Min } from 'class-validator';

export class ChallengeIdParamDto {
  @ApiProperty({ example: '1' })
  @Type(() => String)
  @IsString()
  @Min(1)
  challengeId!: string;
}
