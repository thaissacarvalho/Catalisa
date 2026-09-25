import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class UpdateCommentStatusDto {
  @IsEnum(CommentStatus)
  status!: CommentStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(10)
  @MaxLength(500)
  reason?: string;
}
