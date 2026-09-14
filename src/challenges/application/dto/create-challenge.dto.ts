import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Challenge Title' })
  @Type(() => String)
  @IsString()
  title!: string;
  @ApiProperty({ example: 'Challenge Description' })
  @Type(() => String)
  @IsString()
  description!: string;
  @ApiProperty({ example: 'PENDING' })
  @Type(() => String)
  @IsString()
  status!: ChallengeStatus;
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder!: number;
}
