import { IsString, MaxLength, MinLength } from 'class-validator';
import { LikeTargetDto } from './like-target.dto';

export class UserLikeTargetDto extends LikeTargetDto {
  @IsString()
  @MinLength(36)
  @MaxLength(40)
  userCode!: string;
}
