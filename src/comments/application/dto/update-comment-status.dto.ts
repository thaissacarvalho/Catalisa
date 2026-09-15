import { IsEnum, IsString } from 'class-validator';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class UpdateCommentStatusDto {
  @IsString()
  id!: string;
  
  @IsEnum(CommentStatus)
  status!: CommentStatus;
}