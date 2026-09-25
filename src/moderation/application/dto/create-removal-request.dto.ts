import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TargetType } from '@app/common/domain/enums/target-type.enum';

export class CreateRemovalRequestDto {
  @IsEnum(TargetType)
  targetType!: TargetType;

  @IsUUID()
  targetId!: string;

  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(10)
  @MaxLength(500)
  reason!: string;
}
