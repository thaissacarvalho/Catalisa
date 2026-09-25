import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { IsEnum, IsUUID } from 'class-validator';

export class LikeTargetDto {
  @IsEnum(TargetType)
  type!: TargetType;

  @IsUUID()
  targetId!: string;
}
