import { LikeType } from '@app/likes/domain/enums/like-type.enum';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsEnum(LikeType)
  type!:  LikeType;

  @IsUUID()
  targetId!: string;
}