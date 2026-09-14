import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateChallengeStatusDto {
  @ApiProperty({
    enum: ChallengeStatus,
    example: ChallengeStatus.INACTIVE,
  })
  @IsEnum(ChallengeStatus)
  status!: ChallengeStatus;
}
