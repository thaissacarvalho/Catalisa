import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChallengeIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  challengeId!: string;
}
