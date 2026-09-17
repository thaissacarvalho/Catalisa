import { IsEnum, IsUUID } from 'class-validator';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class UpdateCommentStatusDto {
  @IsUUID()
  id!: string;
  
  @IsEnum(CommentStatus)
  status!: CommentStatus;
}